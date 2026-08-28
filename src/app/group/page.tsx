"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { MessageSquare, ShieldAlert, CheckCircle2, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GroupPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedText, setCopiedText] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      // Ensure user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('global_announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAnnouncements(data);
      }
      setLoading(false);
    };

    fetchAnnouncements();

    // Setup realtime listener
    const channel = supabase
      .channel('public:global_announcements')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'global_announcements' }, payload => {
        setAnnouncements(current => [payload.new, ...current]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gunmetal pt-32 pb-20 flex items-center justify-center">
        <div className="text-[var(--theme-primary)] font-bold uppercase tracking-widest animate-pulse">Loading Group...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gunmetal pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] border border-[var(--theme-primary)]/20 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--theme-primary)]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-black font-heading uppercase text-white flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-[var(--theme-primary)]" /> Tournament Group
                </h1>
                <p className="text-white/50 mt-2">Announcements and Room Details shared by Admin.</p>
              </div>
            </div>

            {announcements.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-xl border border-white/5">
                <ShieldAlert className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 text-lg">No announcements posted yet.</p>
                <p className="text-white/30 text-sm mt-2">Admin will post the ID/Password here before the match starts.</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                {announcements.map((announcement) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={announcement.id} 
                    className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-[var(--theme-primary)]/30 transition-colors shadow-lg"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--theme-primary)]"></div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[var(--theme-primary)] font-black uppercase tracking-widest text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Admin Announcement
                      </span>
                      <span className="text-white/40 text-xs font-mono">{new Date(announcement.created_at).toLocaleString()}</span>
                    </div>
                    
                    {announcement.message && (
                      <p className="text-white/90 text-base mb-6 whitespace-pre-wrap leading-relaxed">{announcement.message}</p>
                    )}

                    {(announcement.room_id || announcement.room_password) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="bg-black/80 p-4 rounded-lg border border-white/10 flex items-center justify-between group/copy hover:border-[var(--theme-primary)]/50 transition-colors">
                          <div>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Room ID</p>
                            <p className="text-[var(--theme-primary)] font-mono text-lg font-bold">{announcement.room_id || '-'}</p>
                          </div>
                          {announcement.room_id && (
                            <button 
                              onClick={() => copyToClipboard(announcement.room_id)}
                              className="p-3 bg-white/5 hover:bg-[var(--theme-primary)]/20 rounded-lg text-white/60 hover:text-[var(--theme-primary)] transition-colors"
                              title="Copy Room ID"
                            >
                              {copiedText === announcement.room_id ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                        
                        <div className="bg-black/80 p-4 rounded-lg border border-white/10 flex items-center justify-between group/copy hover:border-[var(--theme-primary)]/50 transition-colors">
                          <div>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Password</p>
                            <p className="text-white font-mono text-lg font-bold">{announcement.room_password || '-'}</p>
                          </div>
                          {announcement.room_password && (
                            <button 
                              onClick={() => copyToClipboard(announcement.room_password)}
                              className="p-3 bg-white/5 hover:bg-[var(--theme-primary)]/20 rounded-lg text-white/60 hover:text-[var(--theme-primary)] transition-colors"
                              title="Copy Password"
                            >
                              {copiedText === announcement.room_password ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
