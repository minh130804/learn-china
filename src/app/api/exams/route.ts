import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HskLevel } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hsk = searchParams.get('hsk');

    const where: any = { isPublished: true };
    if (hsk && Object.values(HskLevel).includes(hsk as HskLevel)) {
      where.hskLevel = hsk as HskLevel;
    }

    const exams = await prisma.exam.findMany({
      where,
      include: {
        _count: {
          select: { attempts: true },
        },
      },
      orderBy: { hskLevel: 'asc' },
    });

    return NextResponse.json({ exams });
  } catch (error) {
    console.error('Fetch exams error:', error);
    return NextResponse.json({ error: 'Lỗi tải danh sách đề thi' }, { status: 500 });
  }
}
