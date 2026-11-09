'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Filter,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AudioButton } from '@/components/AudioPlayer';

export default function GrammarPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedHsk, setSelectedHsk] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedHsk) params.set('hsk', selectedHsk);

    fetch(`/api/grammar?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        if (data.items?.length > 0) {
          setExpandedId(data.items[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedHsk]);

  const hskTabs = ['', 'HSK1', 'HSK2', 'HSK3', 'HSK4'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Ngữ pháp Tiếng Trung Chuẩn</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Thư viện Ngữ pháp HSK
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Hệ thống công thức, cách dùng, ví dụ thực tế và giải thích chi tiết các lỗi người Việt thường mắc phải.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200">
        <span className="text-xs font-medium text-slate-500 px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Phân cấp HSK:
        </span>
        {hskTabs.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedHsk(lvl)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedHsk === lvl
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {lvl === '' ? 'Tất cả cấp độ' : lvl}
          </button>
        ))}
      </div>

      {/* Grammar Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            Đang tải dữ liệu ngữ pháp...
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            Chưa có bài ngữ pháp nào cho cấp độ này.
          </div>
        ) : (
          items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-100 text-primary-700">
                      {item.hskLevel}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs font-mono text-primary-600 mt-0.5">{item.pattern}</p>
                    </div>
                  </div>
                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-5">
                    {/* Pattern Display */}
                    <div className="p-3.5 bg-primary-50 rounded-xl border border-primary-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 block mb-1">
                        Công thức mẫu
                      </span>
                      <p className="text-sm font-semibold font-mono text-primary-950">
                        {item.pattern}
                      </p>
                    </div>

                    {/* Explanation */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Giải thích chi tiết
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{item.explanationVi}</p>
                    </div>

                    {/* Common Mistakes */}
                    {item.commonMistakes && (
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>Lỗi sai người học hay gặp</span>
                        </div>
                        <p className="leading-relaxed pl-5">{item.commonMistakes}</p>
                      </div>
                    )}

                    {/* Examples */}
                    {item.examples && item.examples.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Ví dụ ứng dụng thực tế
                        </h4>
                        <div className="grid grid-cols-1 gap-2.5">
                          {item.examples.map((ex: any) => (
                            <div
                              key={ex.id}
                              className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                            >
                              <div className="space-y-0.5">
                                <span className="text-base font-chinese font-bold text-slate-900">
                                  {ex.chinese}
                                </span>
                                <p className="text-xs font-semibold text-primary-600">{ex.pinyin}</p>
                                <p className="text-xs text-slate-600">{ex.translation}</p>
                              </div>
                              <AudioButton text={ex.chinese} size="sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

