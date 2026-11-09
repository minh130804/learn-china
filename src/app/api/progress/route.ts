import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Cần đăng nhập' }, { status: 401 });
    }

    const [flashcardsDue, totalReviewed, completedExams] = await Promise.all([
      prisma.userFlashcard.count({
        where: {
          userId: user.id,
          dueDate: { lte: new Date() },
        },
      }),
      prisma.userFlashcard.count({
        where: {
          userId: user.id,
          repetition: { gt: 0 },
        },
      }),
      prisma.examAttempt.count({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json({
      profile: user.profile,
      flashcardsDue,
      totalReviewed,
      completedExams,
    });
  } catch (error) {
    console.error('Progress error:', error);
    return NextResponse.json({ error: 'Lỗi tải tiến độ học tập' }, { status: 500 });
  }
}

