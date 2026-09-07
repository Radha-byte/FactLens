import Image from "next/image";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Architecture", href: "#architecture" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#E7DFDA] bg-white/85 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-8">
        <a href="/" className="flex items-center gap-3.5">
          <Image src="/brand/braid-loop.png" alt="BRAID" width={52} height={52} className="h-[52px] w-[52px]" />
          <div>
            <h1 className="text-xl font-extrabold leading-none tracking-wide text-[#353535]">
              BRAID
            </h1>
            <p className="mt-1.5 italic text-[13px] leading-none text-gray-500">
              -"Documents that finally talk to each other".
            </p>
          </div>
        </a>

        <nav className="hidden gap-7 text-sm font-medium text-gray-700 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[#353535]">
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="/dashboard"
          className="rounded-lg bg-[#D9B8AE] px-4 py-2 text-sm font-semibold text-[#2B2B2B] transition hover:bg-[#C79D92] hover:text-white"
        >
          Get Started
        </a>
      </div>
    </header>
  );
}