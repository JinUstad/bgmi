"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Trophy } from "lucide-react";
import { Card } from "../ui/card";

const features = [
  {
    icon: ShieldCheck,
    title: "Fair Tournaments",
    description: "Strict anti-cheat measures and active moderation ensure a level playing field for everyone.",
  },
  {
    icon: Zap,
    title: "Fast Results",
    description: "Automated scoring systems declare results within minutes of match completion.",
  },
  {
    icon: Lock,
    title: "Secure Registration.",
    description: "Your data is encrypted. We use industry-standard security for all transactions.",
  },
  {
    icon: Trophy,
    title: "Professional Management",
    description: "Managed by esports veterans. Experience seamless match coordination and support.",
  },
];

export function AboutSection() {
  return (
    <section className="py-24 bg-military-green/10 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff_100%),linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff_100%)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black font-heading uppercase tracking-wider mb-6 text-white"
          >
            Why Choose <span className="text-pubg-yellow text-glow">Us</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg"
          >
            We provide the most authentic, secure, and rewarding BGMI esports experience. From daily scrims to massive prize pool tournaments, we've got it all.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card glowOnHover className="h-full group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gunmetal flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                  <feature.icon className="w-8 h-8 text-pubg-yellow group-hover:text-orange-accent transition-colors" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
