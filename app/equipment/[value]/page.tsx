"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  FileText,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { searchEquipment } from "@/lib/api";
import type { EquipmentEntity } from "@/lib/types";

export default function EquipmentDetailPage() {
  const { value } = useParams<{ value: string }>();
  const decodedValue = value ? decodeURIComponent(value) : "";

  const [rows, setRows] = useState<EquipmentEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!decodedValue) return;
    let cancelled = false;
    setLoading(true);

    searchEquipment(decodedValue)
      .then((data) => {
        if (cancelled) return;
        // /api/equipment does a loose match, so narrow to the exact
        // entity_value this page is actually about (case-insensitive).
        const exact = data.filter(
          (row) => row.entity_value.toLowerCase() === decodedValue.toLowerCase()
        );
        setRows(exact.length > 0 ? exact : data);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this equipment's history.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [decodedValue]);

  const entityType = rows[0]?.entity_type ?? null;

  const mentions = useMemo(
    () =>
      rows
        .filter((row) => row.documents)
        .map((row) => ({
          document_id: row.documents!.id,
          file_name: row.documents!.file_name,
          doc_type: row.documents!.doc_type,
          summary: row.documents!.summary,
          context: row.context,
        })),
    [rows]
  );

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#353535]"
        >
          <ArrowLeft size={14} />
          Back to Equipment
        </Link>

        {loading && (
          <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            Loading equipment history...
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-[#E7DFDA] bg-white p-8 text-center">
            <AlertCircle className="mx-auto text-[#C79D92]" size={22} />
            <p className="mt-3 text-sm font-medium text-[#353535]">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Header */}
            <div className="mt-5 rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EEE8] text-[#C79D92]">
                  <Boxes size={20} />
                </span>
                <div>
                  <h1 className="text-lg font-bold text-[#353535]">{decodedValue}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {entityType && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F7F5F4] px-2.5 py-0.5 text-[11px] font-medium text-[#7A6A66]">
                        <Tag size={10} />
                        {entityType}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      Mentioned in {mentions.length} document
                      {mentions.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents that mention it */}
            <div className="mt-5 rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#C79D92]" />
                <h2 className="text-sm font-bold text-[#353535]">
                  Everything About {decodedValue}
                </h2>
              </div>

              {mentions.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-[#E7DFDA] py-10 text-center">
                  <p className="text-sm text-gray-400">
                    No documents currently mention this equipment.
                  </p>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {mentions.map((m, i) => (
                    <li key={`${m.document_id}-${i}`}>
                      <Link
                        href={`/documents/${m.document_id}`}
                        className="block rounded-xl border border-[#F0E9E5] px-4 py-3 transition hover:border-[#D9B8AE] hover:bg-[#FAF8F7]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-[#353535]">
                            {m.file_name}
                          </p>
                          {m.doc_type && (
                            <span className="shrink-0 rounded-full bg-[#F4EEE8] px-2.5 py-0.5 text-[10px] font-medium text-[#7A6A66]">
                              {m.doc_type}
                            </span>
                          )}
                        </div>
                        {m.context && (
                          <p className="mt-1.5 text-xs leading-5 text-gray-600">
                            &ldquo;{m.context}&rdquo;
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quick action */}
            <div className="mt-5 flex justify-end">
              <Link
                href="/chat"
                className="rounded-xl bg-[#353535] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f1f1f]"
              >
                Ask Copilot About {decodedValue}
              </Link>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}