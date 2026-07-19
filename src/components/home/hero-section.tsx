"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";

import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-military-gradient ">
      {/* Background Effects***************************** */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        
        {/* Animated War Background */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], x: [0, -10, 0], y: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('/war_game_bg.png')] bg-cover bg-center" 
        />
        
        {/* Animated Particles / Smoke */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pubg-yellow/20 via-transparent to-transparent z-10"
        />

        {/* Sniper Laser Sights */}
        <motion.div
          animate={{
            x: ["-20vw", "120vw", "-20vw"],
            y: ["20vh", "80vh", "30vh"],
            rotate: [15, -10, 25],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[50vw] bg-red-500/60 shadow-[0_0_15px_red] z-10 top-0 left-0 origin-left pointer-events-none"
        />
        <motion.div
          animate={{
            x: ["120vw", "-20vw", "120vw"],
            y: ["70vh", "10vh", "60vh"],
            rotate: [-15, 20, -5],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[60vw] bg-red-500/50 shadow-[0_0_15px_red] z-10 top-0 left-0 origin-left pointer-events-none"
        />

        {/* Screen Shake / Impact effect occasionally */}
        <motion.div
          animate={{
            opacity: [0, 0, 0.1, 0, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-red-500 z-10 mix-blend-overlay pointer-events-none"
        />
      </div>

      <div className="container relative z-20 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1 border border-pubg-yellow/50 rounded-full bg-black/50 backdrop-blur-sm"
          >
            <span className="text-pubg-yellow font-bold tracking-widest text-sm uppercase">Season 5 Registrations Open</span>
          </motion.div>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6">
            India's Biggest <br />
            <span className="text-pubg-yellow text-glow">
              BGMI Tournament
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join the elite. Fight for glory. Win massive cash prizes in the ultimate battleground experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/registration" className="w-full sm:w-auto">
              <Button size="lg" glow className="w-full text-lg">
                Register Now
              </Button>
            </Link>
            <Link href="/tournaments" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" glow className="w-full text-lg">
                Explore Tournaments
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>


    </section>
  );
}
