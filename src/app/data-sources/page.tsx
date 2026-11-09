'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  FileCode,
} from 'lucide-react';

export default function DataSourcesPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSources = () => {
    setLoading(true);
    fetch('/api/data-sources')
      .then((res) => res.json())
      .then((data) => {
        setSources(data.sources || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleSyncSource = async (sourceId: string) => {
    setSyncingId(sourceId);
    setNotification(null);

    try {
      const res = await fetch('/api/data-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId,
          action: 'SYNC',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotification(data.message);
        loadSources();
      } else {
        alert(data.error || 'Đồng bộ thất bại. Cần quyền Quản trị viên (Admin).');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-semibold mb-2">
          <Database className="w-4 h-4" />
          <span>Data Integration Layer & Provenance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Quản Lý Nguồn Dữ Liệu Ngôn Ngữ
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Theo dõi nguồn gốc, bản quyền giấy phép (Open Source, CC BY-SA, Educational) và trạng thái đồng bộ hóa từ điển tiếng Trung vào MySQL.
        </p>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sources Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            Đang kiểm tra kết nối các nguồn dữ liệu...
          </div>
        ) : (
          sources.map((src) => {
            const isSyncing = syncingId === src.id;

            return (
              <div
                key={src.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        {src.status}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{src.code}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      {src.name}
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-primary-600 transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleSyncSource(src.id)}
                    disabled={isSyncing}
                    className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ dữ liệu'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Loại giấy phép:</span>
                    <span className="font-semibold text-slate-800">{src.licenseType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Số lượng bản ghi:</span>
                    <span className="font-semibold text-slate-800">
                      {src.totalRecords?.toLocaleString()} mục
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Từ vựng đã liên kết:</span>
                    <span className="font-semibold text-slate-800">
                      {src._count?.vocabularies ?? 0} từ
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Lần đồng bộ gần nhất:</span>
                    <span className="font-semibold text-slate-800">
                      {src.lastSyncedAt
                        ? new Date(src.lastSyncedAt).toLocaleDateString('vi-VN')
                        : 'Chưa đồng bộ'}
                    </span>
                  </div>
                </div>

                {src.attribution && (
                  <p className="text-xs text-slate-500 italic">
                    Ghi công nguồn gốc (Attribution): {src.attribution}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Batch Import Tool */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Công Cụ Nhập Dữ Liệu Từ Vựng Nhanh (CSV / TXT Parser)
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Định dạng hỗ trợ: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Chữ Hán, Pinyin, Nghĩa tiếng Việt, Cấp HSK</code> (mỗi từ một dòng).
        </p>

        <textarea
          id="batch-input-area"
          rows={3}
          placeholder="Ví dụ:
高兴, gāoxìng, Vui vẻ, HSK1
天气, tiānqì, Thời tiết, HSK1
电脑, diànnǎo, Máy vi tính, HSK1"
          className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex justify-end">
          <button
            onClick={async () => {
              const text = (document.getElementById('batch-input-area') as HTMLTextAreaElement)?.value;
              if (!text?.trim()) return alert('Vui lòng nhập danh sách từ vựng');
              if (sources.length === 0) return alert('Chưa tìm thấy nguồn dữ liệu');

              const lines = text.split('\n').filter((l) => l.trim().length > 0);
              const sampleRecords = lines.map((line) => {
                const parts = line.split(',').map((p) => p.trim());
                return {
                  simplified: parts[0] || '',
                  pinyin: parts[1] || '',
                  meaningVi: parts[2] || '',
                  hskLevel: parts[3] || 'HSK1',
                };
              });

              try {
                const res = await fetch('/api/data-sources', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    sourceId: sources[0].id,
                    action: 'IMPORT',
                    sampleRecords,
                  }),
                });
                const data = await res.json();
                if (res.ok) {
                  setNotification(data.message);
                  (document.getElementById('batch-input-area') as HTMLTextAreaElement).value = '';
                  loadSources();
                } else {
                  alert(data.error || 'Nhập dữ liệu thất bại (yêu cầu quyền Admin)');
                }
              } catch (e) {
                console.error(e);
              }
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            Nhập danh sách từ vựng vào MySQL
          </button>
        </div>
      </div>
    </div>
  );
}

