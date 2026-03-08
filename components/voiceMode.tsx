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
  agentState?: string;
}

function AgentStateBadge({ state }: { state?: string }) {
  if (!state) return null;

  const config: Record<
    string,
    { label: string; color: string; pulse: boolean }
  > = {
    listening: { label: "Listening", color: "bg-emerald-500", pulse: true },
    thinking: { label: "Thinking…", color: "bg-amber-500", pulse: true },
    speaking: { label: "Speaking", color: "bg-primary", pulse: true },
    idle: { label: "Ready", color: "bg-border", pulse: false },
    initializing: {
      label: "Connecting…",
      color: "bg-muted-foreground",
      pulse: false,
    },
    connecting: {
      label: "Connecting…",
      color: "bg-muted-foreground",
      pulse: false,
    },
    disconnected: {
      label: "Disconnected",
      color: "bg-destructive",
      pulse: false,
    },
    failed: { label: "Failed", color: "bg-destructive", pulse: false },
  };

  const c = config[state] ?? {
    label: state,
    color: "bg-muted-foreground",
    pulse: false,
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border">
      <span className={`relative w-2 h-2 rounded-full ${c.color}`}>
        {c.pulse && (
          <span
            className={`absolute inset-0 rounded-full ${c.color} animate-ping opacity-75`}
          />
        )}
      </span>
      <span className="text-xs font-medium text-foreground">{c.label}</span>
    </div>
  );
}

export default function VoiceMode({
  onMicDown,
  onMicRelease,
  isRecording,
  agentState,
}: VoiceModeProps) {
  const [tapMode, setTapMode] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [barHeights, setBarHeights] = useState<number[]>(Array(28).fill(3));

  const isAgentSpeaking = agentState === "speaking";
  const isAgentThinking = agentState === "thinking";

  // Animate bars while recording OR agent is speaking
  useEffect(() => {
    const shouldAnimate = isRecording || isAgentSpeaking;
    if (shouldAnimate) {
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
      // Thinking: gentle low pulse
      if (isAgentThinking) {
        setBarHeights(
          Array.from({ length: 28 }, (_, i) => {
            const center = Math.abs(i - 13.5) / 13.5;
            return Math.max(3, (1 - center) * 8);
          }),
        );
      } else {
        setBarHeights(Array(28).fill(3));
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording, isAgentSpeaking, isAgentThinking]);

  const handleTap = () => {
    if (!tapMode) return;
    if (isRecording) onMicRelease();
    else onMicDown();
  };

  // Derive button glow color from agent state
  const ringColor = isAgentSpeaking
    ? "bg-primary/25 blur-xl"
    : isAgentThinking
      ? "bg-amber-500/20 blur-xl"
      : isRecording
        ? "bg-primary/25 blur-xl"
        : "bg-primary/10 blur-lg";

  const statusText = isRecording
    ? "Listening…"
    : agentState === "speaking"
      ? "Speaking…"
      : agentState === "thinking"
        ? "Thinking…"
        : tapMode
          ? "Tap to speak"
          : "Hold to speak";

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-background select-none px-6">
      {/* Agent state badge */}
      <AgentStateBadge state={agentState} />

      {/* Pulse rings + mic button */}
      <div className="relative flex items-center justify-center">
        {(isRecording || isAgentSpeaking) && (
          <>
            <span className="absolute w-56 h-56 rounded-full bg-primary/10 animate-ping [animation-duration:1.6s]" />
            <span className="absolute w-44 h-44 rounded-full bg-primary/15 animate-ping [animation-duration:1.2s]" />
          </>
        )}
        {isAgentThinking && (
          <span className="absolute w-44 h-44 rounded-full bg-amber-500/10 animate-ping [animation-duration:2s]" />
        )}

        <span
          className={`absolute w-36 h-36 rounded-full transition-all duration-500 ${ringColor}`}
        />

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

      {/* Waveform */}
      <div className="flex items-center gap-[3px] h-12">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-75 ${
              isAgentSpeaking
                ? "bg-primary"
                : isAgentThinking
                  ? "bg-amber-500/60"
                  : isRecording
                    ? "bg-primary"
                    : "bg-border"
            }`}
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      {/* Status */}
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold text-foreground tracking-tight">
          {statusText}
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
