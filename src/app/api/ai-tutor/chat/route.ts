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

    // 1. Try Google Gemini with effective API key (client key or server env key)
    const serverKey = process.env.GEMINI_API_KEY;
    const effectiveKey = (apiKey && apiKey.trim().length > 10) ? apiKey.trim() : serverKey;

    if (isGeminiConfigured(effectiveKey)) {
      try {
        result = await askGeminiAiTutor(message, targetHsk, effectiveKey, history, modelName);
      } catch (geminiError) {
        console.warn('Gemini execution error, trying server fallback:', geminiError);
        if (serverKey && serverKey !== effectiveKey) {
          try {
            result = await askGeminiAiTutor(message, targetHsk, serverKey, history, modelName);
          } catch (serverErr) {
            console.warn('Server Gemini fallback failed, using intelligent conversational engine:', serverErr);
            result = await askChineseAiTutor(message, targetHsk);
          }
        } else {
          result = await askChineseAiTutor(message, targetHsk);
        }
      }
    } else {
      // 2. Local Intelligent Conversational Engine
      result = await askChineseAiTutor(message, targetHsk);
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
