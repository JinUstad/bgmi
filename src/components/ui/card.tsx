import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glowOnHover?: boolean;
}

export function Card({ children, className, glowOnHover = false }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-white/10 bg-black/60 backdrop-blur-md p-6 transition-all duration-300",
        glowOnHover && "hover:border-pubg-yellow/50 hover:shadow-[0_0_20px_rgba(242,169,0,0.15)]",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
