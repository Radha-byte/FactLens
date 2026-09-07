import {
  FileSearch,
  Network,
  MessageSquareText,
  Quote,
  History,
  Mic,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Document Intelligence",
    description: "Upload manuals, SOPs and reports. BRAID understands and indexes every document.",
  },
  {
    icon: Network,
    title: "Knowledge Graph",
    description: "Connect equipment, procedures and experts into one searchable knowledge network.",
  },
  {
    icon: MessageSquareText,
    title: "AI Copilot",
    description: "Ask natural language questions and receive contextual answers with citations.",
  },
  {
    icon: History,
    title: "Institutional Memory",
    description: "Capture decades of engineering experience before valuable knowledge disappears.",
  },
  {
    icon: Mic,
    title: "Knowledge Capture",
    description: "Automatically organize operational knowledge into structured workflows.",
  },
  {
    icon: Quote,
    title: "Risk Detection",
    description: "Identify missing information, conflicting procedures and operational risks.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-[#FAF8F7] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
          <span className="rounded-full bg-[#F4EEE8] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#7A6A66]">
            Platform Capabilities
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#2B2B2B] sm:text-4xl">
            Everything You Need In One Platform
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-gray-600">
            BRAID combines AI, semantic search, knowledge graphs and document
            intelligence into a single industrial knowledge platform.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="animate-fade-in-up group relative overflow-hidden rounded-2xl border border-[#E7DFDA] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D9B8AE]/15"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#D9B8AE] to-[#B4A7C8] transition-transform duration-300 group-hover:scale-x-100" />

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#F4EEE8] to-[#EFE3DD] text-[#C79D92] transition-transform duration-300 group-hover:scale-110">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#353535]">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}