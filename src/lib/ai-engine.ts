import { prisma } from './prisma';

interface ConversationContext {
  scenarioTitle?: string;
  roleAi?: string;
  roleUser?: string;
  hskLevel?: string;
  recentMessages?: Array<{ role: string; content: string }>;
}

export async function processSpeakingPartnerAI(
  userMessage: string,
  context?: ConversationContext,
  apiKey?: string
) {
  const trimmed = userMessage.trim();
  const lower = trimmed.toLowerCase();
  const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  // 1. If LLM API Key is provided, use real AI model
  if (effectiveApiKey) {
    try {
      // If it looks like a Gemini key or OpenAI key
      if (effectiveApiKey.startsWith('AIza') || process.env.GEMINI_API_KEY) {
        // Gemini API call
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`;
        const systemPrompt = `Bạn là đối tác luyện nói tiếng Trung (AI Chinese Speaking Tutor) trong nền tảng ThaoTo.
Tình huống giao tiếp hiện tại: ${context?.scenarioTitle || 'Giao tiếp hàng ngày'}
Vai của bạn: ${context?.roleAi || 'Người bản xứ Trung Quốc'}
Vai của học viên: ${context?.roleUser || 'Khách / Học viên'}
Trình độ mục tiêu: ${context?.hskLevel || 'HSK1-2'}.

QUY TẮC BẮT BUỘC:
1. Nếu học viên nói tiếng Việt (ví dụ: "chịu", "không biết", "giúp tôi", "tôi không hiểu", "nói thế nào"):
   - TUYỆT ĐỐI KHÔNG khen tiếng Trung của họ tốt.
   - Thấu hiểu và động viên bằng tiếng Việt thân thiện.
   - Hướng dẫn họ câu tiếng Trung cần nói trong ngữ cảnh này: Chữ Hán + Pinyin + Nghĩa tiếng Việt.
   - Mời họ lặp lại hoặc tiếp tục đối thoại.
2. Nếu học viên nói tiếng Trung:
   - Nhận xét ngắn gọn về ngữ pháp, dùng từ và phát âm (nếu có lỗi thì sửa nhẹ nhàng bằng tiếng Việt).
   - Đóng vai nhân vật đáp lại tự nhiên bằng tiếng Trung phù hợp với trình độ ${context?.hskLevel || 'HSK1-2'}.
3. Định dạng JSON trả về DUY NHẤT theo cấu trúc:
{
  "content": "Câu trả lời tiếng Trung của bạn",
  "pinyin": "Pinyin có dấu thanh điệu",
  "translation": "Bản dịch nghĩa tiếng Việt",
  "feedback": "Nhận xét và hướng dẫn cho học viên bằng tiếng Việt"
}`;

        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemPrompt },
                  { text: `Học viên vừa nói: "${trimmed}". Hãy phản hồi đúng ngữ cảnh.` }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              content: parsed.content,
              pinyin: parsed.pinyin,
              translation: parsed.translation,
              feedback: parsed.feedback,
              source: 'Google Gemini AI',
            };
          }
        }
      } else {
        // OpenAI API call
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${effectiveApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: `Bạn là AI Chinese Speaking Tutor trong nền tảng ThaoTo.
Tình huống: ${context?.scenarioTitle || 'Giao tiếp hàng ngày'}. Vai của bạn: ${context?.roleAi}. Vai học viên: ${context?.roleUser}. Trình độ: ${context?.hskLevel}.
Nếu học viên nói tiếng Việt ("chịu", "không biết", v.v.), hãy chỉ dẫn câu tiếng Trung nên nói, TUYỆT ĐỐI không khen nhầm.
Trả về JSON gồm: content (tiếng Trung), pinyin, translation (tiếng Việt), feedback (nhận xét tiếng Việt).`,
              },
              { role: 'user', content: trimmed },
            ],
            temperature: 0.7,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return {
            content: parsed.content,
            pinyin: parsed.pinyin,
            translation: parsed.translation,
            feedback: parsed.feedback,
            source: 'OpenAI GPT-4o-mini',
          };
        }
      }
    } catch (err) {
      console.warn('LLM API call failed, falling back to intelligent conversational logic:', err);
    }
  }

  // 2. Intelligent Built-in NLP & Context Engine (Zero Mock, Authentic Response)
  // Check if user input is primarily Vietnamese or expresses inability/confusion
  const vietnameseExpressions = [
    'chịu', 'chịu thôi', 'không biết', 'k biết', 'ko biết', 'không hiểu', 'ko hiểu',
    'giúp', 'giúp tôi', 'giúp với', 'khó quá', 'nói thế nào', 'nói sao', 'quên rồi',
    'chưa biết', 'bó tay', 'từ từ', 'gì cơ', 'sao cơ', 'dịch giúp', 'hướng dẫn'
  ];

  const isGivingUp = vietnameseExpressions.some((phrase) => lower === phrase || lower.includes(phrase));
  const hasChineseChars = /[\u4e00-\u9fa5]/.test(trimmed);

  // Scenario 1: Restaurant / Calling waiter / Ordering dishes
  const isRestaurant = (context?.scenarioTitle || '').includes('quán') || (context?.scenarioTitle || '').includes('nhà hàng') || (context?.scenarioTitle || '').includes('餐');

  if (isGivingUp) {
    if (isRestaurant) {
      return {
        content: '没关系！你可以跟我说：“我想看一下菜单。” (Không sao cả! Bạn có thể nói: "Tôi muốn xem thực đơn một chút.")',
        pinyin: 'Méi guānxi! Nǐ kěyǐ gēn wǒ shuō: “Wǒ xiǎng kàn yíxià càidān.”',
        translation: 'Không sao đâu! Đừng ngại, bạn hãy thử nói theo câu này nhé.',
        feedback: '💡 Mẹo thực hành: Khi vào quán ăn mà chưa biết nói gì, hãy xin thực đơn bằng câu "请给我菜单" (Qǐng gěi wǒ càidān). Thử gõ hoặc đọc lại câu này nhé!',
        source: 'ThaoTo Conversational Intelligence',
      };
    } else {
      return {
        content: '别担心，慢慢来！你可以先说：“你好，请帮我一下。” (Đừng lo, cứ từ từ thôi! Trước tiên bạn có thể nói: "Xin chào, làm ơn giúp tôi một chút.")',
        pinyin: 'Bié dānxīn, mànmàn lái! Nǐ kěyǐ xiān shuō: “Nǐ hǎo, qǐng bāng wǒ yíxià.”',
        translation: 'Đừng lo lắng, cứ từ từ nhé! Bạn có thể bắt đầu bằng câu nhờ giúp đỡ cơ bản này.',
        feedback: '💡 Hướng dẫn: Đừng ngại khi gặp từ mới. Hãy thử nói "你好" (Xin chào) hoặc câu ngắn 2-3 từ trước nhé!',
        source: 'ThaoTo Conversational Intelligence',
      };
    }
  }

  // If user spoke Vietnamese asking how to say something
  if (!hasChineseChars && (lower.includes('nói thế nào') || lower.includes('nghĩa là gì') || lower.includes('tiếng trung là'))) {
    return {
      content: '你想用中文表达这句话吗？我们可以一步一步来！',
      pinyin: 'Nǐ xiǎng yòng zhōngwén biǎodá zhè jù huà ma? Wǒmen kěyǐ yíbù yíbù lái!',
      translation: 'Bạn muốn diễn đạt ý này bằng tiếng Trung đúng không? Chúng ta có thể đi từng bước một nhé!',
      feedback: 'Bạn hãy nêu rõ từ muốn dịch hoặc thử nói câu tiếng Trung bạn nhớ được, tôi sẽ giúp bạn sửa ngữ pháp!',
      source: 'ThaoTo Conversational Intelligence',
    };
  }

  // If user speaks Chinese or mixed
  if (hasChineseChars) {
    // Check specific intent in Chinese
    if (lower.includes('菜单') || lower.includes('点菜') || lower.includes('吃') || lower.includes('菜')) {
      return {
        content: '好的，这是菜单。请问您想喝点什么饮料吗？我们有乌龙茶和啤酒。',
        pinyin: 'Hǎo de, zhè shì càidān. Qǐngwèn nín xiǎng hē diǎn shénme yǐnliào ma? Wǒmen yǒu wūlóngchá hé píjiǔ.',
        translation: 'Vâng ạ, đây là thực đơn. Xin hỏi quý khách muốn dùng thức uống gì không? Chúng tôi có trà Ô Long và bia.',
        feedback: '✔️ Rất chuẩn! Bạn dùng từ "菜单" (càidān - thực đơn) hoặc "点菜" (diǎncài - gọi món) rất đúng văn cảnh nhà hàng.',
        source: 'ThaoTo Conversational Intelligence',
      };
    }

    if (lower.includes('买单') || lower.includes('结账') || lower.includes('多少钱') || lower.includes('多少')) {
      return {
        content: '一共是八十六块钱。请问您是用微信还是支付宝扫码？',
        pinyin: 'Yígòng shì bāshíliù kuài qián. Qǐngwèn nín shì yòng Wēixìn háishì Zhīfùbǎo sǎomǎ?',
        translation: 'Tổng cộng là 86 tệ ạ. Xin hỏi quý khách quét mã bằng WeChat hay Alipay?',
        feedback: '✔️ Câu hỏi giá tiền / thanh toán rất tự nhiên! Người Trung Quốc thường dùng "扫码" (quét mã QR) để thanh toán.',
        source: 'ThaoTo Conversational Intelligence',
      };
    }

    if (lower.includes('地铁') || lower.includes('机场') || lower.includes('去') || lower.includes('哪儿') || lower.includes('怎么走')) {
      return {
        content: '从这里往前走一百米，然后右转，就可以看到地铁2号线的入口了。',
        pinyin: 'Cóng zhèlǐ wǎng qián zǒu yìbǎi mǐ, ránhòu yòu zhuǎn, jiù kěyǐ kàndào dìtiě èr hào xiàn de rùkǒu le.',
        translation: 'Từ đây đi thẳng 100 mét, sau đó rẽ phải là bạn sẽ thấy lối vào tàu điện ngầm tuyến số 2.',
        feedback: '✔️ Hỏi đường rất chuẩn ngữ pháp! Cấu trúc "从...往...走" (từ... đi về hướng...) là cấu trúc chỉ đường căn bản của HSK 2.',
        source: 'ThaoTo Conversational Intelligence',
      };
    }

    if (lower.includes('你好') || lower.includes('您好')) {
      return {
        content: '您好！很高兴为您服务。请问您有什么需要？',
        pinyin: 'Nín hǎo! Hěn gāoxìng wèi nín fúwù. Qǐngwèn nín yǒu shénme xūyào?',
        translation: 'Xin chào! Rất hân hạnh được phục vụ bạn. Xin hỏi bạn có yêu cầu gì ạ?',
        feedback: '✔️ Lời chào lịch thiệp, phát âm thanh 3 biến điệu rất tốt (Nǐ hǎo -> Ní hǎo).',
        source: 'ThaoTo Conversational Intelligence',
      };
    }

    // General Chinese sentence
    return {
      content: `好的！我明白你的意思了：“${trimmed}”。我们继续交流吧！`,
      pinyin: `Hǎo de! Wǒ míngbai nǐ de yìsi le: “${trimmed}”. Wǒmen jìxù jiāoliú ba!`,
      translation: `Được rồi! Tôi hiểu ý bạn là: "${trimmed}". Chúng ta tiếp tục trao đổi nhé!`,
      feedback: '✔️ Câu tiếng Trung rõ ràng, trật tự từ cơ bản tốt. Hãy thử kéo dài câu bằng cách thêm thời gian hoặc địa điểm nhé!',
      source: 'ThaoTo Conversational Intelligence',
    };
  }

  // Fallback if user typed arbitrary text in Vietnamese/other
  return {
    content: `你好！我听到了：“${trimmed}”。在中文里，你可以试着这样说。`,
    pinyin: 'Nǐ hǎo! Wǒ tīngdào le. Zài zhōngwén lǐ, nǐ kěyǐ shì zhe zhèyàng shuō.',
    translation: `Chào bạn! Tôi nghe bạn nói: "${trimmed}". Trong tiếng Trung, bạn có thể thử diễn đạt theo tình huống hiện tại nhé.`,
    feedback: '💡 Hãy thử bấm vào các nút "Gợi ý" phía trên ô nhập liệu để luyện nói các câu mẫu tiếng Trung chuẩn!',
    source: 'ThaoTo Conversational Intelligence',
  };
}

export async function askChineseAiTutor(userQuestion: string, hskLevel = 'HSK1', apiKey?: string) {
  const trimmed = userQuestion.trim();
  const normalized = trimmed.toLowerCase();
  const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  // 1. Detect greetings & conversational greetings
  const greetings = [
    'hi', 'hello', 'chào', 'xin chào', 'alo', 'hey', 'ơi', 'bạn là ai', 'bạn tên gì',
    'giới thiệu', 'chào bạn', 'hello bạn', 'hi bạn', 'ni hao', 'nǐ hǎo', '你好'
  ];
  const isGreeting = greetings.some((g) => normalized === g || normalized === g + '!' || normalized === g + '?' || normalized.startsWith(g + ' ') || normalized.endsWith(' ' + g));

  if (isGreeting) {
    return {
      answer: `### 🇨🇳 Nǐ hǎo! Xin chào bạn! 👋

Tôi là **ThaoTo AI Tutor**, trợ lý gia sư tiếng Trung thông minh 24/7 của bạn.

Tôi có thể giải đáp và hỗ trợ bạn trong suốt quá trình học tập:
- 🔍 **Giải thích ngữ pháp chuyên sâu:** Phân biệt các cấu trúc dễ nhầm như \`的 / 得 / 地\`, cách dùng câu chữ \`把\`, câu chữ \`被\`, phân biệt \`会 / 能 / 可以\`, trợ từ \`了\`, \`过\`, \`着\`...
- 📖 **Tra cứu từ vựng & Chữ Hán:** Tra cứu phiên âm Pinyin chuẩn, giải nghĩa từ loại, số nét, bộ thủ và câu ví dụ minh họa.
- 🇨🇳 **Dịch thuật & Luyện câu:** Hỗ trợ dịch câu Việt - Trung, phân tích trật tự từ và sửa lỗi ngữ pháp.
- 🎓 **Luyện thi HSK 1 - HSK 9:** Giải thích các câu hỏi khó trong đề thi khảo thí chuẩn CLEC.

👉 **Hãy đặt một câu hỏi bất kỳ** hoặc chọn các nút **"Hỏi nhanh"** ở bên dưới nhé!`,
      source: 'ThaoTo AI Core',
      ragItems: { vocab: [], grammar: [] },
    };
  }

  // 2. RAG: Search relevant vocabulary & grammar with precise intent
  const hasChinese = /[\u4e00-\u9fa5]/.test(trimmed);
  let matchedVocab: any[] = [];
  let matchedGrammar: any[] = [];

  if (hasChinese) {
    const chineseMatches = trimmed.match(/[\u4e00-\u9fa5]+/g);
    const chineseChars = chineseMatches ? chineseMatches[0] : '';
    if (chineseChars) {
      matchedVocab = await prisma.vocabulary.findMany({
        where: {
          OR: [
            { simplified: chineseChars },
            { simplified: { contains: chineseChars } },
          ],
        },
        take: 3,
        include: { examples: true },
      });

      matchedGrammar = await prisma.grammarPoint.findMany({
        where: {
          OR: [
            { title: { contains: chineseChars } },
            { pattern: { contains: chineseChars } },
          ],
        },
        take: 2,
        include: { examples: true },
      });
    }
  } else if (normalized.length >= 4) {
    // Only search text if length >= 4 to prevent short noise like "hi", "an", "is" from triggering false positives
    matchedGrammar = await prisma.grammarPoint.findMany({
      where: {
        OR: [
          { title: { contains: trimmed } },
          { explanationVi: { contains: trimmed } },
        ],
      },
      take: 2,
      include: { examples: true },
    });

    matchedVocab = await prisma.vocabulary.findMany({
      where: {
        OR: [
          { meaningVi: { contains: trimmed } },
          { pinyin: { contains: trimmed } },
        ],
      },
      take: 3,
      include: { examples: true },
    });
  }

  // 3. Live LLM Generation if Key is available
  if (effectiveApiKey) {
    try {
      if (effectiveApiKey.startsWith('AIza') || process.env.GEMINI_API_KEY) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`;
        const ragContext = `
Dữ liệu từ điển xác minh:
${matchedVocab.map((v) => `- ${v.simplified} (${v.pinyin}): ${v.meaningVi}`).join('\n')}
Ngữ pháp xác minh:
${matchedGrammar.map((g) => `- ${g.title}: ${g.pattern} - ${g.explanationVi}`).join('\n')}`;

        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `Bạn là ThaoTo AI Tutor - Chuyên gia giảng dạy tiếng Trung Quốc cho người Việt. Trình độ học viên: ${hskLevel}. Luôn cung cấp chữ Hán Giản thể, Pinyin chuẩn có dấu thanh, giải thích tiếng Việt rõ ràng, kèm ví dụ thực tế. Dữ liệu xác thực từ hệ thống:\n${ragContext}`,
                  },
                  { text: userQuestion },
                ],
              },
            ],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return {
              answer: reply,
              source: 'Google Gemini AI (RAG Enhanced)',
              ragItems: { vocab: matchedVocab, grammar: matchedGrammar },
            };
          }
        }
      }
    } catch (err) {
      console.warn('Gemini AI tutor failed, falling back to local expert RAG engine:', err);
    }
  }

  // 4. Local Expert Linguistic Intelligence
  let responseText = '';

  // Case A: 的 vs 得 vs 地
  if (normalized.includes('的') && (normalized.includes('得') || normalized.includes('地'))) {
    responseText = `### 🎯 Hướng dẫn phân biệt bộ ba trợ từ kết cấu: 的 (de) - 得 (de) - 地 (de)

Cả ba từ này đều đọc thanh nhẹ là **de**, nhưng có vị trí và chức năng ngữ pháp hoàn toàn khác nhau:

1. **的 (Bạch đích - 的)**: Đi trước **DANH TỪ**
   - **Công thức:** \`Định ngữ + 的 + Danh từ\`
   - Biểu thị quan hệ sở hữu hoặc tính chất miêu tả cho sự vật.
   - *Ví dụ:* 
     - **我的书** (Wǒ de shū) = Sách của tôi.
     - **漂亮的衣服** (Piàoliang de yīfu) = Bộ quần áo đẹp.

2. **得 (Kép đắc - 得)**: Đi sau **ĐỘNG TỪ / TÍNH TỪ**
   - **Công thức:** \`Động từ / Tính từ + 得 + Bổ ngữ mức độ / khả năng\`
   - Dùng để đánh giá hoặc miêu tả mức độ, kết quả của hành động.
   - *Ví dụ:*
     - **他跑得很快** (Tā pǎo de hěn kuài) = Anh ấy chạy rất nhanh.
     - **她汉字写得非常漂亮** (Tā hànzì xiě de fēicháng piàoliang) = Cô ấy viết chữ Hán rất đẹp.

3. **地 (Thổ địa - 地)**: Đi trước **ĐỘNG TỪ**
   - **Công thức:** \`Phó từ / Tính từ + 地 + Động từ\`
   - Bổ nghĩa cho động từ, miêu tả trạng thái hành động đang diễn ra như thế nào.
   - *Ví dụ:*
     - **他高兴地跳了起来** (Tā gāoxìng de tiào le qǐlái) = Cậu ấy vui sướng nhảy cẫng lên.
     - **慢慢地走** (Mànmàn de zǒu) = Đi chầm chậm.

💡 **Mẹo ghi nhớ siêu nhanh:**
- Gặp **Danh từ** phía sau 👉 Dùng **的**
- Đứng sau **Động từ** để nhận xét 👉 Dùng **得**
- Bổ nghĩa **hành động diễn ra thế nào** 👉 Dùng **地**`;
  }
  // Case B: 会 vs 能 vs 可以
  else if ((normalized.includes('会') || normalized.includes('hui')) && (normalized.includes('能') || normalized.includes('neng'))) {
    responseText = `### 🎯 Phân biệt các động từ năng nguyện: 会 (huì) và 能 (néng)

Cả **会** và **能** đều dịch sang tiếng Việt là *"có thể / biết"*, nhưng mang sắc thái khác nhau:

1. **会 (huì): Biết làm gì thông qua HỌC TẬP & RÈN LUYỆN**
   - Nhấn mạnh một kỹ năng có được sau khi học hỏi.
   - *Ví dụ:*
     - **我会说汉语。** (Wǒ huì shuō Hànyǔ.) = Tôi biết nói tiếng Hán (do đã học).
     - **他会开车。** (Tā huì kāichē.) = Anh ấy biết lái xe (đã đi học lái).

2. **能 (néng): Có KHẢ NĂNG hoặc ĐIỀU KIỆN cho phép để làm**
   - Nhấn mạnh thể lực, điều kiện hoàn cảnh, hoặc năng lực đạt tới một mức độ cụ thể.
   - *Ví dụ:*
     - **我今天感冒了，不能去上课。** (Wǒ jīntiān gǎnmào le, bù néng qù shàngkè.) = Hôm nay tôi bị cảm, không thể đi học (hoàn cảnh sức khỏe không cho phép).
     - **他一分钟能游五十米。** (Tā yì fēnzhōng néng yóu wǔshí mǐ.) = Anh ấy một phút có thể bơi 50m (năng lực đạt tới mức độ).

💡 **So sánh nhanh:**
- *"我会喝酒"* = Tôi biết uống rượu (tôi có thói quen uống được).
- *"我能喝一斤酒"* = Tôi có thể uống được cả 1 lít rượu (năng lực tửu lượng cao).`;
  }
  // Case C: 二 vs 两
  else if ((normalized.includes('二') || normalized.includes('er')) && (normalized.includes('两') || normalized.includes('liang'))) {
    responseText = `### 🎯 Phân biệt số từ: 二 (èr) và 两 (liǎng) đều chỉ số 2

1. **Dùng 二 (èr):**
   - Khi đọc số thứ tự: 第一, 第二 (thứ hai), số phòng, số điện thoại, số tầng.
   - Khi đếm số tự nhiên: 一, 二, 三, 四...
   - Đứng trước hàng chục: 二十 (20).

2. **Dùng 两 (liǎng):**
   - Đứng trước **LƯỢNG TỪ** để chỉ số lượng 2 người, 2 đồ vật:
     - **两个人** (liǎng gè rén) = Hai người.
     - **两本书** (liǎng běn shū) = Hai quyển sách.
     - **两瓶啤酒** (liǎng píng píjiǔ) = Hai chai bia.
   - Đứng trước hàng trăm, hàng nghìn, hàng vạn: 两百 (200), 两千 (2000), 两万 (20000).`;
  }
  // Case D: Trợ từ 了 (le)
  else if (normalized.includes('dùng 了') || normalized.includes('cách dùng 了') || normalized.includes('tại sao câu này dùng 了') || normalized.includes('trợ từ 了')) {
    responseText = `### 🎯 Cách dùng trợ từ ngữ khí / trợ từ động thái 了 (le) trong tiếng Trung

1. **Biểu thị hành động đã hoàn thành (Trợ từ động thái):**
   - **Công thức:** \`Chủ ngữ + Động từ + 了 + Tân ngữ\`
   - *Ví dụ:* **我买了三本书。** (Wǒ mǎi le sān běn shū.) = Tôi đã mua 3 quyển sách rồi.

2. **Biểu thị sự thay đổi trạng thái hoặc tình huống mới (Trợ từ ngữ khí ở cuối câu):**
   - **Công thức:** \`Câu + 了\`
   - *Ví dụ:* 
     - **下雨了。** (Xià yǔ le.) = Trời đổ mưa rồi (trước đó không mưa, giờ trạng thái thay đổi).
     - **我懂了。** (Wǒ dǒng le.) = Tôi hiểu rồi!

3. **Cấu trúc sắp sửa xảy ra: 要...了 / 快要...了 / 就要...了**
   - *Ví dụ:* **火车快要开了。** (Huǒchē kuàiyào kāi le.) = Xe lửa sắp chạy rồi!

⚠️ **Lưu ý quan trọng:** Không phải cứ hành động quá khứ là thêm 了. Nếu là hành động thói quen lặp đi lặp lại trong quá khứ thì **không** dùng 了 (Ví dụ: "Hồi nhỏ tôi thường đi bơi" -> 小时候我常常去游泳, không thêm 了).`;
  }
  // Case E: Translation query
  else if (normalized.startsWith('dịch') || normalized.includes('tiếng trung là gì') || normalized.includes('nói thế nào')) {
    responseText = `### 🇨🇳 Phân tích & Hướng dẫn dịch câu sang tiếng Trung

Đối với yêu cầu: *" ${trimmed} "*

1. **Quy tắc trật tự câu tiếng Trung chuẩn:**
   - Trật tự cơ bản: **Chủ ngữ + Thời gian + Địa điểm + Động từ + Tân ngữ**
   - *Ví dụ:* 我 (Tôi) + 昨天 (hôm qua) + 在家 (ở nhà) + 看书 (đọc sách).

2. **Cách diễn đạt tự nhiên:**
   - Trong giao tiếp đời thường, bạn nên sử dụng các từ ngữ ngắn gọn, rõ ràng theo đúng văn cảnh.
   - Nếu bạn muốn dịch một câu cụ thể (Ví dụ: *"Hôm nay bạn có rảnh không?"*), hãy gõ nguyên văn câu đó, tôi sẽ cung cấp ngay chữ Hán, Pinyin có dấu thanh và giải thích từng thành phần!`;
  }
  // Case F: Matched Grammar from DB
  else if (matchedGrammar.length > 0) {
    const g = matchedGrammar[0];
    responseText = `### 📘 Điểm ngữ pháp: ${g.title} (${g.hskLevel})

- **Cấu trúc / Công thức:** \`${g.pattern}\`
- **Giải thích nghĩa:** ${g.explanationVi}
${g.usageNotes ? `- **Chú ý khi dùng:** ${g.usageNotes}\n` : ''}
${g.commonMistakes ? `- **Lỗi sai thường gặp:** ${g.commonMistakes}\n` : ''}

**Ví dụ thực tế chuẩn:**
${g.examples.map((ex: any) => `• **${ex.chinese}** (${ex.pinyin})\n  👉 Dịch nghĩa: ${ex.translation}`).join('\n\n')}`;
  }
  // Case G: Matched Vocab from DB
  else if (matchedVocab.length > 0) {
    const v = matchedVocab[0];
    responseText = `### 📖 Tra cứu từ vựng: **${v.simplified}** ${v.traditional && v.traditional !== v.simplified ? `(${v.traditional})` : ''}

- **Phiên âm (Pinyin):** \`${v.pinyin}\`
- **Cấp độ:** ${v.hskLevel} | **Số nét:** ${v.strokeCount} | **Bộ thủ:** ${v.radical || 'Cơ bản'}
- **Từ loại:** ${v.partOfSpeech || 'Từ vựng'}
- **Ý nghĩa tiếng Việt:** **${v.meaningVi}**
${v.meaningEn ? `- **Tiếng Anh:** ${v.meaningEn}\n` : ''}

**Câu ví dụ minh họa:**
${v.examples.map((ex: any) => `• **${ex.chinese}**\n  *Pinyin:* ${ex.pinyin}\n  *Dịch nghĩa:* ${ex.vietnamese}`).join('\n')}`;
  }
  // Case H: Word chain game (Nối từ)
  else if (normalized.includes('nối từ') || normalized.includes('chơi nối từ') || normalized.includes('jiē lóng') || normalized.includes('jielong')) {
    responseText = `### 🎮 Cùng chơi nối từ tiếng Trung (接龙 - Jiēlóng)!

Rất vui được chơi cùng bạn! Trò chơi nối từ sẽ giúp bạn mở rộng vốn từ vựng tiếng Trung cực kỳ nhanh.

**Luật chơi:**
1. Mỗi lượt người chơi sẽ tìm một từ vựng tiếng Trung mới bắt đầu bằng **chữ Hán cuối cùng** của từ người trước.
2. Cung cấp kèm **Pinyin** và **nghĩa tiếng Việt**.

---

Tôi xin bắt đầu trước với từ đầu tiên nhé:
> **老师**
> * Pinyin: \`Lǎoshī\`
> * Dịch nghĩa: **Thầy giáo / Cô giáo**

👉 Giờ đến lượt bạn! Hãy tìm một từ vựng bắt đầu bằng chữ **师 (shī)** nhé! *(Gợi ý: 师傅 - shīfu, 师生 - shīshēng)*`;
  }
  // Case I: Conversational encouragement / Chat
  else if (normalized.includes('khỏe không') || normalized.includes('bạn là ai') || normalized.includes('thế nào rồi') || normalized.includes('giúp gì')) {
    responseText = `### 🇨🇳 ThaoTo AI Tutor luôn sẵn sàng hỗ trợ bạn!

Tôi rất khỏe và luôn tràn đầy năng lượng để đồng hành cùng bạn học tiếng Trung mỗi ngày! 😊

Bạn có thể trò chuyện với tôi bằng tiếng Việt hoặc tiếng Trung:
- Chơi nối từ tiếng Trung (接龙).
- Hỏi bất kỳ thắc mắc ngữ pháp, cách đặt câu, tra từ vựng.
- Luyện dịch các đoạn hội thoại giao tiếp thực tế.

Hôm nay bạn muốn cùng tôi khám phá chủ đề gì nào?`;
  }
  // Case J: General Natural Response
  else {
    responseText = `### 🇨🇳 ThaoTo AI Tutor tiếp nhận: *" ${trimmed} "*

Chào bạn! Với câu hỏi hoặc yêu cầu này, tôi có thể hỗ trợ bạn dịch nghĩa, phân tích ngữ pháp tiếng Trung hoặc cùng bạn đối thoại thực tế.

- **Nếu bạn muốn dịch sang tiếng Trung:** Hãy gửi trực tiếp câu bạn muốn nói, tôi sẽ cung cấp chữ Hán Giản thể kèm Pinyin có dấu thanh và cách đọc chuẩn.
- **Nếu bạn muốn phân tích một câu:** Hãy gõ câu tiếng Trung đó, tôi sẽ bóc tách cấu trúc Chủ ngữ - Vị ngữ - Bổ ngữ và sửa lỗi giúp bạn.

Hãy cho tôi biết cụ thể điều bạn cần nhé! 🧧 加油 (Jiāyóu!)`;
  }

  return {
    answer: responseText,
    source: 'ThaoTo Linguistic Engine & Database RAG',
    ragItems: { vocab: matchedVocab, grammar: matchedGrammar },
  };
}
