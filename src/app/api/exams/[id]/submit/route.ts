import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const { answers, timeSpentSeconds } = await request.json();

    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            questions: {
              orderBy: { questionNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Không tìm thấy đề thi' }, { status: 404 });
    }

    let listeningEarned = 0;
    let listeningTotal = 0;
    let readingEarned = 0;
    let readingTotal = 0;
    let writingEarned = 0;
    let writingTotal = 0;

    const gradedQuestions: any[] = [];

    for (const section of exam.sections) {
      for (const question of section.questions) {
        const userAnswer = answers[question.id] || answers[question.questionNumber];
        const isCorrect =
          userAnswer &&
          (userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() ||
            userAnswer.startsWith(question.correctAnswer.slice(0, 2)));

        if (section.type === 'LISTENING') {
          listeningTotal += question.score;
          if (isCorrect) listeningEarned += question.score;
        } else if (section.type === 'READING') {
          readingTotal += question.score;
          if (isCorrect) readingEarned += question.score;
        } else {
          writingTotal += question.score;
          if (isCorrect) writingEarned += question.score;
        }

        gradedQuestions.push({
          questionId: question.id,
          questionNumber: question.questionNumber,
          prompt: question.prompt,
          pinyin: question.pinyin,
          audioScript: question.audioScript,
          userAnswer: userAnswer ?? 'Chưa làm (未答)',
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation,
          score: isCorrect ? question.score : 0,
          maxScore: question.score,
        });
      }
    }

    const totalEarned = listeningEarned + readingEarned + writingEarned;
    const totalMax = listeningTotal + readingTotal + writingTotal || 200;
    const passed = totalEarned >= exam.passingScore;

    let attemptId = null;
    if (user) {
      const attempt = await prisma.examAttempt.create({
        data: {
          userId: user.id,
          examId: exam.id,
          score: totalEarned,
          passed,
          timeSpentSeconds: timeSpentSeconds || 0,
          answers: answers,
        },
      });
      attemptId = attempt.id;

      // Update points and streak
      await prisma.userProfile.update({
        where: { userId: user.id },
        data: {
          totalPoints: { increment: passed ? 100 : 30 },
        },
      });
    }

    return NextResponse.json({
      success: true,
      attemptId,
      examCode: exam.code || 'H11001',
      examTitle: exam.title,
      totalEarned,
      totalMax,
      passingScore: exam.passingScore,
      passed,
      listeningScore: { earned: listeningEarned, total: listeningTotal || 100 },
      readingScore: { earned: readingEarned, total: readingTotal || 100 },
      writingScore: writingTotal > 0 ? { earned: writingEarned, total: writingTotal } : null,
      gradedQuestions,
    });
  } catch (error) {
    console.error('Submit exam error:', error);
    return NextResponse.json({ error: 'Lỗi nộp bài thi' }, { status: 500 });
  }
}
