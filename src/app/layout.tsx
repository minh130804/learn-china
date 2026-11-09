import type { Metadata } from 'next';
import './globals.css';
import { NavigationShell } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'ThaoTo – AI Chinese Learning Platform',
  description: 'Nền tảng học tiếng Trung toàn diện từ HSK 1 đến HSK 9 tích hợp AI Tutor, Spaced Repetition và luyện kỹ năng thực tế.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased font-sans bg-slate-50 text-slate-900">
        <NavigationShell>{children}</NavigationShell>
      </body>
    </html>
  );
}
