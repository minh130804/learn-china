import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateSM2 } from '@/lib/srs';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Cần đăng nhập' }, { status: 401 });
    }

    const { userFlashcardId, vocabularyId, rating } = await request.json();

    if (!rating || rating < 1 || rating > 4) {
      return NextResponse.json({ error: 'Đánh giá điểm nhớ không hợp lệ (1-4)' }, { status: 400 });
    }

    let userFlashcard;
    if (userFlashcardId) {
      userFlashcard = await prisma.userFlashcard.findUnique({
        where: { id: userFlashcardId },
      });
    } else if (vocabularyId) {
      userFlashcard = await prisma.userFlashcard.findUnique({
        where: {
          userId_vocabularyId: {
            userId: user.id,
            vocabularyId,
          },
        },
      });
    }

    const currentRepetition = userFlashcard?.repetition ?? 0;
    const currentInterval = userFlashcard?.interval ?? 1;
    const currentEase = userFlashcard?.easeFactor ?? 2.5;

    const sm2Result = calculateSM2(rating, currentRepetition, currentInterval, currentEase);

    const updated = await prisma.userFlashcard.upsert({
      where: {
        userId_vocabularyId: {
          userId: user.id,
          vocabularyId: vocabularyId || userFlashcard!.vocabularyId,
        },
      },
      create: {
        userId: user.id,
        vocabularyId: vocabularyId || userFlashcard!.vocabularyId,
        interval: sm2Result.interval,
        repetition: sm2Result.repetition,
        easeFactor: sm2Result.easeFactor,
        dueDate: sm2Result.dueDate,
        state: sm2Result.state,
        lastReview: new Date(),
      },
      update: {
        interval: sm2Result.interval,
        repetition: sm2Result.repetition,
        easeFactor: sm2Result.easeFactor,
        dueDate: sm2Result.dueDate,
        state: sm2Result.state,
        lastReview: new Date(),
      },
    });

    // Log review
    await prisma.reviewLog.create({
      data: {
        userFlashcardId: updated.id,
        rating,
      },
    });

    // Update user points and streak
    await prisma.userProfile.update({
      where: { userId: user.id },
      data: {
        totalPoints: { increment: 5 },
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      card: updated,
      nextReviewDays: sm2Result.interval,
    });
  } catch (error) {
    console.error('Review card error:', error);
    return NextResponse.json({ error: 'Không thể ghi nhận lượt ôn tập' }, { status: 500 });
  }
}

