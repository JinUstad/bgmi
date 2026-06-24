"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert("Registration submitted successfully! We will contact you shortly.");
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-black relative">
      
      {/* Global Animated Background for Contact Page */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10" />
        
        {/* PUBG Theme Background */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('/pubg_contact_bg.png')] bg-cover bg-center mix-blend-overlay opacity-50" 
        />

        {/* Sniper Laser Sights */}
        <motion.div
          animate={{
            x: ["-20vw", "120vw", "-20vw"],
            y: ["30vh", "70vh", "40vh"],
            rotate: [10, -15, 20],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[40vw] bg-red-500/60 shadow-[0_0_15px_red] z-10 top-0 left-0 origin-left"
        />
        <motion.div
          animate={{
            x: ["120vw", "-20vw", "120vw"],
            y: ["60vh", "20vh", "50vh"],
            rotate: [-20, 15, -10],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
          className="absolute h-[2px] w-[55vw] bg-red-500/50 shadow-[0_0_15px_red] z-10 top-0 left-0 origin-left"
        />

        {/* Screen Shake / Impact effect occasionally */}
        <motion.div
          animate={{
            opacity: [0, 0, 0.15, 0, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-red-600 z-10 mix-blend-overlay"
        />
      </div>

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 border-b border-white/10 z-10">
        <div className="container relative mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tighter text-white mb-4 text-glow"
          >
            Comms <span className="text-pubg-yellow">Center</span>
          </motion.h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Register for tournaments, report issues, or just say hello. Our support team is online 24/7.
          </p>
        </div>
      </section>

      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-black font-heading uppercase text-white mb-6">Contact Info</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-pubg-yellow" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Call / WhatsApp</h4>
                      <p className="text-white/60">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-pubg-yellow" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Email Support</h4>
                      <p className="text-white/60">support@bgmiesports.in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-pubg-yellow" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Discord / Telegram</h4>
                      <p className="text-white/60">@bgmiesports</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-pubg-yellow" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Headquarters</h4>
                      <p className="text-white/60">Cyber City, Gurugram, Haryana 122002, India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-64 bg-gunmetal rounded-md border border-white/10 overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <span className="text-pubg-yellow font-bold uppercase tracking-widest">View on Google Maps</span>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-3xl font-black font-heading uppercase text-white mb-8 border-b border-white/10 pb-4">
                  Tournament <span className="text-pubg-yellow">Registration</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Full Name *</label>
                      <input required type="text" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">BGMI ID *</label>
                      <input required type="text" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="5123456789" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Team Name (Optional)</label>
                      <input type="text" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="Team Soul" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Mobile Number *</label>
                      <input required type="tel" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="+91" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Email Address</label>
                      <input type="email" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Tournament Type *</label>
                      <select required className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow appearance-none">
                        <option value="">Select Category</option>
                        <option value="solo">Solo Match</option>
                        <option value="duo">Duo Match</option>
                        <option value="squad">Squad Match</option>
                        <option value="custom">Custom Room</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Message / Query (Optional)</label>
                    <textarea rows={4} className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow resize-none" placeholder="Any specific requests?" />
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Button type="submit" size="lg" glow className="w-full md:w-auto">
                      <span className="flex  items-start gap-2">
                        <Send className="w-6 h-6" />
                        <span>Submit Registration</span>
                      </span>
                    </Button>
                    <p className="text-white/40 text-xs mt-4">
                      By submitting this form, you agree to our Terms of Service and Privacy Policy. Your data is secure with us.
                    </p>
                  </div>
                </form>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
