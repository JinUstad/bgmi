"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
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
  const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-300 rounded-sm";
  
  const variants = {
    primary: "bg-pubg-yellow text-black hover:bg-orange-accent",
    secondary: "bg-military-green text-white hover:bg-opacity-80",
    outline: "border-2 border-pubg-yellow text-pubg-yellow hover:bg-pubg-yellow hover:text-black",
    ghost: "text-white hover:text-pubg-yellow bg-transparent",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        glow && variant === "primary" ? "box-glow" : "",
        glow && variant === "outline" ? "box-glow-orange" : "",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {/* Optional: Add a subtle overlay or glitch effect pseudo-element here later */}
    </motion.button>
  );
}
