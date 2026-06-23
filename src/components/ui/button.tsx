"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "entry";
  size?: "sm" | "md" | "lg";
  className?: string;
  glow?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  glow = false,
  ...props
}: ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-black tracking-[0.2em] uppercase transition-all duration-300 rounded-tl-3xl rounded-br-3xl rounded-tr-none rounded-bl-none";
  
  const variants = {
    primary: "bg-pubg-yellow text-black hover:bg-orange-accent shadow-lg",
    secondary: "border-[3px] border-pubg-yellow bg-transparent text-pubg-yellow hover:bg-pubg-yellow hover:text-black",
    outline: "border-[3px] border-white/50 text-white hover:border-white hover:bg-white hover:text-black",
    ghost: "text-white hover:text-pubg-yellow bg-transparent",
    entry: "bg-pubg-yellow text-black hover:bg-orange-accent shadow-lg",
  };

  const sizes = {
    sm: "px-6 py-2 text-sm",
    md: "px-10 py-3 text-base",
    lg: "px-12 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        glow && variant === "secondary" ? "box-glow" : "",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
