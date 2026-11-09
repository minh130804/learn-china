import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            questions: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Không tìm thấy đề thi' }, { status: 404 });
    }

    return NextResponse.json({ exam });
  } catch (error) {
    console.error('Get exam detail error:', error);
    return NextResponse.json({ error: 'Lỗi tải đề thi' }, { status: 500 });
  }
}

