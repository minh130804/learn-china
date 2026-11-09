'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { AudioButton } from '@/components/AudioPlayer';

export default function ReadingPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPinyin, setShowPinyin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reading')
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        if (data.items?.length > 0) {
          setSelectedItem(data.items[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectAnswer = (qId: string, opt: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
    setShowPinyin(false);
    setShowTranslation(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
          <FileText className="w-4 h-4" />
          <span>Luyện kỹ năng Đọc hiểu (Reading)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Thư viện Bài đọc tiếng Trung Phân cấp
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Đọc hiểu các câu chuyện văn hóa, sinh hoạt hàng ngày với phụ đề Pinyin và bản dịch song ngữ linh hoạt.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          Đang tải bài đọc...
        </div>
      ) : selectedItem ? (
        <div className="space-y-6">
          {/* Main Reading Text Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    {selectedItem.hskLevel}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{selectedItem.topic}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1.5">{selectedItem.title}</h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedItem.estimatedMinutes} phút đọc
                </span>
                <AudioButton text={selectedItem.contentChinese} size="md" />
              </div>
            </div>

            {/* Toggle controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showPinyin
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {showPinyin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin'}</span>
              </button>

              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showTranslation
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showTranslation ? 'Ẩn dịch nghĩa' : 'Hiện dịch nghĩa tiếng Việt'}</span>
              </button>
            </div>

            {/* Reading Content */}
            <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-4">
              <p className="font-chinese text-lg font-medium text-slate-900 leading-loose tracking-wide">
                {selectedItem.contentChinese}
              </p>

              {showPinyin && (
                <div className="pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 block mb-1">
                    Pinyin
                  </span>
                  <p className="text-sm font-mono text-primary-800 leading-relaxed">
                    {selectedItem.contentPinyin}
                  </p>
                </div>
              )}

              {showTranslation && (
                <div className="pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                    Bản dịch tiếng Việt
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedItem.contentVi}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reading Comprehension Questions */}
          {selectedItem.questions && selectedItem.questions.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Câu hỏi đọc hiểu ({selectedItem.questions.length} câu)
                </h3>
                {submitted && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Đọc và làm lại
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {selectedItem.questions.map((q: any, idx: number) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div key={q.id} className="space-y-3">
                      <p className="text-sm font-bold text-slate-900">
                        Câu {idx + 1}: {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt: string) => {
                          const isSelected = userAnswer === opt;
                          let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                          if (submitted) {
                            if (opt === q.correctAnswer) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                            } else if (isSelected) {
                              btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                            }
                          } else if (isSelected) {
                            btnStyle = 'border-primary-500 bg-primary-50 text-primary-800 font-semibold';
                          }

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, opt)}
                              className={`p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {submitted && opt === q.correctAnswer && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              )}
                              {submitted && isSelected && opt !== q.correctAnswer && (
                                <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {submitted && q.explanation && (
                        <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900 border border-blue-100 flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!submitted && (
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  Kiểm tra đáp án đọc hiểu
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

