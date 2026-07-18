"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Calendar, Trophy, Users, ShieldAlert } from "lucide-react";

export function UpcomingTournament() {
  const [data, setData] = useState<{
    headline: string;
    match_name: string;
    bg_image_url: string;
    tournament_date?: string;
    slots?: string[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tournamentData } = await supabase
        .from('upcoming_tournaments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (tournamentData) {
        setData(tournamentData);
      }
    };

    fetchData();
  }, []);

  if (!data) return null;

  return (
    <section className="relative py-24 overflow-hidden border-y border-white/10">
      {/* Dynamic Background Image----- */}
      <motion.div
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.bg_image_url})` }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 mb-6"
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">Next Big Event</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            {data.headline}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative inline-block mb-10"
          >
            <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20" />
            <div className="relative bg-black/50 backdrop-blur-md border border-yellow-500/30 px-8 py-6 rounded-2xl">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                <Trophy className="w-8 h-8 text-yellow-500 shrink-0" />
                <h3 className="text-2xl md:text-3xl font-black text-yellow-500 uppercase tracking-widest">
                  {data.match_name}
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: Users, label: "Slots", value: data.slots ? `${data.slots.length} Slots` : "Limited" },
              { icon: Calendar, label: "Date", value: data.tournament_date || "Coming Soon" },
              { icon: ShieldAlert, label: "Mode", value: "Squad" },
              { icon: Trophy, label: "Prize", value: "TBA" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <stat.icon className="w-6 h-6 text-yellow-500 mx-auto mb-2 opacity-80" />
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-white font-black">{stat.value}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
