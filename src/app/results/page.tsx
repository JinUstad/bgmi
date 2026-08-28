"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Trophy, Shield, Crosshair, CheckCircle2 } from 'lucide-react';

type Registration = {
  id: string;
  team_name: string;
  full_name: string;
  in_game_id: string;
  tournament_type?: string;
  time_slot?: string;
};

type TeamMatch = {
  id: string;
  created_at: string;
  tournament_type: string;
  time_slot: string;
  team1_id: string;
  team2_id: string;
  winner_id: string | null;
  status: string;
  team1_name?: string;
  team1_in_game_id?: string;
  team1_player_name?: string;
  team2_name?: string;
  team2_in_game_id?: string;
  team2_player_name?: string;
  winner_team_name?: string;
  team1?: Registration;
  team2?: Registration;
};

export default function ResultsPage() {
  const [matches, setMatches] = useState<TeamMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    fetchMatches();
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, full_name, in_game_id, team_name, tournament_type, time_slot')
      .eq('payment_status', 'verified');
    
    if (!error && data) {
      setRegistrations(data);
    }
  };

  const fetchMatches = async () => {
    setLoading(true);
    const { data: matchesData, error } = await supabase
      .from('team_matches')
      .select(`
        *,
        team1:team1_id (id, full_name, in_game_id, team_name),
        team2:team2_id (id, full_name, in_game_id, team_name)
      `)
      .order('created_at', { ascending: false });

    if (!error && matchesData) {
      setMatches(matchesData as any);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black font-sans selection:bg-[var(--theme-primary)]/30 selection:text-[var(--theme-primary)]">
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[80vh]">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--theme-primary)]/5 via-black to-black"></div>
          <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-primary)]/20 to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wider mb-4">
              Match <span className="text-[var(--theme-primary)] text-glow">Results</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Check out the latest 1v1 team battle results. See who dominated the battleground and who took the victory!
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Crosshair className="w-12 h-12 text-[var(--theme-primary)] animate-spin" />
            </div>
          ) : (
            <>
              {matches.length === 0 ? (
                <div className="text-center py-20 border border-white/5 bg-white/5 rounded-3xl backdrop-blur-sm">
                  <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-white/50 uppercase tracking-widest">No Results Yet</h3>
                  <p className="text-white/40 mt-2">Check back later for match updates.</p>
                </div>
              ) : (
                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-white/50 text-xs uppercase tracking-wider">
                          <th className="p-4 font-bold whitespace-nowrap">Slot / Mode</th>
                          <th className="p-4 font-bold">Winning Team</th>
                          <th className="p-4 font-bold text-center">Status</th>
                          <th className="p-4 font-bold text-right">Losing Team</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {matches.map((match) => {
                          const t1Name = match.team1_name || match.team1?.team_name || match.team1?.full_name || 'Team 1';
                          const t1InGameId = match.team1_in_game_id || match.team1?.in_game_id || 'Hidden';

                          const t2Name = match.team2_name || match.team2?.team_name || match.team2?.full_name || 'Team 2';
                          const t2InGameId = match.team2_in_game_id || match.team2?.in_game_id || 'Hidden';

                          const isTeam2Winner = (match.winner_id && match.winner_id === match.team2_id) || (match.winner_team_name && match.winner_team_name === t2Name);
                          const isTeam1Winner = (match.winner_id && match.winner_id === match.team1_id) || (match.winner_team_name && match.winner_team_name === t1Name);
                          const hasWinner = isTeam1Winner || isTeam2Winner || match.winner_id || match.winner_team_name;

                          let winningTeamName = isTeam2Winner ? t2Name : t1Name;
                          let winningInGameId = isTeam2Winner ? t2InGameId : t1InGameId;

                          let losingTeamName = isTeam2Winner ? t1Name : t2Name;
                          let losingInGameId = isTeam2Winner ? t1InGameId : t2InGameId;

                          if (!hasWinner && match.status === 'pending') {
                            winningTeamName = t1Name;
                            winningInGameId = t1InGameId;
                            losingTeamName = t2Name;
                            losingInGameId = t2InGameId;
                          }

                          return (
                            <tr key={match.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                              <td className="p-4 whitespace-nowrap">
                                <span className="inline-block px-2 py-1 bg-white/5 text-white/70 rounded text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                  {match.time_slot} • {match.tournament_type}
                                </span>
                              </td>
                              
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[var(--theme-primary)] text-base md:text-lg truncate max-w-[150px] md:max-w-[200px]" title={winningTeamName}>
                                    {winningTeamName}
                                  </span>
                                  {hasWinner && (
                                    <Trophy className="w-4 h-4 text-[var(--theme-primary)]" />
                                  )}
                                </div>
                                <div className="text-white/40 font-mono text-[10px] mt-1 flex items-center gap-1">
                                  <Shield className="w-3 h-3" /> {winningInGameId}
                                </div>
                              </td>
                              
                              <td className="p-4 text-center align-middle">
                                <div className="flex flex-col items-center justify-center h-full">
                                  <span className="text-red-500 font-black italic mb-1 text-xs">VS</span>
                                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                    match.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                  }`}>
                                    {match.status}
                                  </span>
                                </div>
                              </td>

                              <td className="p-4 text-right">
                                <div className="flex flex-col items-end">
                                  <span className={`font-medium text-base md:text-lg truncate max-w-[150px] md:max-w-[200px] ${hasWinner ? 'text-white/40 line-through' : 'text-white'}`} title={losingTeamName}>
                                    {losingTeamName}
                                  </span>
                                  <div className="text-white/30 font-mono text-[10px] mt-1 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> {losingInGameId}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Waiting Teams Section */}
              {(() => {
                const waitingTeams = registrations.filter(r => {
                  if (r.tournament_type === 'solo') return false;
                  const teamMatches = matches.filter(m => m.team1_id === r.id || m.team2_id === r.id);
                  if (teamMatches.length === 0) return true;
                  const isPending = teamMatches.some(m => m.status === 'pending' || m.status === 'ongoing');
                  if (isPending) return false;
                  const hasLost = teamMatches.some(m => m.status === 'completed' && m.winner_id && m.winner_id !== r.id);
                  if (hasLost) return false;
                  return true;
                });

                waitingTeams.sort((a, b) => {
                  const parseTime = (timeStr: string) => {
                    if (!timeStr) return 0;
                    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    if (!match) return 0;
                    let hours = parseInt(match[1], 10);
                    const minutes = parseInt(match[2], 10);
                    const ampm = match[3].toUpperCase();
                    if (ampm === 'PM' && hours < 12) hours += 12;
                    if (ampm === 'AM' && hours === 12) hours = 0;
                    return hours * 60 + minutes;
                  };
                  return parseTime(a.time_slot || '') - parseTime(b.time_slot || '');
                });
                
                if (waitingTeams.length === 0) return null;
                
                return (
                  <div className="mt-16 bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-3">
                       Pending Battles
                    </h2>
                    <p className="text-white/40 text-sm mb-8 -mt-4">These teams have registered for Duo/Squad matches and are waiting for an opponent.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {waitingTeams.map((team, idx) => (
                        <motion.div 
                          key={team.id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-black/50 border border-white/5 rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden group hover:border-yellow-500/30 transition-colors"
                        >
                          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-bl-full -z-10 group-hover:bg-yellow-500/10 transition-colors"></div>
                          <span className="text-yellow-500/70 font-bold uppercase text-[10px] tracking-widest px-2 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20 self-start">
                            {team.time_slot} • {team.tournament_type}
                          </span>
                          <h3 className="font-black text-xl text-white truncate" title={team.team_name || team.full_name}>
                            {team.team_name || team.full_name}
                          </h3>
                          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                            <span className="text-white/40 text-xs italic font-bold uppercase tracking-widest">Waiting for another team...</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
