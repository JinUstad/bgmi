"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudioToggle } from "../ui/audio-toggle";
import { supabase } from "@/lib/supabase";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/results", label: "Results" },
  { href: "/blogs", label: "Blogs" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [liveStreamSettings, setLiveStreamSettings] = useState({ url: '', enabled: false });
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchLiveStream = async () => {
      try {
        const { data, error } = await supabase.from('settings').select('live_stream_url, is_live_stream_enabled').eq('id', 1).single();
        if (!error && data) {
          setLiveStreamSettings({ url: data.live_stream_url || '', enabled: data.is_live_stream_enabled || false });
        }
      } catch (err) {
        console.error("Failed to fetch live stream setting", err);
      }
    };

    fetchLiveStream();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (pathname?.startsWith('/user-dashboard')) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] z-50 transition-all duration-300",
        isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Crosshair className="h-8 w-8 text-[var(--theme-primary)] transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
            <span className="font-heading text-2xl font-black uppercase tracking-wider text-white">
              XYLO<span className="text-[var(--theme-primary)] text-glow">ESPORTS</span>
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
                    "relative text-sm font-bold uppercase tracking-widest transition-colors hover:text-[var(--theme-primary)]",
                    isActive ? "text-[var(--theme-primary)]" : "text-white/80"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[var(--theme-primary)] box-glow"
                    />
                  )}
                </Link>
              );
            })}
            <AudioToggle />
            {liveStreamSettings.enabled && (
              <Link
                href={liveStreamSettings.url || '#'}
                target={liveStreamSettings.url ? "_blank" : "_self"}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors text-white/80 hover:text-red-500"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_red]"></span>
                </span>
                Live Stream
              </Link>
            )}
            <Link
              href="/registration"
              className="px-6 py-2 bg-[var(--theme-primary)] text-black font-black uppercase tracking-widest text-sm rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none hover:brightness-110 transition-all shadow-lg box-glow"
            >
              Register Now
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <AudioToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              className="text-white hover:text-[var(--theme-primary)] transition-colors"
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
                pathname === link.href ? "bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] border-[var(--theme-primary)]/30" : "text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
          {liveStreamSettings.enabled && (
            <Link
              href={liveStreamSettings.url || '#'}
              target={liveStreamSettings.url ? "_blank" : "_self"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-4 text-center font-bold uppercase tracking-widest transition-colors border border-white/5 text-white hover:bg-white/5"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_red]"></span>
              </span>
              Live Stream
            </Link>
          )}
          <Link
            href="/registration"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full p-4 text-center bg-[var(--theme-primary)] text-black font-black uppercase tracking-widest rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none shadow-lg box-glow hover:brightness-110 transition-all"
          >
            Register Now
          </Link>
        </motion.div>
      )}
    </header>
  );
}
