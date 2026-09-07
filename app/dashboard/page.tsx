"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  Boxes,
  UploadCloud,
  MessageSquareText,
  ArrowRight,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { getDashboardSummary } from "@/lib/api";
import type { DashboardSummary } from "@/lib/types";

const statCards = [
  { key: "total_documents" as const, label: "Documents", icon: FileText, tint: "from-[#F4EEE8] to-[#EFE3DD] text-[#C79D92]" },
  { key: "total_equipment" as const, label: "Equipment Tracked", icon: Boxes, tint: "from-[#EFEAF3] to-[#E4DCEC] text-[#B4A7C8]" },
  { key: "total_flags" as const, label: "Open Flags", icon: AlertTriangle, tint: "from-[#F4EEE8] to-[#EFE3DD] text-[#C79D92]" },
];

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDashboardSummary()
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load dashboard data. Is the dev server running?");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#2B2B2B]">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              A live overview of everything BRAID has indexed so far.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/upload"
              className="flex items-center gap-1.5 rounded-xl bg-[#353535] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f1f1f]"
            >
              <UploadCloud size={15} />
              Upload Document
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-1.5 rounded-xl border border-[#D9B8AE] bg-white px-4 py-2.5 text-sm font-semibold text-[#353535] transition hover:bg-[#F4EEE8]"
            >
              <MessageSquareText size={15} />
              Ask Copilot
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-[#E7DFDA] bg-white"
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-[#E7DFDA] bg-white p-8 text-center">
            <AlertTriangle className="mx-auto text-[#C79D92]" size={22} />
            <p className="mt-3 text-sm font-medium text-[#353535]">{error}</p>
            <p className="mt-1 text-xs text-gray-500">
              GET /api/dashboard — make sure your .env.local Supabase keys are set.
            </p>
          </div>
        )}

        {/* Loaded state */}
        {!loading && !error && summary && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {statCards.map(({ key, label, icon: Icon, tint }) => (
                <div
                  key={key}
                  className="rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tint}`}>
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <p className="mt-4 text-3xl font-extrabold text-[#2B2B2B]">
                    {summary[key]}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#353535]">Recent Uploads</h2>
                <Link
                  href="/upload"
                  className="flex items-center gap-1 text-xs font-semibold text-[#C79D92] hover:underline"
                >
                  Upload another
                  <ArrowRight size={13} />
                </Link>
              </div>

              {summary.recent_uploads.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-[#E7DFDA] py-10 text-center">
                  <FileText className="mx-auto text-gray-300" size={26} />
                  <p className="mt-3 text-sm text-gray-500">
                    No documents uploaded yet.
                  </p>
                  <Link
                    href="/upload"
                    className="mt-3 inline-block text-sm font-semibold text-[#C79D92] hover:underline"
                  >
                    Upload your first document →
                  </Link>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-[#F0E9E5]">
                  {summary.recent_uploads.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4EEE8] text-[#C79D92]">
                          <FileText size={16} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#353535]">
                            {doc.file_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.doc_type ?? "Unclassified"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(doc.uploaded_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
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