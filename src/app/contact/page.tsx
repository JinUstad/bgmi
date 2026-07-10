"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { load } from '@cashfreepayments/cashfree-js';
import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";

const MAX_SLOT_CAPACITY = 6;

const TIME_SLOTS = [
  { value: "10-11am", label: "10:00 AM - 11:00 AM" },
  { value: "11-12pm", label: "11:00 AM - 12:00 PM" },
  { value: "12-1pm", label: "12:00 PM - 1:00 PM" },
  { value: "2-3pm", label: "2:00 PM - 3:00 PM" },
  { value: "3-4pm", label: "3:00 PM - 4:00 PM" },
  { value: "4-5pm", label: "4:00 PM - 5:00 PM" },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [registrationFee, setRegistrationFee] = useState<number>(99);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    setCurrentDate(localDate.toISOString().split('T')[0]);

    const initCashfree = async () => {
      const envStr = (process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || '').toUpperCase();
      const cf = await load({
        mode: envStr === 'PRODUCTION' ? 'production' : 'sandbox'
      });
      setCashfree(cf);
    };

    const fetchFee = async () => {
      const { data, error } = await supabase.from('settings').select('registration_fee').eq('id', 1).single();
      if (!error && data) {
        setRegistrationFee(data.registration_fee);
      }
    };

    const fetchSlotCounts = async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('time_slot');

      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach((row: any) => {
          counts[row.time_slot] = (counts[row.time_slot] || 0) + 1;
        });
        setSlotCounts(counts);
      }
    };

    initCashfree();
    fetchFee();
    fetchSlotCounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashfree) {
      alert("Payment system is initializing, please wait a moment and try again.");
      return;
    }

    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // 1. Create order on our backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const orderData = await response.json();
      console.log('[contact] API response:', JSON.stringify(orderData));

      if (!response.ok) throw new Error(orderData.error || "Failed to create order");

      // Validate payment_session_id before calling checkout
      if (!orderData.payment_session_id) {
        throw new Error(`Server returned success but no payment_session_id. Full response: ${JSON.stringify(orderData)}`);
      }

      console.log('[contact] Using payment_session_id:', orderData.payment_session_id);
      console.log('[contact] Server CF environment:', orderData.cf_environment);

      // 2. Open Cashfree Checkout Modal
      let checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          alert("Payment was closed or failed. Please try again.");
          setLoading(false);
        }
        if (result.paymentDetails) {
          // Payment completed, verify status
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderData.order_id })
          });
          const verifyData = await verifyResponse.json();

          if (verifyData.status === 'verified') {
            alert("Registration and Payment successful! We will contact you shortly.");
            form.reset();
            window.location.href = `/user-dashboard?order_id=${orderData.order_id}`;
          } else {
            alert("Payment is pending or failed. Please check your status later or contact support.");
          }
          setLoading(false);
        }
      });

    } catch (error: any) {
      console.error("Error submitting registration:", error);
      alert(`Payment error: ${error.message || 'Unknown error. Please try again.'}`);
      setLoading(false);
    }
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
                      <p className="text-white/60">8512889586</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-pubg-yellow" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Email Support</h4>
                      <p className="text-white/60">support@xyloesports.in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-pubg-yellow" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Location</h4>
                      <p className="text-white/60">Rafikabad Colony Dasna Ghaizabad Uttar Pradesh</p>
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
                      <input required name="fullName" type="text" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">BGMI ID *</label>
                      <input required name="bgmiId" type="text" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="e.g. 22222, 33333, 444444, 555555" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Team Name *</label>
                      <input required name="teamName" type="text" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="Team Soul" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Mobile Number *</label>
                      <input required name="mobileNumber" type="tel" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="+91" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Email Address (Optional)</label>
                      <input name="email" type="email" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Tournament Type *</label>
                      <select required name="tournamentType" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow appearance-none" defaultValue="squad">
                        <option value="squad">Squad Team Only</option>
                        <option value="solo" disabled>Solo (Coming Soon)</option>
                        <option value="duo" disabled>Duo/Dual (Coming Soon)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">UPI ID *</label>
                      <input required name="upiId" type="text" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow" placeholder="yourupi@okbank" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Registration Date *</label>
                      <input
                        name="registrationDate"
                        type="date"
                        value={currentDate}
                        readOnly
                        className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white/50 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Time Slot *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TIME_SLOTS.map((slot) => {
                          const count = slotCounts[slot.value] || 0;
                          const isFull = count >= MAX_SLOT_CAPACITY;
                          return (
                            <label
                              key={slot.value}
                              className={`relative flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${isFull
                                  ? 'border-red-500/30 bg-red-500/5 cursor-not-allowed opacity-60'
                                  : 'border-white/10 bg-black hover:border-pubg-yellow/50 hover:bg-pubg-yellow/5 has-[:checked]:border-pubg-yellow has-[:checked]:bg-pubg-yellow/10'
                                }`}
                            >
                              <input
                                type="radio"
                                name="timeSlot"
                                value={slot.value}
                                required
                                disabled={isFull}
                                className="w-4 h-4 accent-pubg-yellow"
                              />
                              <div className="flex-1">
                                <span className={`text-sm font-medium ${isFull ? 'text-white/40 line-through' : 'text-white'}`}>
                                  {slot.label}
                                </span>
                                <div className={`text-xs mt-0.5 ${isFull ? 'text-red-400' : 'text-white/40'}`}>
                                  {isFull ? 'FULL' : `${count}/${MAX_SLOT_CAPACITY} registered`}
                                </div>
                              </div>
                              {isFull && (
                                <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                  Completed
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 text-sm font-bold uppercase tracking-widest">Message / Query (Optional)</label>
                    <textarea name="message" rows={4} className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-pubg-yellow resize-none" placeholder="Any specific requests?" />
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-6">
                    <div
                      className="flex items-center gap-3"
                      title="Read the terms and condition and privacy and polices"
                    >
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-5 h-5 rounded border-white/10 bg-black accent-pubg-yellow cursor-pointer shrink-0"
                      />
                      <label htmlFor="terms" className="text-white/70 text-sm cursor-pointer select-none">
                        I accept the Terms and Conditions and Privacy Policy.
                      </label>
                    </div>

                    <div className="flex justify-start w-full">
                      <Button type="submit" size="lg" glow disabled={loading || !termsAccepted} className="w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed">
                        <span className="flex items-center gap-2">
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                          <span>{loading ? "Processing Payment..." : `Pay & Register (₹${registrationFee})`}</span>
                        </span>
                      </Button>
                    </div>
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
