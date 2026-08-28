"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/theme-context";

export function GameExpoSection() {
  const { activeGame, activeCategory } = useTheme();
  
  const heading = activeGame?.about_heading || activeGame?.name || 'GAME EXPO';
  const subheading = activeGame?.about_subheading || activeGame?.tagline || 'WHERE DIGITAL WORLDS MEET REAL INNOVATION';
  const categoryName = activeCategory?.name || 'INNOVATION';
  const cta = activeGame?.about_cta || "VIEW SCHEDULE";
  const paragraph = activeGame?.about_paragraph || "";
  const sideImage = activeGame?.why_choose_us_side_image || "/army_character.png";

  return (
    <section className="relative w-full py-24 bg-black overflow-hidden border-t border-white/5">
      {/* Background with glowing effect */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center opacity-10 mix-blend-overlay" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-[var(--theme-primary)]/10 blur-[150px] z-0" />
      
      <div className="container relative z-10 mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Character Image and Gun Animations */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex justify-center lg:justify-start relative"
        >
          {/* Animated Bullets (Gun Shots) */}
          <motion.div
            animate={{
              x: [0, 600],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
            className="absolute h-[3px] w-24 shadow-[0_0_20px_yellow] z-20 top-1/2 left-1/2 rounded-full"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          />
          <motion.div
            animate={{
              x: [0, 800],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear", repeatDelay: 1.8 }}
            className="absolute h-[2px] w-32 shadow-[0_0_15px_orange] z-20 top-[40%] left-[45%] rounded-full"
            style={{ backgroundColor: 'var(--theme-accent)' }}
          />
          
          <Image 
            src={sideImage} 
            alt="Character" 
            width={600}
            height={600}
            className="max-h-[600px] w-auto object-contain drop-shadow-[0_0_50px_rgba(242,169,0,0.3)] hover:scale-105 transition-transform duration-700 mix-blend-screen relative z-10"
          />
        </motion.div>

        {/* Right Side: Text & Button */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 space-y-8 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading uppercase tracking-tighter text-white leading-[1.1]">
            {heading}: <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{subheading}</span> <br/>
            <span className="text-[var(--theme-primary)] text-glow">{categoryName}</span>
          </h2>
          {paragraph && (
            <p className="text-lg text-white/70 max-w-lg">
              {paragraph}
            </p>
          )}
          <div>
            <Link href="/tournaments">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[var(--theme-primary)] text-black font-black tracking-[0.2em] uppercase px-10 py-5 rounded-tl-3xl rounded-br-3xl rounded-tr-none rounded-bl-none hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(242,169,0,0.4)]"
              >
                {cta}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
