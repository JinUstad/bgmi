"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Trophy, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RULES = [
  "Once a player or team successfully registers and selects a match slot, they can only participate in that selected slot.",
  "Players are not allowed to switch to another slot after registration.",
  "The registration fee is strictly non-refundable under any circumstances.",
  "Once the payment has been successfully completed, no refund requests will be accepted.",
  "Players must join the room before the reporting time.",
  "Late entries may be disqualified.",
  "Any form of cheating, hacking, teaming, exploiting bugs, or using third-party software will result in immediate disqualification.",
  "Players must follow BGMI's official gameplay rules.",
  "Organizers reserve the right to change schedules due to technical or unforeseen issues.",
  "Tournament decisions made by the organizers are final."
];

/**
 * Terms Content — Client Component
 * Contains animated UI for the Terms & Conditions page.
 * Parent page.tsx (Server Component) handles metadata export.
 */
export default function TermsContent() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-black relative">

      {/* Global Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <motion.div animate={{ scale: [1, 1.05, 1], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-[url('/war_game_bg.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black z-10" />
        <motion.div animate={{ x: ["-20vw", "120vw", "-20vw"], y: ["30vh", "70vh", "40vh"], rotate: [10, -15, 20] }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }} className="absolute h-[2px] w-[40vw] bg-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.8)] z-10 top-0 left-0 origin-left" />
        <motion.div animate={{ x: ["120vw", "-20vw", "120vw"], y: ["60vh", "20vh", "50vh"], rotate: [-20, 15, -10] }} transition={{ duration: 13, repeat: Infinity, ease: "linear" }} className="absolute h-[2px] w-[55vw] bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-10 top-0 left-0 origin-left" />
      </div>

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 border-b border-white/10 z-10">
        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tighter text-white mb-4 leading-none">
              TERMS &<br />
              <span className="text-pubg-yellow text-glow">CONDITIONS</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/80 text-lg md:text-xl font-medium max-w-md mx-auto">
              Please read the terms and conditions carefully before participating.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-16">
            <h2 className="text-3xl font-black font-heading uppercase text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
              <AlertTriangle className="text-pubg-yellow w-8 h-8" aria-hidden="true" />
              Tournament <span className="text-pubg-yellow">Rules</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {RULES.map((rule, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Card className="p-6 h-full flex items-start gap-4 hover:border-pubg-yellow/50 transition-colors group bg-black/40 backdrop-blur-md">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-pubg-yellow font-bold group-hover:bg-pubg-yellow/20 group-hover:border-pubg-yellow/50 transition-all" aria-hidden="true">
                      {index + 1}
                    </div>
                    <p className="text-white/80 leading-relaxed text-sm md:text-base">{rule}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
