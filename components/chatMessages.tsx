// components/chat-messages.tsx
"use client";

import { useEffect, useRef } from "react";
import {
  FileText,
  FileSpreadsheet,
  File,
  Mic,
  Play,
  Bot,
  User,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant";
export type MessageType = "text" | "document" | "voice";

interface BaseMessage {
  id: string;
  role: MessageRole;
  timestamp: Date;
}

interface TextMessage extends BaseMessage {
  type: "text";
  content: string;
}

interface DocumentMessage extends BaseMessage {
  type: "document";
  files: { name: string; size: number; mimeType: string }[];
  caption?: string;
}

interface VoiceMessage extends BaseMessage {
  type: "voice";
  durationSeconds: number;
  transcript?: string;
}

export type ChatMessage = TextMessage | DocumentMessage | VoiceMessage;

interface ChatMessagesProps {
  messages: ChatMessage[];
  isThinking?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["xls", "xlsx", "csv"].includes(ext ?? ""))
    return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
  if (ext === "pdf") return <FileText className="w-4 h-4 text-red-400" />;
  return <File className="w-4 h-4 text-muted-foreground" />;
}

// ─── Fake waveform bars ───────────────────────────────────────────────────────

function Waveform({ isUser }: { isUser: boolean }) {
  const bars = [3, 5, 8, 6, 10, 7, 4, 9, 6, 5, 8, 4, 7, 5, 3];
  return (
    <div className="flex items-center gap-[2px] h-6">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full ${isUser ? "bg-primary-foreground/60" : "bg-primary/50"}`}
          style={{ height: `${h * 2}px` }}
        />
      ))}
    </div>
  );
}

// ─── Per-type renderers ───────────────────────────────────────────────────────

function TextBubble({ msg }: { msg: TextMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`max-w-[80%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-card border border-border text-foreground rounded-bl-sm"
          }`}
      >
        {msg.content}
      </div>
      <span className="text-[10px] text-muted-foreground px-1">
        {formatTime(msg.timestamp)}
      </span>
    </div>
  );
}

function DocumentBubble({ msg }: { msg: DocumentMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`max-w-[80%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`flex flex-col gap-2 px-3.5 py-3 rounded-2xl border min-w-[220px]
          ${
            isUser
              ? "bg-primary/10 border-primary/20 rounded-br-sm"
              : "bg-card border-border rounded-bl-sm"
          }`}
      >
        {/* Files */}
        <div className="flex flex-col gap-1.5">
          {msg.files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 bg-background/70 border border-border rounded-xl px-3 py-2"
            >
              <div className="shrink-0">{getFileIcon(f.name)}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate leading-tight">
                  {f.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatSize(f.size)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Optional caption */}
        {msg.caption && (
          <p className="text-sm text-foreground leading-relaxed px-0.5">
            {msg.caption}
          </p>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground px-1">
        {formatTime(msg.timestamp)}
      </span>
    </div>
  );
}

function VoiceBubble({ msg }: { msg: VoiceMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`max-w-[80%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`flex flex-col gap-2 px-3.5 py-3 rounded-2xl border min-w-[220px]
          ${
            isUser
              ? "bg-primary text-primary-foreground border-primary/20 rounded-br-sm"
              : "bg-card border-border rounded-bl-sm"
          }`}
      >
        {/* Player row */}
        <div className="flex items-center gap-3">
          <button
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors
              ${
                isUser
                  ? "bg-primary-foreground/20 hover:bg-primary-foreground/30"
                  : "bg-primary/10 hover:bg-primary/20"
              }`}
          >
            <Play
              className={`w-3.5 h-3.5 ml-0.5 ${isUser ? "text-primary-foreground" : "text-primary"}`}
            />
          </button>

          <Waveform isUser={isUser} />

          <span
            className={`text-[11px] font-medium shrink-0 ${isUser ? "text-primary-foreground/80" : "text-muted-foreground"}`}
          >
            {formatDuration(msg.durationSeconds)}
          </span>
        </div>

        {/* Transcript */}
        {msg.transcript && (
          <p
            className={`text-xs leading-relaxed italic border-t pt-2 
            ${isUser ? "border-primary-foreground/20 text-primary-foreground/80" : "border-border text-muted-foreground"}`}
          >
            "{msg.transcript}"
          </p>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground px-1">
        {formatTime(msg.timestamp)}
      </span>
    </div>
  );
}

// ─── Thinking indicator ───────────────────────────────────────────────────────

function ThinkingBubble() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="shrink-0 w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center mt-0.5">
        <Bot className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl rounded-bl-sm bg-card border border-border">
        <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground">Thinking…</span>
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ role }: { role: MessageRole }) {
  return (
    <div className="shrink-0 w-7 h-7 rounded-full border border-border flex items-center justify-center mt-0.5 bg-muted">
      {role === "assistant" ? (
        <Bot className="w-3.5 h-3.5 text-muted-foreground" />
      ) : (
        <User className="w-3.5 h-3.5 text-muted-foreground" />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatMessages({
  messages,
  isThinking = false,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  if (messages.length === 0 && !isThinking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center">
          <Bot className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">How can I help?</p>
          <p className="text-xs text-muted-foreground mt-1">
            Send a message, attach a document, or hold to talk.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg) => {
        const isUser = msg.role === "user";

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
          >
            <Avatar role={msg.role} />
            {msg.type === "text" && <TextBubble msg={msg} />}
            {msg.type === "document" && <DocumentBubble msg={msg} />}
            {msg.type === "voice" && <VoiceBubble msg={msg} />}
          </div>
        );
      })}

      {isThinking && <ThinkingBubble />}
      <div ref={bottomRef} />
    </div>
  );
}
