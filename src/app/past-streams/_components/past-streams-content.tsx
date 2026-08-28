"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MonitorPlay, PlayCircle, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";

const STREAMS_PER_PAGE = 12;

export default function PastStreamsContent() {
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchStreams(0);
  }, []);

  const fetchStreams = async (pageIndex: number) => {
    try {
      if (pageIndex === 0) setLoading(true);
      else setLoadingMore(true);

      const from = pageIndex * STREAMS_PER_PAGE;
      const to = from + STREAMS_PER_PAGE - 1;

      const { data, count, error } = await supabase
        .from("past_streams")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching past streams", error);
        return;
      }

      if (data) {
        if (pageIndex === 0) {
          setStreams(data);
        } else {
          setStreams((prev) => [...prev, ...data]);
        }
        
        if (count && streams.length + data.length >= count) {
          setHasMore(false);
        } else if (data.length < STREAMS_PER_PAGE) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch past streams", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStreams(nextPage);
  };

  return (
    <div className="flex flex-col w-full min-h-screen pt-24 bg-black">
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[var(--theme-primary)]/10 rounded-full blur-[150px]"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-6"
            >
              <MonitorPlay className="w-5 h-5" />
              <span className="font-bold uppercase tracking-widest text-sm">VOD Archive</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-wider mb-6"
            >
              Past <span className="text-[var(--theme-primary)] text-glow">Live Streams</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 max-w-2xl mx-auto text-lg"
            >
              Catch up on all the action you missed. Watch previous tournaments, scrims, and community matches.
            </motion.p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[var(--theme-primary)]" />
            </div>
          ) : streams.length === 0 ? (
            <div className="text-center py-20 bg-[#111] border border-white/10 rounded-2xl">
              <MonitorPlay className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Streams Yet</h3>
              <p className="text-white/50">Check back later for recorded live streams.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {streams.map((stream, idx) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (idx % STREAMS_PER_PAGE) * 0.05 }}
                    className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/10 hover:border-[var(--theme-primary)]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,178,0,0.15)] flex flex-col h-full"
                  >
                    <div className="aspect-video relative overflow-hidden bg-black/50 shrink-0">
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
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Link href={stream.url} target="_blank" className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                            <PlayCircle className="w-8 h-8 text-white" />
                          </div>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-white font-bold text-lg line-clamp-2 mb-4 group-hover:text-[var(--theme-primary)] transition-colors">
                        {stream.title}
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
                          {new Date(stream.created_at).toLocaleDateString()}
                        </span>
                        <Link 
                          href={stream.url} 
                          target="_blank"
                          className="flex items-center gap-1 text-[var(--theme-primary)] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                          Watch <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-4 bg-transparent border-2 border-[var(--theme-primary)] text-[var(--theme-primary)] font-black uppercase tracking-widest rounded-tl-2xl rounded-br-2xl hover:bg-[var(--theme-primary)] hover:text-black transition-all duration-300 box-glow disabled:opacity-50 flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
