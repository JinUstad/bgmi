"use client";

import { motion } from "framer-motion";
import { UserPlus, Swords, Trophy, DollarSign } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Register", desc: "Create your account and form your squad." },
  { icon: Swords, title: "Join Match", desc: "Get room ID and password 15 mins prior." },
  { icon: Trophy, title: "Play & Win", desc: "Show your skills on the battleground." },
  { icon: DollarSign, title: "Get Paid", desc: "Instant prize transfer to your wallet." },
];

export function TimelineSection() {
  return (
    <section className="py-24 bg-black relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black font-heading uppercase tracking-wider mb-4 text-white"
          >
            How It <span className="text-[var(--theme-primary)] text-glow">Works</span>
          </motion.h2>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gunmetal border-2 border-[var(--theme-primary)] rounded-full flex items-center justify-center mb-6 relative z-10 box-glow">
                  <step.icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--theme-accent)] rounded-full flex items-center justify-center text-xs font-bold text-black">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-2 text-[var(--theme-primary)]">
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
