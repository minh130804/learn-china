'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  BookA,
  Layers,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  FileText,
  GraduationCap,
  Bot,
  Database,
  ShieldCheck,
  Menu,
  X,
  Flame,
  Award,
  LogOut,
  Sparkles,
} from 'lucide-react';

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Exclude shell on landing page if desired, or show on all
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Kiểm tra đầu vào', href: '/placement-test', icon: Sparkles },
    { label: 'Lộ trình HSK', href: '/roadmap', icon: Compass },
    { label: 'Từ vựng & Tra cứu', href: '/vocabulary', icon: BookA },
    { label: 'Flashcards (SRS)', href: '/flashcards', icon: Layers },
    { label: 'Ngữ pháp', href: '/grammar', icon: BookOpen },
    { label: 'Luyện nghe', href: '/listening', icon: Headphones },
    { label: 'Luyện nói AI', href: '/speaking', icon: Mic },
    { label: 'Luyện viết chữ Hán', href: '/writing', icon: PenTool },
    { label: 'Luyện đọc', href: '/reading', icon: FileText },
    { label: 'Thi thử HSK', href: '/exams', icon: GraduationCap },
    { label: 'AI Chinese Tutor', href: '/ai-tutor', icon: Bot, highlight: true },
    { label: 'Nguồn dữ liệu', href: '/data-sources', icon: Database },
    ...(user?.role === 'ADMIN'
      ? [{ label: 'Quản trị hệ thống', href: '/admin', icon: ShieldCheck }]
      : []),
  ];

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none rounded-lg hover:bg-slate-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                汉
              </span>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-800 bg-clip-text text-transparent">
                  ThaoTo
                </span>
                <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] uppercase font-semibold bg-primary-50 text-primary-700 rounded-md">
                  AI Platform
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Streak Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{user.profile?.streakDays || 1} ngày</span>
                </div>

                {/* Target HSK Badge */}
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-semibold">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>{user.profile?.targetHskLevel || 'HSK1'}</span>
                </div>

                {/* User menu */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-medium text-slate-900 leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Đăng xuất"
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : !loading ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition shadow-sm"
                >
                  Đăng ký
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main container with sidebar */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 py-6 px-3 flex-shrink-0">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${
                    item.highlight && !isActive
                      ? 'bg-gradient-to-r from-accent-50 to-orange-50 text-accent-700 border border-accent-200/60'
                      : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-primary-600' : item.highlight ? 'text-accent-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-6 px-2">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary-900 to-indigo-950 text-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-accent-400" />
                <span className="text-xs font-bold text-accent-300 uppercase tracking-wide">
                  AI Tutor 24/7
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Giải đáp ngữ pháp, phân tích câu và giải thích từ vựng tiếng Trung chuẩn xác.
              </p>
              <Link
                href="/ai-tutor"
                className="mt-3 block text-center py-1.5 px-3 bg-white text-primary-900 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
              >
                Hỏi gia sư AI
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-xs bg-white h-full shadow-2xl p-4 overflow-y-auto z-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3">
                <span className="font-bold text-lg text-primary-700">ThaoTo</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Children Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
