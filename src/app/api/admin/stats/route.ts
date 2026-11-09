import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Truy cập bị từ chối' }, { status: 403 });
    }

    const [
      userCount,
      vocabCount,
      grammarCount,
      examCount,
      examAttemptCount,
      dataSourceCount,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.vocabulary.count(),
      prisma.grammarPoint.count(),
      prisma.exam.count(),
      prisma.examAttempt.count(),
      prisma.dataSource.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          profile: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        userCount,
        vocabCount,
        grammarCount,
        examCount,
        examAttemptCount,
        dataSourceCount,
      },
      recentUsers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Lỗi tải thông tin quản trị' }, { status: 500 });
  }
}

