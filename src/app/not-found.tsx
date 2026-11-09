'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-extrabold text-primary-600">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy trang</h2>
        <p className="text-xs text-slate-500">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold"
        >
          Trở về Trang chủ
        </Link>
      </div>
    </div>
  );
}

