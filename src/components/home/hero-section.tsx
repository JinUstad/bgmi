"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from 'next/link';
import { useTheme } from "@/context/theme-context";

export function HeroSection() {
  const { activeGame } = useTheme();

  // Fallback defaults if no game is active or still loading
  const heading = activeGame?.hero_heading || "India's Biggest \n Esports Tournament";
  const subheading = activeGame?.hero_paragraph || activeGame?.description || activeGame?.hero_subheading || "Join the elite. Fight for glory. Win massive cash prizes in the ultimate battleground experience.";
  const bgImage = activeGame?.hero_background || activeGame?.hero_image_url || "/war_game_bg.png";
  
  let mainHeading = heading;
  let subHeadingGlow = "";
  
  if (heading.includes('\n')) {
    const parts = heading.split('\n');
    mainHeading = parts[0];
    subHeadingGlow = parts.slice(1).join('\n');
  } else {
    // If no explicit newline, highlight the last word for some flair
    const words = heading.split(' ');
    if (words.length > 1) {
       subHeadingGlow = words.pop() || "";
       mainHeading = words.join(' ');
    }
  }

  return (
    <section className="relative min-h-[90svh] lg:min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Dynamic Vignette/Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#0a0a0a] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_100%)] z-10 opacity-80" />
        
        {/* Animated Background Image */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0, -1, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        
        {/* Animated Particles / Ambient Glow */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle_at_center,_var(--theme-primary)_0%,_transparent_70%)] opacity-20 blur-[100px] mix-blend-screen z-10 pointer-events-none"
        />

        {/* Subtle Grid Overlay for tech/esports vibe */}
        <div className="absolute inset-0 z-10 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
      </div>

      {/* Main Content */}
      <div className="container relative z-20 mx-auto px-4 text-center flex flex-col items-center -mt-[15vh]">
        <motion.div
          key={activeGame?.id || 'default'} // Force re-animation on game change
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto flex flex-col items-center w-full"
        >
          {/* Live Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-3 mb-8 px-6 py-2 border border-[var(--theme-primary)]/30 rounded-full bg-black/60 backdrop-blur-md box-glow relative overflow-hidden group cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--theme-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--theme-primary)] shadow-[0_0_10px_var(--theme-primary)]"></span>
            </span>
            <span className="text-[var(--theme-primary)] font-bold tracking-[0.2em] text-xs sm:text-sm uppercase drop-shadow-md">
              {activeGame ? `${activeGame.name} Event Live` : 'Season 5 Registrations Open'}
            </span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="font-heading text-5xl md:text-6xl lg:text-[6rem] leading-[1.05] font-black uppercase tracking-tighter mb-6 whitespace-pre-line drop-shadow-2xl text-balance">
            <span className="text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              {mainHeading}
            </span> 
            {subHeadingGlow && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-accent)] text-glow">
                {heading.includes('\n') ? <br /> : ' '}
                {subHeadingGlow}
              </span>
            )}
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto line-clamp-3 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {subheading}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-4 w-full sm:w-auto">
            <Link href="/registration" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-[260px] h-14 text-lg font-bold tracking-widest uppercase bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-accent)] text-black border-none box-glow hover:box-glow-accent hover:scale-[1.02] transition-all duration-300 skew-x-[-10deg] rounded-sm group relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
                 <span className="skew-x-[10deg] inline-block">{activeGame?.hero_primary_cta || "Enter Tournament"}</span>
              </Button>
            </Link>
            <Link href="/tournaments" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-[260px] h-14 text-lg font-bold tracking-widest uppercase border-2 border-[var(--theme-primary)]/50 text-white bg-black/40 backdrop-blur-sm hover:bg-[var(--theme-primary)]/10 hover:border-[var(--theme-primary)] hover:box-glow transition-all duration-300 skew-x-[-10deg] rounded-sm">
                <span className="skew-x-[10deg] inline-block">{activeGame?.hero_secondary_cta || "View Brackets"}</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer hidden md:flex"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
