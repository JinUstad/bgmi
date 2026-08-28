"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { load } from '@cashfreepayments/cashfree-js';
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/context/theme-context";

export default function ContactContent() {
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [globalFee, setGlobalFee] = useState<number>(99);
  const [registrationFee, setRegistrationFee] = useState<number>(99);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [activeGames, setActiveGames] = useState<any[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  
  // We will assume tournaments are fetched based on selected game in the future, 
  // but for now we rely on the global active tournament or just standard slots
  const [timeSlots, setTimeSlots] = useState<{ value: string, label: string, capacity: number }[]>([]);
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});
  const [isTournamentActive, setIsTournamentActive] = useState<boolean>(true);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
    
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

    const fetchActiveGames = async () => {
      // Fetch global fee first
      const { data: settingsData } = await supabase.from('settings').select('registration_fee').eq('id', 1).single();
      if (settingsData && settingsData.registration_fee) {
        setGlobalFee(settingsData.registration_fee);
      }

      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('name');
        
      if (!error && data && data.length > 0) {
        setActiveGames(data);
        setSelectedGameId(data[0].id);
      } else {
        setIsTournamentActive(false); // No games active
      }
    };

    const fetchTournamentDetails = async () => {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*');
        
      if (!error && data && data.length > 0) {
        setTimeSlots(data.map((s: any) => ({
          value: s.slot_time,
          label: s.slot_time,
          capacity: 100 // default mock capacity
        })));
      } else {
        // Fallback slots if no time_slots table data exists
        setTimeSlots([
          { value: "10:00 AM - 10:30 AM", label: "10:00 AM - 10:30 AM", capacity: 100 },
          { value: "02:00 PM - 02:30 PM", label: "02:00 PM - 02:30 PM", capacity: 100 },
        ]);
      }
    };

    const fetchSlotCounts = async () => {
      // Mocking slot counts for guest flow
      setSlotCounts({});
    };

    initCashfree();
    fetchActiveGames();
    fetchTournamentDetails();
    fetchSlotCounts();
  }, []);

  useEffect(() => {
    if (activeGames.length > 0 && selectedGameId) {
      const selectedGame = activeGames.find(g => g.id === selectedGameId);
      if (selectedGame && selectedGame.registration_fee !== null && selectedGame.registration_fee !== undefined) {
        setRegistrationFee(selectedGame.registration_fee);
      } else {
        setRegistrationFee(globalFee);
      }
    }
  }, [selectedGameId, activeGames, globalFee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashfree) {
      alert("Payment system is initializing, please wait a moment and try again.");
      return;
    }

    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: Record<string, any> = Object.fromEntries(formData.entries());
    
    const payload: Record<string, any> = {
      ...data,
      game_id: selectedGameId,
      // No user_id since it's guest flow
    };

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const orderData = await response.json();
      if (!response.ok) throw new Error(orderData.error || "Failed to create order");

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
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderData.order_id })
          });
          const verifyData = await verifyResponse.json();

          if (verifyData.status === 'verified') {
            // Redirect to receipt page instead of user-dashboard
            window.location.href = `/receipt/${orderData.order_id}`;
          } else {
            alert("Payment is pending or failed. Please contact support.");
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

  const { activeGame } = useTheme();

  const selectedGameObj = activeGames.find(g => g.id === selectedGameId);
  const isSinglePlayer = selectedGameObj?.name?.toLowerCase().includes('tekken') || 
                         selectedGameObj?.name?.toLowerCase().includes('solo') || 
                         selectedGameObj?.name?.toLowerCase().includes('1v1');

  return (
    <main className="flex flex-col w-full min-h-screen bg-black relative">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <motion.div
          animate={{ scale: [1, 1.05, 1], x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-50 transition-all duration-1000"
          style={{ backgroundImage: `url('${activeGame?.registration_hero_background || "/pubg_contact_bg.png"}')` }}
        />
      </div>

      <section className="relative pt-32 pb-20 border-b border-white/10 z-10">
        <div className="container relative mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tighter text-white mb-4 text-glow whitespace-pre-line"
          >
            {(() => {
              const heading = activeGame?.registration_hero_heading || "Tournament Registration";
              const parts = heading.split(' ');
              const lastWord = parts.pop();
              return (
                <>
                  {parts.join(' ')} <span className="text-[var(--theme-primary)]">{lastWord}</span>
                </>
              );
            })()}
          </motion.h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {activeGame?.registration_hero_description || "Select your game, fill out your team details, and pay the entry fee to secure your slot instantly."}
          </p>
        </div>
      </section>

      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <address className="lg:col-span-1 space-y-8 not-italic">
              <div>
                <h2 className="text-2xl font-black font-heading uppercase text-white mb-6">Contact Info</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[var(--theme-primary)]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Call / WhatsApp</h3>
                      <a href="tel:+918512889586" className="text-white/60 hover:text-[var(--theme-primary)] transition-colors">8512889586</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[var(--theme-primary)]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Email Support</h3>
                      <a href="mailto:support@xyloesports.in" className="text-white/60 hover:text-[var(--theme-primary)] transition-colors">support@xyloesports.in</a>
                    </div>
                  </div>
                </div>
              </div>
            </address>

            <div className="lg:col-span-2">
              <Card className="p-8">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate autoComplete="off">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="game" className="text-white/70 text-sm font-bold uppercase tracking-widest">Select Game *</label>
                      <select 
                        id="game" 
                        required 
                        value={selectedGameId}
                        onChange={(e) => setSelectedGameId(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-[var(--theme-primary)] appearance-none"
                      >
                        {activeGames.length === 0 && <option value="">No Active Games Available</option>}
                        {activeGames.map(game => (
                          <option key={game.id} value={game.id}>{game.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="teamName" className="text-white/70 text-sm font-bold uppercase tracking-widest">
                        {isSinglePlayer ? 'Player Name *' : 'Team Name *'}
                      </label>
                      <input id="teamName" required name="teamName" type="text" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-[var(--theme-primary)]" placeholder={isSinglePlayer ? 'e.g. John Doe' : 'e.g. Team Soul'} />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="inGameIds" className="text-white/70 text-sm font-bold uppercase tracking-widest">
                        {isSinglePlayer ? 'In-Game ID (IGN) *' : 'In-Game IDs (IGNs) *'}
                      </label>
                      <input id="inGameIds" required name="inGameIds" type="text" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-[var(--theme-primary)]" placeholder={isSinglePlayer ? 'e.g. Mortal' : 'e.g. Mortal, Viper'} />
                    </div>

                    {!isSinglePlayer ? (
                      <div className="space-y-2">
                        <label htmlFor="tournamentType" className="text-white/70 text-sm font-bold uppercase tracking-widest">Tournament Type *</label>
                        <select 
                          id="tournamentType" 
                          required 
                          name="tournamentType"
                          className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-[var(--theme-primary)] appearance-none"
                        >
                          <option value="">Select Type</option>
                          <option value="squad">Squad</option>
                          <option value="duo">Duo</option>
                          <option value="solo">Solo</option>
                        </select>
                      </div>
                    ) : (
                      <input type="hidden" name="tournamentType" value="solo" />
                    )}

                    <div className="space-y-2">
                      <label htmlFor="timeSlot" className="text-white/70 text-sm font-bold uppercase tracking-widest">Time Slot *</label>
                      <select 
                        id="timeSlot" 
                        required 
                        name="timeSlot"
                        className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-[var(--theme-primary)] appearance-none"
                      >
                        <option value="">Select Slot</option>
                        {timeSlots.map((slot, i) => (
                          <option key={i} value={slot.value}>{slot.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="mobileNumber" className="text-white/70 text-sm font-bold uppercase tracking-widest">WhatsApp Number *</label>
                      <input id="mobileNumber" required name="mobileNumber" type="tel" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-[var(--theme-primary)]" placeholder="+91" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-white/70 text-sm font-bold uppercase tracking-widest">Contact Email *</label>
                      <input id="email" required name="email" type="email" className="w-full bg-black border border-white/10 rounded-md p-5 text-lg text-white focus:outline-none focus:border-[var(--theme-primary)]" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-6">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        disabled={!isTournamentActive || activeGames.length === 0}
                        className="w-5 h-5 rounded border-white/10 bg-black accent-pubg-yellow cursor-pointer shrink-0 disabled:opacity-50"
                      />
                      <label htmlFor="terms" className="text-white/70 text-sm cursor-pointer select-none">
                        I accept the{" "}
                        <a href="/terms" className="text-[var(--theme-primary)] hover:underline">Terms and Conditions</a>
                        {" "}and{" "}
                        <a href="/privacy" className="text-[var(--theme-primary)] hover:underline">Privacy Policy</a>.
                      </label>
                    </div>

                    <div className="flex justify-start w-full">
                      <Button type="submit" size="lg" glow disabled={loading || !termsAccepted || !isTournamentActive || activeGames.length === 0} className="w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed">
                        <span className="flex items-center gap-2">
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                          <span>{(!isTournamentActive || activeGames.length === 0) ? "Registration Closed" : loading ? "Processing Payment..." : `Pay ₹${registrationFee} & Register`}</span>
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
    </main>
  );
}
