"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF8F7]">
      {/* Desktop sidebar */}
      <aside className="hidden md:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-[#E7DFDA] bg-white px-4 py-3 md:hidden">
          <span className="text-sm font-bold tracking-wide text-[#353535]">BRAID</span>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7DFDA] text-[#353535]"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}