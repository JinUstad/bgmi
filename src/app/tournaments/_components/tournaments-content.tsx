"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { Search, Map as MapIcon, Clock, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lottie from "lottie-react";
import animationData from "../../../../public/war_lottie.json";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const TABS = ["All", "Solo", "Duo", "Squad"];

const TOURNAMENTS = [
  {
    id: 1,
    name: "Lone Wolf Challenge",
    type: "Solo",
    date: "June 26, 2026",
    time: "---",
    entryFee: "₹0",
    prizePool: "0",
    totalSlots: 100,
    remainingSlots: 45,
    map: "Sanhok",
    disabled: true,
  },
  {
    id: 2,
    name: "Duo Deathmatch",
    type: "Duo",
    date: "June 27, 2026",
    time: "----",
    entryFee: "₹0",
    prizePool: "₹0",
    totalSlots: 50,
    remainingSlots: 5,
    map: "Miramar",
    disabled: true,
  },
  {
    id: 3,
    name: "Mega Championship",
    type: "TDM Squad",
    date: "September 5,6, 2026",
    time: "10:00 AM",
    entryFee: "₹220",
    prizePool: "1st: ₹800 | 2nd: ₹500",
    totalSlots: 100,
    remainingSlots: 36,
    map: "TDM",
    disabled: false,
  },
];

const FAQS = [
  { q: "How to register?", a: "Click on the register button, fill the form with your BGMI ID and team details, and pay the entry fee." },
  { q: "When will the room ID be shared?", a: "Room ID and Password will be shared in your registered WhatsApp number and Discord 15 minutes before the match start time." },
  { q: "How will winners get paid?", a: "Prize money is transferred instantly via UPI or Bank Transfer after the match results are verified." },
  { q: "What if the match disconnects?", a: "If the server crashes for everyone, the match will be restarted. Individual disconnections are not our responsibility." },
];

/**
 * Tournaments Content — Client Component
 * Contains all interactive tournament listing, filtering, and prize sections.
 * Parent page.tsx (Server Component) handles metadata and JSON-LD export.
 */
