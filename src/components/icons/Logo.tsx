import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer circle with gradient */}
        <circle
          cx="24"
          cy="24"
          r="22"
          className="stroke-primary"
          strokeWidth="2"
          fill="none"
        />
        {/* Inner healing symbol - stylized phoenix/rising */}
        <path
          d="M24 12C24 12 18 18 18 24C18 30 24 36 24 36C24 36 30 30 30 24C30 18 24 12 24 12Z"
          className="fill-primary"
          opacity="0.9"
        />
        {/* Light rays */}
        <path
          d="M24 8L24 10M24 38L24 40M8 24L10 24M38 24L40 24M12.5 12.5L14 14M34 34L35.5 35.5M12.5 35.5L14 34M34 14L35.5 12.5"
          className="stroke-primary/60"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
