'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  RotateCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  BookOpen,
  Plus,
} from 'lucide-react';
import { AudioButton } from '@/components/AudioPlayer';

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<any[]>([]);
  const [dueCards, setDueCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedSession, setCompletedSession] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newHsk, setNewHsk] = useState('HSK1');
  const [creating, setCreating] = useState(false);

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);

    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          hskLevel: newHsk,
          isPublic: true,
          cards: [],
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewDesc('');
        loadFlashcards();
      } else {
        alert('Vui lòng đăng nhập để tạo bộ thẻ cá nhân');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const loadFlashcards = () => {
    setLoading(true);
    fetch('/api/flashcards')
      .then((res) => res.json())
      .then((data) => {
        setDecks(data.decks || []);
        setDueCards(data.dueCards || []);
        setCurrentIndex(0);
        setIsFlipped(false);
        setCompletedSession(false);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  const currentCard = dueCards[currentIndex];

  const handleRating = async (rating: number) => {
    if (!currentCard) return;

    try {
      await fetch('/api/flashcards/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userFlashcardId: currentCard.id,
          rating,
        }),
      });

      setReviewedCount((prev) => prev + 1);
      setIsFlipped(false);

      if (currentIndex + 1 < dueCards.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCompletedSession(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          <Layers className="w-4 h-4" />
          <span>Thuật toán Anki SuperMemo 2 (SM-2)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Flashcards Lặp lại ngắt quãng (SRS)
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Hệ thống tự động tính toán thời điểm vàng để nhắc bạn ôn tập trước khi từ vựng bị quên lãng.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
          Đang chuẩn bị bộ thẻ ôn tập...
        </div>
      ) : completedSession || dueCards.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {completedSession
              ? 'Xuất sắc! Bạn đã hoàn thành phiên ôn tập'
              : 'Hiện không có thẻ nào đến hạn ôn tập'}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {completedSession
              ? `Bạn đã ôn tập thành công ${reviewedCount} thẻ từ vựng với thuật toán SM-2. Điểm kinh nghiệm đã được cộng vào hồ sơ của bạn.`
              : 'Tuyệt vời! Bạn đã hoàn thành tất cả các mục tiêu ôn tập hôm nay. Bạn có thể thêm từ mới từ mục Từ vựng hoặc khám phá bài học mới.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={loadFlashcards}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Làm mới danh sách
            </button>
            <Link
              href="/vocabulary"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Thêm từ vựng mới
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Thẻ {currentIndex + 1} / {dueCards.length}
            </span>
            <span>Khoảng cách lặp lại: {currentCard.interval} ngày</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
            />
          </div>

          {/* Flashcard container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[360px] bg-white rounded-3xl border-2 border-slate-200 hover:border-primary-400 p-8 shadow-md flex flex-col justify-between items-center text-center transition-all duration-200 relative overflow-hidden"
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg">
                {currentCard.vocabulary?.hskLevel || 'HSK'}
              </span>
              <div onClick={(e) => e.stopPropagation()}>
                <AudioButton text={currentCard.vocabulary?.simplified || ''} size="md" />
              </div>
            </div>

            {/* Front & Back Content */}
            <div className="space-y-4 my-auto py-6">
              {!isFlipped ? (
                <>
                  <div className="text-7xl font-chinese font-bold text-slate-900 tracking-wide">
                    {currentCard.vocabulary?.simplified}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" /> Chạm để lật mặt sau
                  </p>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-4xl font-chinese font-bold text-slate-900">
                    {currentCard.vocabulary?.simplified}
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    {currentCard.vocabulary?.pinyin}
                  </div>
                  <div className="text-lg font-medium text-slate-800">
                    {currentCard.vocabulary?.meaningVi}
                  </div>
                  {currentCard.vocabulary?.examples?.[0] && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 max-w-md mx-auto text-xs text-slate-600">
                      <p className="font-chinese font-semibold text-slate-900">
                        {currentCard.vocabulary.examples[0].chinese}
                      </p>
                      <p className="text-primary-600">
                        {currentCard.vocabulary.examples[0].pinyin}
                      </p>
                      <p>{currentCard.vocabulary.examples[0].vietnamese}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400">
              {isFlipped ? 'Chọn mức độ ghi nhớ bên dưới' : 'Nhấn vào thẻ để xem đáp án'}
            </div>
          </div>

          {/* SM-2 Rating Buttons (Appear when flipped) */}
          {isFlipped ? (
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => handleRating(1)}
                className="py-3 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-center font-bold text-xs sm:text-sm transition"
              >
                <div>Quên (Again)</div>
                <div className="text-[10px] font-normal text-rose-500 mt-0.5">&lt; 1 ngày</div>
              </button>
              <button
                onClick={() => handleRating(2)}
                className="py-3 px-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-2xl text-center font-bold text-xs sm:text-sm transition"
              >
                <div>Khó (Hard)</div>
                <div className="text-[10px] font-normal text-amber-500 mt-0.5">1 - 2 ngày</div>
              </button>
              <button
                onClick={() => handleRating(3)}
                className="py-3 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-2xl text-center font-bold text-xs sm:text-sm transition"
              >
                <div>Tốt (Good)</div>
                <div className="text-[10px] font-normal text-blue-500 mt-0.5">3 - 6 ngày</div>
              </button>
              <button
                onClick={() => handleRating(4)}
                className="py-3 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-2xl text-center font-bold text-xs sm:text-sm transition"
              >
                <div>Dễ (Easy)</div>
                <div className="text-[10px] font-normal text-emerald-500 mt-0.5">&gt; 7 ngày</div>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsFlipped(true)}
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-semibold shadow-md shadow-primary-500/20 transition flex items-center justify-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              <span>Xem đáp án mặt sau</span>
            </button>
          )}
        </div>
      )}

      {/* Public Decks Overview */}
      <div className="pt-8 border-t border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Bộ thẻ ôn tập có sẵn</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo bộ thẻ mới</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                  {deck.hskLevel || 'Chung'}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{deck.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{deck.description}</p>
                <span className="text-xs font-semibold text-primary-600 mt-2 block">
                  {deck.flashcards?.length || 0} thẻ từ vựng
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Deck Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Tạo bộ thẻ Flashcards cá nhân</h3>
            <form onSubmit={handleCreateDeck} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên bộ thẻ
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Từ vựng Du lịch Bắc Kinh"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả ngắn
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Mô tả nội dung của bộ thẻ..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cấp độ HSK tương ứng
                </label>
                <select
                  value={newHsk}
                  onChange={(e) => setNewHsk(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="HSK1">HSK 1</option>
                  <option value="HSK2">HSK 2</option>
                  <option value="HSK3">HSK 3</option>
                  <option value="HSK4">HSK 4</option>
                  <option value="HSK5">HSK 5</option>
                  <option value="HSK6">HSK 6</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                >
                  {creating ? 'Đang tạo...' : 'Tạo bộ thẻ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

