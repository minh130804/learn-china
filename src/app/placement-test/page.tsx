'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  Compass,
  RotateCcw,
} from 'lucide-react';
import { AudioButton } from '@/components/AudioPlayer';

export default function PlacementTestPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [testResult, setTestResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const questions = [
    {
      level: 'HSK 1',
      type: 'Nhận diện Pinyin',
      prompt: 'Từ "你好" có phiên âm Pinyin chính xác là gì?',
      options: ['nǐ hǎo', 'ní hào', 'nì hāo', 'nǐ hào'],
      correct: 'nǐ hǎo',
      explanation: '"你好" (Xin chào) đọc là nǐ hǎo với hai thanh 3 đi liền nhau.',
    },
    {
      level: 'HSK 1',
      type: 'Từ vựng & Nghĩa',
      prompt: 'Trong câu "我想喝茶", từ "喝" có nghĩa là gì?',
      options: ['Ăn', 'Uống', 'Mua', 'Pha'],
      correct: 'Uống',
      explanation: '"喝" (hē) là động từ Uống.',
    },
    {
      level: 'HSK 2',
      type: 'Ngữ pháp trợ từ',
      prompt: 'Điền từ thích hợp vào chỗ trống: "这件衣服是____买的。"',
      options: ['我', '我的', '我和', '我有'],
      correct: '我',
      explanation: 'Cấu trúc nhấn mạnh 是...的: "是 + Ai đó + Động từ + 的".',
    },
    {
      level: 'HSK 2',
      type: 'Trợ từ kết cấu',
      prompt: 'Chọn câu viết đúng ngữ pháp tiếng Trung:',
      options: [
        '他跑的很快。',
        '他跑得很快。',
        '他跑地很快。',
        '他跑是很快。',
      ],
      correct: '他跑得很快。',
      explanation: 'Sau động từ (跑) dùng trợ từ kết cấu "得" để liên kết với bổ ngữ mức độ (很快).',
    },
    {
      level: 'HSK 3',
      type: 'Luyện nghe & Ngữ cảnh',
      prompt: 'Nghe đoạn thoại: "你觉得这个工作怎么样？— 挺好的，就是有点儿累。" Người nói thứ hai cảm thấy công việc thế nào?',
      passage: 'Nǐ juéde zhè ge gōngzuò zěnmeyàng? — Tǐng hǎo de, jiùshì yǒudiǎnr lèi.',
      options: [
        'Rất chán và không thích',
        'Khá tốt, chỉ là hơi mệt một chút',
        'Lương quá thấp',
        'Quá nhàn rỗi',
      ],
      correct: 'Khá tốt, chỉ là hơi mệt một chút',
      explanation: '"挺好的" = Khá tốt; "就是有点儿累" = Chỉ là hơi mệt một chút.',
    },
    {
      level: 'HSK 3/4',
      type: 'Cấu trúc câu chữ 把',
      prompt: 'Sắp xếp câu đúng cấu trúc câu chữ 把:',
      options: [
        '请把书放在桌子上。',
        '请书把放在桌子上。',
        '请放在桌子上把书。',
        '把请书放在桌子上。',
      ],
      correct: '请把书放在桌子上。',
      explanation: 'Công thức câu chữ 把: S + 把 + Tân ngữ (书) + Động từ (放) + Kết quả/Nơi chốn (在桌子上).',
    },
  ];

  const handleSelectOption = (opt: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: opt }));
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    setSubmitting(true);
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correctCount++;
      }
    });

    let assignedLevel = 'HSK1';
    let recommendation = '';

    if (correctCount >= 5) {
      assignedLevel = 'HSK3';
      recommendation =
        'Trình độ của bạn rất tốt! Bạn đã nắm vững các cấu trúc cơ bản và ngữ pháp trợ từ. Nên bắt đầu từ lộ trình HSK 3 trở lên.';
    } else if (correctCount >= 3) {
      assignedLevel = 'HSK2';
      recommendation =
        'Bạn đã có nền tảng tiếng Trung căn bản. Bạn nên củng cố ngữ pháp HSK 2 và luyện thêm nghe nói phản xạ.';
    } else {
      assignedLevel = 'HSK1';
      recommendation =
        'Bạn nên bắt đầu từ lộ trình HSK 1 để nắm chắc bảng chữ cái Pinyin, phát âm chuẩn 4 thanh điệu và 150 từ vựng cốt lõi.';
    }

    setTestResult({
      score: Math.round((correctCount / questions.length) * 100),
      correctCount,
      total: questions.length,
      assignedLevel,
      recommendation,
    });
    setSubmitting(false);
  };

  const q = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Bài Đánh Giá Năng Lực Đầu Vào (Diagnostic Placement Test)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Kiểm Tra Trình Độ Tiếng Trung Cá Nhân
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Làm bài trắc nghiệm 5 phút để hệ thống xác định chính xác trình độ hiện tại và tự động đề xuất lộ trình học phù hợp nhất cho bạn.
        </p>
      </div>

      {!testResult ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 pb-4">
            <span className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary-100 text-primary-800">
                {q.level}
              </span>
              <span>{q.type}</span>
            </span>
            <span>
              Câu {currentQuestion + 1} / {questions.length}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Prompt */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg font-bold text-slate-900 leading-relaxed">
              {q.prompt}
            </h2>
            {q.passage && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-chinese text-slate-700 font-medium">
                  {q.passage}
                </span>
                <AudioButton text={q.passage} size="sm" />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {q.options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-left text-sm font-medium transition flex items-center justify-between ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-900 shadow-sm ring-1 ring-primary-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next / Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30"
            >
              Quay lại câu trước
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
            >
              <span>
                {currentQuestion + 1 === questions.length
                  ? 'Hoàn thành bài kiểm tra'
                  : 'Câu tiếp theo'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results Report */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Kết quả đánh giá trình độ
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Khuyến nghị: {testResult.assignedLevel}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Bạn trả lời đúng {testResult.correctCount}/{testResult.total} câu ({testResult.score}%)
            </p>
          </div>

          <div className="p-5 bg-indigo-50/70 border border-indigo-100 rounded-2xl max-w-xl mx-auto text-xs text-indigo-950 leading-relaxed text-left">
            <p className="font-bold mb-1">🎯 Lộ trình cá nhân hóa đề xuất:</p>
            <p>{testResult.recommendation}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href={`/roadmap`}
              className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Khám phá Lộ trình {testResult.assignedLevel}</span>
            </Link>

            <Link
              href="/dashboard"
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Vào Bảng điều khiển
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

