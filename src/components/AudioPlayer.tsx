'use client';

import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Pause, Play, Loader2 } from 'lucide-react';

interface AudioButtonProps {
  text: string;
  speed?: number;
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AudioButton({
  text,
  speed = 1.0,
  className = '',
  label,
  size = 'md',
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cleanChineseText = (raw: string) => {
    return (
      raw
        .replace(/\([^)]*\)/g, '')
        .replace(/（[^）]*）/g, '')
        .replace(/\[[^\]]*\]/g, '')
        .trim() || raw
    );
  };

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    const spokenText = cleanChineseText(text);
    setIsPlaying(true);

    try {
      // 1. Try playing high-fidelity audio stream from Next.js TTS API
      const audioUrl = `/api/tts?text=${encodeURIComponent(spokenText)}`;
      const audio = new Audio(audioUrl);
      audio.playbackRate = speed;
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        // Fallback to Web Speech Synthesis if network stream fails
        fallbackSpeechSynthesis(spokenText);
      };

      await audio.play();
    } catch (err) {
      console.warn('HTML5 Audio play failed, falling back to Web Speech Synthesis:', err);
      fallbackSpeechSynthesis(spokenText);
    }
  };

  const fallbackSpeechSynthesis = (spokenText: string) => {
    if (!('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = 'zh-CN';
    utterance.rate = speed;
    utterance.pitch = 1.0;

    // Pick Chinese voice if available in Safari/Chrome
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(
      (v) =>
        v.lang.includes('zh') ||
        v.lang.includes('cmn') ||
        v.name.includes('Tingting') ||
        v.name.includes('Sinji') ||
        v.name.includes('Mei-Jia')
    );
    if (zhVoice) {
      utterance.voice = zhVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  return (
    <button
      onClick={handleSpeak}
      title={`Nghe phát âm tiếng Trung: "${text}"`}
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-full transition-all duration-150 cursor-pointer ${
        isPlaying
          ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300 animate-pulse'
          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
      } ${sizeClasses} ${className}`}
    >
      <Volume2 className={iconSizes} />
      {label && <span className="font-semibold pr-1">{label}</span>}
    </button>
  );
}
