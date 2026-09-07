import Image from "next/image";
import { ArrowRight, Sparkles, Network, MessageSquareText, ShieldAlert } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAF8F7] to-[#F4EEE8] pt-32 pb-16 lg:pt-36 lg:pb-20">
      <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-[#D9B8AE]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-[#B4A7C8]/15 blur-3xl" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.3]" aria-hidden="true">
        <defs>
          <pattern id="braid-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#D9B8AE" fillOpacity="0.35" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#braid-dots)" />
      </svg>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 sm:px-8 lg:flex-row lg:justify-between lg:gap-10">
        {/* LEFT SIDE */}
        <div className="max-w-xl text-center animate-fade-in-up lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E7DFDA] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#7A6A66] shadow-sm">
            <Sparkles size={13} className="text-[#D9B8AE]" />
            ET AI Hackathon 2026
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#2B2B2B] sm:text-5xl lg:text-[3.4rem]">
            Industrial{" "}
            <span className="bg-gradient-to-r from-[#D9B8AE] via-[#C79D92] to-[#B4A7C8] bg-clip-text text-transparent">
              Knowledge Intelligence
            </span>{" "}
            Platform
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-gray-600 lg:mx-0">
            BRAID transforms maintenance manuals, SOPs, inspection reports and
            institutional knowledge into one intelligent assistant capable of
            answering questions with trusted citations and contextual understanding.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="/dashboard"
              className="group flex items-center gap-2 rounded-xl bg-[#353535] px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:scale-[1.03] hover:bg-[#1f1f1f]"
            >
              Explore Platform
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </a>
            <a
              href="#workflow"
              className="rounded-xl border-2 border-[#D9B8AE] bg-white px-6 py-3 text-sm font-semibold text-[#353535] transition duration-300 hover:bg-[#F4EEE8]"
            >
              View Workflow
            </a>
          </div>

          {/* Stat strip */}
          <div className="mt-9 grid grid-cols-3 gap-4 border-t border-[#E7DFDA] pt-5">
            <div className="text-center lg:text-left">
              <p className="text-xl font-extrabold text-[#353535]">6</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[#8B87A0]">
                Core Modules
              </p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-xl font-extrabold text-[#353535]">100%</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[#8B87A0]">
                Cited Answers
              </p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-xl font-extrabold text-[#353535]">4-Step</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[#8B87A0]">
                Workflow
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative h-[240px] w-[240px] shrink-0 animate-fade-in-up delay-200 sm:h-[280px] sm:w-[280px] lg:h-[320px] lg:w-[320px]">
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-white to-[#F4EEE8] shadow-xl ring-1 ring-[#E7DFDA]">
            <Image
              src="/brand/braid-loop.png"
              alt="BRAID Logo"
              width={160}
              height={160}
              priority
              className="h-[45%] w-[45%] object-contain drop-shadow-lg"
            />
          </div>

          <div className="animate-float absolute -top-3 left-0 flex items-center gap-1.5 rounded-xl border border-[#E7DFDA] bg-white/95 px-3 py-2 shadow-lg backdrop-blur sm:-left-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F4EEE8] text-[#D9B8AE]">
              <Network size={13} />
            </span>
            <p className="text-xs font-semibold text-[#353535]">Knowledge Graph</p>
          </div>

          <div
            className="animate-float absolute bottom-3 -left-1 flex items-center gap-1.5 rounded-xl border border-[#E7DFDA] bg-white/95 px-3 py-2 shadow-lg backdrop-blur sm:-left-6"
            style={{ animationDelay: "1.2s" }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFEAF3] text-[#B4A7C8]">
              <MessageSquareText size={13} />
            </span>
            <p className="text-xs font-semibold text-[#353535]">AI Copilot</p>
          </div>

          <div
            className="animate-float absolute bottom-3 -right-1 flex items-center gap-1.5 rounded-xl border border-[#E7DFDA] bg-white/95 px-3 py-2 shadow-lg backdrop-blur sm:-right-6"
            style={{ animationDelay: "2.4s" }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F4EEE8] text-[#D9B8AE]">
              <ShieldAlert size={13} />
            </span>
            <p className="text-xs font-semibold text-[#353535]">Risk Detection</p>
          </div>
        </div>
      </div>
    </section>
  );
}