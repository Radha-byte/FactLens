import { UploadCloud, BrainCircuit, Share2, MessagesSquare } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UploadCloud,
    title: "Upload Knowledge",
    description: "Import maintenance manuals, SOPs, inspection reports and operational documents.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI Processing",
    description: "BRAID extracts entities, relationships and technical knowledge from every document.",
  },
  {
    number: "03",
    icon: Share2,
    title: "Knowledge Graph",
    description: "All information is connected into a searchable industrial knowledge network.",
  },
  {
    number: "04",
    icon: MessagesSquare,
    title: "Ask Anything",
    description: "Engineers receive trustworthy answers with citations through an AI assistant.",
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="scroll-mt-20 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
          <span className="rounded-full bg-[#F4EEE8] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#7A6A66]">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#2B2B2B] sm:text-4xl">
            Simple Workflow, Powerful Intelligence
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-gray-600">
            BRAID transforms scattered industrial documents into an intelligent
            assistant in four simple steps.
          </p>
        </div>

        {/* Desktop / large screens: connector line is a direct sibling of each icon, so it always touches icon edges */}
        <div className="mt-14 hidden lg:flex lg:items-stretch">
          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <div key={number} className="flex-1">
              <div
                className="animate-fade-in-up flex items-center"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                  <span
                    className="absolute -top-3 -right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-[#E7DFDA] bg-white text-[10px] font-bold text-[#B98F82] shadow-sm"
                    aria-hidden="true"
                  >
                    {number}
                  </span>
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9B8AE] to-[#C79D92] text-white shadow-md shadow-[#D9B8AE]/40">
                    <Icon size={22} />
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div
                    className="h-0.5 flex-1 bg-gradient-to-r from-[#D9B8AE] via-[#B4A7C8] to-[#D9B8AE]"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="mt-4 pr-6">
                <h3 className="text-base font-bold text-[#353535]">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-gray-600">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / tablet: stacked, no connector lines */}
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:hidden">
          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <div
              key={number}
              className="animate-fade-in-up text-center"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
                <span
                  className="absolute -top-3 -right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-[#E7DFDA] bg-white text-[10px] font-bold text-[#B98F82] shadow-sm"
                  aria-hidden="true"
                >
                  {number}
                </span>
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9B8AE] to-[#C79D92] text-white shadow-md shadow-[#D9B8AE]/40">
                  <Icon size={22} />
                </div>
              </div>
              <h3 className="mt-4 text-base font-bold text-[#353535]">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-gray-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}