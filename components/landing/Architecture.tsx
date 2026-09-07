import { LayoutPanelLeft, Database, Sparkles } from "lucide-react";

const layers = [
  {
    icon: LayoutPanelLeft,
    label: "Frontend",
    title: "Next.js 16 + TypeScript",
    description: "A real-time dashboard, equipment views, and copilot chat — all built on the App Router.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    tint: "from-[#F4EEE8] to-[#EFE3DD] text-[#C79D92]",
  },
  {
    icon: Database,
    label: "Data Layer",
    title: "Supabase + pgvector",
    description: "Documents, entities, and flags live in Postgres; pgvector powers semantic search over document chunks.",
    tags: ["Postgres", "pgvector", "Supabase"],
    tint: "from-[#EFEAF3] to-[#E4DCEC] text-[#B4A7C8]",
  },
  {
    icon: Sparkles,
    label: "Intelligence",
    title: "Gemini",
    description: "Handles extraction, embeddings, and grounded generation — every answer traces back to real source text.",
    tags: ["Gemini", "Embeddings", "RAG"],
    tint: "from-[#F4EEE8] to-[#EFE3DD] text-[#C79D92]",
  },
];

export default function Architecture() {
  return (
    <section id="architecture" className="scroll-mt-20 bg-[#FAF8F7] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
          <span className="rounded-full bg-[#F4EEE8] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#7A6A66]">
            Under The Hood
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#2B2B2B] sm:text-4xl">
            Built For Real Factory Data, Not A Demo
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-gray-600">
            Three layers working together, from raw document to a cited, trustworthy answer.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {layers.map(({ icon: Icon, label, title, description, tags, tint }, i) => (
            <div
              key={label}
              className="animate-fade-in-up flex h-full flex-col rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D9B8AE]/15"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tint}`}>
                <Icon size={22} />
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-[#7A6A66]">
                {label}
              </p>
              <h3 className="mt-1 text-base font-bold text-[#353535]">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{description}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#F7F5F4] px-2.5 py-1 text-[11px] font-medium text-[#7A6A66]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}