type BadgeProps = {
  children: React.ReactNode;
};

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-[#E7DFDA] bg-white px-4 py-2 text-sm font-semibold text-[#7A6A66] shadow-sm">
      {children}
    </span>
  );
}