import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from './prisma';

export const AVAILABLE_GEMINI_MODELS = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash Preview (Thế hệ mới nhất 2026 - Thông minh & Chuẩn xác nhất)',
    badge: 'Khuyên dùng',
    desc: 'Mô hình thế hệ mới nhất của Google, suy luận đa ngôn ngữ sắc bén, giải thích ngữ pháp chuyên sâu.',
  },
  {
    id: 'gemini-flash-lite-latest',
    name: 'Gemini Flash Lite (Siêu tốc & Ổn định)',
    badge: 'Tốc độ cao',
    desc: 'Tối ưu độ trễ, phản hồi tức thì cho đàm thoại luyện nói.',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite (Hiện đại & Nhẹ)',
    badge: 'Tiêu chuẩn',
    desc: 'Mô hình linh hoạt cho dịch thuật và phản xạ tình huống.',
  },
];

export function getPreferredGeminiModel(customModel?: string): string {
  return (
    customModel ||
    process.env.GEMINI_MODEL ||
    'gemini-3-flash-preview'
  );
}

/**
 * Returns the effective Gemini API Key from environment or override
 */
export function getGeminiApiKey(customKey?: string): string | null {
  return customKey || process.env.GEMINI_API_KEY || null;
}

/**
 * Check if Gemini is configured
 */
export function isGeminiConfigured(customKey?: string): boolean {
  return Boolean(getGeminiApiKey(customKey));
}

/**
 * AI Chinese Tutor Engine using Google Gemini (with model fallback)
 */
