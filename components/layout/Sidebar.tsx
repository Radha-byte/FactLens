"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  MessageSquareText,
  UploadCloud,
  Mic,
  Home,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Equipment", href: "/equipment", icon: Boxes },
  { label: "Chat", href: "/chat", icon: MessageSquareText },
  { label: "Upload", href: "/upload", icon: UploadCloud },
  { label: "Capture Knowledge", href: "/capture", icon: Mic },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-[#E7DFDA] bg-white">
      <div className="flex items-center gap-3 border-b border-[#E7DFDA] px-5 py-5">
        <Image src="/brand/braid-loop.png" alt="BRAID" width={56} height={56} className="h-14 w-14 shrink-0" />
        <div>
          <p className="text-xl font-bold leading-none tracking-wide text-[#353535]">BRAID</p>
          <p className="mt-1.5 italic text-[11.5px] leading-snug text-gray-500">Documents that finally talk to each other.</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#F4EEE8] text-[#353535]"
                  : "text-gray-600 hover:bg-[#FAF8F7] hover:text-[#353535]"
              }`}
            >
              <Icon
                size={17}
                strokeWidth={1.9}
                className={active ? "text-[#D9B8AE]" : "text-gray-400"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E7DFDA] px-3 py-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-[#FAF8F7] hover:text-[#353535]"
        >
          <Home size={17} strokeWidth={1.9} className="text-gray-400" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}