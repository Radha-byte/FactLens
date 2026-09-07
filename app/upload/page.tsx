"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { uploadDocument, getDocuments } from "@/lib/api";
import type { UploadResponse } from "@/lib/types";

const severityTint: Record<string, string> = {
  high: "border-red-200 bg-red-50 text-red-600",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-[#E7DFDA] bg-[#F4EEE8] text-[#7A6A66]",
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }, []);

  async function handleUpload() {
    if (!file || uploading) return;
    setUploading(true);
    setError(null);
    setResult(null);
    setDocumentId(null);

    try {
      const data = await uploadDocument(file);
      setResult(data);

      // No id comes back directly — look it up by the returned fileName.
      try {
        const documents = await getDocuments();
        const match = documents.find((d) => d.file_name === data.fileName);
        if (match) setDocumentId(match.id);
      } catch {
        // non-fatal — upload itself still succeeded
      }

      setFile(null);
    } catch {
      setError("Upload failed. Check the dev server console for details.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-extrabold text-[#2B2B2B]">Upload Document</h1>
        <p className="mt-1 text-sm text-gray-500">
          PDF manuals, SOPs, inspection reports, or maintenance logs.
        </p>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`mt-6 rounded-2xl border-2 border-dashed p-10 text-center transition ${
            dragging
              ? "border-[#D9B8AE] bg-[#F4EEE8]"
              : "border-[#E7DFDA] bg-white"
          }`}
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EEE8] text-[#C79D92]">
                <FileText size={18} />
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#353535]">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="ml-2 text-gray-400 hover:text-[#353535]"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud className="mx-auto text-gray-300" size={30} />
              <p className="mt-3 text-sm font-medium text-[#353535]">
                Drag a PDF here, or
              </p>
              <label className="mt-2 inline-block cursor-pointer text-sm font-semibold text-[#C79D92] hover:underline">
                browse your files
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#353535] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          {uploading ? "Processing with AI..." : "Upload & Analyze"}
        </button>

        {uploading && (
          <p className="mt-2 text-center text-xs text-gray-400">
            Extracting entities, flags, and building embeddings — this can take a moment.
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#E7DFDA] bg-white p-4 text-sm text-[#353535]">
            <AlertTriangle size={16} className="text-[#C79D92]" />
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#4B8B5A]">
              <CheckCircle2 size={18} />
              <p className="text-sm font-semibold">Processed successfully</p>
            </div>

            {result.ai.doc_type && (
              <span className="mt-3 inline-block rounded-full bg-[#F4EEE8] px-2.5 py-1 text-[11px] font-medium text-[#7A6A66]">
                {result.ai.doc_type}
              </span>
            )}

            {result.ai.summary && (
              <p className="mt-3 text-sm leading-6 text-gray-600">{result.ai.summary}</p>
            )}

            {result.ai.entities.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#7A6A66]">
                  Entities Found
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.ai.entities.map((e, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[#F7F5F4] px-2.5 py-1 text-[11px] font-medium text-[#7A6A66]"
                    >
                      {e.type}: {e.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.ai.flags.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#7A6A66]">
                  Flags Raised
                </p>
                <ul className="mt-2 space-y-1.5">
                  {result.ai.flags.map((f, i) => (
                    <li
                      key={i}
                      className={`rounded-xl border px-3 py-2 text-xs leading-5 ${
                        severityTint[f.severity] ?? severityTint.low
                      }`}
                    >
                      <span className="font-semibold">{f.type}:</span> {f.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {documentId && (
                <Link
                  href={`/documents/${documentId}`}
                  className="flex items-center gap-1.5 rounded-xl bg-[#353535] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f1f1f]"
                >
                  View Document
                  <ArrowRight size={14} />
                </Link>
              )}
              <Link
                href="/chat"
                className="flex items-center gap-1.5 rounded-xl border border-[#D9B8AE] bg-white px-4 py-2.5 text-sm font-semibold text-[#353535] transition hover:bg-[#F4EEE8]"
              >
                Ask About It
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}