"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

const LANGUAGES = [
  "Hindi",
  "Tamil",
  "Bengali",
  "Marathi",
  "Telugu",
  "Kannada",
  "Gujarati",
  "Malayalam",
  "Punjabi",
  "Odia",
  "Urdu",
  "Assamese",
];

interface VoiceModeProps {
  onMicDown: () => void;
  onMicRelease: () => void;
  isRecording: boolean;
}

export default function VoiceMode({
  onMicDown,
  onMicRelease,
  isRecording,
}: VoiceModeProps) {
  const [tapMode, setTapMode] = useState(true); // false = hold, true = tap-toggle
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [barHeights, setBarHeights] = useState<number[]>(Array(28).fill(3));

  // Animate bars while recording
  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setBarHeights(
          Array.from({ length: 28 }, (_, i) => {
            const center = Math.abs(i - 13.5) / 13.5;
            const base = (1 - center * 0.5) * 28;
            return Math.max(4, base * (0.3 + Math.random() * 0.7));
          }),
        );
      }, 80);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setBarHeights(Array(28).fill(3));
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  const handleTap = () => {
    if (!tapMode) return;
    if (isRecording) onMicRelease();
    else onMicDown();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-10 bg-background select-none px-6">
      {/* Pulse rings + mic button */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse rings — only when recording */}
        {isRecording && (
          <>
            <span className="absolute w-56 h-56 rounded-full bg-primary/10 animate-ping [animation-duration:1.6s]" />
            <span className="absolute w-44 h-44 rounded-full bg-primary/15 animate-ping [animation-duration:1.2s]" />
          </>
        )}

        {/* Soft glow halo — always visible */}
        <span
          className={`absolute w-36 h-36 rounded-full transition-all duration-500 ${
            isRecording ? "bg-primary/25 blur-xl" : "bg-primary/10 blur-lg"
          }`}
        />

        {/* Main circle */}
        <button
          onMouseDown={tapMode ? undefined : onMicDown}
          onMouseUp={tapMode ? undefined : onMicRelease}
          onMouseLeave={tapMode ? undefined : onMicRelease}
          onTouchStart={
            tapMode
              ? undefined
              : (e) => {
                  e.preventDefault();
                  onMicDown();
                }
          }
          onTouchEnd={
            tapMode
              ? undefined
              : (e) => {
                  e.preventDefault();
                  onMicRelease();
                }
          }
          onClick={tapMode ? handleTap : undefined}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl
            ${
              isRecording
                ? "bg-primary scale-110 shadow-primary/40"
                : "bg-primary/90 hover:bg-primary hover:scale-105"
            }`}
        >
          {isRecording ? (
            <MicOff className="w-10 h-10 text-primary-foreground" />
          ) : (
            <Mic className="w-10 h-10 text-primary-foreground" />
          )}
        </button>
      </div>

      {/* Waveform visualizer */}
      <div className="flex items-center gap-[3px] h-12">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-75 ${
              isRecording ? "bg-primary" : "bg-border"
            }`}
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      {/* Status text */}
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold text-foreground tracking-tight">
          {isRecording
            ? "Listening…"
            : tapMode
              ? "Tap to speak"
              : "Hold to speak"}
        </p>
        <p className="text-sm text-muted-foreground">
          Hindi, Tamil, Bengali, Marathi, Telugu, Kannada,
          <br />
          and 16+ more languages
        </p>
      </div>

      {/* Language pills */}
      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {LANGUAGES.map((lang) => (
          <span
            key={lang}
            className="px-3 py-1 text-xs font-medium rounded-full border border-border text-muted-foreground bg-muted"
          >
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
}
