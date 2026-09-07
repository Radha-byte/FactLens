import { ArrowRight, MessageCircleQuestion } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-white px-6 py-16 sm:px-8 lg:py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#D9B8AE] via-[#DCC0B4] to-[#B4A7C8] px-8 py-12 text-center shadow-xl sm:px-12 lg:py-14">
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full border border-white/30" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full border border-white/20" />

        <h2 className="relative text-3xl font-extrabold tracking-tight text-[#2B2B2B] sm:text-4xl">
          Stop Searching. Start Asking.
        </h2>
        <p className="relative mx-auto mt-3 max-w-lg text-base leading-7 text-[#4A3F3B]">
          Every document your factory already has, finally working together.
        </p>
        <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-[#2B2B2B] px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:scale-[1.03] hover:bg-black"
          >
            Try BRAID
            <ArrowRight size={16} />
          </a>
          <a
            href="/chat"
            className="flex items-center gap-2 rounded-xl border-2 border-[#2B2B2B]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#2B2B2B] backdrop-blur transition duration-300 hover:bg-white"
          >
            <MessageCircleQuestion size={16} />
            Ask a Question Now
          </a>
        </div>
      </div>
    </section>
  );
}