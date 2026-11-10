import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AVAILABLE_GEMINI_MODELS } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function GET() {
  const key = process.env.GEMINI_API_KEY || '';
  const currentModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  const isConfigured = Boolean(key && key.trim().length > 10);
  const preview = isConfigured ? `${key.slice(0, 6)}...${key.slice(-4)}` : null;

  return NextResponse.json({
    configured: isConfigured,
    previewKey: preview,
    currentModel,
    availableModels: AVAILABLE_GEMINI_MODELS,
  });
}

export async function POST(request: Request) {
  try {
    const { apiKey, modelName } = await request.json();

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 15) {
      return NextResponse.json({ error: 'API Key không hợp lệ. Vui lòng kiểm tra lại.' }, { status: 400 });
    }

    const cleanKey = apiKey.trim();
    const cleanModel = modelName && typeof modelName === 'string' ? modelName.trim() : 'gemini-3.5-flash';

    // 1. Verify key with Google Gemini API directly
    try {
      const genAI = new GoogleGenerativeAI(cleanKey);
      const model = genAI.getGenerativeModel({ model: cleanModel });
      await model.generateContent('ping');
    } catch (testErr: any) {
      console.warn(`Test call with model ${cleanModel} failed, trying fallback to flash-lite:`, testErr);
      try {
        const genAI = new GoogleGenerativeAI(cleanKey);
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
        await fallbackModel.generateContent('ping');
      } catch (fallbackErr: any) {
        return NextResponse.json(
          {
            error:
              fallbackErr?.message?.includes('API_KEY_INVALID') || fallbackErr?.status === 400
                ? 'Google từ chối API Key này (API Key không tồn tại hoặc sai định dạng).'
                : `Lỗi kết nối Gemini: ${fallbackErr?.message || 'Không thể xác thực'}`,
          },
          { status: 400 }
        );
      }
    }

    // 2. Save to .env file (if running in local environment)
    try {
      const envPath = path.join(process.cwd(), '.env');
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      if (envContent.includes('GEMINI_API_KEY=')) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*(\r?\n|$)/g, `GEMINI_API_KEY="${cleanKey}"\n`);
      } else {
        envContent += `\nGEMINI_API_KEY="${cleanKey}"\n`;
      }

      if (envContent.includes('GEMINI_MODEL=')) {
        envContent = envContent.replace(/GEMINI_MODEL=.*(\r?\n|$)/g, `GEMINI_MODEL="${cleanModel}"\n`);
      } else {
        envContent += `GEMINI_MODEL="${cleanModel}"\n`;
      }

      fs.writeFileSync(envPath, envContent, 'utf8');
    } catch (fsErr) {
      console.warn('Notice: Serverless read-only filesystem, skipping .env write:', fsErr);
    }
    
    process.env.GEMINI_API_KEY = cleanKey;
    process.env.GEMINI_MODEL = cleanModel;

    return NextResponse.json({
      success: true,
      model: cleanModel,
      message: `Đã kích hoạt thành công Google Gemini (${cleanModel}) trên toàn bộ hệ thống!`,
    });
  } catch (error: any) {
    console.error('Save Gemini API Key error:', error);
    return NextResponse.json({ error: error?.message || 'Lỗi lưu cấu hình Gemini' }, { status: 500 });
  }
}
