import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.writingExercise.findMany({
      orderBy: { strokeCount: 'asc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Writing exercises error:', error);
    return NextResponse.json({ error: 'Lỗi tải bài luyện viết' }, { status: 500 });
  }
}

