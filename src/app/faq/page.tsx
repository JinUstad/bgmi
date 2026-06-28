"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "How do I register?",
    answer: "You can register by navigating to our Contact/Registration page. Fill out the required details including your Full Name, BGMI ID, Mobile Number, and preferred Time Slot. Don't forget to accept the Terms and Conditions before submitting."
  },
  {
    question: "How will I receive my Room ID and Password?",
    answer: "Room ID and Password will be shared via WhatsApp and our official Discord server 15 minutes before the match start time. Make sure you have provided a valid WhatsApp number."
  },
  {
    question: "What are the tournament rules?",
    answer: "Players must play in their selected slots. Cheating, teaming up, or using third-party software is strictly prohibited and will lead to instant disqualification. Please read our Terms & Conditions for detailed rules."
  },
  {
    question: "When will the match start?",
    answer: "Matches start precisely according to the time slot you have selected during registration. Please join the room at least 10 minutes prior to the start time."
  },
  {
    question: "How is the winner selected?",
    answer: "Winners are selected based on their total points, which is a combination of placement points and kill points according to the official BGMI competitive point system."
  },
  {
    question: "What happens if a player disconnects?",
    answer: "If a player disconnects due to their personal network issues, the match will continue. We highly recommend playing on a stable internet connection. No rematches will be held for individual disconnects."
  },
  {
    question: "How do I claim my prize?",
    answer: "Prize money will be transferred via UPI, Google Pay, or Paytm within 24 hours of the tournament's completion. Winners will be contacted by our support team for their payment details."
  },
  {
    question: "Can I change my selected slot after registration?",
    answer: "No, once a slot is selected and registration is complete, you cannot change your slot. Please double-check your availability before registering."
  },
  {
    question: "Is the registration fee refundable?",
    answer: "The registration fee is strictly non-refundable under any circumstances. Once the payment has been successfully completed, no refund requests will be accepted."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach out to our support team 24/7 via WhatsApp, Email (support@bgmiesports.in), or by joining our official Discord server."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col w-full min-h-screen bg-black relative">
      
      {/* Global Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('/faq_bg.png')] bg-cover bg-center mix-blend-overlay" 
        />
        {/* Floating particles */}
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

        {/* Laser Sights (FAQ Theme - Yellow & Green) */}
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
            className="text-4xl md:text-6xl font-black font-heading uppercase tracking-tighter text-white mb-4 text-glow"
          >
            Frequently Asked <span className="text-pubg-yellow">Questions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg max-w-2xl mx-auto uppercase tracking-widest font-bold"
          >
            Everything You Need to Know Before Joining the Tournament
          </motion.p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;

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
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
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
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
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
        </div>
      </section>
    </div>
  );
}
