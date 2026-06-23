import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  glowOnHover?: boolean;
}

export function Card({ children, className, glowOnHover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-tl-[48px] rounded-br-[48px] rounded-tr-lg rounded-bl-lg border border-white/10 bg-black/60 backdrop-blur-md p-8 transition-all duration-300",
        glowOnHover && "hover:-translate-y-2 hover:border-pubg-yellow/50 hover:shadow-[0_10px_30px_rgba(242,169,0,0.15)]",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