export async function askGeminiAiTutor(
  userQuestion: string,
  hskLevel = 'HSK1',
  customKey?: string,
  history: Array<{ role: string; content: string }> = [],
  customModel?: string
) {
  const apiKey = getGeminiApiKey(customKey);
  if (!apiKey) {
    throw new Error('MISSING_GEMINI_API_KEY');
  }

  const selectedModel = getPreferredGeminiModel(customModel);

  // 1. RAG Search: Retrieve matching vocabulary and grammar from MySQL
  const hasChinese = /[\u4e00-\u9fa5]/.test(userQuestion);
  let matchedVocab: any[] = [];
  let matchedGrammar: any[] = [];

  try {
    if (hasChinese) {
      const chars = userQuestion.match(/[\u4e00-\u9fa5]+/g)?.join('') || '';
      matchedVocab = await prisma.vocabulary.findMany({
        where: {
          OR: [
            { simplified: chars },
            { simplified: { contains: chars } },
          ],
        },
        take: 3,
        include: { examples: true },
      });

      matchedGrammar = await prisma.grammarPoint.findMany({
        where: {
          OR: [
            { title: { contains: chars } },
            { pattern: { contains: chars } },
          ],
        },
        take: 2,
        include: { examples: true },
      });
    } else if (userQuestion.trim().length >= 4) {
      matchedGrammar = await prisma.grammarPoint.findMany({
        where: {
          OR: [
            { title: { contains: userQuestion.trim() } },
            { explanationVi: { contains: userQuestion.trim() } },
          ],
        },
        take: 2,
        include: { examples: true },
      });

      matchedVocab = await prisma.vocabulary.findMany({
        where: {
          OR: [
            { meaningVi: { contains: userQuestion.trim() } },
            { pinyin: { contains: userQuestion.trim() } },
          ],
        },
        take: 3,
        include: { examples: true },
      });
    }
  } catch (err) {
    console.warn('RAG database search warning:', err);
  }

  const ragContext = `
[DỮ LIỆU TỪ ĐIỂN VÀ NGỮ PHÁP XÁC THỰC TỪ DATABASE HANLEARN]:
${matchedVocab.length > 0 ? 'Từ vựng liên quan:\n' + matchedVocab.map(v => `- ${v.simplified} [${v.pinyin}]: ${v.meaningVi} (HSK ${v.hskLevel})`).join('\n') : '(Không có từ vựng khớp trực tiếp)'}
${matchedGrammar.length > 0 ? 'Điểm ngữ pháp liên quan:\n' + matchedGrammar.map(g => `- ${g.title}: ${g.pattern} - ${g.explanationVi}`).join('\n') : '(Không có điểm ngữ pháp khớp trực tiếp)'}
`;

  // 2. Try primary selected model with fallback cascade
  const modelsToTry = [
    selectedModel,
    'gemini-3-flash-preview',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: any = null;

  for (const modelId of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelId,
        systemInstruction: `Bạn là ThaoTo AI Tutor - Chuyên gia sư phạm giảng dạy tiếng Trung Quốc cao cấp dành cho người Việt Nam trên nền tảng ThaoTo.
Cấp độ mục tiêu hiện tại của người học: ${hskLevel}.

NGUYÊN TẮC GIẢNG DẠY & PHẢN HỒI:
1. Khi học viên chào hỏi (như "hi", "hello", "chào", "ni hao", "xin chào"):
   - Hãy chào lại bằng tiếng Trung thân thiện kèm Pinyin: "你好！(Nǐ hǎo!) Rất vui được gặp bạn..."
   - Giới thiệu ngắn gọn các chủ đề có thể giúp đỡ và khơi gợi câu hỏi.
2. Khi học viên hỏi về ngữ pháp:
   - Cung cấp: Tên cấu trúc + Công thức chuẩn + Giải thích tiếng Việt dễ hiểu + Lưu ý/Lỗi sai thường gặp + Ví dụ song ngữ Trung-Pinyin-Việt.
3. Khi học viên hỏi tra từ vựng hoặc hỏi dịch câu:
   - Cung cấp chữ Hán Giản thể (và Phồn thể nếu cần), Pinyin có dấu thanh điệu đầy đủ, giải nghĩa từ loại và các thành phần câu.
4. Khi học viên viết câu tiếng Trung:
   - Phân tích câu, sửa lỗi trật tự từ nếu có và giải thích lý do bằng tiếng Việt nhẹ nhàng, mang tính khích lệ.
5. Luôn định dạng câu trả lời bằng Markdown đẹp mắt (dùng tiêu đề, in đậm, danh sách gạch đầu dòng, khối code cho Pinyin).
6. Sử dụng ngữ liệu được cung cấp từ hệ thống để tăng độ chính xác:
${ragContext}`,
      });

      const chat = model.startChat({
        history: history.slice(-6).map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessage(userQuestion);
      const response = await result.response;
      
      const modelDisplayName =
        modelId === 'gemini-2.0-flash'
          ? 'Google Gemini 2.0 Flash'
          : modelId === 'gemini-1.5-pro'
          ? 'Google Gemini 1.5 Pro'
          : 'Google Gemini 1.5 Flash';

      return {
        answer: response.text(),
        source: `${modelDisplayName} (Cao cấp)`,
        modelId,
        ragItems: { vocab: matchedVocab, grammar: matchedGrammar },
      };
    } catch (err) {
      console.warn(`Model ${modelId} failed, trying next fallback:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('ALL_GEMINI_MODELS_FAILED');
}

/**
 * AI Chinese Speaking Partner using Google Gemini (with model selection)
 */
export async function askGeminiSpeakingPartner(
  userSpeech: string,
  scenarioContext?: {
    scenarioTitle?: string;
    roleAi?: string;
    roleUser?: string;
    hskLevel?: string;
  },
  customKey?: string,
  history: Array<{ role: string; content: string }> = [],
  customModel?: string
) {
  const apiKey = getGeminiApiKey(customKey);
  if (!apiKey) {
    throw new Error('MISSING_GEMINI_API_KEY');
  }

  const selectedModel = getPreferredGeminiModel(customModel);
  const modelsToTry = [
    selectedModel,
    'gemini-3-flash-preview',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: any = null;

  for (const modelId of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelId,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
        systemInstruction: `Bạn là đối tác đàm thoại tiếng Trung thông minh (AI Speaking Partner) trong nền tảng ThaoTo.
Tình huống giao tiếp: ${scenarioContext?.scenarioTitle || 'Giao tiếp đời sống hàng ngày'}.
Vai của bạn: ${scenarioContext?.roleAi || 'Người bản xứ Trung Quốc'}.
Vai của học viên: ${scenarioContext?.roleUser || 'Khách hàng / Học viên'}.
Cấp độ HSK: ${scenarioContext?.hskLevel || 'HSK 1-2'}.

QUY TẮC CỐT LÕI:
1. Nếu học viên nói tiếng Việt bế tắc (như "chịu", "không biết", "quên rồi", "nói thế nào"):
   - TUYỆT ĐỐI KHÔNG khen tiếng Trung của họ tốt.
   - Thấu hiểu và động viên bằng tiếng Việt thân mật.
   - Chỉ dẫn câu tiếng Trung nên nói trong tình huống này: Chữ Hán + Pinyin + Dịch nghĩa.
2. Nếu học viên nói tiếng Trung:
   - Đóng đúng vai nhân vật, đối thoại tự nhiên, ngắn gọn, phù hợp trình độ.
   - Nhận xét phát âm, dùng từ hoặc khen ngợi cụ thể.
3. Luôn trả về DUY NHẤT một chuỗi JSON chuẩn có cấu trúc:
{
  "content": "Câu nói tiếng Trung của bạn để tiếp tục đối thoại",
  "pinyin": "Phiên âm Pinyin có dấu thanh điệu",
  "translation": "Bản dịch tiếng Việt của câu tiếng Trung trên",
  "feedback": "Nhận xét, chỉ dẫn phát âm hoặc góp ý cho học viên bằng tiếng Việt"
}`,
      });

      const chat = model.startChat({
        history: history.slice(-6).map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessage(`Học viên vừa nói: "${userSpeech}". Hãy phản hồi theo đúng cấu trúc JSON.`);
      const response = await result.response;
      let rawText = response.text().trim();
      
      // Clean potential markdown blocks
      if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);

      return {
        content: parsed.content,
        pinyin: parsed.pinyin,
        translation: parsed.translation,
        feedback: parsed.feedback,
        source: `Google Gemini AI (${modelId})`,
      };
    } catch (err) {
      console.warn(`Speaking partner model ${modelId} failed, trying fallback:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('ALL_SPEAKING_MODELS_FAILED');
}

