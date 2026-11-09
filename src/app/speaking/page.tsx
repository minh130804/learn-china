'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  KeyRound,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AudioButton } from '@/components/AudioPlayer';

const GEMINI_MODELS = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash Preview',
    tag: 'Thế hệ mới nhất 2026',
    badge: 'Khuyên dùng',
    desc: 'Tốc độ phản hồi cực nhanh, phát âm & chỉ dẫn ngữ điệu chính xác nhất.',
  },
  {
    id: 'gemini-flash-lite-latest',
    name: 'Gemini Flash Lite',
    tag: 'Siêu tốc',
    badge: 'Phản xạ nhanh',
    desc: 'Tối ưu độ trễ, phản hồi tức thì cho đàm thoại luyện nói.',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tag: 'Tiêu chuẩn',
    badge: 'Ổn định',
    desc: 'Mô hình chuẩn, giao tiếp đàm thoại đời sống hàng ngày nhanh gọn.',
  },
];

const SCENARIO_SUGGESTIONS: Record<string, string[]> = {
  HSK1: [
    '服务员，请给我一份菜单。(Phục vụ ơi, cho tôi xem thực đơn.)',
    '我想吃北京烤鸭。(Tôi muốn ăn Vịt quay Bắc Kinh.)',
    '多少钱？可以微信支付吗？(Bao nhiêu tiền? Có quét mã WeChat được không?)',
  ],
  HSK2: [
    '请问地铁站在哪里？(Xin hỏi ga tàu điện ngầm ở đâu?)',
    '从这里去航站楼怎么走？(Từ đây đi sang nhà ga sân bay đi như thế nào?)',
    '我想换点人民币。(Tôi muốn đổi một ít nhân dân tệ.)',
  ],
  HSK3: [
    '我在网上预订了一间单人房。(Tôi đã đặt một phòng đơn trên mạng.)',
    '房费包含明天的早餐吗？(Giá phòng đã bao gồm bữa sáng ngày mai chưa?)',
    '请问这里的无线网络密码是多少？(Xin hỏi mật khẩu wifi ở đây là gì?)',
  ],
  HSK4: [
    '老板，这件衣服有点贵，能便宜点吗？(Chủ quán ơi, cái áo này hơi đắt, bớt chút được không?)',
    '买两件能打折吗？(Mua hai chiếc thì có được giảm giá không?)',
    '质量很好，我要一件黑色的！(Chất lượng rất tốt, tôi lấy một cái màu đen nhé!)',
  ],
  HSK5: [
    '我在跨国贸易领域有三年的工作经验。(Tôi có 3 năm kinh nghiệm trong lĩnh vực thương mại quốc tế.)',
    '我的中文达到HSK5级，能熟练撰写商业邮件。(Tiếng Trung của tôi đạt HSK5, có thể viết email thương mại thành thạo.)',
    '贵公司未来的职业发展通道是怎样的？(Lộ trình phát triển sự nghiệp của quý công ty như thế nào?)',
  ],
  HSK6: [
    '关于付款条款，我们建议采用不可撤销信用证（L/C）。(Về điều khoản thanh toán, chúng tôi đề xuất áp dụng L/C không hủy ngang.)',
    '如果订单量达到一万件，贵方能否给予百分之五的折扣？(Nếu lượng đặt hàng đạt 10.000 sản phẩm, quý công ty có thể chiết khấu 5% không?)',
    '我们希望在下周一前签署正式合作备忘录。(Chúng tôi hy vọng có thể ký kết biên bản ghi nhớ hợp tác chính thức trước thứ Hai tuần sau.)',
  ],
};

