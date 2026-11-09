import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { processSpeakingPartnerAI } from '@/lib/ai-engine';
import { askGeminiSpeakingPartner, isGeminiConfigured } from '@/lib/gemini';

export async function GET() {
  try {
    const scenarios = await prisma.speakingScenario.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error('Speaking scenarios error:', error);
    return NextResponse.json({ error: 'Lỗi tải tình huống luyện nói' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { scenarioId, userMessage, apiKey, modelName, history = [] } = await request.json();

    if (!userMessage || !userMessage.trim()) {
      return NextResponse.json({ error: 'Nội dung nói không được để trống' }, { status: 400 });
    }

    const scenario = scenarioId
      ? await prisma.speakingScenario.findUnique({ where: { id: scenarioId } })
      : null;

    let result: any;

    if (isGeminiConfigured(apiKey)) {
      try {
        result = await askGeminiSpeakingPartner(
          userMessage,
          {
            scenarioTitle: scenario?.title,
            roleAi: scenario?.roleAi,
            roleUser: scenario?.roleUser,
            hskLevel: scenario?.hskLevel,
          },
          apiKey,
          history,
          modelName
        );
      } catch (geminiErr) {
        console.warn('Gemini speaking partner failed, falling back:', geminiErr);
        result = await processSpeakingPartnerAI(
          userMessage,
          {
            scenarioTitle: scenario?.title,
            roleAi: scenario?.roleAi,
            roleUser: scenario?.roleUser,
            hskLevel: scenario?.hskLevel,
            recentMessages: history,
          },
          apiKey
        );
      }
    } else {
      result = await processSpeakingPartnerAI(
        userMessage,
        {
          scenarioTitle: scenario?.title,
          roleAi: scenario?.roleAi,
          roleUser: scenario?.roleUser,
          hskLevel: scenario?.hskLevel,
          recentMessages: history,
        },
        apiKey
      );
    }

    // Award practice points if user is logged in
    if (user) {
      await prisma.userProfile.update({
        where: { userId: user.id },
        data: { totalPoints: { increment: 10 } },
      });
    }

    return NextResponse.json({
      success: true,
      message: {
        role: 'assistant',
        content: result.content,
        pinyin: result.pinyin,
        translation: result.translation,
        feedback: result.feedback,
        source: result.source,
      },
    });
  } catch (error) {
    console.error('Speaking chat error:', error);
    return NextResponse.json({ error: 'Lỗi đối thoại luyện nói' }, { status: 500 });
  }
}
