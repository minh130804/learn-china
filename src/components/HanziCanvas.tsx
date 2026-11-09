'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface HanziCanvasProps {
  character: string;
  pinyin: string;
  meaning: string;
  strokeCount?: number;
  radical?: string;
  rule?: string;
}

export function HanziCanvas({
  character,
  pinyin,
  meaning,
  strokeCount,
  radical,
  rule,
}: HanziCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  const drawGrid = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Diagonal lines
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.moveTo(size, 0);
    ctx.lineTo(0, size);
    ctx.stroke();

    // Cross lines
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();

    ctx.setLineDash([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width);
    setStrokeHistory([]);
    setHasDrawn(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set resolution
    canvas.width = 320;
    canvas.height = 320;
    drawGrid(ctx, 320);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory((prev) => [...prev, current]);

    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e1b4b';

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md w-full">
      <div className="text-center mb-4">
        <div className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-1">
          {pinyin}
        </div>
        <div className="text-xl font-bold text-slate-800">{meaning}</div>
        <div className="flex items-center justify-center gap-3 text-xs text-slate-500 mt-1">
          {strokeCount && <span>Số nét: {strokeCount}</span>}
          {radical && <span>Bộ thủ: {radical}</span>}
        </div>
      </div>

      {/* Grid writing container */}
      <div className="relative w-[320px] h-[320px] bg-red-50/20 border-2 border-red-200 rounded-xl overflow-hidden shadow-inner">
        {showGuide && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-[220px] font-chinese text-slate-200/70 font-light">
            {character}
          </div>
        )}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative z-10 cursor-crosshair touch-none w-full h-full"
        />
      </div>

      {rule && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100 text-center w-full">
          {rule}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between w-full mt-4 gap-2">
        <button
          onClick={() => setShowGuide(!showGuide)}
          type="button"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          {showGuide ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showGuide ? 'Ẩn nét mẫu' : 'Hiện nét mẫu'}
        </button>

        <button
          onClick={clearCanvas}
          type="button"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" />
          Xóa viết lại
        </button>

        {hasDrawn && (
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium px-2 py-1 bg-emerald-50 rounded-lg">
            <CheckCircle className="w-4 h-4" /> Đã hoàn thành nét
          </div>
        )}
      </div>
    </div>
  );
}

