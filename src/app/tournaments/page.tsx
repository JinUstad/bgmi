"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Map as MapIcon, Clock, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lottie from "lottie-react";
import animationData from "../../../public/war_lottie.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const TABS = ["All", "Solo", "Duo", "Squad"];

const TOURNAMENTS = [
  {
    id: 1,
    name: "Weekend Warrior",
    type: "Squad",
    date: "June 25, 2026",
    time: "08:00 PM",
    entryFee: "₹200",
    prizePool: "₹25,000",
    totalSlots: 100,
    remainingSlots: 12,
    map: "Erangel",
  },
  {
    id: 2,
    name: "Lone Wolf Challenge",
    type: "Solo",
    date: "June 26, 2026",
    time: "09:00 PM",
    entryFee: "₹50",
    prizePool: "₹5,000",
    totalSlots: 100,
    remainingSlots: 45,
    map: "Sanhok",
  },
  {
    id: 3,
    name: "Duo Deathmatch",
    type: "Duo",
    date: "June 27, 2026",
    time: "07:00 PM",
    entryFee: "₹100",
    prizePool: "₹12,000",
    totalSlots: 50,
    remainingSlots: 5,
    map: "Miramar",
  },
  {
    id: 4,
    name: "Mega Championship",
    type: "Squad",
    date: "July 1, 2026",
    time: "06:00 PM",
    entryFee: "₹500",
    prizePool: "₹1,00,000",
    totalSlots: 100,
    remainingSlots: 80,
    map: "Erangel + Miramar",
  },
];

