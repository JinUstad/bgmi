"use client";

import { motion } from "framer-motion";

export function GameExpoSection() {
  return (
    <section className="relative w-full py-24 bg-black overflow-hidden border-t border-white/5">
      {/* Background with glowing effect */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center opacity-10 mix-blend-overlay" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-pubg-yellow/10 blur-[150px] z-0" />
      
      <div className="container relative z-10 mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Character Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex justify-center lg:justify-start"
        >
          <img 
            src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1000" 
            alt="Game Character" 
            className="max-h-[600px] object-contain drop-shadow-[0_0_50px_rgba(242,169,0,0.3)] hover:scale-105 transition-transform duration-700"
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
            GAME EXPO: <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">WHERE DIGITAL</span> <br/>
            WORLDS MEET REAL <br/>
            <span className="text-pubg-yellow text-glow">INNOVATION</span>
          </h2>
          <div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-pubg-yellow text-black font-black tracking-[0.2em] uppercase px-10 py-5 rounded-tl-3xl rounded-br-3xl rounded-tr-none rounded-bl-none hover:bg-orange-accent transition-all duration-300 shadow-[0_0_20px_rgba(242,169,0,0.4)]"
            >
              VIEW SCHEDULE
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
