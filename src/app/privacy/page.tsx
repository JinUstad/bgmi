"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Database, Cookie, Share2, UserCheck, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

const POLICY_SECTIONS = [
  {
    icon: Database,
    title: "Information We Collect",
    content: "When you register for our tournaments, we collect personal information such as your Full Name, BGMI ID, Mobile Number, and Email Address. This helps us identify you and ensure a smooth tournament experience."
  },
  {
    icon: Lock,
    title: "Payment Information",
    content: "We process payments via secure third-party gateways (UPI). We do not store your sensitive banking details, credit card numbers, or UPI PINs on our servers. All transactions are encrypted."
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: "Your data is primarily used to manage tournament brackets, distribute Room IDs/Passwords, communicate important updates, and process prize money payouts. We do not sell your personal data to advertisers."
  },
  {
    icon: ShieldCheck,
    title: "Data Security",
    content: "We implement industry-standard security measures, including SSL encryption and secure databases, to protect your personal information from unauthorized access, alteration, or disclosure."
  },
  {
    icon: Cookie,
    title: "Cookies",
    content: "Our website uses cookies to enhance user experience, remember your preferences, and track analytics. You can choose to disable cookies through your browser settings, though some site features may not function properly."
  },
  {
    icon: Share2,
    title: "Third-Party Services",
    content: "We may use third-party tools (such as Google Analytics or Discord integrations) to improve our services. These providers have their own privacy policies governing how they handle data."
  },
  {
    icon: UserCheck,
    title: "User Rights",
    content: "You have the right to request access to the personal data we hold about you. You may also request corrections to any inaccurate information or ask us to delete your data from our systems."
  },
  {
    icon: Mail,
    title: "Contact Information",
    content: "If you have any questions or concerns regarding this Privacy Policy, please contact our Data Protection Officer at privacy@xyloesports.in or reach out via our Contact page."
  }
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-black relative">
      
      {/* Global Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('/war_contact_bg.png')] bg-cover bg-center mix-blend-overlay" 
        />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 z-10" />

        {/* Laser Sights (Privacy Theme - Yellow) */}
        <motion.div
          animate={{
            x: ["-20vw", "120vw", "-20vw"],
            y: ["50vh", "20vh", "70vh"],
            rotate: [-10, 15, -20],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[45vw] bg-pubg-yellow/60 shadow-[0_0_15px_rgba(240,165,0,0.8)] z-10 top-0 left-0 origin-left"
        />
        <motion.div
          animate={{
            x: ["120vw", "-20vw", "120vw"],
            y: ["30vh", "60vh", "40vh"],
            rotate: [20, -15, 10],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
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
            className="w-16 h-16 mx-auto bg-pubg-yellow/20 rounded-full flex items-center justify-center mb-6 border border-pubg-yellow/50 shadow-[0_0_15px_rgba(240,165,0,0.4)]"
          >
            <ShieldCheck className="w-8 h-8 text-pubg-yellow" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black font-heading uppercase tracking-tighter text-white mb-4"
          >
            Privacy <span className="text-pubg-yellow text-glow">Policy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg max-w-2xl mx-auto uppercase tracking-widest font-bold"
          >
            How we protect and manage your data
          </motion.p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-white/70 leading-relaxed text-center"
          >
            <p>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="mt-4">
              At Xyloesports, we are committed to protecting your privacy and ensuring that your personal information is handled securely and responsibly. This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to safeguard your data when you use our tournament platform.
            </p>
          </motion.div>

          <div className="space-y-6">
            {POLICY_SECTIONS.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 md:p-8 bg-black/40 backdrop-blur-md border border-white/10 hover:border-pubg-yellow/30 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pubg-yellow/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-pubg-yellow/10 transition-colors pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-pubg-yellow/10 flex items-center justify-center border border-pubg-yellow/20 group-hover:bg-pubg-yellow/20 transition-colors">
                        <Icon className="w-6 h-6 text-pubg-yellow" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-3 group-hover:text-pubg-yellow transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-white/60 leading-relaxed text-sm md:text-base">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
