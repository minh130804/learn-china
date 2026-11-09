'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Award,
  Layers,
  Bot,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  PenTool,
  BookA,
  Volume2,
  GraduationCap,
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((res) => res.json()),
      fetch('/api/progress').then((res) => res.json()),
    ])
      .then(([userData, progressData]) => {
        if (userData.authenticated) {
          setUser(userData.user);
        }
        setStats(progressData);
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  const weeklyDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-primary-900 via-indigo-900 to-slate-900 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold text-accent-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tiến trình học tập thông minh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Chào mừng trở lại, {user?.name || 'Học viên'}! 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Hôm nay là thời điểm lý tưởng để ôn tập thẻ nhớ và luyện giao tiếp tiếng Trung cùng Gia sư AI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/flashcards"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold shadow-md shadow-accent-500/20 transition transform hover:-translate-y-0.5"
            >
              <Layers className="w-4 h-4" />
              <span>Ôn tập thẻ ({stats?.flashcardsDue ?? 4})</span>
            </Link>
            <Link
              href="/ai-tutor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 transition"
            >
              <Bot className="w-4 h-4 text-accent-400" />
              <span>Hỏi AI Tutor</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chuỗi liên tiếp</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {user?.profile?.streakDays ?? 7} <span className="text-sm font-medium text-slate-500">ngày</span>
            </h3>
            <p className="text-[11px] text-amber-600 font-medium mt-1">🔥 Giữ vững phong độ!</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thẻ cần ôn hôm nay</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {stats?.flashcardsDue ?? 4} <span className="text-sm font-medium text-slate-500">từ</span>
            </h3>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">Spaced Repetition (SRS)</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm tích lũy</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {user?.profile?.totalPoints ?? 1250} <span className="text-sm font-medium text-slate-500">pts</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Cấp độ: {user?.profile?.targetHskLevel || 'HSK1'}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mục tiêu ngày</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {user?.profile?.dailyGoalMinutes ?? 20} <span className="text-sm font-medium text-slate-500">phút</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Đã hoàn thành 75%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Hoạt động học tập tuần này</h2>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Tuần hiện tại
              </span>
            </div>

            {/* Week attendance simulation */}
            <div className="grid grid-cols-7 gap-2 text-center py-2">
              {weeklyDays.map((d, i) => (
                <div key={d} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold transition ${i < 5
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                      : i === 5
                        ? 'bg-primary-600 text-white ring-2 ring-primary-300 ring-offset-2'
                        : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    {i < 5 ? <CheckCircle2 className="w-4 h-4" /> : d}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">{d}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Đã học 6/7 ngày liên tiếp</span>
              <span className="font-semibold text-emerald-600">+120 XP hôm nay</span>
            </div>
          </div>

          {/* Core modules quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/vocabulary"
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-primary-400 hover:shadow-sm transition group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                  <BookA className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition">
                    Từ vựng & Tra cứu
                  </h4>
                  <p className="text-xs text-slate-500">Tra chữ Hán, Pinyin & ví dụ</p>
                </div>
              </div>
            </Link>

            <Link
              href="/speaking"
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-primary-400 hover:shadow-sm transition group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition">
                    Luyện nói cùng AI
                  </h4>
                  <p className="text-xs text-slate-500">Đối thoại gọi món & hỏi đường</p>
                </div>
              </div>
            </Link>

            <Link
              href="/writing"
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-primary-400 hover:shadow-sm transition group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition">
                    Luyện viết chữ Hán
                  </h4>
                  <p className="text-xs text-slate-500">Bảng vẽ Mễ tự cách tương tác</p>
                </div>
              </div>
            </Link>

            <Link
              href="/exams"
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-primary-400 hover:shadow-sm transition group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition">
                    Thi thử HSK Chuẩn
                  </h4>
                  <p className="text-xs text-slate-500">Bấm giờ & chấm điểm tức thì</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Side Panel: Daily Recommendations */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Đề xuất cho bạn hôm nay</h3>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                Ngữ pháp HSK 1
              </span>
              <p className="text-sm font-semibold text-slate-800">
                Phân biệt cách dùng 是 và 吗
              </p>
              <Link
                href="/grammar"
                className="text-xs text-primary-600 font-medium inline-flex items-center gap-1 hover:underline pt-1"
              >
                Học bài này <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-600">
                Luyện nghe hội thoại
              </span>
              <p className="text-sm font-semibold text-slate-800">
                Chào hỏi và làm quen tại trường học
              </p>
              <Link
                href="/listening"
                className="text-xs text-accent-600 font-medium inline-flex items-center gap-1 hover:underline pt-1"
              >
                Nghe ngay <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Đọc hiểu truyện ngắn
              </span>
              <p className="text-sm font-semibold text-slate-800">
                Một ngày của Tiểu Minh (小明的一天)
              </p>
              <Link
                href="/reading"
                className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1 hover:underline pt-1"
              >
                Đọc bài <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

