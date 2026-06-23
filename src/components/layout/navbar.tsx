"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudioToggle } from "../ui/audio-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] z-50 transition-all duration-300",
        isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Crosshair className="h-8 w-8 text-pubg-yellow transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
            <span className="font-heading text-2xl font-black uppercase tracking-wider text-white">
              BGMI<span className="text-pubg-yellow text-glow">ESPORTS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-bold uppercase tracking-widest transition-colors hover:text-pubg-yellow",
                    isActive ? "text-pubg-yellow" : "text-white/80"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-pubg-yellow box-glow"
                    />
                  )}
                </Link>
              );
            })}
            <AudioToggle />
            <Link
              href="/contact"
              className="px-6 py-2 bg-pubg-yellow text-black font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-orange-accent transition-colors box-glow"
            >
              Register Now
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <AudioToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-pubg-yellow transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-gunmetal border-b border-white/10 p-4 md:hidden flex flex-col gap-4 shadow-2xl"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block p-4 text-center font-bold uppercase tracking-widest transition-colors border border-white/5",
                pathname === link.href ? "bg-pubg-yellow/10 text-pubg-yellow border-pubg-yellow/30" : "text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full p-4 text-center bg-pubg-yellow text-black font-bold uppercase tracking-widest rounded-sm"
          >
            Register Now
          </Link>
        </motion.div>
      )}
    </header>
  );
}
