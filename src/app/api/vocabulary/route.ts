import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { HskLevel } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const hsk = searchParams.get('hsk') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (q) {
      where.OR = [
        { simplified: { contains: q } },
        { traditional: { contains: q } },
        { pinyin: { contains: q } },
        { meaningVi: { contains: q } },
        { meaningEn: { contains: q } },
      ];
    }

    if (hsk && Object.values(HskLevel).includes(hsk as HskLevel)) {
      where.hskLevel = hsk as HskLevel;
    }

    const [items, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        skip,
        take: limit,
        orderBy: { frequency: 'asc' },
        include: {
          examples: true,
          dataSource: {
            select: { name: true, code: true, licenseType: true },
          },
        },
      }),
      prisma.vocabulary.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Vocabulary search error:', error);
    return NextResponse.json({ error: 'Lỗi tải danh sách từ vựng' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Bạn không có quyền thực hiện thao tác này' }, { status: 403 });
    }

    const body = await request.json();
    const {
      simplified,
      traditional,
      pinyin,
      meaningVi,
      meaningEn,
      partOfSpeech,
      hskLevel,
      strokeCount,
      radical,
      examples,
      dataSourceId,
    } = body;

    if (!simplified || !pinyin || !meaningVi) {
      return NextResponse.json(
        { error: 'Vui lòng điền chữ Hán, Pinyin và nghĩa tiếng Việt' },
        { status: 400 }
      );
    }

    const newVocab = await prisma.vocabulary.create({
      data: {
        simplified,
        traditional: traditional || simplified,
        pinyin,
        meaningVi,
        meaningEn,
        partOfSpeech,
        hskLevel: hskLevel || 'HSK1',
        strokeCount: strokeCount || 1,
        radical,
        dataSourceId,
        examples: {
          create: Array.isArray(examples) ? examples : [],
        },
      },
      include: {
        examples: true,
      },
    });

    return NextResponse.json({ success: true, vocabulary: newVocab });
  } catch (error) {
    console.error('Create vocabulary error:', error);
    return NextResponse.json({ error: 'Không thể tạo từ vựng mới' }, { status: 500 });
  }
}
