type Props = {
  title: string;
  subtitle: string;
};

export default function SectionHeading({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl text-center">

      <h2 className="text-5xl font-bold text-[#353535]">

        {title}

      </h2>

      <p className="mt-6 text-lg leading-8 text-gray-600">

        {subtitle}

      </p>

    </div>
  );
}