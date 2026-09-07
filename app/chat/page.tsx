"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Send,
  Loader2,
  FileText,
  AlertTriangle,
  MessageSquareText,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { askChat, getFlags } from "@/lib/api";
import type { Flag } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: { document_id: string; file_name: string; excerpt: string }[];
}

const severityTint: Record<string, string> = {
  high: "border-red-200 bg-red-50 text-red-600",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-[#E7DFDA] bg-[#F4EEE8] text-[#7A6A66]",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [showFlags, setShowFlags] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFlags()
      .then(setFlags)
      .catch(() => setFlags([]));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend() {
    const question = input.trim();
    if (!question || sending) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setSending(true);

    try {
      const data = await askChat(question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, citations: data.citations },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong answering that — check the dev server and try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-6xl gap-6 md:h-[calc(100vh-4rem)]">
        {/* Chat column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#2B2B2B]">AI Copilot</h1>
              <p className="mt-1 text-sm text-gray-500">
                Ask anything — answers are grounded only in your uploaded documents.
              </p>
            </div>
            <button
              onClick={() => setShowFlags((v) => !v)}
              className="hidden items-center gap-1.5 rounded-lg border border-[#E7DFDA] bg-white px-3 py-2 text-xs font-semibold text-[#353535] transition hover:bg-[#F4EEE8] lg:flex"
            >
              {showFlags ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
              Flags
            </button>
          </div>

          <div className="flex-1 overflow-y-auto rounded-2xl border border-[#E7DFDA] bg-white p-5">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4EEE8] text-[#D9B8AE]">
                  <MessageSquareText size={22} />
                </span>
                <p className="mt-4 text-sm font-medium text-[#353535]">
                  Ask about any equipment, procedure, or issue
                </p>
                <p className="mt-1 max-w-xs text-xs text-gray-500">
                  e.g. &ldquo;What was found during Pump-101&apos;s last inspection?&rdquo;
                </p>
              </div>
            )}

            <div className="space-y-5">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      m.role === "user"
                        ? "bg-[#353535] text-white"
                        : "border border-[#E7DFDA] bg-[#FAF8F7] text-[#353535]"
                    }`}
                  >
                    <p>{m.content}</p>

                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-[#E7DFDA] pt-3">
                        {m.citations.map((c, ci) => (
                          <Link
                            key={ci}
                            href={`/documents/${c.document_id}`}
                            className="block rounded-xl border border-[#E7DFDA] bg-white px-3 py-2 transition hover:border-[#D9B8AE]"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C79D92]">
                              <FileText size={12} />
                              {c.file_name}
                            </div>
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              &ldquo;{c.excerpt}&rdquo;
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-[#E7DFDA] bg-[#FAF8F7] px-4 py-3 text-sm text-gray-500">
                    <Loader2 size={14} className="animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask BRAID about your equipment..."
              className="flex-1 rounded-xl border border-[#E7DFDA] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D9B8AE] focus:ring-2 focus:ring-[#D9B8AE]/30"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#353535] text-white transition hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Flags panel */}
        {showFlags && (
          <div className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-0 rounded-2xl border border-[#E7DFDA] bg-white p-5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-[#C79D92]" />
                <h2 className="text-sm font-bold text-[#353535]">Flags ({flags.length})</h2>
              </div>

              {flags.length === 0 ? (
                <p className="mt-4 text-xs text-gray-400">
                  No flags raised across your documents yet.
                </p>
              ) : (
                <ul className="mt-3 max-h-[calc(100vh-14rem)] space-y-2 overflow-y-auto">
                  {flags.map((flag) => (
                    <li
                      key={flag.id}
                      className={`rounded-xl border px-3 py-2.5 text-xs leading-5 ${
                        severityTint[flag.severity] ?? severityTint.low
                      }`}
                    >
                      <p className="font-semibold">{flag.flag_type ?? "Flag"}</p>
                      <p className="mt-0.5">{flag.description}</p>
                      <Link
                        href={`/documents/${flag.document_id}`}
                        className="mt-1.5 inline-block text-[11px] font-semibold underline underline-offset-2"
                      >
                        View document
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}