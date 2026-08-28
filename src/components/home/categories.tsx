"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import { useTheme } from "@/context/theme-context";

// Default fallback images in case no image is provided
const cardImages = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
  "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=2070",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071"
];

export function CategoriesSection() {
  const { activeGame, settings } = useTheme();

  // If the admin has toggled off the categories section for this game, don't render it
  if (activeGame && activeGame.show_tournament_categories === false) {
    return null;
  }

  // Parse categories from game data
  let categories = [];
  if (activeGame?.tournament_category_cards) {
    categories = typeof activeGame.tournament_category_cards === 'string' 
      ? JSON.parse(activeGame.tournament_category_cards) 
      : activeGame.tournament_category_cards;
  }

  // Fallback to defaults if no categories are configured yet
  if (!Array.isArray(categories) || categories.length === 0) {
    categories = [
      { title: "Solo / 1v1", image: cardImages[0], entryFee: "₹50", prizePool: "₹250", timing: "Daily", disabled: false },
      { title: "Duo / Tag Team", image: cardImages[1], entryFee: "₹100", prizePool: "₹500", timing: "Weekly", disabled: true },
      { title: "Squad / Pro", image: cardImages[2], entryFee: "₹200", prizePool: "₹1200", timing: "Weekend", disabled: false },
    ];
  }

  // Ensure we only ever show exactly 3 cards maximum, just in case
  categories = categories.slice(0, 3);
  const bgImageUrl = settings?.tournament_categories_bg_url || '/categories_bg.png';

  return (
    <section className="py-24 relative overflow-hidden">

      {/* Animated War Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/80 z-10" />

        <motion.div
          animate={{ scale: [1, 1.05, 1], x: [0, -10, 0], y: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60"
          style={{ backgroundImage: `url('${bgImageUrl}')` }}
        />

        {/* Sniper Laser Sights */}
        <motion.div
          animate={{
            x: ["-20vw", "120vw", "-20vw"],
            y: ["20%", "80%", "30%"],
            rotate: [5, -10, 15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[50vw] z-10 top-0 left-0 origin-left"
          style={{ backgroundColor: 'color-mix(in srgb, var(--theme-accent) 60%, transparent)', boxShadow: '0 0 15px var(--theme-accent)' }}
        />
        <motion.div
          animate={{
            x: ["120vw", "-20vw", "120vw"],
            y: ["70%", "10%", "50%"],
            rotate: [-15, 10, -5],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[60vw] z-10 top-0 left-0 origin-left"
          style={{ backgroundColor: 'color-mix(in srgb, var(--theme-accent) 50%, transparent)', boxShadow: '0 0 15px var(--theme-accent)' }}
        />

        {/* Screen Shake / Impact effect occasionally */}
        <motion.div
          animate={{
            opacity: [0, 0, 0.1, 0, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-10 mix-blend-overlay"
          style={{ backgroundColor: 'var(--theme-accent)' }}
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
            Tournament <span className="text-[var(--theme-primary)] text-glow">Categories</span>
          </motion.h2>
          <p className="text-white/60">Choose your battle format and conquer the lobby.</p>
        </div>

        {/* Changed back to grid-cols-3 for 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={!cat.disabled ? { y: -10 } : {}}
              className={`relative rounded-tl-[40px] rounded-br-[40px] rounded-tr-lg rounded-bl-lg overflow-hidden border border-white/10 bg-black ${cat.disabled ? 'opacity-60 cursor-not-allowed grayscale' : 'group cursor-pointer'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
              <Image
                src={cat.image || cardImages[index] || cardImages[0]}
                alt={cat.title || 'Category'}
                width={800}
                height={400}
                className={`w-full h-[380px] object-cover opacity-60 ${!cat.disabled ? 'group-hover:opacity-100 group-hover:scale-110' : ''} transition-all duration-700`}
              />
              <div className="absolute inset-0 z-20 p-5 flex flex-col justify-end">
                <h3 className={`text-2xl font-black uppercase tracking-widest text-white mb-4 drop-shadow-lg ${!cat.disabled ? 'group-hover:text-[var(--theme-primary)]' : ''} transition-colors`}>
                  {cat.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/60 uppercase text-xs font-bold tracking-wider">Entry Fee</span>
                    <span className="text-white font-bold">{cat.entryFee}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/60 uppercase text-xs font-bold tracking-wider">Prize Pool</span>
                    <span className="text-[var(--theme-primary)] font-bold text-glow">{cat.prizePool}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 uppercase text-xs font-bold tracking-wider">Timing</span>
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
