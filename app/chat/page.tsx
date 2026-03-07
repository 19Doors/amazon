"use client";

import { useRef, useState } from "react";
import { Paperclip, Send, Mic, FileText, X } from "lucide-react";
import ChatMessages, { ChatMessage } from "@/components/chatMessages";

interface AttachedFile {
  id: string;
  file: File;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Chat() {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

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
    const next: AttachedFile[] = Array.from(incoming).map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
    setFiles((prev) => [...prev, ...next]);
  };

  const handleSend = () => {
    if (!value.trim() && files.length === 0) return;

    // Push user message
    const userMsg: ChatMessage =
      files.length > 0
        ? {
            id: crypto.randomUUID(),
            role: "user",
            type: "document",
            timestamp: new Date(),
            files: files.map((f) => ({
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
    setValue("");
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Simulate AI reply
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setMessages((p) => [
        ...p,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          type: "text",
          timestamp: new Date(),
          content: "I've received your message! How can I help further?",
        },
      ]);
    }, 1800);
  };

  const handleMicRelease = () => {
    setIsRecording(false);
    setMessages((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        role: "user",
        type: "voice",
        timestamp: new Date(),
        durationSeconds: 7,
        transcript: "Hey, can you summarise the uploaded document?",
      },
    ]);
  };

  const canSend = value.trim().length > 0 || files.length > 0;

  return (
    <div className="w-full h-screen flex justify-center bg-background font-inter">
      <div className="w-full max-w-2xl h-full flex flex-col">
        <ChatMessages messages={messages} isThinking={isThinking} />
        <div className="flex flex-col gap-2 px-4 pb-8">
          {/* File chips */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 px-1">
              {files.map(({ id, file }) => (
                <div
                  key={id}
                  className="group flex items-center gap-2 bg-muted border border-border rounded-lg pl-2.5 pr-1.5 py-1.5 max-w-[200px]"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate leading-none">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setFiles((p) => p.filter((f) => f.id !== id))
                    }
                    className="shrink-0 p-0.5 rounded text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div
            className={`flex flex-col gap-2 rounded-xl border bg-card px-4 pt-3.5 pb-3 shadow-sm transition-all duration-200  focus-within:shadow-md hover:shadow-md ${
              isRecording
                ? "border-primary scale-105"
                : "border-border focus-within:border-primary/40"
            }`}
          >
            {/* Textarea */}
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
              className={`w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none caret-primary h-auto min-h-[24px] max-h-[160px] ${isRecording ? "placeholder:text-primary placeholder:font-medium" : ""}`}
            />

            {/* Bottom action row */}
            <div className="flex items-center justify-between">
              {/* Left — attach */}
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

              {/* Right — mic + send */}
              <div className="flex items-center gap-1.5">
                <button
                  onMouseDown={() => setIsRecording(true)}
                  onMouseUp={() => setIsRecording(false)}
                  onMouseLeave={() => {
                    setIsRecording(false);
                    handleMicRelease();
                  }}
                  onTouchStart={() => setIsRecording(true)}
                  onTouchEnd={() => setIsRecording(false)}
                  title="Hold to talk"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150
                  ${
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
      </div>
    </div>
  );
}
