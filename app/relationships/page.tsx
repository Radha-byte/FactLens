"use client";
import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";

const badgeColor: Record<string, string> = {
  corroborates: "bg-green-100 text-green-800",
  contradicts: "bg-red-100 text-red-800",
  reconciled_by_context: "bg-amber-100 text-amber-800",
};

export default function RelationshipsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/relationships")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-extrabold text-[#2B2B2B]">Relationships</h1>
        {loading && <p className="mt-4 text-sm text-gray-500">Loading...</p>}
        {!loading && data.length === 0 && (
          <p className="mt-4 text-sm text-gray-500">No relationships found yet.</p>
        )}
        <div className="mt-6 space-y-4">
          {data.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[#E7DFDA] bg-white p-5">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badgeColor[r.relationship_type] ?? "bg-gray-100"}`}>
                {r.relationship_type}
              </span>
              <p className="mt-2 text-sm text-gray-600 italic">"{r.reasoning}"</p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[r.fact, r.related_fact].map((f, i) => (
                  <div key={i} className="rounded-xl bg-[#FAF7F5] p-4">
                    <p className="text-sm font-semibold">{f.subject} — {f.value} {f.unit}</p>
                    <p className="text-xs text-gray-500">{f.time_period} {f.scope ? `· ${f.scope}` : ""}</p>
                    <p className="mt-2 text-xs text-gray-600">"{f.quote}"</p>
                    <p className="mt-1 text-xs text-gray-400">{f.documents?.file_name} · p.{f.page_number}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}