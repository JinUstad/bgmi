"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Swords, Target } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  { label: "Players Registered", value: 36, suffix: "+", icon: Users },
  { label: "Prize Distributed", value: 1200, prefix: "₹", icon: Trophy },
  { label: "Matches Hosted", value: 1, suffix: "+", icon: Swords },
  { label: "Active Tournaments", value: 1, icon: Target },
];

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

export function LiveStats() {
  return (
    <section className="py-20 bg-black border-y border-white/5 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative p-6 rounded-tl-[48px] rounded-br-[48px] rounded-tr-lg rounded-bl-lg bg-gunmetal border-2 border-white/5 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-[var(--theme-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <stat.icon className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <stat.icon className="w-8 h-8 text-[var(--theme-primary)] mb-4" />
                <div className="text-4xl font-black font-heading mb-2 text-white">
                  {stat.prefix}
                  <Counter value={stat.value} />
                  <span className="text-[var(--theme-primary)]">{stat.suffix}</span>
                </div>
                <div className="text-sm uppercase tracking-widest text-white/60 font-bold">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
