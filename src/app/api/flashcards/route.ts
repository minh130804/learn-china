import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    // Get public decks or decks belonging to current user
    const decks = await prisma.flashcardDeck.findMany({
      where: user
        ? {
            OR: [{ isPublic: true }, { userId: user.id }],
          }
        : { isPublic: true },
      include: {
        flashcards: {
          include: {
            vocabulary: true,
          },
        },
      },
    });

    // If user is logged in, also fetch due cards for Spaced Repetition (SRS)
    let dueCards: any[] = [];
    if (user) {
      dueCards = await prisma.userFlashcard.findMany({
        where: {
          userId: user.id,
          dueDate: {
            lte: new Date(),
          },
        },
        include: {
          vocabulary: {
            include: { examples: true },
          },
        },
        take: 30,
      });
    }

    return NextResponse.json({
      decks,
      dueCards,
      dueCount: dueCards.length,
    });
  } catch (error) {
    console.error('Flashcard error:', error);
    return NextResponse.json({ error: 'Lỗi tải bộ thẻ Flashcard' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập để tạo bộ thẻ' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, hskLevel, isPublic, cards } = body;

    const deck = await prisma.flashcardDeck.create({
      data: {
        userId: user.id,
        title,
        description,
        hskLevel,
        isPublic: !!isPublic,
        flashcards: {
          create: Array.isArray(cards)
            ? cards.map((c: any) => ({
                front: c.front,
                back: c.back,
                hint: c.hint,
                vocabularyId: c.vocabularyId,
              }))
            : [],
        },
      },
      include: { flashcards: true },
    });

    return NextResponse.json({ success: true, deck });
  } catch (error) {
    console.error('Create deck error:', error);
    return NextResponse.json({ error: 'Không thể tạo bộ thẻ' }, { status: 500 });
  }
}

