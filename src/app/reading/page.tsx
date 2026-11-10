'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Sparkles,
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

export default function ReadingPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
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

  // When changing level tab, auto select first item in that level if current item is not in filtered
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100">
            <FileText className="w-4 h-4" />
            <span>Thư viện Đọc hiểu Phân cấp (Reading Library)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Luyện Đọc hiểu tiếng Trung HSK 1 – HSK 6
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Chọn chủ đề và cấp độ để luyện đọc văn bản thực tế kèm Pinyin, phát âm giọng chuẩn bản xứ và câu hỏi củng cố.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-200/60 px-4 py-2.5 rounded-2xl text-emerald-800 text-xs font-semibold self-start md:self-auto">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>{items.length} bài đọc phong phú</span>
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
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-emerald-700 text-emerald-100'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reading Materials Selector Carousel / Grid */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Danh sách bài đọc ({filteredItems.length} bài)
          </span>
          <span className="text-slate-400">Bấm bài bất kỳ để đọc</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            Chưa có bài đọc nào ở cấp độ này. Hãy chọn cấp độ khác.
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
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.hskLevel}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {item.estimatedMinutes}p
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold line-clamp-1 ${
                        isSelected ? 'text-emerald-950 font-extrabold' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-chinese">
                      {item.contentChinese}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100/80 text-slate-500">
                    <span className="truncate">{item.topic || 'Đọc hiểu thực hành'}</span>
                    <span className="text-emerald-700 font-semibold flex items-center">
                      Đọc bài <ChevronRight className="w-3 h-3 ml-0.5" />
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
          Đang tải nội dung bài đọc...
        </div>
      ) : selectedItem ? (
        <div className="space-y-6">
          {/* Main Reading Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {selectedItem.hskLevel}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedItem.topic || 'Chủ đề đời sống'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {selectedItem.title}
                </h2>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {selectedItem.estimatedMinutes} phút đọc
                </span>
                <AudioButton text={selectedItem.contentChinese} size="md" />
              </div>
            </div>

            {/* Toggle controls */}
            <div className="flex flex-wrap items-center gap-2">
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
                <span>{showTranslation ? 'Ẩn dịch nghĩa' : 'Hiện bản dịch tiếng Việt'}</span>
              </button>
            </div>

            {/* Reading Content */}
            <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-4">
              <p className="font-chinese text-lg sm:text-xl font-medium text-slate-900 leading-loose tracking-wide">
                {selectedItem.contentChinese}
              </p>

              {showPinyin && (
                <div className="pt-4 border-t border-slate-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                    Phiên âm Pinyin chuẩn
                  </span>
                  <p className="text-sm font-mono text-indigo-950 leading-relaxed">
                    {selectedItem.contentPinyin}
                  </p>
                </div>
              )}

              {showTranslation && (
                <div className="pt-4 border-t border-slate-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                    Bản dịch tiếng Việt
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-sans">
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
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Câu hỏi đọc hiểu ({selectedItem.questions.length} câu)
                  </h3>
                </div>
                {submitted && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Làm lại bài
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {selectedItem.questions.map((q: any, idx: number) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;

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
                            btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500';
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
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50"
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
