'use client';

import React from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-center">
      <div className="max-w-md space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Đã xảy ra sự cố</h2>
        <p className="text-xs text-slate-500">{error.message || 'Lỗi không xác định'}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}

