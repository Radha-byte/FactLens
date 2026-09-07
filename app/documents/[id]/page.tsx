"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  Tag,
  History,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { getDocument, getRelatedDocuments } from "@/lib/api";
import type { DocumentDetailResponse, RelatedDocument } from "@/lib/types";

const severityTint: Record<string, string> = {
  high: "bg-red-50 text-red-600 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-[#F4EEE8] text-[#7A6A66] border-[#E7DFDA]",
};

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [detail, setDetail] = useState<DocumentDetailResponse | null>(null);
  const [related, setRelated] = useState<RelatedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    Promise.all([getDocument(id), getRelatedDocuments(id)])
      .then(([documentData, relatedData]) => {
        if (cancelled) return;
        setDetail(documentData);
        setRelated(relatedData);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't find that document.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#353535]"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        {loading && (
          <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            Loading document...
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-[#E7DFDA] bg-white p-8 text-center">
            <AlertTriangle className="mx-auto text-[#C79D92]" size={22} />
            <p className="mt-3 text-sm font-medium text-[#353535]">{error}</p>
          </div>
        )}

        {!loading && !error && detail && (
          <>
            <div className="mt-5 rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EEE8] text-[#C79D92]">
                    <FileText size={20} />
                  </span>
                  <div>
                    <h1 className="text-lg font-bold text-[#353535]">
                      {detail.document.file_name}
                    </h1>
                    {detail.document.doc_type && (
                      <span className="mt-1 inline-block rounded-full bg-[#F7F5F4] px-2.5 py-0.5 text-[11px] font-medium text-[#7A6A66]">
                        {detail.document.doc_type}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(detail.document.uploaded_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {detail.document.summary && (
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {detail.document.summary}
                </p>
              )}
            </div>

            {/* Flags */}
            {detail.flags.length > 0 && (
              <div className="mt-5 rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-[#C79D92]" />
                  <h2 className="text-sm font-bold text-[#353535]">Flags</h2>
                </div>
                <ul className="mt-3 space-y-2">
                  {detail.flags.map((flag) => (
                    <li
                      key={flag.id}
                      className={`rounded-xl border px-4 py-2.5 text-sm ${
                        severityTint[flag.severity] ?? severityTint.low
                      }`}
                    >
                      <span className="font-semibold">{flag.flag_type ?? "Flag"}:</span>{" "}
                      {flag.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Entities */}
            {detail.entities.length > 0 && (
              <div className="mt-5 rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-[#C79D92]" />
                  <h2 className="text-sm font-bold text-[#353535]">Mentioned In This Document</h2>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {detail.entities.map((entity) => (
                    <span
                      key={entity.id}
                      className="rounded-full bg-[#F4EEE8] px-3 py-1.5 text-xs font-medium text-[#7A6A66]"
                    >
                      <span className="text-[#C79D92]">{entity.entity_type}</span>{" "}
                      · {entity.entity_value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Institutional Memory panel */}
            <div className="mt-5 rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <History size={16} className="text-[#B4A7C8]" />
                <h2 className="text-sm font-bold text-[#353535]">Institutional Memory</h2>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Related documents BRAID found automatically when this was uploaded.
              </p>

              {related.length === 0 ? (
                <p className="mt-4 text-sm text-gray-400">
                  No related documents found — this looks like the first
                  record of its kind.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {related.map((doc) => (
                    <li
                      key={doc.document_id}
                      className="flex items-center justify-between rounded-xl border border-[#F0E9E5] px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText size={14} className="text-[#B4A7C8]" />
                        <div>
                          <p className="text-sm font-medium text-[#353535]">
                            {doc.file_name}
                          </p>
                          {doc.doc_type && (
                            <p className="text-[11px] text-gray-500">{doc.doc_type}</p>
                          )}
                        </div>
                      </div>
                      <span className="rounded-full bg-[#EFEAF3] px-2.5 py-1 text-[11px] font-semibold text-[#B4A7C8]">
                        {Math.round(doc.similarity_score * 100)}% match
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}