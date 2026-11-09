'use client';

import React, { useState, useEffect } from 'react';
import { PenTool, CheckCircle, Sparkles } from 'lucide-react';
import { HanziCanvas } from '@/components/HanziCanvas';

export default function WritingPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedChar, setSelectedChar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/writing')
      .then((res) => res.json())
      .then((data) => {
        setExercises(data.items || []);
        if (data.items?.length > 0) {
          setSelectedChar(data.items[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2">
          <PenTool className="w-4 h-4" />
          <span>Luyện viết chữ Hán (Hanzi Writing)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Tập viết chữ Hán trên Bảng Mễ Tự Cách
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Học thứ tự nét chuẩn (Bút thuận), quy tắc viết chữ Hán và thực hành nét bút trực tiếp trên bảng vẽ cảm ứng.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          Đang tải bài luyện viết chữ Hán...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Character Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {exercises.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedChar(item)}
                className={`px-4 py-2 rounded-xl font-chinese text-base font-bold transition border ${
                  selectedChar?.id === item.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {item.character} <span className="text-xs font-normal">({item.pinyin})</span>
              </button>
            ))}
          </div>

          {/* Writing Canvas & Details Area */}
          {selectedChar && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Interactive Canvas */}
              <div className="flex justify-center">
                <HanziCanvas
                  character={selectedChar.character}
                  pinyin={selectedChar.pinyin}
                  meaning={selectedChar.meaningVi}
                  strokeCount={selectedChar.strokeCount}
                  radical={selectedChar.radical}
                  rule={selectedChar.strokeData?.rule}
                />
              </div>

              {/* Stroke Order Guidelines */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Thứ tự các nét (笔顺)
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Chữ: {selectedChar.character} – {selectedChar.meaningVi}
                  </h3>
                </div>

                {selectedChar.strokeData?.strokes && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500">
                      Các nét theo thứ tự chuẩn:
                    </p>
                    <div className="space-y-1.5">
                      {selectedChar.strokeData.strokes.map((stroke: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-800"
                        >
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{stroke}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold text-amber-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>7 Quy tắc viết bút thuận cốt lõi</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 pt-1">
                    <li>Ngang trước sổ sau (一 trước 丨 sau).</li>
                    <li>Phẩy trước mác sau (丿 trước ㇏ sau).</li>
                    <li>Trên trước dưới sau, trái trước phải sau.</li>
                    <li>Ngoài trước trong sau, vào trước đóng sau.</li>
                    <li>Giữa trước hai bên sau (Ví dụ chữ 小, 水).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

