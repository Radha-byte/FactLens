import Image from "next/image";

const links = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Architecture", href: "#architecture" },
  { label: "Dashboard", href: "/dashboard" },
];

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.02 11.02 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.22.66.8.55A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-[#E7DFDA] bg-[#FAF8F7] px-6 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
        <div className="flex items-center gap-2.5">
          <Image src="/brand/braid-loop.png" alt="BRAID logo" width={30} height={30} />
          <div>
            <p className="text-sm font-bold tracking-wide text-[#353535]">BRAID</p>
            <p className="text-[11px] text-gray-500">Documents that finally talk to each other.</p>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-1.5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-gray-600 transition hover:text-[#353535]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#"
            aria-label="GitHub"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E7DFDA] bg-white text-[#7A6A66] transition hover:border-[#D9B8AE] hover:text-[#353535]"
          >
            <GithubIcon />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E7DFDA] bg-white text-[#7A6A66] transition hover:border-[#D9B8AE] hover:text-[#353535]"
          >
            <LinkedinIcon />
          </a>
          <span className="ml-1 rounded-full border border-[#E7DFDA] bg-white px-3 py-1.5 text-[11px] font-medium text-[#7A6A66]">
            ET AI Hackathon 2026 · Problem 8
          </span>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] text-gray-400">
        © 2026 BRAID. Built by Team Syntactic Sugar for the ET AI Hackathon.
      </p>
    </footer>
  );
}