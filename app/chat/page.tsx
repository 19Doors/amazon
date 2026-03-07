"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Mic, FileText, X } from "lucide-react";
import ChatMessages, { ChatMessage } from "@/components/chatMessages";
import VoiceMode from "@/components/voiceMode";
import { MessageSquare, Mic as MicIcon } from "lucide-react";

import { Room, RoomEvent, TokenSource } from "livekit-client";
import {
  useSession,
  SessionProvider,
  RoomAudioRenderer,
  useChat,
} from "@livekit/components-react";

interface AttachedFile {
  id: string;
  file: File;
  progress: number; // 0–100, null = not yet sending
  status: "pending" | "sending" | "done" | "error";
}

const BYTE_STREAM_TOPIC = "document-upload"; // must match Python agent

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const tokenSource = TokenSource.endpoint("http://localhost:3002/getToken");

// ─── Inner — runs INSIDE SessionProvider context ──────────────────────────────
function ChatInner({ session }: { session: ReturnType<typeof useSession> }) {
  // ✅ useChat reads from SessionProvider context — no room arg needed
  const { chatMessages, send, isSending } = useChat();

  const [value, setValue] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles((prev) => [
      ...prev,
      ...Array.from(incoming).map((file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: "pending" as const,
      })),
    ]);
  };

  const sendFilesViaLiveKit = async (pendingFiles: AttachedFile[]) => {
    for (const { id, file } of pendingFiles) {
      // Mark as sending
      setFiles((p) =>
        p.map((f) => (f.id === id ? { ...f, status: "sending" } : f)),
      );

      try {
        await session.room.localParticipant.sendFile(file, {
          mimeType: file.type || "application/octet-stream",
          topic: BYTE_STREAM_TOPIC,
          onProgress: (progress) => {
            setFiles((p) =>
              p.map((f) =>
                f.id === id ? { ...f, progress: Math.ceil(progress * 100) } : f,
              ),
            );
          },
        });

        // Mark done
        setFiles((p) =>
          p.map((f) =>
            f.id === id ? { ...f, status: "done", progress: 100 } : f,
          ),
        );
      } catch (err) {
        console.error("File send failed:", err);
        setFiles((p) =>
          p.map((f) => (f.id === id ? { ...f, status: "error" } : f)),
        );
      }
    }
  };

  const handleSend = async () => {
    if (!value.trim() && files.length === 0) return;

    const pendingFiles = files.filter((f) => f.status === "pending");

    // Push user message to chat immediately
    const userMsg: ChatMessage =
      pendingFiles.length > 0
        ? {
            id: crypto.randomUUID(),
            role: "user",
            type: "document",
            timestamp: new Date(),
            files: pendingFiles.map((f) => ({
              name: f.file.name,
              size: f.file.size,
              mimeType: f.file.type,
            })),
            caption: value.trim() || undefined,
          }
        : {
            id: crypto.randomUUID(),
            role: "user",
            type: "text",
            timestamp: new Date(),
            content: value.trim(),
          };

    setMessages((p) => [...p, userMsg]);

    // Send text message over LiveKit chat
    if (value.trim()) send(value.trim());

    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Stream files in background — chips stay visible with progress
    if (pendingFiles.length > 0) {
      setIsThinking(true);
      await sendFilesViaLiveKit(pendingFiles);
      // Clear done files after a short delay so user sees ✓
      setTimeout(() => {
        setFiles((p) => p.filter((f) => f.status !== "done"));
        setIsThinking(false);
      }, 1200);
    }
  };

  const handleMicDown = async () => {
    setIsRecording(true);
    await session.room.localParticipant.setMicrophoneEnabled(true);
  };

  const handleMicRelease = async () => {
    if (!isRecording) return;
    setIsRecording(false);
    await session.room.localParticipant.setMicrophoneEnabled(false);
    setMessages((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        role: "user",
        type: "voice",
        timestamp: new Date(),
        durationSeconds: 7,
      },
    ]);
  };

  const canSend = value.trim().length > 0 || files.length > 0;

  return (
    <div className="w-full h-screen flex justify-center bg-background font-inter">
      <div className="w-full max-w-2xl h-full flex flex-col">
        {/* ── Top bar with mode switch ── */}
        <div className="flex items-center justify-end px-4 pt-4 pb-2 shrink-0">
          <div className="flex items-center gap-1 bg-muted border border-border rounded-full p-1">
            <button
              onClick={() => setVoiceMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                !voiceMode
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
            </button>
            <button
              onClick={() => setVoiceMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                voiceMode
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MicIcon className="w-3.5 h-3.5" />
              Voice
            </button>
          </div>
        </div>

        {/* ── Mode content ── */}
        {voiceMode ? (
          <VoiceMode
            isRecording={isRecording}
            onMicDown={handleMicDown}
            onMicRelease={handleMicRelease}
          />
        ) : (
          <>
            <ChatMessages messages={messages} isThinking={isThinking} />

            <div className="flex flex-col gap-2 px-4 pb-8">
              {/* File chips */}

              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 px-1">
                  {files.map(({ id, file, progress, status }) => (
                    <div
                      key={id}
                      className={`group flex flex-col gap-1 bg-muted border rounded-lg pl-2.5 pr-1.5 pt-1.5 pb-1 max-w-[200px] transition-colors duration-150
          ${
            status === "error"
              ? "border-destructive/40"
              : status === "done"
                ? "border-emerald-500/40"
                : "border-border"
          }`}
                    >
                      {/* Top row */}
                      <div className="flex items-center gap-2">
                        <FileText
                          className={`w-3.5 h-3.5 shrink-0 ${
                            status === "error"
                              ? "text-destructive"
                              : status === "done"
                                ? "text-emerald-500"
                                : "text-primary"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground truncate leading-none">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {status === "sending"
                              ? `${progress}%`
                              : status === "done"
                                ? "Sent ✓"
                                : status === "error"
                                  ? "Failed"
                                  : formatSize(file.size)}
                          </p>
                        </div>
                        {/* Only allow removal if not mid-send */}
                        {status !== "sending" && (
                          <button
                            onClick={() =>
                              setFiles((p) => p.filter((f) => f.id !== id))
                            }
                            className="shrink-0 p-0.5 rounded text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Progress bar — only while sending */}
                      {status === "sending" && (
                        <div className="w-full h-1 rounded-full bg-background overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-150 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Input bar */}
              <div
                className={`flex flex-col gap-2 rounded-xl border bg-card px-4 pt-3.5 pb-3 shadow-sm transition-all duration-200 focus-within:shadow-md hover:shadow-md ${
                  isRecording
                    ? "border-primary scale-105"
                    : "border-border focus-within:border-primary/40"
                }`}
              >
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={value}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isRecording
                      ? "Listening…"
                      : "Ask anything… (Shift+Enter for new line)"
                  }
                  className={`w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none caret-primary h-auto min-h-[24px] max-h-[160px] ${
                    isRecording
                      ? "placeholder:text-primary placeholder:font-medium"
                      : ""
                  }`}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent text-xs font-medium transition-colors duration-150"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Attach</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onMouseDown={handleMicDown}
                      onMouseUp={handleMicRelease}
                      onMouseLeave={handleMicRelease}
                      onTouchStart={handleMicDown}
                      onTouchEnd={handleMicRelease}
                      title="Hold to talk"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${
                        isRecording
                          ? "bg-primary text-primary-foreground scale-110 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleSend}
                      disabled={!canSend}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-25 disabled:pointer-events-none hover:opacity-90 active:scale-95 transition-all duration-150"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-center text-[10px] text-muted-foreground">
                AI can make mistakes. Double-check important info.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Outer — sets up session, owns SessionProvider ────────────────────────────
export default function Chat() {
  const roomRef = useRef<Room>(
    new Room({
      disconnectOnPageLeave: true,
      audioCaptureDefaults: {
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
      },
      publishDefaults: {
        dtx: true,
        red: true,
      },
    }),
  );
  const roomNameRef = useRef(
    `grameen-${Math.random().toString(36).substring(7)}`,
  );

  const session = useSession(tokenSource, {
    room: roomRef.current,
    roomName: roomNameRef.current,
  });

  useEffect(() => {
    session.start();

    const onConnected = () => {
      session.room.localParticipant.setMicrophoneEnabled(false);
    };
    session.room.on(RoomEvent.Connected, onConnected);

    return () => {
      session.room.off(RoomEvent.Connected, onConnected);
      session.end();
    };
  }, []);

  return (
    // ✅ SessionProvider wraps ChatInner — all hooks inside have valid context
    <SessionProvider session={session}>
      <RoomAudioRenderer />
      <ChatInner session={session} />
    </SessionProvider>
  );
}
