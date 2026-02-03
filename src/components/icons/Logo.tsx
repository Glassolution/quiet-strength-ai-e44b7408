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
      <img 
        src="/axon.png" 
        alt="Axon Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
