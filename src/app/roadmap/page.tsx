'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  CheckCircle,
  Lock,
  ArrowRight,
  BookA,
  BookOpen,
  Headphones,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function RoadmapPage() {
  const [selectedLevel, setSelectedLevel] = useState('HSK1');

  const levels = [
    {
      id: 'HSK1',
      name: 'HSK 1: Khởi đầu & Nhập môn',
      vocabTarget: 150,
      grammarCount: 15,
      status: 'IN_PROGRESS',
      progress: 68,
      desc: 'Nắm vững bảng chữ cái Pinyin, phát âm chuẩn 4 thanh điệu, giao tiếp chào hỏi, giới thiệu bản thân và số đếm cơ bản.',
      topics: ['Pinyin & Thanh điệu', 'Chào hỏi & Cảm ơn', 'Gia đình & Nghề nghiệp', 'Ngày tháng & Thời gian', 'Đồ ăn & Thức uống'],
    },
    {
      id: 'HSK2',
      name: 'HSK 2: Giao tiếp Hàng ngày',
      vocabTarget: 300,
      grammarCount: 25,
      status: 'AVAILABLE',
      progress: 20,
      desc: 'Giao tiếp trong các tình huống sinh hoạt quen thuộc như mua sắm, gọi món, đi taxi, hỏi đường và thời tiết.',
      topics: ['Hỏi đường & Phương tiện', 'Mua sắm & Trả giá', 'Sở thích & Thể thao', 'Trợ từ kết cấu 的 得 地', 'Câu chữ 把 cơ bản'],
    },
    {
      id: 'HSK3',
      name: 'HSK 3: Tự tin Sinh hoạt',
      vocabTarget: 600,
      grammarCount: 40,
      status: 'LOCKED',
      progress: 0,
      desc: 'Hoàn thành các nhiệm vụ giao tiếp cơ bản trong cuộc sống, học tập và công việc. Có thể du lịch tự túc tại Trung Quốc.',
      topics: ['Du lịch & Đặt phòng', 'Khám bệnh & Sức khỏe', 'Môi trường & Công sở', 'Bổ ngữ kết quả & Bổ ngữ xu hướng'],
    },
    {
      id: 'HSK4',
      name: 'HSK 4: Thảo luận & Làm việc',
      vocabTarget: 1200,
      grammarCount: 60,
      status: 'LOCKED',
      progress: 0,
      desc: 'Thảo luận lưu loát về nhiều chủ đề, đọc hiểu tin tức ngắn và tự tin giao tiếp trôi chảy với người bản xứ.',
      topics: ['Kinh tế & Thương mại', 'Công nghệ & Đời sống', 'Thành ngữ bốn chữ', 'Văn hóa truyền thống'],
    },
    {
      id: 'HSK5',
      name: 'HSK 5: Đọc báo & Xem phim',
      vocabTarget: 2500,
      grammarCount: 80,
      status: 'LOCKED',
      progress: 0,
      desc: 'Đọc báo chí tiếng Trung, thưởng thức phim ảnh không cần phụ đề và thuyết trình chuyên môn.',
      topics: ['Phim ảnh & Văn học', 'Báo chí & Bình luận', 'Diễn thuyết & Tranh luận'],
    },
    {
      id: 'HSK6',
      name: 'HSK 6: Tinh thông & Bản xứ',
      vocabTarget: 5000,
      grammarCount: 120,
      status: 'LOCKED',
      progress: 0,
      desc: 'Dễ dàng hiểu tất cả thông tin tiếp nhận qua nghe hoặc đọc, biểu đạt suy nghĩ trôi chảy, chính xác.',
      topics: ['Học thuật cao cấp', 'Văn ngôn & Thành ngữ cổ', 'Biên phiên dịch chuyên sâu'],
    },
    {
      id: 'HSK7_9',
      name: 'HSK 7–9: Chuyên gia & Học thuật',
      vocabTarget: 11000,
      grammarCount: 180,
      status: 'LOCKED',
      progress: 0,
      desc: 'Chuẩn HSK 3.0 dành cho học giả quốc tế, nhà nghiên cứu và dịch giả văn học Trung Quốc.',
      topics: ['Nghiên cứu Hán học', 'Văn học cổ điển', 'Biện luận hàn lâm'],
    },
  ];

  const currentLevelData = levels.find((l) => l.id === selectedLevel) || levels[0];

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-2">
          <Compass className="w-4 h-4" />
          <span>Lộ trình chuẩn CLEC & HSK 3.0</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Lộ trình chinh phục HSK 1 – HSK 9
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Hệ thống bài học được thiết kế từng bước, từ con số không đến trình độ chuyên gia, cân bằng cả 4 kỹ năng Nghe - Nói - Đọc - Viết.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Level List */}
        <div className="space-y-3">
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <div
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary-50 border-primary-500 shadow-sm ring-1 ring-primary-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        lvl.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : lvl.status === 'AVAILABLE'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {lvl.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{lvl.name.split(':')[0]}</h3>
                  </div>

                  {lvl.status === 'IN_PROGRESS' ? (
                    <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                      Đang học ({lvl.progress}%)
                    </span>
                  ) : lvl.status === 'AVAILABLE' ? (
                    <span className="text-xs font-medium text-indigo-600">Sẵn sàng</span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${lvl.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Level Detail Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                Chi tiết cấp độ
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">{currentLevelData.name}</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {currentLevelData.desc}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-primary-600">
                {currentLevelData.vocabTarget}
              </span>
              <p className="text-xs text-slate-500 font-medium">Từ vựng mục tiêu</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Các chủ đề cốt lõi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentLevelData.topics.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-800"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <Link
              href={`/vocabulary?hsk=${currentLevelData.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <BookA className="w-4 h-4" />
              <span>Học từ vựng cấp độ này</span>
            </Link>
            <Link
              href={`/grammar?hsk=${currentLevelData.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Xem ngữ pháp</span>
            </Link>
            <Link
              href={`/exams?hsk=${currentLevelData.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold transition"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Thi thử kiểm tra</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

