"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Trophy } from "lucide-react";
import { Card } from "../ui/card";
import { useTheme } from "@/context/theme-context";
import Lottie from "lottie-react";
import animationData from "../../../public/war_lottie.json";

const defaultFeatures = [
  {
    title: "Fair Tournaments",
    description: "Strict anti-cheat measures and active moderation ensure a level playing field for everyone.",
  },
  {
    title: "Fast Results",
    description: "Automated scoring systems declare results within minutes of match completion.",
  },
  {
    title: "Secure Registration",
    description: "Your data is encrypted. We use industry-standard security for all transactions.",
  },
  {
    title: "Professional Management",
    description: "Managed by esports veterans. Experience seamless match coordination and support.",
  },
];

const icons = [ShieldCheck, Zap, Lock, Trophy];

export function AboutSection() {
  const { activeGame } = useTheme();

  const heading = activeGame?.why_choose_us_heading || "Why Choose Us";
  const description = activeGame?.why_choose_us_description || "We provide the most authentic, secure, and rewarding Xyloesports experience. From daily scrims to massive prize pool tournaments, we've got it all.";
  const features = (activeGame?.why_choose_us_features?.length > 0) ? activeGame.why_choose_us_features : defaultFeatures;
  const bgImage = activeGame?.why_choose_us_background || "/about_bg.png";

  const headingParts = heading.split(' ');
  const lastWord = headingParts.pop();
  const firstParts = headingParts.join(' ');

  return (
    <section className="py-24 relative overflow-hidden bg-black">
      {/* Animated War Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/70 z-10" />
        
        <motion.div 
          animate={{ scale: [1, 1.05, 1], x: [0, -10, 0], y: [0, 5, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60 transition-all duration-1000" 
          style={{ backgroundImage: `url('${bgImage}')` }}
        />

        {/* Lottie Animation Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-30 mix-blend-screen">
          <Lottie 
            animationData={animationData} 
            loop={true} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* Screen Shake / Impact effect occasionally */}
        <motion.div
          animate={{
            opacity: [0, 0, 0.15, 0, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-10 mix-blend-overlay"
          style={{ backgroundColor: 'var(--theme-accent)' }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black font-heading uppercase tracking-wider mb-6 text-white"
          >
            {firstParts} <span className="text-[var(--theme-primary)] text-glow">{lastWord}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg"
          >
            {description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature: any, index: number) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card glowOnHover className="h-full group flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gunmetal flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                    <Icon className="w-8 h-8 text-[var(--theme-primary)] group-hover:text-[var(--theme-accent)] transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-3 text-white">
                    {feature.title || feature.name}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
