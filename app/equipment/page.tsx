"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Boxes, ChevronDown, ChevronRight, FileText, AlertCircle } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { searchEquipment } from "@/lib/api";
import type { EquipmentEntity } from "@/lib/types";

type Group = {
  key: string;
  value: string;
  type: string;
  mentions: {
    document_id: string;
    file_name: string;
    doc_type: string | null;
    context: string | null;
  }[];
};

function groupEntities(rows: EquipmentEntity[]): Group[] {
  const map = new Map<string, Group>();
  for (const row of rows) {
    const key = `${row.entity_type}::${row.entity_value}`;
    if (!map.has(key)) {
      map.set(key, { key, value: row.entity_value, type: row.entity_type, mentions: [] });
    }
    map.get(key)!.mentions.push({
      document_id: row.document_id,
      file_name: row.documents?.file_name ?? "Unknown document",
      doc_type: row.documents?.doc_type ?? null,
      context: row.context,
    });
  }
  return Array.from(map.values()).sort((a, b) => b.mentions.length - a.mentions.length);
}

export default function EquipmentPage() {
  const [rows, setRows] = useState<EquipmentEntity[]>([]);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timeout = setTimeout(() => {
      searchEquipment(search)
        .then((data) => {
          if (!cancelled) {
            setRows(data);
            setError(null);
          }
        })
        .catch(() => {
          if (!cancelled) setError("Couldn't load equipment data.");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300); // debounce

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search]);

  const groups = useMemo(() => groupEntities(rows), [rows]);

  // entity_type is freeform text — build the filter pills from whatever
  // actually shows up in the data instead of hardcoding categories.
  const types = useMemo(
    () => Array.from(new Set(rows.map((r) => r.entity_type))).sort(),
    [rows]
  );

  const visibleGroups = activeType
    ? groups.filter((g) => g.type === activeType)
    : groups;

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-extrabold text-[#2B2B2B]">Equipment Explorer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search anything mentioned across your documents — equipment, people,
          components, procedures.
        </p>

        {/* Search */}
        <div className="relative mt-6 max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search e.g. Pump-101"
            className="w-full rounded-xl border border-[#E7DFDA] bg-white py-2.5 pl-10 pr-4 text-sm text-[#353535] shadow-sm outline-none transition focus:border-[#D9B8AE] focus:ring-2 focus:ring-[#D9B8AE]/30"
          />
        </div>

        {/* Type filter pills — built dynamically from real data */}
        {types.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveType(null)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                activeType === null
                  ? "bg-[#353535] text-white"
                  : "bg-white text-gray-600 border border-[#E7DFDA] hover:border-[#D9B8AE]"
              }`}
            >
              All ({rows.length})
            </button>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeType === type
                    ? "bg-[#353535] text-white"
                    : "bg-white text-gray-600 border border-[#E7DFDA] hover:border-[#D9B8AE]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border border-[#E7DFDA] bg-white" />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-[#E7DFDA] bg-white p-8 text-center">
            <AlertCircle className="mx-auto text-[#C79D92]" size={22} />
            <p className="mt-3 text-sm font-medium text-[#353535]">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && visibleGroups.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-[#E7DFDA] bg-white py-14 text-center">
            <Boxes className="mx-auto text-gray-300" size={26} />
            <p className="mt-3 text-sm text-gray-500">
              {search ? `Nothing found for "${search}".` : "No entities indexed yet — upload a document to get started."}
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && visibleGroups.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGroups.map((group) => {
              const isOpen = expanded === group.key;
              return (
                <div
                  key={group.key}
                  className="rounded-2xl border border-[#E7DFDA] bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <button
                      onClick={() => setExpanded(isOpen ? null : group.key)}
                      className="flex-1 text-left"
                    >
                      <span className="rounded-full bg-[#F4EEE8] px-2.5 py-0.5 text-[11px] font-semibold text-[#7A6A66]">
                        {group.type}
                      </span>
                      <p className="mt-2 text-base font-bold text-[#353535]">{group.value}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Mentioned in {group.mentions.length} document
                        {group.mentions.length === 1 ? "" : "s"}
                      </p>
                    </button>
                    <div className="flex shrink-0 items-center gap-1">
                      <Link
                        href={`/equipment/${encodeURIComponent(group.value)}`}
                        title="Open full details"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-[#F4EEE8] hover:text-[#C79D92]"
                      >
                        <ChevronRight size={16} />
                      </Link>
                      <button
                        onClick={() => setExpanded(isOpen ? null : group.key)}
                        aria-label="Toggle preview"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-[#F4EEE8] hover:text-[#C79D92]"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <ul className="mt-4 space-y-3 border-t border-[#F0E9E5] pt-4">
                      {group.mentions.map((m, i) => (
                        <li key={`${m.document_id}-${i}`} className="flex gap-2.5">
                          <FileText size={14} className="mt-0.5 shrink-0 text-[#C79D92]" />
                          <div>
                            <p className="text-xs font-semibold text-[#353535]">{m.file_name}</p>
                            {m.doc_type && (
                              <p className="text-[11px] text-gray-500">{m.doc_type}</p>
                            )}
                            {m.context && (
                              <p className="mt-1 text-xs leading-5 text-gray-600">
                                &ldquo;{m.context}&rdquo;
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}