const FAQS = [
  { q: "How to register?", a: "Click on the register button, fill the form with your BGMI ID and team details, and pay the entry fee." },
  { q: "When will the room ID be shared?", a: "Room ID and Password will be shared in your registered WhatsApp number and Discord 15 minutes before the match start time." },
  { q: "How will winners get paid?", a: "Prize money is transferred instantly via UPI or Bank Transfer after the match results are verified." },
  { q: "What if the match disconnects?", a: "If the server crashes for everyone, the match will be restarted. Individual disconnections are not our responsibility." },
];

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTournament, setSelectedTournament] = useState<typeof TOURNAMENTS[0] | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqRef = useRef(null);

  useGSAP(() => {
    gsap.from(".faq-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: faqRef.current,
        start: "top 80%",
      }
    });

    gsap.from(".faq-item", {
      x: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: faqRef.current,
        start: "top 70%",
      }
    });
  }, { scope: faqRef });

  const filteredTournaments = TOURNAMENTS.filter((t) => {
    const matchesTab = activeTab === "All" || t.type === activeTab;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-tactical-black">
      {/* Hero Banner */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/10 bg-black pt-20">
        
        {/* Animated Battle Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black/60 z-10" />
          
          <motion.div 
            animate={{ scale: [1, 1.05, 1], x: [0, -5, 0], y: [0, 5, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[url('/tournaments_hero_bg.png')] bg-cover bg-center opacity-70 mix-blend-overlay" 
          />

          {/* Bullet Tracers (Left to Right) */}
          <motion.div
            animate={{
              x: ["-20vw", "120vw"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            className="absolute h-[3px] w-32 bg-yellow-400 shadow-[0_0_20px_yellow] z-10 top-1/3 left-0 rounded-full"
          />
          <motion.div
            animate={{
              x: ["-20vw", "120vw"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear", repeatDelay: 2.2 }}
            className="absolute h-[2px] w-40 bg-orange-500 shadow-[0_0_15px_orange] z-10 top-2/3 left-0 rounded-full"
          />

          {/* Muzzle Flash / Screen Shake */}
          <motion.div
            animate={{
              opacity: [0, 0.2, 0, 0, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            className="absolute inset-0 bg-yellow-600 mix-blend-overlay z-10"
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center mt-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-black font-heading uppercase tracking-tighter text-white mb-6 text-glow"
          >
            Upcoming <span className="text-pubg-yellow">Battles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-xl md:text-2xl max-w-3xl mx-auto mb-12"
          >
            Find your next tournament, assemble your elite squad, and fight for the top spot on the leaderboards.
          </motion.p>

          {/* Added Stats Content to fill the taller banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-pubg-yellow text-4xl font-black mb-2">150K+</div>
              <div className="text-white/60 font-bold uppercase tracking-widest text-sm">Active Players</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-pubg-yellow text-4xl font-black mb-2">₹50L+</div>
              <div className="text-white/60 font-bold uppercase tracking-widest text-sm">Prizes Awarded</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-pubg-yellow text-4xl font-black mb-2">500+</div>
              <div className="text-white/60 font-bold uppercase tracking-widest text-sm">Daily Scrims</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="py-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex overflow-x-auto hide-scrollbar space-x-2 bg-gunmetal p-1 rounded-md border border-white/10 w-full md:w-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "shrink-0 px-6 py-2 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none font-bold uppercase tracking-widest text-sm transition-all",
                    activeTab === tab
                      ? "bg-pubg-yellow text-black box-glow"
                      : "text-white/60 hover:text-pubg-yellow hover:bg-white/5"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 bg-gunmetal border border-white/10 rounded-md py-3 pl-10 pr-4 text-white focus:outline-none focus:border-pubg-yellow/50 transition-colors"
              />
            </div>
          </div>

          {/* Tournament Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTournaments.map((tournament) => (
                <motion.div
                  key={tournament.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    glowOnHover 
                    className="p-0 flex flex-col h-full group relative overflow-hidden cursor-pointer border-0"
                    onClick={() => setSelectedTournament(tournament)}
                  >
                    {/* Background Image & Overlays */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070" 
                        alt="Background" 
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6 flex flex-col h-full pt-16">
                      <h3 className="text-4xl md:text-5xl font-black font-heading uppercase text-white mb-8 drop-shadow-lg">
                        {tournament.type}
                      </h3>

                      <div className="space-y-4 mb-8 flex-grow">
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                          <span className="text-white/60 font-bold uppercase tracking-widest text-sm">Entry Fee</span>
                          <span className="text-white font-bold text-lg">{tournament.entryFee}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                          <span className="text-white/60 font-bold uppercase tracking-widest text-sm">Prize Pool</span>
                          <span className="text-pubg-yellow font-black text-xl text-glow">{tournament.prizePool}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                          <span className="text-white/60 font-bold uppercase tracking-widest text-sm">Timing</span>
                          <span className="text-white font-bold text-lg">{tournament.time}</span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Button className="w-full group-hover:bg-orange-accent transition-colors">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredTournaments.length === 0 && (
              <div className="col-span-full py-20 text-center text-white/50 font-bold uppercase tracking-widest">
                No tournaments found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-24 relative overflow-hidden bg-black">
        {/* Animated War Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/70 z-10" />
          
          <motion.div 
            animate={{ scale: [1, 1.05, 1], x: [0, -10, 0], y: [0, 5, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[url('/faq_bg.png')] bg-cover bg-center mix-blend-overlay opacity-60" 
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
            className="absolute inset-0 bg-red-600 z-10 mix-blend-overlay"
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-3xl">
          <h2 className="faq-title text-3xl font-black font-heading uppercase text-center text-white mb-12">
            Frequently Asked <span className="text-pubg-yellow">Questions</span>
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="faq-item border border-white/10 rounded-md bg-black/70 backdrop-blur-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left font-bold text-white hover:text-pubg-yellow transition-colors"
                >
                  {faq.q}
                  <span className="text-pubg-yellow text-xl">{openFaq === index ? "-" : "+"}</span>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-white/70">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal
        isOpen={!!selectedTournament}
        onClose={() => setSelectedTournament(null)}
        title="Tournament Details"
      >
        {selectedTournament && (
          <div className="space-y-6 text-white">
            <div>
              <h3 className="text-3xl font-black font-heading uppercase text-white mb-2">{selectedTournament.name}</h3>
              <span className="inline-block px-3 py-1 bg-pubg-yellow/20 text-pubg-yellow border border-pubg-yellow/50 rounded-sm text-sm font-bold tracking-widest uppercase">
                {selectedTournament.type} Match
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-black/50 rounded-md border border-white/10">
              <div>
                <MapIcon className="text-white/50 w-5 h-5 mb-1" />
                <div className="font-bold">{selectedTournament.map}</div>
              </div>
              <div>
                <Clock className="text-white/50 w-5 h-5 mb-1" />
                <div className="font-bold">{selectedTournament.time}</div>
              </div>
              <div>
                <Users className="text-white/50 w-5 h-5 mb-1" />
                <div className="font-bold">{selectedTournament.remainingSlots} Slots</div>
              </div>
              <div>
                <Trophy className="text-white/50 w-5 h-5 mb-1" />
                <div className="font-bold text-pubg-yellow">{selectedTournament.prizePool}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-pubg-yellow border-b border-white/10 pb-2">Rules & Regulations</h4>
              <ul className="list-disc pl-5 space-y-2 text-white/70 text-sm">
                <li>Emulators are strictly prohibited. iPad players must declare before registering.</li>
                <li>Hacks, scripts, or any third-party tools will result in a permanent ban and prize forfeiture.</li>
                <li>Teaming up with enemy squads is not allowed.</li>
                <li>Players must join the room 10 minutes prior to the start time.</li>
                <li>The decision of the management is final and binding in all disputes.</li>
              </ul>
            </div>

            <div className="pt-6 flex justify-end gap-4 border-t border-white/10">
              <Button variant="ghost" onClick={() => setSelectedTournament(null)}>
                Cancel
              </Button>
              <Button glow onClick={() => {
                window.location.href = `/contact?tournament=${selectedTournament.id}`;
              }}>
                Proceed To Register
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
