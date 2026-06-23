"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-military-gradient pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center" />
        {/* Animated Particles / Smoke */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pubg-yellow/10 via-transparent to-transparent z-10"
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
            <Button size="lg" glow className="w-full sm:w-auto text-lg">
              Register Now
            </Button>
            <Button variant="outline" size="lg" glow className="w-full sm:w-auto text-lg">
              Explore Tournaments
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-[30px] h-[50px] border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-pubg-yellow rounded-full box-glow"
          />
        </div>
      </motion.div>
    </section>
  );
}
