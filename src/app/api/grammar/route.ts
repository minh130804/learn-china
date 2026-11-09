import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { HskLevel } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hsk = searchParams.get('hsk') || '';
    const q = searchParams.get('q')?.trim() || '';

    const where: any = {};
    if (hsk && Object.values(HskLevel).includes(hsk as HskLevel)) {
      where.hskLevel = hsk as HskLevel;
    }
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { pattern: { contains: q } },
        { explanationVi: { contains: q } },
      ];
    }

    const items = await prisma.grammarPoint.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        examples: true,
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Grammar fetch error:', error);
    return NextResponse.json({ error: 'Lỗi tải danh sách ngữ pháp' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Không có quyền quản trị' }, { status: 403 });
    }

    const body = await request.json();
    const { hskLevel, title, pattern, explanationVi, explanationEn, usageNotes, commonMistakes, examples } = body;

    const newGrammar = await prisma.grammarPoint.create({
      data: {
        hskLevel: hskLevel || 'HSK1',
        title,
        pattern,
        explanationVi,
        explanationEn,
        usageNotes,
        commonMistakes,
        examples: {
          create: Array.isArray(examples) ? examples : [],
        },
      },
      include: { examples: true },
    });

    return NextResponse.json({ success: true, grammar: newGrammar });
  } catch (error) {
    console.error('Create grammar error:', error);
    return NextResponse.json({ error: 'Không thể tạo ngữ pháp' }, { status: 500 });
  }
}