export default function TournamentsContent() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTournament, setSelectedTournament] = useState<typeof TOURNAMENTS[0] | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [upcomingTournamentData, setUpcomingTournamentData] = useState<any>(null);
  const [settingsData, setSettingsData] = useState<any>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      const { data } = await supabase
        .from('registrations')
        .select('team_name, time_slot')
        .eq('payment_status', 'verified');
      if (data) {
        setRegistrations(data);
      }
    };
    const fetchUpcomingTournament = async () => {
      const { data } = await supabase
        .from('upcoming_tournaments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setUpcomingTournamentData(data);
      }
    };
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (data) {
        setSettingsData(data);
      }
    };
    fetchRegistrations();
    fetchUpcomingTournament();
    fetchSettings();
  }, []);

  const groupedRegistrations = registrations.reduce((acc: any, curr: any) => {
    if (!acc[curr.time_slot]) acc[curr.time_slot] = [];
    acc[curr.time_slot].push(curr);
    return acc;
  }, {});

  const hasRegistrations = Object.keys(groupedRegistrations).length > 0;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXAbs = useMotionValue(0);
  const mouseYAbs = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
    mouseXAbs.set(mouseX);
    mouseYAbs.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glareBackground = useMotionTemplate`radial-gradient(500px circle at ${mouseXAbs}px ${mouseYAbs}px, rgba(255,255,255,0.15), transparent 80%)`;

  const faqRef = useRef(null);
  const prizeRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: prizeRef.current,
        start: "top 85%",
      }
    });
    tl.from(".prize-card-wrapper", { y: 50, opacity: 0, scale: 0.95, duration: 0.8, ease: "power3.out" })
      .from(".prize-content", { x: -30, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .from(".prize-stat", { y: 30, opacity: 0, duration: 0.6, stagger: 0.2, ease: "back.out(1.7)" }, "-=0.4")
      .from(".prize-divider", { scale: 0, opacity: 0, duration: 0.4 }, "-=0.4");
  }, { scope: prizeRef });

  useGSAP(() => {
    gsap.from(".faq-title", {
      y: 50, opacity: 0, duration: 1,
      scrollTrigger: { trigger: faqRef.current, start: "top 80%" }
    });
    gsap.from(".faq-item", {
      x: -50, opacity: 0, duration: 0.8, stagger: 0.15,
      scrollTrigger: { trigger: faqRef.current, start: "top 70%" }
    });
  }, { scope: faqRef });

  const dynamicTournaments = TOURNAMENTS.map(t => {
    if (t.id === 3 && upcomingTournamentData) {
      let totalCap = 100;
      if (upcomingTournamentData.slots && Array.isArray(upcomingTournamentData.slots)) {
        totalCap = upcomingTournamentData.slots.reduce((acc: number, slot: any) => acc + (parseInt(slot.capacity) || 0), 0);
      }
      const timeStr = (upcomingTournamentData.slots && upcomingTournamentData.slots.length > 0) 
        ? `${upcomingTournamentData.slots[0].startHour}:${upcomingTournamentData.slots[0].startMin} ${upcomingTournamentData.slots[0].startAmPm}`
        : t.time;

      return {
        ...t,
        name: upcomingTournamentData.headline || upcomingTournamentData.match_name || t.name,
        type: upcomingTournamentData.match_mode ? upcomingTournamentData.match_mode.toUpperCase() : t.type,
        date: upcomingTournamentData.tournament_date || t.date,
        time: timeStr,
        entryFee: settingsData?.registration_fee ? "₹" + settingsData.registration_fee : t.entryFee,
        prizePool: upcomingTournamentData.prize || t.prizePool,
        map: upcomingTournamentData.map_area || t.map,
        totalSlots: totalCap > 0 ? totalCap : t.totalSlots,
        remainingSlots: totalCap > 0 ? totalCap : t.remainingSlots,
      };
    }
    return t;
  });

  const filteredTournaments = dynamicTournaments.filter((t) => {
    const matchesTab = activeTab === "All" || t.type.toLowerCase().includes(activeTab.toLowerCase());
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-tactical-black">
      {/* Hero Banner */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/10 bg-black pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <motion.div
            animate={{ scale: [1, 1.05, 1], x: [0, -5, 0], y: [0, 5, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[url('/tournaments_hero_bg.png')] bg-cover bg-center opacity-70 mix-blend-overlay"
          />
          <motion.div
            animate={{ x: ["-20vw", "120vw"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            className="absolute h-[3px] w-32 bg-yellow-400 shadow-[0_0_20px_yellow] z-10 top-1/3 left-0 rounded-full"
          />
          <motion.div
            animate={{ x: ["-20vw", "120vw"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear", repeatDelay: 2.2 }}
            className="absolute h-[2px] w-40 bg-orange-500 shadow-[0_0_15px_orange] z-10 top-2/3 left-0 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0, 0.2, 0, 0, 0] }}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-pubg-yellow text-4xl font-black mb-2">15</div>
              <div className="text-white/60 font-bold uppercase tracking-widest text-sm">Active Players</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-pubg-yellow text-4xl font-black mb-2">5</div>
              <div className="text-white/60 font-bold uppercase tracking-widest text-sm">Prizes Awarded</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-pubg-yellow text-4xl font-black mb-2">5+</div>
              <div className="text-white/60 font-bold uppercase tracking-widest text-sm">Daily Scrims</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prize Distribution Section */}
      <section className="py-12 relative z-30 bg-black/80 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full">
            <h2 className="text-3xl font-black font-heading uppercase text-white mb-8 border-b border-white/10 pb-4 flex items-center justify-center gap-3">
              <Trophy className="text-pubg-yellow w-8 h-8" aria-hidden="true" />
              Prize <span className="text-pubg-yellow">Distribution</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { place: "1st Place", prize: "₹800", icon: "🥇", glow: "shadow-[0_0_30px_rgba(255,215,0,0.3)]", border: "border-yellow-400/50" },
                { place: "2nd Place", prize: "₹500", icon: "🥈", glow: "shadow-[0_0_20px_rgba(192,192,192,0.2)]", border: "border-gray-400/50" },
                { place: "3rd Place", prize: "Free Entry in Next Tournament", icon: "🥉", glow: "shadow-[0_0_20px_rgba(205,127,50,0.2)]", border: "border-amber-700/50" }
              ].map((item, index) => (
                <Card key={index} className={cn("p-8 text-center flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-md transition-all hover:-translate-y-2 border", item.border, item.glow)}>
                  <div className="text-5xl" aria-hidden="true">{item.icon}</div>
                  <h3 className="text-2xl font-black font-heading uppercase text-white tracking-widest">{item.place}</h3>
                  <div className="h-px w-16 bg-white/20 mx-auto" />
                  <p className="text-pubg-yellow font-bold text-xl uppercase tracking-wider">{item.prize}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prize Pool & Entry Fee Section */}
      <section ref={prizeRef} className="py-16 md:py-20 relative z-30">
        <div className="container mx-auto px-4" style={{ perspective: 1000 }}>
          <div className="prize-card-wrapper max-w-5xl mx-auto">
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="rounded-[2rem] p-6 md:p-12 overflow-hidden relative shadow-[0_15px_50px_0_rgba(249,115,22,0.1)] border border-white/10 group hover:border-orange-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-300 bg-zinc-900"
            >
              <div className="absolute inset-0 z-0" aria-hidden="true">
                <Image src="/pubg_battleground_bg.png" alt="" width={1200} height={800} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/80 to-zinc-950" />
                <div className="absolute inset-0 bg-orange-500/5 mix-blend-overlay" />
              </div>
              <div className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-screen transition-opacity duration-500 group-hover:opacity-50" aria-hidden="true">
                <Lottie animationData={animationData} loop={true} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <motion.div className="absolute inset-0 z-10 pointer-events-none rounded-[2rem] overflow-hidden" style={{ background: glareBackground }} aria-hidden="true" />

              <motion.div initial={{ z: 30 }} animate={{ x: ["-20vw", "100vw"], y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }} className="absolute top-1/4 left-0 pointer-events-none opacity-40 mix-blend-screen" aria-hidden="true">
                <div className="text-6xl drop-shadow-[0_0_20px_orange] rotate-45">🚀</div>
              </motion.div>
              <motion.div initial={{ z: 20 }} animate={{ x: ["-20vw", "100vw"] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }} className="absolute top-[30%] left-0 h-[3px] w-48 bg-orange-400 shadow-[0_0_20px_orange] rounded-full pointer-events-none" aria-hidden="true" />
              <motion.div initial={{ z: 40 }} animate={{ x: ["100vw", "-20vw"] }} transition={{ duration: 0.4, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }} className="absolute top-2/3 right-0 h-[3px] w-32 bg-orange-600 shadow-[0_0_20px_orange] rounded-full pointer-events-none" aria-hidden="true" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10" style={{ transform: "translateZ(50px)" }}>
                <div className="flex-1 text-center md:text-left prize-content relative z-10">
                  <div className="inline-block px-3 py-1 mb-4 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-500 text-xs font-bold uppercase tracking-widest">Tactical Showdown</div>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-heading uppercase text-white mb-4">Daily <span className="text-orange-500 text-glow drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]">Battle</span></h2>
                  <p className="text-white/80 font-bold tracking-wider text-sm md:text-base max-w-lg mx-auto md:mx-0 drop-shadow-md mb-8">Enter the battlefield for just ₹220 and stand a chance to win the grand prize of 1st: ₹800 | 2nd: ₹500. Assemble your squad and prove your dominance.</p>
                  <div className="flex flex-row items-center justify-center md:justify-start gap-6 md:gap-10 w-full md:w-auto bg-zinc-900/60 p-4 md:p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl inline-flex">
                    <div className="text-center prize-stat">
                      <div className="text-xs md:text-sm text-white/70 uppercase tracking-widest font-bold mb-1">Entry Fee</div>
                      <div className="text-3xl md:text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{settingsData?.registration_fee ? "₹" + settingsData.registration_fee : "₹220"}</div>
                    </div>
                    <div className="h-12 w-px bg-white/20 hidden md:block prize-divider" />
                    <div className="h-px w-12 bg-white/20 md:hidden prize-divider" />
                    <div className="text-center prize-stat">
                      <div className="text-xs md:text-sm text-orange-500/90 uppercase tracking-widest font-bold mb-1">Winner Gets</div>
                      <div className="text-4xl md:text-5xl font-black text-orange-500 text-glow drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]">{upcomingTournamentData?.prize || "1st: ₹800"}</div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex justify-center md:justify-end relative z-10 pointer-events-none mt-8 md:mt-0">
                  <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ transform: "translateZ(80px)" }} className="w-64 md:w-80 lg:w-[28rem] drop-shadow-[0_10px_30px_rgba(249,115,22,0.4)] mix-blend-screen">
                    <Image src="/gemini_soldier.png" alt="XYLO Esports tactical soldier character" width={600} height={800} className="w-full h-auto object-contain" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Time Table Section */}
      <section className="py-12 relative z-20 bg-black/40 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black font-heading uppercase text-white mb-4">Match <span className="text-pubg-yellow">Schedule</span></h2>
            <p className="text-white/60 font-bold uppercase tracking-widest text-sm">Daily Scrims &amp; Tournament Timings</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {upcomingTournamentData?.slots && Array.isArray(upcomingTournamentData.slots) ? (
              upcomingTournamentData.slots.map((slot: any, i: number) => {
                const timeString = `${slot.startHour}:${slot.startMin} ${slot.startAmPm} - ${slot.endHour}:${slot.endMin} ${slot.endAmPm}`;
                return (
                  <div key={`slot-${i}`} className="w-full md:w-[calc(50%-1rem)] lg:w-72 bg-gunmetal border border-white/10 rounded-md p-4 text-center hover:border-pubg-yellow/50 transition-colors group cursor-default">
                    <div className="text-pubg-yellow font-black text-base md:text-lg whitespace-nowrap mb-2 group-hover:scale-105 transition-transform">{timeString}</div>
                    <div className="text-white font-bold uppercase text-sm mb-1">{upcomingTournamentData.match_name || "Tournament Match"}</div>
                    <div className="text-white/50 text-xs uppercase tracking-widest">
                      {(upcomingTournamentData.map_area || "Map") + " - " + (upcomingTournamentData.match_mode || "Mode")}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-white/50 text-sm py-8 font-bold uppercase tracking-widest">
                Loading schedule...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Registered Teams Section */}
      {hasRegistrations && (
        <section className="py-12 relative z-20 bg-black/60 border-b border-white/10">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black font-heading uppercase text-white mb-2">Registered <span className="text-pubg-yellow">Teams</span></h2>
              <p className="text-white/60 text-sm uppercase tracking-widest">Verified squad registrations by slot</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedRegistrations).map(([slot, teams]: [string, any]) => (
                <div key={slot} className="bg-black/60 border border-white/10 rounded-lg p-4">
                  <h3 className="text-pubg-yellow font-black uppercase tracking-widest text-sm mb-3 border-b border-white/10 pb-2">{slot}</h3>
                  <ul className="space-y-1">
                    {teams.map((team: any, i: number) => (
                      <li key={i} className="text-white/70 text-sm flex items-center gap-2">
                        <Users className="w-3 h-3 text-pubg-yellow shrink-0" aria-hidden="true" />
                        {team.team_name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tournament Listing */}
      <section className="py-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div className="flex gap-2 flex-wrap justify-center">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 font-bold uppercase tracking-widest text-sm transition-all border rounded-sm",
                    activeTab === tab
                      ? "bg-pubg-yellow text-black border-pubg-yellow"
                      : "bg-transparent text-white/60 border-white/20 hover:border-pubg-yellow/50 hover:text-white"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-sm pl-10 pr-4 py-2 text-white focus:outline-none focus:border-pubg-yellow text-sm w-64"
                aria-label="Search tournaments"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTournaments.map((tournament) => (
                <motion.div
                  key={tournament.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group cursor-pointer"
                  onClick={() => !tournament.disabled && setSelectedTournament(tournament)}
                >
                  <Card className={cn(
                    "p-6 h-full flex flex-col bg-black/60 backdrop-blur-md border transition-all",
                    tournament.disabled
                      ? "border-white/5 opacity-60 cursor-not-allowed"
                      : "border-white/10 hover:border-pubg-yellow/50 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(240,165,0,0.15)]"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 bg-pubg-yellow/10 text-pubg-yellow border border-pubg-yellow/30 text-xs font-bold uppercase tracking-widest rounded-sm">{tournament.type}</span>
                      <span className={cn("px-2 py-1 text-xs font-bold uppercase tracking-widest rounded-sm", tournament.disabled ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-green-500/10 text-green-400 border border-green-500/30")}>
                        {tournament.disabled ? "Unavailable" : "Open"}
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black font-heading uppercase text-white mb-8 drop-shadow-lg">{tournament.type}</h3>
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
                      <Button disabled={tournament.disabled} className={`w-full ${tournament.disabled ? 'bg-white/10 text-white/50 cursor-not-allowed hover:bg-white/10' : 'group-hover:bg-orange-accent'} transition-colors`}>
                        {tournament.disabled ? 'Unavailable' : 'View Details'}
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
      <section ref={faqRef} className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-black/70 z-10" />
          <motion.div animate={{ scale: [1, 1.05, 1], x: [0, -10, 0], y: [0, 5, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-[url('/faq_bg.png')] bg-cover bg-center mix-blend-overlay opacity-60" />
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-30 mix-blend-screen">
            <Lottie animationData={animationData} loop={true} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <motion.div animate={{ opacity: [0, 0, 0.15, 0, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-red-600 z-10 mix-blend-overlay" />
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-3xl">
          <h2 className="faq-title text-3xl font-black font-heading uppercase text-center text-white mb-12">Frequently Asked <span className="text-pubg-yellow">Questions</span></h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="faq-item border border-white/10 rounded-md bg-black/70 backdrop-blur-sm overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center p-6 text-left font-bold text-white hover:text-pubg-yellow transition-colors" aria-expanded={openFaq === index}>
                  {faq.q}
                  <span className="text-pubg-yellow text-xl" aria-hidden="true">{openFaq === index ? "-" : "+"}</span>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-6 pt-0 text-white/70">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal isOpen={!!selectedTournament} onClose={() => setSelectedTournament(null)} title="Tournament Details">
        {selectedTournament && (
          <div className="space-y-6 text-white">
            <div>
              <h3 className="text-3xl font-black font-heading uppercase text-white mb-2">{selectedTournament.name}</h3>
              <span className="inline-block px-3 py-1 bg-pubg-yellow/20 text-pubg-yellow border border-pubg-yellow/50 rounded-sm text-sm font-bold tracking-widest uppercase">{selectedTournament.type} Match</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-black/50 rounded-md border border-white/10">
              <div><MapIcon className="text-white/50 w-5 h-5 mb-1" aria-hidden="true" /><div className="font-bold">{selectedTournament.map}</div></div>
              <div><Clock className="text-white/50 w-5 h-5 mb-1" aria-hidden="true" /><div className="font-bold">{selectedTournament.time}</div></div>
              <div><Users className="text-white/50 w-5 h-5 mb-1" aria-hidden="true" /><div className="font-bold">{selectedTournament.remainingSlots} Slots</div></div>
              <div><Trophy className="text-white/50 w-5 h-5 mb-1" aria-hidden="true" /><div className="font-bold text-pubg-yellow">{selectedTournament.prizePool}</div></div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-pubg-yellow border-b border-white/10 pb-2">Rules &amp; Regulations</h4>
              <ul className="list-disc pl-5 space-y-2 text-white/70 text-sm">
                <li>Emulators are strictly prohibited. iPad players must declare before registering.</li>
                <li>Hacks, scripts, or any third-party tools will result in a permanent ban and prize forfeiture.</li>
                <li>Teaming up with enemy squads is not allowed.</li>
                <li>Players must join the room 10 minutes prior to the start time.</li>
                <li>The decision of the management is final and binding in all disputes.</li>
              </ul>
            </div>
            <div className="pt-6 flex justify-end gap-4 border-t border-white/10">
              <Button variant="ghost" onClick={() => setSelectedTournament(null)}>Cancel</Button>
              <Button glow onClick={() => { window.location.href = `/contact?tournament=${selectedTournament.id}`; }}>Proceed To Register</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
