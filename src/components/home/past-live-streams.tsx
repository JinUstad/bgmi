"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MonitorPlay, PlayCircle, ExternalLink } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export function PastLiveStreams() {
  const [streams, setStreams] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLElement>(null);
  const redBlobRef = useRef<HTMLDivElement>(null);
  const yellowBlobRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!redBlobRef.current || !yellowBlobRef.current) return;

    // Floating animation for red blob
    gsap.to(redBlobRef.current, {
      y: 80,
      x: -50,
      scale: 1.2,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Floating animation for yellow blob
    gsap.to(yellowBlobRef.current, {
      y: -80,
      x: 50,
      scale: 1.4,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const { data, count, error } = await supabase
          .from("past_streams")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .limit(4);

        if (!error && data) {
          setStreams(data);
          setTotalCount(count || 0);
        }
      } catch (err) {
        console.error("Failed to fetch past streams", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStreams();
  }, []);

  if (loading || streams.length === 0) return null;

  return (
    <section ref={containerRef} className="relative py-24 bg-black overflow-hidden border-t border-white/5">
      {/* Animated Background elements */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-0 pointer-events-none"></div>
      <div 
        ref={redBlobRef}
        className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-0"
      ></div>
      <div 
        ref={yellowBlobRef}
        className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-pubg-yellow/10 rounded-full blur-[120px] pointer-events-none z-0"
      ></div>
      
      {/* Animated grid lines background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-6"
          >
            <MonitorPlay className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-sm">VOD Archive</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wider mb-6"
          >
            Past <span className="text-pubg-yellow text-glow">Live Streams</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto text-lg"
          >
            Missed the action? Catch up on our latest matches and tournaments.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {streams.map((stream, idx) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/10 hover:border-pubg-yellow/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,178,0,0.15)] backdrop-blur-sm"
            >
              <div className="aspect-video relative overflow-hidden bg-black/50">
                {stream.thumbnail_url ? (
                  <Image
                    src={stream.thumbnail_url}
                    alt={stream.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MonitorPlay className="w-12 h-12 text-white/20" />
                  </div>
                )}
                
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link href={stream.url} target="_blank" className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>
                  </Link>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-white font-bold text-lg line-clamp-2 mb-3 group-hover:text-pubg-yellow transition-colors">
                  {stream.title}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
                    {new Date(stream.created_at).toLocaleDateString()}
                  </span>
                  <Link 
                    href={stream.url} 
                    target="_blank"
                    className="flex items-center gap-1 text-pubg-yellow text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Watch <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <a
            href="https://www.youtube.com/@xyloesportsofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-red-600 border-2 border-red-600 text-white font-black uppercase tracking-widest rounded-tl-2xl rounded-br-2xl hover:bg-red-700 hover:border-red-700 transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:shadow-[0_0_35px_rgba(220,38,38,0.7)] flex items-center gap-3 group relative overflow-hidden"
          >
            <YoutubeIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="relative z-10">View All On YouTube</span>
            <ExternalLink className="w-4 h-4 text-white/80" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