export default function SpeakingPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Gemini state
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [isServerConfigured, setIsServerConfigured] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [validatingKey, setValidatingKey] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          handleSendMessage(transcript);
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(
        'Trình duyệt của bạn chưa hỗ trợ ghi âm nhận diện giọng nói trực tiếp. Bạn có thể gõ văn bản hoặc bấm gợi ý hội thoại!'
      );
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Check Gemini config on server and load localStorage
  useEffect(() => {
    fetch('/api/config/gemini')
      .then((res) => res.json())
      .then((data) => {
        if (data.configured) setIsServerConfigured(true);
        if (data.currentModel) setSelectedModel(data.currentModel);
      })
      .catch((err) => console.error(err));

    const savedKey =
      localStorage.getItem('hanlearn_llm_api_key') || localStorage.getItem('hanlearn_llm_key');
    if (savedKey) setApiKey(savedKey);

    const savedModel = localStorage.getItem('hanlearn_gemini_model');
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  // Fetch speaking scenarios
  useEffect(() => {
    fetch('/api/speaking')
      .then((res) => res.json())
      .then((data) => {
        setScenarios(data.scenarios || []);
        if (data.scenarios?.length > 0) {
          const first = data.scenarios[0];
          setSelectedScenario(first);
          setMessages([
            {
              role: 'assistant',
              content: first.initialPrompt,
              pinyin: 'Nǐ hǎo! Huānyíng guānglín! Qǐngwèn jǐ wèi? Xiǎng chī diǎnr shénme?',
              translation:
                'Xin chào! Hoan nghênh quý khách! Xin hỏi mấy người? Muốn dùng món gì ạ?',
            },
          ]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScenarioChange = (scenario: any) => {
    setSelectedScenario(scenario);
    setMessages([
      {
        role: 'assistant',
        content: scenario.initialPrompt,
        pinyin: 'Nǐ hǎo! Qǐngwèn yǒu shénme kěyǐ bāng nín de?',
        translation: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      },
    ]);
  };

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem('hanlearn_gemini_model', modelId);
    setShowModelDropdown(false);
  };

  const handleSaveApiKey = async (newKey: string, persistToEnv: boolean) => {
    setValidatingKey(true);
    setKeyError(null);
    try {
      const res = await fetch('/api/config/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newKey.trim(), persistToEnv }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Khóa API không hợp lệ');
      }

      setApiKey(newKey.trim());
      localStorage.setItem('hanlearn_llm_api_key', newKey.trim());
      localStorage.setItem('hanlearn_llm_key', newKey.trim());
      if (persistToEnv) {
        setIsServerConfigured(true);
      }
      setShowKeyModal(false);
    } catch (err: any) {
      setKeyError(err.message || 'Lỗi kiểm tra khóa Gemini');
    } finally {
      setValidatingKey(false);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: textToSend,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectedScenario?.id,
          userMessage: textToSend,
          apiKey: apiKey || undefined,
          modelName: selectedModel,
          history: newMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentLevel = selectedScenario?.hskLevel || 'HSK1';
  const currentSuggestions = SCENARIO_SUGGESTIONS[currentLevel] || SCENARIO_SUGGESTIONS['HSK1'];
  const activeModelObj =
    GEMINI_MODELS.find((m) => m.id === selectedModel) || GEMINI_MODELS[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-2">
            <Mic className="w-4 h-4" />
            <span>Luyện nói & Đối thoại Tương tác (AI Speaking Partner)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            AI Chinese Speaking Partner
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Luyện phản xạ giao tiếp theo tình huống thực tế từ HSK 1 đến HSK 6. Gia sư AI nhận diện ngữ cảnh, phản hồi tức thì với Pinyin, âm thanh bản xứ và hướng dẫn chi tiết khi gặp khó khăn.
          </p>
        </div>

        {/* Model Selector & Key Config Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>{activeModelObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showModelDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Chọn mô hình AI
                </div>
                {GEMINI_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModel(m.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-start justify-between gap-2 ${
                      selectedModel === m.id
                        ? 'bg-orange-50 text-orange-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{m.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5">{m.desc}</p>
                    </div>
                    {selectedModel === m.id && (
                      <Check className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowKeyModal(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition shadow-sm bg-white"
          >
            <KeyRound className="w-3.5 h-3.5 text-orange-600" />
            <span>
              {isServerConfigured || apiKey ? 'Đã kết nối Gemini' : 'Cấu hình Gemini'}
            </span>
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-orange-600" />
                  Cấu hình Google Gemini API Key
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Nhận diện thông minh qua <strong>Gemini 2.0 Flash</strong> & <strong>1.5 Pro</strong>.
                </p>
              </div>
            </div>

            {keyError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{keyError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gemini API Key:
              </label>
              <input
                type="password"
                defaultValue={apiKey}
                id="speaking-gemini-key-input"
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                <span>Chưa có key? Nhận miễn phí tại:</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline flex items-center gap-0.5 font-medium"
                >
                  <span>Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="speaking-persist-env" defaultChecked className="rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
              <label htmlFor="speaking-persist-env" className="text-xs text-slate-600">
                Lưu vào hệ thống để dùng chung cho mọi bài học
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Đóng
              </button>
              <button
                type="button"
                disabled={validatingKey}
                onClick={() => {
                  const val = (document.getElementById('speaking-gemini-key-input') as HTMLInputElement)?.value;
                  const persist = (document.getElementById('speaking-persist-env') as HTMLInputElement)?.checked;
                  handleSaveApiKey(val, persist);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
              >
                {validatingKey ? 'Đang kiểm tra...' : 'Xác thực & Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Chọn tình huống đàm thoại:
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(sc)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                selectedScenario?.id === sc.id
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${selectedScenario?.id === sc.id ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {sc.hskLevel}
              </span>
              <span>{sc.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[540px] overflow-hidden">
        {/* Scenario Banner */}
        {selectedScenario && (
          <div className="p-4 bg-orange-50/70 border-b border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-bold text-orange-950">Vai của AI:</span>{' '}
              <span className="text-orange-800 font-medium">{selectedScenario.roleAi}</span>
              <span className="mx-2 text-orange-300">|</span>
              <span className="font-bold text-orange-950">Vai của bạn:</span>{' '}
              <span className="text-orange-800 font-medium">{selectedScenario.roleUser}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-orange-200/80 text-orange-900 rounded font-bold text-[11px]">
                {selectedScenario.hskLevel}
              </span>
              <span className="text-slate-500 text-[11px] hidden sm:inline">
                {selectedScenario.description}
              </span>
            </div>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm space-y-2 shadow-sm ${
                    isUser
                      ? 'bg-primary-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-chinese text-base font-semibold leading-relaxed">
                      {m.content}
                    </p>
                    {!isUser && <AudioButton text={m.content} size="sm" />}
                  </div>

                  {m.pinyin && (
                    <p className="text-xs font-mono text-primary-600 font-medium">
                      {m.pinyin}
                    </p>
                  )}

                  {m.translation && (
                    <p className="text-xs text-slate-500 border-t border-slate-200/60 pt-1.5">
                      {m.translation}
                    </p>
                  )}

                  {m.feedback && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-medium flex items-start gap-2 border border-emerald-100 mt-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{m.feedback}</span>
                    </div>
                  )}

                  {m.source && (
                    <div className="text-[10px] text-slate-400 text-right pt-1">
                      {m.source}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span>Gia sư AI ({activeModelObj.name}) đang lắng nghe và phản hồi...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
            Gợi ý câu:
          </span>
          {currentSuggestions.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600 rounded-lg text-xs whitespace-nowrap transition shadow-2xs"
            >
              {p.split('(')[0]}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleRecording}
              title={
                isRecording
                  ? 'Đang ghi âm giọng nói tiếng Trung... Bấm để dừng'
                  : 'Bấm micro để nói tiếng Trung (Speech-to-Text)'
              }
              className={`p-2.5 rounded-xl border transition flex items-center justify-center ${
                isRecording
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse ring-2 ring-rose-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isRecording
                  ? 'Đang nghe bạn nói tiếng Trung...'
                  : 'Nhập câu tiếng Trung (hoặc gõ tiếng Việt để xin hướng dẫn, hoặc bấm micro)...'
              }
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
