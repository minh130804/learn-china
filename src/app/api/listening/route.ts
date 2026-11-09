import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HskLevel } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hsk = searchParams.get('hsk');

    const where: any = {};
    if (hsk && Object.values(HskLevel).includes(hsk as HskLevel)) {
      where.hskLevel = hsk as HskLevel;
    }

    const items = await prisma.listeningMaterial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Listening materials error:', error);
    return NextResponse.json({ error: 'Lỗi tải bài luyện nghe' }, { status: 500 });
  }
}
