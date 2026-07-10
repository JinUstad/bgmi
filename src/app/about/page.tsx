"use client";

import { motion } from "framer-motion";
import { Target, Users, Trophy, ShieldCheck, Zap, Crosshair } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Trophy,
    title: "Massive Prize Pools",
    desc: "Compete for significant cash prizes in our daily, weekly, and monthly mega tournaments."
  },
  {
    icon: ShieldCheck,
    title: "Fair Play Guaranteed",
    desc: "Strict anti-cheat monitoring ensures a completely level playing field for all participants."
  },
  {
    icon: Zap,
    title: "Instant Payouts",
    desc: "Winners receive their prize money transferred directly to their UPI or bank accounts within 24 hours."
  },
  {
    icon: Users,
    title: "Vibrant Community",
    desc: "Join thousands of active BGMI players. Find squads, share strategies, and grow your network."
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-black relative">

      {/* Global Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('/about_bg.png')] bg-cover bg-center mix-blend-overlay"
        />
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 z-10" />

        {/* Laser Sights */}
        <motion.div
          animate={{
            x: ["-20vw", "120vw", "-20vw"],
            y: ["60vh", "30vh", "70vh"],
            rotate: [15, -10, 20],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[40vw] bg-pubg-yellow/50 shadow-[0_0_15px_rgba(240,165,0,0.8)] z-10 top-0 left-0 origin-left"
        />
      </div>

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 border-b border-white/10 z-10">
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto bg-pubg-yellow/10 rounded-2xl flex items-center justify-center mb-6 border border-pubg-yellow/30 shadow-[0_0_25px_rgba(240,165,0,0.2)] rotate-45"
          >
            <Crosshair className="w-10 h-10 text-pubg-yellow -rotate-45" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tighter text-white mb-6 text-glow"
          >
            About  The <span className="text-pubg-yellow">Platform</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto tracking-wide font-medium leading-relaxed"
          >
            We are India's premier Battlegrounds Mobile India (BGMI) esports platform, dedicated to providing a professional, competitive, and rewarding ecosystem for gamers of all skill levels.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 relative z-20 bg-black/40 border-b border-white/5">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black font-heading uppercase text-white mb-6 flex items-center gap-3">
                <Target className="text-pubg-yellow w-8 h-8" />
                Our <span className="text-pubg-yellow">Mission</span>
              </h2>
              <p className="text-white/70 leading-relaxed text-lg mb-6">
                To bridge the gap between casual gaming and professional esports by offering accessible, high-quality, and high-stakes tournaments. We believe every player deserves a stage to showcase their tactical brilliance and reflexes.
              </p>
              <p className="text-white/70 leading-relaxed text-lg">
                We're building a foundation where undiscovered talent can rise, earn recognition, and transition into professional gaming careers through our highly competitive leagues.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-pubg-yellow/20 blur-[100px] rounded-full pointer-events-none" />
              <img
                src="/army_character.png"
                alt="BGMI Character"
                className="w-full max-w-md mx-auto drop-shadow-[0_0_30px_rgba(240,165,0,0.3)] relative z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 relative z-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black font-heading uppercase text-white mb-4">
              Why <span className="text-pubg-yellow">Choose Us?</span>
            </h2>
            <div className="w-24 h-1 bg-pubg-yellow mx-auto rounded-full box-glow" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-8 h-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-pubg-yellow/50 transition-all group hover:-translate-y-2">
                    <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-pubg-yellow/20 group-hover:border-pubg-yellow/50 transition-all">
                      <Icon className="w-7 h-7 text-white group-hover:text-pubg-yellow transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-4 group-hover:text-pubg-yellow transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed text-sm">
                      {feature.desc}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-20 border-t border-white/10 bg-gradient-to-b from-transparent to-pubg-yellow/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-black font-heading uppercase tracking-tighter text-white mb-6">
              Ready to <span className="text-pubg-yellow text-glow">Dominate?</span>
            </h2>
            <p className="text-white/70 text-lg mb-10">
              The battleground is calling. Assemble your squad, register for the next tournament, and prove that you are the ultimate survivor.
            </p>
            <Link href="/tournaments">
              <Button size="lg" glow className="text-lg px-12 py-8 rounded-tl-3xl rounded-br-3xl rounded-tr-none rounded-bl-none">
                View Upcoming Tournaments
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
