type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-8 py-4 font-semibold transition-all duration-300";

  const styles = {
    primary:
      "bg-[#D9B8AE] text-white shadow-lg hover:bg-[#C79D92] hover:scale-105",

    secondary:
      "border border-[#D9B8AE] bg-white text-[#353535] hover:bg-[#F4EEE8]",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}