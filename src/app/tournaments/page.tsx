"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Map as MapIcon, Clock, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

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

  const filteredTournaments = TOURNAMENTS.filter((t) => {
    const matchesTab = activeTab === "All" || t.type === activeTab;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-tactical-black">
      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-military-gradient border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tighter text-white mb-4 text-glow"
          >
            Upcoming <span className="text-pubg-yellow">Battles</span>
          </motion.h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Find your next tournament, assemble your squad, and fight for the top spot.
          </p>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="py-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex space-x-2 bg-gunmetal p-1 rounded-md border border-white/10">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none font-bold uppercase tracking-widest text-sm transition-all",
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
                  <Card glowOnHover className="flex flex-col h-full border-l-4 border-l-pubg-yellow group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-bold text-pubg-yellow uppercase tracking-widest bg-pubg-yellow/10 px-2 py-1 rounded-sm">
                          {tournament.type}
                        </span>
                        <h3 className="text-2xl font-black font-heading uppercase text-white mt-2 group-hover:text-pubg-yellow transition-colors">
                          {tournament.name}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <div className="text-white/50 uppercase tracking-wider text-xs font-bold mb-1">Date & Time</div>
                        <div className="text-white font-medium">{tournament.date} <br/> {tournament.time}</div>
                      </div>
                      <div>
                        <div className="text-white/50 uppercase tracking-wider text-xs font-bold mb-1">Prize Pool</div>
                        <div className="text-pubg-yellow font-bold text-lg text-glow">{tournament.prizePool}</div>
                      </div>
                      <div>
                        <div className="text-white/50 uppercase tracking-wider text-xs font-bold mb-1">Entry Fee</div>
                        <div className="text-white font-medium">{tournament.entryFee}</div>
                      </div>
                      <div>
                        <div className="text-white/50 uppercase tracking-wider text-xs font-bold mb-1">Slots</div>
                        <div className="text-white font-medium">{tournament.remainingSlots} / {tournament.totalSlots} left</div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/10 flex gap-3">
                      <Button className="w-full" onClick={() => setSelectedTournament(tournament)}>
                        View Details
                      </Button>
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
      <section className="py-24 bg-gunmetal relative">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-black font-heading uppercase text-center text-white mb-12">
            Frequently Asked <span className="text-pubg-yellow">Questions</span>
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border border-white/10 rounded-md bg-black/50 overflow-hidden">
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
