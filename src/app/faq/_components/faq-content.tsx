"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
}

interface FAQContentProps {
  faqs: FaqItem[];
}

/**
 * FAQ Content — Client Component
 * Interactive accordion UI. FAQs data and JSON-LD are handled by parent page.tsx.
 */
export default function FAQContent({ faqs }: FAQContentProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col w-full min-h-screen bg-black relative">

      {/* Global Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('/faq_bg.png')] bg-cover bg-center mix-blend-overlay"
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pubg-yellow/30 rounded-full"
            animate={{
              y: ["-10vh", "110vh"],
              x: [Math.random() * 100 + "vw", Math.random() * 100 + "vw"],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
        <motion.div
          animate={{
            x: ["-10vw", "110vw", "-10vw"],
            y: ["20vh", "80vh", "30vh"],
            rotate: [5, -10, 15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[35vw] bg-pubg-yellow/60 shadow-[0_0_15px_rgba(240,165,0,0.8)] z-10 top-0 left-0 origin-left"
        />
        <motion.div
          animate={{
            x: ["110vw", "-10vw", "110vw"],
            y: ["70vh", "10vh", "60vh"],
            rotate: [-15, 10, -5],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[50vw] bg-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.8)] z-10 top-0 left-0 origin-left"
        />
      </div>

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 border-b border-white/10 z-10">
        <div className="container relative mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black font-heading uppercase tracking-tighter text-white mb-2 text-glow"
          >
            FAQ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-black font-heading uppercase tracking-tighter text-pubg-yellow mb-6"
          >
            Frequently Asked Questions
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Find answers to common questions about our BGMI Tournament.
          </motion.p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4" role="list" aria-label="Frequently asked questions">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `faq-panel-${index}`;
              const btnId = `faq-btn-${index}`;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "border border-white/10 rounded-lg overflow-hidden transition-all duration-300",
                    isOpen ? "bg-white/5 border-pubg-yellow/50 shadow-[0_0_15px_rgba(240,165,0,0.2)]" : "bg-black/40 hover:bg-white/5 backdrop-blur-sm"
                  )}
                  role="listitem"
                >
                  <button
                    id={btnId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pubg-yellow"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className={cn(
                      "font-bold uppercase tracking-widest transition-colors",
                      isOpen ? "text-pubg-yellow" : "text-white/90"
                    )}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "flex-shrink-0 ml-4",
                        isOpen ? "text-pubg-yellow" : "text-white/50"
                      )}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/5 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-6 md:p-8 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm hover:bg-white/5 transition-colors flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl border border-pubg-yellow/50 bg-pubg-yellow/10 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pubg-yellow" aria-hidden="true">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Still have questions?</h3>
                <p className="text-white/60">Contact our support team, we&apos;re here to help you!</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="px-8 py-3 bg-pubg-yellow text-black font-bold rounded hover:bg-pubg-yellow/90 transition-colors whitespace-nowrap flex items-center gap-2"
              aria-label="Contact XYLO Esports support team"
            >
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
