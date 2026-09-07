"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mic, Square, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { captureKnowledge } from "@/lib/api";
import type { CaptureResponse } from "@/lib/types";

// Minimal typing for the Web Speech API — not part of standard TS lib.dom yet.
interface SpeechRecognitionResultLike {
  transcript: string;
}
interface SpeechRecognitionEventLike extends Event {
  results: { [index: number]: { [index: number]: SpeechRecognitionResultLike } };
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

export default function CapturePage() {
  const [text, setText] = useState("");
  const [equipmentHint, setEquipmentHint] = useState("");
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CaptureResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setMicSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < Object.keys(event.results).length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setText((prev) => (prev ? prev.trim() + " " : "") + transcript.trim());
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  function toggleMic() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }

  async function handleSubmit() {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const data = await captureKnowledge(text.trim(), equipmentHint.trim());
      setResult(data);
      setText("");
      setEquipmentHint("");
    } catch {
      setError("Couldn't capture that note. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-extrabold text-[#2B2B2B]">Capture Knowledge</h1>
        <p className="mt-1 text-sm text-gray-500">
          Type — or speak — something you know that isn&apos;t written down
          anywhere. It becomes searchable in chat immediately.
        </p>

        <div className="mt-6 rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#7A6A66]">
            Equipment (optional)
          </label>
          <input
            value={equipmentHint}
            onChange={(e) => setEquipmentHint(e.target.value)}
            placeholder="e.g. Pump-101"
            className="mt-2 w-full rounded-xl border border-[#E7DFDA] px-4 py-2.5 text-sm text-[#353535] outline-none transition focus:border-[#D9B8AE] focus:ring-2 focus:ring-[#D9B8AE]/30"
          />

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-[#7A6A66]">
            What do you know?
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="e.g. Pump-101's bearing seal fails faster in the monsoon months — swap it every 4 months during that period instead of the usual 6."
            className="mt-2 w-full resize-none rounded-xl border border-[#E7DFDA] px-4 py-3 text-sm leading-6 text-[#353535] outline-none transition focus:border-[#D9B8AE] focus:ring-2 focus:ring-[#D9B8AE]/30"
          />

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={toggleMic}
              disabled={!micSupported}
              title={micSupported ? "Speak instead of typing" : "Speech input isn't supported in this browser"}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                listening
                  ? "border-red-300 bg-red-50 text-red-600"
                  : "border-[#E7DFDA] bg-white text-[#353535] hover:bg-[#F4EEE8]"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {listening ? <Square size={15} /> : <Mic size={15} />}
              {listening ? "Stop Recording" : "Speak"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={!text.trim() || submitting}
              className="flex items-center gap-2 rounded-xl bg-[#353535] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {submitting ? "Saving..." : "Save Knowledge"}
            </button>
          </div>

          {!micSupported && (
            <p className="mt-2 text-xs text-gray-400">
              Voice input works in Chrome and Edge. Typing works everywhere.
            </p>
          )}
        </div>

        {/* Success */}
        {result && (
          <div className="mt-5 rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#4B8B5A]">
              <CheckCircle2 size={18} />
              <p className="text-sm font-semibold">Saved and searchable now</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">{result.summary}</p>
            {result.entities.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {result.entities.map((e, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-[#F4EEE8] px-2.5 py-1 text-[11px] font-medium text-[#7A6A66]"
                  >
                    {e.type}: {e.value}
                  </span>
                ))}
              </div>
            )}
            <Link
              href="/chat"
              className="mt-4 inline-block text-sm font-semibold text-[#C79D92] hover:underline"
            >
              Try asking about it in Chat →
            </Link>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#E7DFDA] bg-white p-4 text-sm text-[#353535]">
            <AlertCircle size={16} className="text-[#C79D92]" />
            {error}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}