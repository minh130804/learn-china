import { NextResponse } from 'next/server';
import { askChineseAiTutor } from '@/lib/ai-engine';
import { askGeminiAiTutor, isGeminiConfigured } from '@/lib/gemini';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { message, conversationId, apiKey, history, modelName } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Nội dung câu hỏi không hợp lệ' }, { status: 400 });
    }

    const targetHsk = user?.profile?.targetHskLevel || 'HSK1';
    let result: { answer: string; source: string; ragItems?: any };

    // 1. Try Google Gemini if configured
    if (isGeminiConfigured(apiKey)) {
      try {
        result = await askGeminiAiTutor(message, targetHsk, apiKey, history, modelName);
      } catch (geminiError) {
        console.warn('Gemini execution error, falling back to local linguistic engine:', geminiError);
        result = await askChineseAiTutor(message, targetHsk, apiKey);
      }
    } else {
      // 2. Local Linguistic Engine
      result = await askChineseAiTutor(message, targetHsk, apiKey);
    }

    // Save to conversation history if user is logged in
    if (user) {
      let convId = conversationId;
      if (!convId) {
        const newConv = await prisma.aiConversation.create({
          data: {
            userId: user.id,
            title: message.slice(0, 30) + '...',
          },
        });
        convId = newConv.id;
      }

      await prisma.aiMessage.createMany({
        data: [
          {
            conversationId: convId,
            role: 'user',
            content: message,
          },
          {
            conversationId: convId,
            role: 'assistant',
            content: result.answer,
          },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      reply: result.answer,
      source: result.source,
      ragItems: result.ragItems,
    });
  } catch (error) {
    console.error('AI Tutor chat error:', error);
    return NextResponse.json({ error: 'Lỗi xử lý phản hồi từ AI Tutor' }, { status: 500 });
  }
}
