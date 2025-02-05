import React from "react";
import Link from "next/link"
interface LeftAuthComponentProps {
  title: string;
  description: string;
}
const LeftAuthComponent: React.FC<LeftAuthComponentProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-start justify-between bg-primary p-4 sm:p-6 md:p-12 lg:p-16 text-primary-foreground">
      <Link href="#" className="inline-flex items-center gap-2" prefetch={false}>
          <BrandIcon className="h-8 w-8" />
        </Link>
      <div className="space-y-2 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="max-w-full md:max-w-[620px] text-base sm:text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LeftAuthComponent;

function BrandIcon({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex items-center justify-center border-2 border-white rounded-[0.2rem] p-2 w-fit">
    {/* Checkmark SVG */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-black"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
    
    {/* Brand Text */}
    <span className="text-2xl font-bold ml-2">Centrix</span>
  </div>
  )
}