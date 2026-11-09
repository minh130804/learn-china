'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  BookA,
  Filter,
  Plus,
  Layers,
  Sparkles,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import { AudioButton } from '@/components/AudioPlayer';

export default function VocabularyPage() {
  const [query, setQuery] = useState('');
  const [selectedHsk, setSelectedHsk] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState<any>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const fetchVocab = (q = '', hsk = '') => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (hsk) params.set('hsk', hsk);

    fetch(`/api/vocabulary?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        if (data.items?.length > 0 && !selectedVocab) {
          setSelectedVocab(data.items[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVocab(query, selectedHsk);
  }, [selectedHsk]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVocab(query, selectedHsk);
  };

  const handleAddToFlashcard = async (vocab: any) => {
    try {
      const res = await fetch('/api/flashcards/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vocabularyId: vocab.id,
          rating: 3, // Initial good rating
        }),
      });

      if (res.ok) {
        setAddedIds((prev) => new Set(prev).add(vocab.id));
      } else {
        alert('Vui lòng đăng nhập để thêm từ vào bộ Flashcard cá nhân!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const hskTabs = ['', 'HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-2">
          <BookA className="w-4 h-4" />
          <span>Tra cứu & Từ vựng Chuẩn hóa</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Từ điển & Kho từ vựng tiếng Trung
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Hỗ trợ tìm kiếm theo chữ Hán Giản thể, Phồn thể, Pinyin hoặc nghĩa tiếng Việt. Tích hợp phát âm chuẩn và ví dụ thực tế.
        </p>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm: 你好, ni hao, xin chào, hello..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition"
          >
            Tìm kiếm
          </button>
        </form>

        {/* HSK Level Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Lọc HSK:
          </span>
          {hskTabs.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedHsk(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedHsk === lvl
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === '' ? 'Tất cả' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left List + Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vocabulary Items List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
              Đang tra cứu cơ sở dữ liệu...
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
              Không tìm thấy từ vựng phù hợp với từ khóa này.
            </div>
          ) : (
            items.map((vocab) => {
              const isSelected = selectedVocab?.id === vocab.id;
              const isAdded = addedIds.has(vocab.id);

              return (
                <div
                  key={vocab.id}
                  onClick={() => setSelectedVocab(vocab)}
                  className={`p-4 bg-white rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-chinese font-bold text-slate-900">
                      {vocab.simplified}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary-600">{vocab.pinyin}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {vocab.hskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">{vocab.meaningVi}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <AudioButton text={vocab.simplified} size="sm" />
                    <button
                      onClick={() => handleAddToFlashcard(vocab)}
                      title="Thêm vào Flashcard ôn tập"
                      className={`p-1.5 rounded-lg text-xs font-medium transition ${
                        isAdded
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                    >
                      {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Vocabulary Detail Panel */}
        <div className="space-y-4">
          {selectedVocab ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-5xl font-chinese font-bold text-slate-900 leading-none">
                    {selectedVocab.simplified}
                  </div>
                  {selectedVocab.traditional &&
                    selectedVocab.traditional !== selectedVocab.simplified && (
                      <span className="text-xs text-slate-400 mt-1 block">
                        Phồn thể: {selectedVocab.traditional}
                      </span>
                    )}
                </div>
                <AudioButton text={selectedVocab.simplified} size="lg" />
              </div>

              <div>
                <div className="text-lg font-bold text-primary-600">{selectedVocab.pinyin}</div>
                <div className="text-sm font-semibold text-slate-800 mt-1">
                  {selectedVocab.meaningVi}
                </div>
                {selectedVocab.meaningEn && (
                  <div className="text-xs text-slate-500 mt-0.5 italic">
                    EN: {selectedVocab.meaningEn}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 text-slate-600">
                <div>
                  <span className="text-slate-400">Cấp độ:</span>{' '}
                  <span className="font-semibold text-slate-800">{selectedVocab.hskLevel}</span>
                </div>
                <div>
                  <span className="text-slate-400">Từ loại:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {selectedVocab.partOfSpeech || 'Từ vựng'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Số nét:</span>{' '}
                  <span className="font-semibold text-slate-800">{selectedVocab.strokeCount}</span>
                </div>
                <div>
                  <span className="text-slate-400">Bộ thủ:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {selectedVocab.radical || 'Cơ bản'}
                  </span>
                </div>
              </div>

              {/* Examples */}
              {selectedVocab.examples && selectedVocab.examples.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Câu ví dụ minh họa
                  </h4>
                  {selectedVocab.examples.map((ex: any) => (
                    <div
                      key={ex.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-chinese font-semibold text-slate-900">
                          {ex.chinese}
                        </span>
                        <AudioButton text={ex.chinese} size="sm" />
                      </div>
                      <p className="text-xs text-primary-600 font-medium">{ex.pinyin}</p>
                      <p className="text-xs text-slate-600">{ex.vietnamese}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2">
                <button
                  onClick={() => handleAddToFlashcard(selectedVocab)}
                  className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>
                    {addedIds.has(selectedVocab.id)
                      ? 'Đã có trong Flashcard ôn tập'
                      : 'Thêm vào bộ Flashcards SRS'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
              Chọn một từ vựng để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

