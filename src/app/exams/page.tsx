'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Volume2,
  FileCheck,
  LayoutGrid,
  Check,
  AlertCircle,
} from 'lucide-react';
import { AudioButton } from '@/components/AudioPlayer';

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [activeExam, setActiveExam] = useState<any>(null);
  const [examDetail, setExamDetail] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(35 * 60);
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAnswerSheet, setShowAnswerSheet] = useState(true);

  useEffect(() => {
    fetch('/api/exams')
      .then((res) => res.json())
      .then((data) => {
        setExams(data.exams || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (isExamRunning && timeLeft > 0 && !submittedResult) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamRunning, timeLeft, submittedResult]);

  const handleStartExam = async (exam: any) => {
    setActiveExam(exam);
    setLoading(true);
    setSubmittedResult(null);
    setAnswers({});

    try {
      const res = await fetch(`/api/exams/${exam.id}`);
      const data = await res.json();
      setExamDetail(data.exam);
      setTimeLeft((data.exam.durationMinutes || 35) * 60);
      setIsExamRunning(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (submittedResult) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const scrollToQuestion = (qNum: number) => {
    const el = document.getElementById(`question-${qNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmitExam = async () => {
    if (!activeExam || submittedResult) return;
    setIsExamRunning(false);

    try {
      const res = await fetch(`/api/exams/${activeExam.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          timeSpentSeconds: (examDetail.durationMinutes || 35) * 60 - timeLeft,
        }),
      });

      const data = await res.json();
      setSubmittedResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
          <GraduationCap className="w-4 h-4" />
          <span>Hệ thống Khảo thí HSK Chuẩn Quốc tế (CLEC / Hanban)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Phòng Thi Thử HSK Chuẩn Quốc Tế
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Hệ thống đề thi chuẩn hóa từ HSK 1 đến HSK 9 theo khung năng lực CLEC (Trung tâm Hợp tác Giao lưu Ngôn ngữ Bộ Giáo dục Trung Quốc) với đầy đủ phần Nghe (听力 - kèm âm thanh giọng Bắc Kinh), phần Đọc (阅读), phần Viết (书写) và phiếu trả lời (答题卡).
        </p>
      </div>

      {!activeExam ? (
        /* Exams Catalog List with Level Tabs */
        <div className="space-y-6">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'ALL', label: 'Tất cả cấp độ' },
              { id: 'HSK1', label: 'HSK 1 (Sơ cấp 1)' },
              { id: 'HSK2', label: 'HSK 2 (Sơ cấp 2)' },
              { id: 'HSK3', label: 'HSK 3 (Trung cấp 1)' },
              { id: 'HSK4', label: 'HSK 4 (Trung cấp 2)' },
              { id: 'HSK5', label: 'HSK 5 (Cao cấp 1)' },
              { id: 'HSK6', label: 'HSK 6 (Cao cấp 2)' },
              { id: 'HSK7_9', label: 'HSK 7-9 (HSK 3.0 Chuyên gia)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedLevel(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  selectedLevel === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 ring-2 ring-purple-600'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams
              .filter((e) => selectedLevel === 'ALL' || e.hskLevel === selectedLevel)
              .map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-3xl border-2 border-slate-200 hover:border-purple-400 p-6 shadow-sm transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-mono">
                        Mã đề: {exam.code || 'H11001'}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                        {exam.hskLevel.replace('_', '-')}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {exam.title}
                    </h3>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 text-center border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Thời gian</span>
                        <span className="font-bold text-slate-900">{exam.durationMinutes} phút</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Số câu hỏi</span>
                        <span className="font-bold text-slate-900">{exam.totalQuestions} câu</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Điểm đạt</span>
                        <span className="font-bold text-emerald-600">{exam.passingScore}/{exam.totalScore || 200}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartExam(exam)}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-2"
                  >
                    <span>Vào phòng thi HSK chính thức</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      ) : (
        /* ========================================================
           AUTHENTIC HSK ONLINE EXAM ROOM (CHUẨN FORM HSK)
           ======================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Exam Paper Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Standard Official HSK Header Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-bold flex items-center justify-center text-xl shadow">
                    HSK
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {activeExam.title}
                    </h2>
                    <p className="text-xs font-mono text-purple-700 font-semibold mt-0.5">
                      Đề số: {activeExam.code || 'H11001'} | Cấp độ: {activeExam.hskLevel}
                    </p>
                  </div>
                </div>

                {/* Live Countdown Timer */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-base font-bold shadow-sm ${
                      timeLeft < 300
                        ? 'bg-rose-50 text-rose-700 ring-2 ring-rose-400 animate-pulse'
                        : 'bg-purple-50 text-purple-900 border border-purple-200'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>

                  {!submittedResult ? (
                    <button
                      onClick={handleSubmitExam}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition"
                    >
                      Nộp bài thi
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveExam(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
                    >
                      Thoát đề thi
                    </button>
                  )}
                </div>
              </div>

              {/* Candidate Info Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Học viên (考生)</span>
                  <span className="font-semibold text-slate-800">Thí sinh tự do</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Số báo danh (准考证号)</span>
                  <span className="font-mono font-semibold text-slate-800">H1100120261108</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Đã trả lời</span>
                  <span className="font-semibold text-purple-700">
                    {answeredCount} / {examDetail?.totalQuestions || 40} câu
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Chuẩn đạt (合格)</span>
                  <span className="font-semibold text-emerald-600">≥ 120 / 200 điểm</span>
                </div>
              </div>
            </div>

            {/* Official HSK Score Certificate (Appears after submission) */}
            {submittedResult && (
              <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-purple-300 font-bold block mb-1">
                      Báo Cáo Điểm Thi Chuẩn Quốc Tế (HSK 成绩报告)
                    </span>
                    <h3 className="text-2xl font-extrabold text-white">
                      {submittedResult.examTitle}
                    </h3>
                  </div>

                  {/* Stamp */}
                  <div
                    className={`px-5 py-2.5 rounded-2xl font-black text-lg border-2 tracking-widest transform rotate-3 ${
                      submittedResult.passed
                        ? 'border-emerald-400 text-emerald-300 bg-emerald-500/20'
                        : 'border-rose-400 text-rose-300 bg-rose-500/20'
                    }`}
                  >
                    {submittedResult.passed ? '合格 (ĐẠT)' : '不合格 (CHƯA ĐẠT)'}
                  </div>
                </div>

                {/* Score Columns */}
                <div className={`grid grid-cols-1 ${submittedResult.writingScore ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4 text-center`}>
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur border border-white/10">
                    <span className="text-xs text-purple-200 block">听力 (Nghe hiểu)</span>
                    <span className="text-3xl font-bold text-white mt-1 block">
                      {submittedResult.listeningScore?.earned ?? 0}
                    </span>
                    <span className="text-[11px] text-purple-300">/ {submittedResult.listeningScore?.total || 100} điểm</span>
                  </div>

                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur border border-white/10">
                    <span className="text-xs text-purple-200 block">阅读 (Đọc hiểu)</span>
                    <span className="text-3xl font-bold text-white mt-1 block">
                      {submittedResult.readingScore?.earned ?? 0}
                    </span>
                    <span className="text-[11px] text-purple-300">/ {submittedResult.readingScore?.total || 100} điểm</span>
                  </div>

                  {submittedResult.writingScore && (
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur border border-white/10">
                      <span className="text-xs text-purple-200 block">书写 (Viết)</span>
                      <span className="text-3xl font-bold text-white mt-1 block">
                        {submittedResult.writingScore?.earned ?? 0}
                      </span>
                      <span className="text-[11px] text-purple-300">/ {submittedResult.writingScore?.total || 100} điểm</span>
                    </div>
                  )}

                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur border border-white/10">
                    <span className="text-xs text-purple-200 block">总分 (Tổng điểm)</span>
                    <span className="text-3xl font-black text-amber-400 mt-1 block">
                      {submittedResult.totalEarned}
                    </span>
                    <span className="text-[11px] text-purple-300">/ {submittedResult.totalMax || 200} điểm</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-purple-200 pt-2">
                  <span>Yêu cầu vượt qua: {submittedResult.passingScore} điểm</span>
                  <button
                    onClick={() => handleStartExam(activeExam)}
                    className="px-4 py-2 bg-white text-purple-900 rounded-xl font-bold hover:bg-slate-100 transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Làm lại bài thi này
                  </button>
                </div>
              </div>
            )}

            {/* Questions by Official HSK Sections */}
            {examDetail?.sections?.map((sec: any) => (
              <div
                key={sec.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8"
              >
                {/* Section Header */}
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block mb-1">
                    {sec.type === 'LISTENING'
                      ? 'Phần Nghe Hiểu (听力)'
                      : sec.type === 'READING'
                      ? 'Phần Đọc Hiểu (阅读)'
                      : 'Phần Viết / Dịch Thuật (书写 / 翻译)'}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">{sec.title}</h3>
                </div>

                {/* Section Vocabulary Box (Only For HSK 1 Part 4 Fill in Blanks) */}
                {sec.type === 'READING' && activeExam?.hskLevel === 'HSK1' && (
                  <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs">
                    <span className="font-bold text-purple-900 block mb-2">
                      📋 Hộp từ vựng lựa chọn cho phần điền từ (第 36-40 题):
                    </span>
                    <div className="flex flex-wrap gap-2 text-slate-800">
                      <span className="px-3 py-1 bg-white rounded-xl border border-purple-200 font-semibold font-chinese">
                        [A] 喜欢 (xǐhuan)
                      </span>
                      <span className="px-3 py-1 bg-white rounded-xl border border-purple-200 font-semibold font-chinese">
                        [B] 多少 (duōshao)
                      </span>
                      <span className="px-3 py-1 bg-white rounded-xl border border-purple-200 font-semibold font-chinese">
                        [C] 谢谢 (xièxie)
                      </span>
                      <span className="px-3 py-1 bg-white rounded-xl border border-purple-200 font-semibold font-chinese">
                        [D] 怎么 (zěnme)
                      </span>
                      <span className="px-3 py-1 bg-white rounded-xl border border-purple-200 font-semibold font-chinese">
                        [E] 明天 (míngtiān)
                      </span>
                    </div>
                  </div>
                )}

                {/* Questions */}
                <div className="space-y-8">
                  {sec.questions?.map((q: any) => {
                    const userAnswer = answers[q.id];
                    const graded = submittedResult?.gradedQuestions?.find(
                      (g: any) => g.questionId === q.id
                    );

                    return (
                      <div
                        id={`question-${q.questionNumber}`}
                        key={q.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-4 scroll-mt-28"
                      >
                        {/* Question Title & Audio */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                                {q.questionNumber}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                                {q.questionType === 'TRUE_FALSE'
                                  ? 'Phán đoán Đúng / Sai'
                                  : q.questionType === 'FILL_BLANK'
                                  ? 'Điền từ vào chỗ trống'
                                  : 'Chọn đáp án A, B, C'}
                              </span>
                            </div>

                            <p className="text-base font-bold font-chinese text-slate-900 pt-1 leading-relaxed whitespace-pre-line">
                              {q.prompt}
                            </p>

                            {q.pinyin && (
                              <p className="text-xs font-mono text-purple-700">
                                {q.pinyin}
                              </p>
                            )}

                            {q.passage && (
                              <p className="text-xs text-slate-500 italic pt-0.5">
                                {q.passage}
                              </p>
                            )}
                          </div>

                          {/* Audio Player for Listening questions */}
                          {sec.type === 'LISTENING' && (
                            <AudioButton
                              text={q.audioScript || q.prompt}
                              size="md"
                              label="Phát âm thanh"
                            />
                          )}
                        </div>

                        {/* Options by Question Type */}
                        {q.questionType === 'TRUE_FALSE' ? (
                          /* STANDARD HSK TRUE/FALSE BUTTONS */
                          <div className="grid grid-cols-2 gap-4 max-w-sm pt-1">
                            {['对', '错'].map((tf) => {
                              const isSelected = userAnswer === tf;
                              let btnClass =
                                'border-slate-200 bg-white hover:bg-slate-100 text-slate-800';

                              if (submittedResult) {
                                if (tf === q.correctAnswer) {
                                  btnClass =
                                    'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                                } else if (isSelected) {
                                  btnClass = 'border-rose-400 bg-rose-50 text-rose-800';
                                }
                              } else if (isSelected) {
                                btnClass =
                                  'border-purple-600 bg-purple-600 text-white font-bold shadow-md';
                              }

                              return (
                                <button
                                  key={tf}
                                  type="button"
                                  onClick={() => handleSelectOption(q.id, tf)}
                                  className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition flex items-center justify-center gap-2 ${btnClass}`}
                                >
                                  <span>{tf === '对' ? '✔ 对 (Đúng)' : '✖ 错 (Sai)'}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          /* STANDARD HSK MULTIPLE CHOICE / FILL IN BLANK */
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {Array.isArray(q.options) &&
                              q.options.map((opt: string) => {
                                const isSelected = userAnswer === opt;
                                let style =
                                  'border-slate-200 bg-white hover:bg-slate-100 text-slate-700';

                                if (submittedResult) {
                                  if (opt === q.correctAnswer) {
                                    style =
                                      'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                                  } else if (isSelected) {
                                    style = 'border-rose-400 bg-rose-50 text-rose-800';
                                  }
                                } else if (isSelected) {
                                  style =
                                    'border-purple-600 bg-purple-50 text-purple-950 font-bold ring-1 ring-purple-500';
                                }

                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleSelectOption(q.id, opt)}
                                    className={`p-3 rounded-xl border-2 text-left text-xs transition flex items-center justify-between ${style}`}
                                  >
                                    <span className="font-chinese text-sm">{opt}</span>
                                    {submittedResult && opt === q.correctAnswer && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                    )}
                                    {submittedResult &&
                                      isSelected &&
                                      opt !== q.correctAnswer && (
                                        <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                      )}
                                  </button>
                                );
                              })}
                          </div>
                        )}

                        {/* Answer Explanation (After submission) */}
                        {submittedResult && q.explanation && (
                          <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900 border border-blue-100 flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Đáp án đúng: {q.correctAnswer}</span>
                              <p className="mt-0.5">{q.explanation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Bottom Submit Action */}
            {!submittedResult && (
              <div className="pt-2">
                <button
                  onClick={handleSubmitExam}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-base font-bold shadow-lg shadow-purple-500/20 transition"
                >
                  Hoàn Thành Bài Thi & Nộp Phiếu Trả Lời HSK
                </button>
              </div>
            )}
          </div>

          {/* Floating Answer Sheet Navigation (答题卡) */}
          <div className="lg:col-span-1 sticky top-20 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-purple-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Phiếu trả lời (答题卡)</h4>
                </div>
                <span className="text-xs font-semibold text-purple-600">
                  {answeredCount}/{examDetail?.totalQuestions || 40}
                </span>
              </div>

              {/* Question Number Pills 1 to 40 */}
              <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {Array.from({ length: examDetail?.totalQuestions || 40 }, (_, i) => i + 1).map(
                  (num) => {
                    // Check if question with questionNumber num is answered
                    const qObj = examDetail?.sections
                      ?.flatMap((s: any) => s.questions)
                      ?.find((q: any) => q.questionNumber === num);

                    const isAnswered = qObj && answers[qObj.id];

                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => scrollToQuestion(num)}
                        className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                          isAnswered
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-md bg-purple-600 inline-block" /> Đã chọn
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-md bg-slate-100 inline-block" /> Chưa làm
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
