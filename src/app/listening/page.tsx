'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Headphones,
  Eye,
  EyeOff,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { AudioButton } from '@/components/AudioPlayer';

const HSK_TABS = [
  { id: 'ALL', label: 'Tất cả cấp độ' },
  { id: 'HSK1', label: 'HSK 1 (Sơ cấp)' },
  { id: 'HSK2', label: 'HSK 2' },
  { id: 'HSK3', label: 'HSK 3 (Trung cấp)' },
  { id: 'HSK4', label: 'HSK 4' },
  { id: 'HSK5', label: 'HSK 5 (Cao cấp)' },
  { id: 'HSK6', label: 'HSK 6 (Thành thạo)' },
];

export default function ListeningPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listening')
      .then((res) => res.json())
      .then((data) => {
        const loaded = data.items || [];
        setItems(loaded);
        if (loaded.length > 0) {
          setSelectedItem(loaded[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedLevel === 'ALL') return items;
    return items.filter((item) => item.hskLevel === selectedLevel);
  }, [items, selectedLevel]);

  const handleSelectTab = (level: string) => {
    setSelectedLevel(level);
    const newFiltered = level === 'ALL' ? items : items.filter((i) => i.hskLevel === level);
    if (newFiltered.length > 0) {
      setSelectedItem(newFiltered[0]);
      handleReset();
    }
  };

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    handleReset();
  };

  const handleSelectAnswer = (qId: string, option: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
    setShowTranscript(false);
    setShowPinyin(false);
    setShowTranslation(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100">
            <Headphones className="w-4 h-4" />
            <span>Luyện kỹ năng Nghe hiểu (Listening Lab)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Luyện nghe tiếng Trung thực tế HSK 1 – HSK 6
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Luyện tai nghe với các đoạn hội thoại thực tế, tùy chỉnh tốc độ, ẩn hiện phụ đề Pinyin và kiểm tra độ hiểu bài tức thì.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50/70 border border-blue-200/60 px-4 py-2.5 rounded-2xl text-blue-800 text-xs font-semibold self-start md:self-auto">
          <Volume2 className="w-4 h-4 text-blue-600" />
          <span>{items.length} bài hội thoại có sẵn</span>
        </div>
      </div>

      {/* Level Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {HSK_TABS.map((tab) => {
          const count =
            tab.id === 'ALL'
              ? items.length
              : items.filter((i) => i.hskLevel === tab.id).length;
          const isActive = selectedLevel === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 ring-2 ring-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-blue-700 text-blue-100'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Listening Materials Selector Grid */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Danh sách bài nghe ({filteredItems.length} bài)
          </span>
          <span className="text-slate-400">Bấm bài bất kỳ để nghe</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            Chưa có bài nghe nào ở cấp độ này. Hãy chọn cấp độ khác.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`text-left p-3.5 rounded-xl border transition flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.hskLevel}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {item.duration || 45}s
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold line-clamp-1 ${
                        isSelected ? 'text-blue-950 font-extrabold' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100/80 text-slate-500">
                    <span className="truncate">{item.questions?.length || 1} câu hỏi</span>
                    <span className="text-blue-700 font-semibold flex items-center">
                      Luyện nghe <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 shadow-sm">
          Đang tải bài nghe...
        </div>
      ) : selectedItem ? (
        <div className="space-y-6">
          {/* Main Audio Player Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {selectedItem.hskLevel}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {selectedItem.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedItem.description}</p>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60">
                {[1.0, 0.75, 0.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                      speed === s
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Play Audio CTA */}
            <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-blue-50/50 to-indigo-50/40 rounded-2xl border border-blue-100/70 space-y-3">
              <AudioButton
                text={selectedItem.transcript}
                speed={speed}
                size="lg"
                label="Phát toàn bộ bài nghe"
                className="px-8 py-4 shadow-lg shadow-blue-500/10 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
              />
              <span className="text-xs text-slate-500">
                Tốc độ đang chọn: <strong className="text-blue-700">{speed}x</strong> | Giọng đọc chuẩn phát thanh viên Bắc Kinh
              </span>
            </div>

            {/* Subtitle Toggles */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showTranscript
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showTranscript ? 'Ẩn chữ Hán' : 'Hiện phụ đề chữ Hán'}</span>
              </button>

              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showPinyin
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {showPinyin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin'}</span>
              </button>

              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showTranslation
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showTranslation ? 'Ẩn bản dịch' : 'Hiện bản dịch tiếng Việt'}</span>
              </button>
            </div>

            {/* Subtitle Display */}
            {(showTranscript || showPinyin || showTranslation) && (
              <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-4">
                {showTranscript && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Lời thoại chữ Hán
                    </span>
                    <p className="font-chinese text-base sm:text-lg font-medium text-slate-900 leading-relaxed whitespace-pre-line">
                      {selectedItem.transcript}
                    </p>
                  </div>
                )}

                {showPinyin && (
                  <div className={showTranscript ? 'pt-4 border-t border-slate-200/70' : ''}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                      Phiên âm Pinyin
                    </span>
                    <p className="text-sm font-mono text-indigo-950 leading-relaxed whitespace-pre-line">
                      {selectedItem.pinyin}
                    </p>
                  </div>
                )}

                {showTranslation && (
                  <div className={showTranscript || showPinyin ? 'pt-4 border-t border-slate-200/70' : ''}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                      Bản dịch tiếng Việt
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {selectedItem.translationVi}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Listening Comprehension Quiz */}
          {selectedItem.questions && selectedItem.questions.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Câu hỏi kiểm tra thấu hiểu ({selectedItem.questions.length} câu)
                  </h3>
                </div>
                {submitted && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-blue-700 font-bold hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Nghe và làm lại
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {selectedItem.questions.map((q: any, idx: number) => {
                  const userAnswer = userAnswers[q.id];

                  return (
                    <div key={q.id} className="space-y-3">
                      <p className="text-sm font-bold text-slate-900 flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center flex-shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{q.question}</span>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map((opt: string) => {
                          const isSelected = userAnswer === opt;
                          let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                          if (submitted) {
                            if (opt === q.correctAnswer) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-400';
                            } else if (isSelected) {
                              btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                            }
                          } else if (isSelected) {
                            btnStyle = 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500';
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
                        <div className="p-3 bg-blue-50/80 rounded-xl text-xs text-blue-900 border border-blue-100 flex items-start gap-2">
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
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  Kiểm tra đáp án nghe hiểu
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
