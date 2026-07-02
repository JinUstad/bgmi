"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";

const categories = [
  {
    title: "Solo",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
    entryFee: "₹0",
    prizePool: "₹0",
    timing: "null",
    disabled: true,
  },
  {
    title: "Duo",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=2070",
    entryFee: "0",
    prizePool: "0",
    timing: "null",
    disabled: true,
  },
  {
    title: "TDM Squad ",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071",
    entryFee: "₹220",
    prizePool: "1st: ₹800 | 2nd: ₹500",
    timing: "Monthly Mega",
    disabled: false,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-24 relative overflow-hidden">

      {/* Animated War Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/80 z-10" />

        <motion.div
          animate={{ scale: [1, 1.05, 1], x: [0, -10, 0], y: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('/categories_bg.png')] bg-cover bg-center mix-blend-overlay opacity-60"
        />

        {/* Sniper Laser Sights */}
        <motion.div
          animate={{
            x: ["-20vw", "120vw", "-20vw"],
            y: ["20%", "80%", "30%"],
            rotate: [5, -10, 15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[50vw] bg-red-500/60 shadow-[0_0_15px_red] z-10 top-0 left-0 origin-left"
        />
        <motion.div
          animate={{
            x: ["120vw", "-20vw", "120vw"],
            y: ["70%", "10%", "50%"],
            rotate: [-15, 10, -5],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[60vw] bg-red-500/50 shadow-[0_0_15px_red] z-10 top-0 left-0 origin-left"
        />

        {/* Screen Shake / Impact effect occasionally */}
        <motion.div
          animate={{
            opacity: [0, 0, 0.1, 0, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-red-600 z-10 mix-blend-overlay"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black font-heading uppercase tracking-wider mb-4 text-white"
          >
            Tournament <span className="text-pubg-yellow text-glow">Categories</span>
          </motion.h2>
          <p className="text-white/60">Choose your battle format and conquer the lobby.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={!cat.disabled ? { y: -10 } : {}}
              className={`relative rounded-tl-[48px] rounded-br-[48px] rounded-tr-lg rounded-bl-lg overflow-hidden border border-white/10 bg-black ${cat.disabled ? 'opacity-60 cursor-not-allowed grayscale' : 'group cursor-pointer'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
              <img
                src={cat.image}
                alt={cat.title}
                className={`w-full h-[400px] object-cover opacity-60 ${!cat.disabled ? 'group-hover:opacity-100 group-hover:scale-110' : ''} transition-all duration-700`}
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                <h3 className={`text-3xl font-black uppercase tracking-widest text-white mb-4 drop-shadow-lg ${!cat.disabled ? 'group-hover:text-pubg-yellow' : ''} transition-colors`}>
                  {cat.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/60 uppercase text-sm font-bold">Entry Fee</span>
                    <span className="text-white font-bold">{cat.entryFee}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/60 uppercase text-sm font-bold">Prize Pool</span>
                    <span className="text-pubg-yellow font-bold text-glow">{cat.prizePool}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 uppercase text-sm font-bold">Timing</span>
                    <span className="text-white font-bold">{cat.timing}</span>
                  </div>
                </div>

                <Button
                  disabled={cat.disabled}
                  className={`w-full ${cat.disabled ? 'bg-white/10 text-white/50 opacity-100 cursor-not-allowed hover:bg-white/10' : 'opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0'} transition-all duration-300`}
                >
                  {cat.disabled ? 'Unavailable' : `Join ${cat.title}`}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
