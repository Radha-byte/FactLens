type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-[#E7DFDA] bg-white shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}