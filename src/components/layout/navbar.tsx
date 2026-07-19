"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudioToggle } from "../ui/audio-toggle";
import { supabase } from "@/lib/supabase";
import { LogOut, User } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Platform" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/blogs", label: "Blogs" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [liveStreamSettings, setLiveStreamSettings] = useState({ url: '', enabled: false });
  const [user, setUser] = useState<any>(null);
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

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    fetchLiveStream();
    fetchUser();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/user-dashboard`,
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
              XYLO<span className="text-pubg-yellow text-glow">ESPORTS</span>
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
              className="px-6 py-2 bg-pubg-yellow text-black font-black uppercase tracking-widest text-sm rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none hover:bg-orange-accent transition-all shadow-lg box-glow"
            >
              Registration Now
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/group"
                  className="text-sm font-bold uppercase tracking-widest text-pubg-yellow hover:text-white transition-colors"
                >
                  Tournament Group
                </Link>
                <Link href="/user-dashboard" className="flex items-center gap-2">
                  <img
                    src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=User"}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-pubg-yellow hover:border-white transition-colors"
                    title="My Dashboard"
                  />
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 border border-red-500/50 text-red-400 font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="px-6 py-2 border border-white/20 text-white font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white/10 transition-colors"
              >
                Login
              </button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <AudioToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
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
            className="block w-full p-4 text-center bg-pubg-yellow text-black font-black uppercase tracking-widest rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none shadow-lg box-glow"
          >
            Registration Now
          </Link>

          {user ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <Link href="/group" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 p-4 text-pubg-yellow hover:bg-white/5 transition-colors border border-white/5 font-bold uppercase tracking-widest">
                Tournament Group
              </Link>
              <Link href="/user-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 text-white hover:bg-white/5 transition-colors border border-white/5">
                 <img
                  src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=User"}
                  alt="User"
                  className="w-8 h-8 rounded-full border border-pubg-yellow"
                />
                <span className="font-bold uppercase tracking-widest">My Dashboard</span>
              </Link>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 p-4 text-center font-bold uppercase tracking-widest transition-colors border border-red-500/30 text-red-400 hover:bg-red-500/10">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => { handleGoogleLogin(); setIsMobileMenuOpen(false); }}
              className="block w-full p-4 text-center border border-white/20 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors"
            >
              Login with Google
            </button>
          )}
        </motion.div>
      )}
    </header>
  );
}
