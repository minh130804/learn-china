'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  BookA,
  BookOpen,
  GraduationCap,
  Database,
  Server,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => {
        if (res.status === 403) {
          throw new Error('Bạn cần đăng nhập với tài khoản Quản trị viên (admin@hanlearn.com)');
        }
        return res.json();
      })
      .then((resData) => setData(resData))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bảng Điều Khiển Quản Trị Hệ Thống (Admin)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Admin Control Center
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Giám sát tình trạng hạ tầng cơ sở dữ liệu MySQL XAMPP (Port 3307), người dùng và tài nguyên bài học.
        </p>
      </div>

      {error ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-red-200 shadow-sm space-y-3">
          <ShieldCheck className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Yêu cầu quyền Quản trị viên</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
          <div className="pt-2">
            <Link
              href="/login"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Chuyển sang tài khoản Admin
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          Đang tải thông số quản trị...
        </div>
      ) : (
        <div className="space-y-6">
          {/* System Health Status */}
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h3 className="text-sm font-bold text-emerald-950">Hệ thống đang hoạt động ổn định</h3>
                <p className="text-xs text-emerald-700">
                  Cơ sở dữ liệu MySQL XAMPP kết nối thành công tại cổng 3307.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-white text-emerald-800 rounded-lg border border-emerald-200">
              127.0.0.1:3307 / hanlearn
            </span>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Tổng số học viên</span>
              <h3 className="text-2xl font-bold text-slate-900">{data?.stats?.userCount ?? 0}</h3>
              <p className="text-[11px] text-slate-400">Đã đăng ký tài khoản</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Từ vựng từ điển</span>
              <h3 className="text-2xl font-bold text-slate-900">{data?.stats?.vocabCount ?? 0}</h3>
              <p className="text-[11px] text-slate-400">CC-CEDICT & HSK Corpus</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Điểm ngữ pháp</span>
              <h3 className="text-2xl font-bold text-slate-900">{data?.stats?.grammarCount ?? 0}</h3>
              <p className="text-[11px] text-slate-400">HSK 1 - HSK 4</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Đề thi HSK xuất bản</span>
              <h3 className="text-2xl font-bold text-slate-900">{data?.stats?.examCount ?? 0}</h3>
              <p className="text-[11px] text-slate-400">Có bấm giờ & chấm điểm</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Lượt làm bài thi</span>
              <h3 className="text-2xl font-bold text-slate-900">
                {data?.stats?.examAttemptCount ?? 0}
              </h3>
              <p className="text-[11px] text-slate-400">Đã ghi nhận kết quả</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Nguồn dữ liệu tích hợp</span>
              <h3 className="text-2xl font-bold text-slate-900">
                {data?.stats?.dataSourceCount ?? 0}
              </h3>
              <p className="text-[11px] text-slate-400">Provenance & Licenses</p>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Danh sách người dùng gần đây</h3>
            <div className="divide-y divide-slate-100">
              {data?.recentUsers?.map((u: any) => (
                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">{u.name}</span>
                    <span className="text-slate-500">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                    <span className="text-slate-400">
                      Mục tiêu: {u.profile?.targetHskLevel || 'HSK1'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

