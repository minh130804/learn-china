'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Database,
  Key,
  HelpCircle,
  X,
  Volume2,
  Cpu,
  ChevronDown,
  Check,
} from 'lucide-react';
import { AudioButton } from '@/components/AudioPlayer';

const GEMINI_MODELS = [
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    tag: 'Thế hệ mới nhất 2026',
    badge: 'Khuyên dùng',
    desc: 'Thế hệ AI mới nhất từ Google, tự động nhận diện ý định (đố vui, nối từ, phân tích ngữ pháp, dịch thuật).',
  },
  {
    id: 'gemini-3.5-flash-lite',
    name: 'Gemini 3.5 Flash Lite',
    tag: 'Siêu tốc',
    badge: 'Phản xạ nhanh (<2s)',
    desc: 'Tối ưu tốc độ phản hồi cực nhanh, phù hợp cho đối thoại tức thì.',
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash Latest',
    tag: 'Tiêu chuẩn',
    badge: 'Ổn định',
    desc: 'Cân bằng giữa tốc độ và độ chính xác cho ngữ pháp HSK 1-6.',
  },
];

export default function AiTutorPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: `### 🇨🇳 Xin chào bạn! Tôi là ThaoTo AI Tutor

Tôi là trợ lý gia sư tiếng Trung thông minh 24/7 của bạn. Bạn có thể hỏi tôi bất kỳ điều gì:
- **Phân biệt ngữ pháp:** Giải thích cặn kẽ các cặp từ dễ nhầm như \`的、得、地\`, phân biệt \`会 vs 能\`, \`二 vs 两\`, cách dùng trợ từ \`了\`...
- **Phân tích câu:** Kiểm tra trật tự từ, ngữ pháp và gợi ý cách diễn đạt tự nhiên chuẩn bản xứ.
- **Tra cứu từ vựng:** Chữ Hán, Pinyin chuẩn kèm thanh điệu, giải nghĩa chi tiết và câu ví dụ.
- **Dịch thuật:** Dịch câu tiếng Việt sang tiếng Trung hoặc ngược lại kèm phiên âm.

*Hãy thử gõ câu hỏi hoặc bấm vào các gợi ý bên dưới nhé!*`,
      source: 'ThaoTo AI Core',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [isServerConfigured, setIsServerConfigured] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [validatingKey, setValidatingKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check server Gemini configuration status
    fetch('/api/config/gemini')
      .then((res) => res.json())
      .then((data) => {
        if (data.configured) {
          setIsServerConfigured(true);
        }
        if (data.currentModel) {
          setSelectedModel(data.currentModel);
        }
      })
      .catch((err) => console.error(err));

    const savedKey = localStorage.getItem('hanlearn_llm_api_key');
    if (savedKey) setApiKey(savedKey);

    const savedModel = localStorage.getItem('hanlearn_gemini_model');
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem('hanlearn_gemini_model', modelId);
  };

  const handleSaveKey = async (val: string, chosenModel = selectedModel) => {
    setKeyError(null);
    if (!val.trim()) {
      setApiKey('');
      localStorage.removeItem('hanlearn_llm_api_key');
      setShowKeyModal(false);
      return;
    }

    setValidatingKey(true);
    try {
      const res = await fetch('/api/config/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: val.trim(),
          modelName: chosenModel,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setApiKey(val.trim());
        setSelectedModel(chosenModel);
        setIsServerConfigured(true);
        localStorage.setItem('hanlearn_llm_api_key', val.trim());
        localStorage.setItem('hanlearn_gemini_model', chosenModel);
        setShowKeyModal(false);
      } else {
        setKeyError(data.error || 'API Key không hợp lệ');
      }
    } catch (err: any) {
      setKeyError('Lỗi kết nối khi xác thực API Key');
    } finally {
      setValidatingKey(false);
    }
  };

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    const userMessage = { role: 'user', content: q };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          apiKey: apiKey || undefined,
          modelName: selectedModel,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            source: data.source,
            ragItems: data.ragItems,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'Phân biệt cách dùng 的, 得 và 地',
    'Phân biệt 会 và 能',
    'Tại sao câu này dùng 了?',
    'Phân biệt 二 và 两',
    'Giải thích từ vựng 学习',
  ];

  const currentModelInfo = GEMINI_MODELS.find((m) => m.id === selectedModel) || GEMINI_MODELS[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-50 text-accent-700 text-xs font-semibold mb-2">
            <Bot className="w-4 h-4 text-accent-600" />
            <span>Gia sư Tiếng Trung Cá nhân hóa (RAG Knowledge Engine)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ThaoTo AI Chinese Tutor
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Hỏi đáp ngữ pháp, tra cứu từ vựng chuyên sâu và giải thích câu từ tiếng Trung dựa trên cơ sở dữ liệu AllSet và giáo trình chuẩn CLEC.
          </p>
        </div>

        {/* Model & Key Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Active Model Indicator */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-sm text-xs font-semibold text-slate-700 flex items-center gap-2 transition"
          >
            <Cpu className="w-4 h-4 text-purple-600" />
            <div className="text-left">
              <span className="block text-[10px] text-slate-400 font-medium">Model hiện tại:</span>
              <span className="font-bold text-purple-900">{currentModelInfo.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          <button
            onClick={() => setShowKeyModal(true)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold border flex items-center gap-2 transition ${
              isServerConfigured || apiKey
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isServerConfigured || apiKey ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            <Key className="w-3.5 h-3.5" />
            <span>{isServerConfigured || apiKey ? 'Đã kích hoạt API' : 'Cấu hình Key'}</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-accent-500 to-orange-400 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm space-y-3 shadow-sm ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  ) : (
                    <div className="prose prose-sm max-w-none text-slate-800 space-y-2">
                      <ReactMarkdown
                        components={{
                          h3: ({ node, ...props }) => (
                            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200/80 pb-1.5 mt-1 mb-2.5 flex items-center gap-2" {...props} />
                          ),
                          h4: ({ node, ...props }) => (
                            <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="leading-relaxed mb-2" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-5 space-y-1.5 my-2" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-5 space-y-1.5 my-2" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="leading-relaxed" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold text-slate-950" {...props} />
                          ),
                          code: ({ node, ...props }) => (
                            <code className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-mono text-xs font-semibold" {...props} />
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {!isUser && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-500">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Mô hình: {m.source || 'Cơ sở dữ liệu ThaoTo'}</span>
                      </span>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-12">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>{currentModelInfo.name} đang phân tích ngữ cảnh và biên soạn câu trả lời...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
            Hỏi nhanh:
          </span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="px-3 py-1 bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-slate-700 rounded-xl text-xs whitespace-nowrap transition"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Đặt câu hỏi về ngữ pháp, từ vựng hoặc dịch câu..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Model & Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Cấu Hình Mô Hình Google Gemini
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Model Cards */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                1. Chọn phiên bản mô hình Gemini mong muốn:
              </label>
              <div className="space-y-2">
                {GEMINI_MODELS.map((m) => {
                  const isSelected = selectedModel === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectModel(m.id)}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {m.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isSelected
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {m.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-snug">{m.desc}</p>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                2. Dán Google Gemini API Key:
              </label>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900">
                <span className="font-bold block mb-0.5">🔑 Lấy Key miễn phí:</span>
                <p className="text-[11px] text-purple-700">
                  Google cung cấp miễn phí API Key không giới hạn cho cả Gemini 2.0 Flash và 1.5 Pro tại{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-purple-900 hover:text-purple-950"
                  >
                    Google AI Studio (Click vào đây)
                  </a>.
                </p>
              </div>

              {keyError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                  {keyError}
                </div>
              )}

              <input
                type="password"
                defaultValue={apiKey}
                id="apiKeyInput"
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveKey('')}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
              >
                Xóa Key & Dùng Engine Nội Bộ
              </button>

              <button
                type="button"
                disabled={validatingKey}
                onClick={() => {
                  const val = (document.getElementById('apiKeyInput') as HTMLInputElement)?.value;
                  handleSaveKey(val || '', selectedModel);
                }}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {validatingKey && (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{validatingKey ? 'Đang xác thực với Google...' : 'Lưu & Kích hoạt Model'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
