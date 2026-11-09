import React from 'react';
import Link from 'next/link';
import {
  Compass,
  BookA,
  Layers,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  GraduationCap,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Database,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: BookA,
      title: 'Từ điển & 50,000+ Từ vựng',
      desc: 'Dữ liệu chuẩn hóa từ CC-CEDICT & HSK 3.0 với Pinyin, số nét, bộ thủ và ví dụ thực tế.',
      href: '/vocabulary',
      badge: 'HSK 1-9',
    },
    {
      icon: Layers,
      title: 'Flashcards Spaced Repetition (SRS)',
      desc: 'Thuật toán lặp lại ngắt quãng SM-2 / Anki giúp ghi nhớ từ vựng vĩnh viễn với nỗ lực tối thiểu.',
      href: '/flashcards',
      badge: 'Hiệu quả x3',
    },
    {
      icon: Bot,
      title: 'AI Chinese Tutor 24/7',
      desc: 'Gia sư AI sử dụng công nghệ RAG từ cơ sở dữ liệu xác thực, giải thích ngữ pháp và phân biệt từ đồng nghĩa.',
      href: '/ai-tutor',
      badge: 'Công nghệ AI',
    },
    {
      icon: Mic,
      title: 'Luyện nói & Phát âm AI',
      desc: 'Đối thoại nhập vai đa tình huống (gọi món, sân bay, công sở) với đánh giá phát âm và ngữ điệu chuẩn.',
      href: '/speaking',
      badge: 'Interactive',
    },
    {
      icon: PenTool,
      title: 'Luyện viết chữ Hán Canvas',
      desc: 'Viết chữ Hán trực tiếp trên bảng Mễ tự cách, theo dõi thứ tự nét và nhận diện quy tắc viết chữ.',
      href: '/writing',
      badge: 'Thủ công',
    },
    {
      icon: GraduationCap,
      title: 'Phòng thi thử HSK Chuẩn',
      desc: 'Hệ thống đề thi mô phỏng nghe hiểu, đọc hiểu bấm giờ thực tế và tự động chấm điểm giải thích chi tiết.',
      href: '/exams',
      badge: 'Mô phỏng 100%',
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-primary-900 to-slate-900 text-white p-8 sm:p-14 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-accent-300">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span>ThaoTo – AI-Powered Chinese Learning Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Học tiếng Trung toàn diện từ{' '}
            <span className="bg-gradient-to-r from-accent-400 to-amber-300 bg-clip-text text-transparent">
              HSK 1 đến HSK 9
            </span>{' '}
            cùng Gia sư AI
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Không chỉ là lý thuyết khô khan. ThaoTo kết hợp cơ sở dữ liệu ngôn ngữ xác thực, phương pháp lặp lại ngắt quãng SRS, luyện nghe nói tương tác và gia sư AI 24/7 giúp bạn thành thạo tiếng Hán thực chiến.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold shadow-lg shadow-accent-500/30 transition transform hover:-translate-y-0.5"
            >
              <span>Vào học ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai-tutor"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 backdrop-blur transition"
            >
              <Bot className="w-5 h-5 text-accent-400" />
              <span>Trò chuyện với AI Tutor</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>MySQL XAMPP Database</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Thuật toán Anki SM-2</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Phát âm giọng đọc AI chuẩn</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>RAG Knowledge Base</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Hệ sinh thái học tập đa chiều
          </h2>
          <p className="text-sm text-slate-600">
            Trang bị đầy đủ 4 kỹ năng Nghe - Nói - Đọc - Viết kết hợp luyện thi chứng chỉ HSK
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-primary-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all">
                  <span>Trải nghiệm tính năng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Demo Access Bar */}
      <section className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold">
            ⚡
          </span>
          <div>
            <h4 className="text-sm font-bold text-amber-900">Tài khoản trải nghiệm có sẵn</h4>
            <p className="text-xs text-amber-700">
              Học viên: <span className="font-mono font-semibold">demo@hanlearn.com / 123456</span> | Quản trị: <span className="font-mono font-semibold">admin@hanlearn.com / admin123</span>
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition"
        >
          Đăng nhập ngay
        </Link>
      </section>
    </div>
  );
}

