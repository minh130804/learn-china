import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function splitIntoChunks(text: string, maxLength = 120): string[] {
  // Split by sentence terminators
  const sentences = text
    .replace(/\r\n/g, '\n')
    .split(/([。！？\n]+)/)
    .filter(Boolean);

  const chunks: string[] = [];
  let currentChunk = '';

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i];
    if ((currentChunk + part).length <= maxLength) {
      currentChunk += part;
    } else {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      if (part.length > maxLength) {
        // Fallback split by commas or spaces
        const subParts = part.split(/([，、；\s]+)/).filter(Boolean);
        let subChunk = '';
        for (const sub of subParts) {
          if ((subChunk + sub).length <= maxLength) {
            subChunk += sub;
          } else {
            if (subChunk.trim()) chunks.push(subChunk.trim());
            subChunk = sub;
          }
        }
        if (subChunk.trim()) chunks.push(subChunk.trim());
        currentChunk = '';
      } else {
        currentChunk = part;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text.slice(0, maxLength)];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text')?.trim();

    if (!text) {
      return NextResponse.json({ error: 'Missing text parameter' }, { status: 400 });
    }

    // Clean out parenthetical notes like (hǎo) or (tốt) or brackets
    let cleanText = text
      .replace(/\([^)]*\)/g, '')
      .replace(/（[^）]*）/g, '')
      .replace(/\[[^\]]*\]/g, '')
      .trim();

    if (!cleanText) {
      cleanText = text;
    }

    const chunks = splitIntoChunks(cleanText, 140);
    const audioBuffers: Uint8Array[] = [];

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=${encodeURIComponent(
        chunk.trim()
      )}`;

      const res = await fetch(ttsUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (res.ok) {
        const buf = await res.arrayBuffer();
        audioBuffers.push(new Uint8Array(buf));
      }
    }

    if (audioBuffers.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch audio from TTS provider' }, { status: 502 });
    }

    // Concatenate all MP3 buffers into a single continuous MP3 stream
    const totalLength = audioBuffers.reduce((acc, curr) => acc + curr.length, 0);
    const combinedBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of audioBuffers) {
      combinedBuffer.set(buf, offset);
      offset += buf.length;
    }

    return new NextResponse(combinedBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('TTS audio error:', error);
    return NextResponse.json({ error: 'TTS audio generation failed' }, { status: 500 });
  }
}
