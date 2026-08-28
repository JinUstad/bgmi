"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

type Match = {
  id: string;
  team1: string;
  team2: string;
  winner: string;
};

type Round = {
  id: string;
  title: string;
  matches: Match[];
};

export default function TournamentBracket({ rounds }: { rounds: Round[] }) {
  if (!rounds || rounds.length === 0) return null;

  // Helper to remove IGNs from the name (e.g. "Team Name (1,2,3)" -> "Team Name")
  const formatName = (name: string) => {
    if (!name) return "TBD";
    if (name === "BYE") return name;
    if (name === "TBD") return name;
    return name.split(' (')[0].trim();
  };

  // Determine the final winner (Champion)
  const lastRound = rounds[rounds.length - 1];
  const finalMatch = lastRound?.matches[0];
  const champion = finalMatch?.winner || "TBD";

  // Helper to get color classes based on round depth from final
  const getRoundColors = (roundsFromFinal: number) => {
    if (roundsFromFinal === 0) return "bg-red-500 text-white border-red-600"; // Final
    if (roundsFromFinal === 1) return "bg-teal-400 text-black border-teal-500"; // Semi
    if (roundsFromFinal === 2) return "bg-cyan-500 text-white border-cyan-600"; // Quarter
    return "bg-[#1E1E1E] text-white border-white/10"; // Base Matches
  };

  return (
    <div className="w-full overflow-x-auto py-12 px-4 hide-scrollbar">
      <div className="min-w-[800px] flex flex-col items-center">
        {/* Initial Participants (Seeds) Row */}
        <div className="flex flex-col items-center w-full relative mb-16">
          <div className="flex flex-row justify-around w-full relative mt-4">
            {rounds[0].matches.map((match, mIndex) => (
              <div key={`seed-match-${match.id}`} className="flex flex-row justify-around w-full relative px-2">
                {/* Team 1 */}
                <div className="flex flex-col items-center relative w-full">
                  <div className="absolute top-full left-1/2 w-[1px] h-8 bg-white/20 -translate-x-1/2"></div>
                  <div className="absolute top-[calc(100%+32px)] left-1/2 w-1/2 h-[1px] bg-white/20"></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: mIndex * 0.1 }}
                    className="z-10 px-4 py-3 rounded text-sm font-bold text-center border shadow-lg whitespace-nowrap bg-[#87C9B1] text-black border-[#65a38d] w-full max-w-[160px] truncate"
                  >
                    {formatName(match.team1) || "TBD"}
                  </motion.div>
                </div>
                
                {/* Connector Drop to Match */}
                <div className="absolute top-[calc(100%+32px)] left-1/2 w-[1px] h-12 bg-white/20 -translate-x-1/2 -z-10"></div>
                
                {/* Team 2 */}
                <div className="flex flex-col items-center relative w-full">
                  <div className="absolute top-full left-1/2 w-[1px] h-8 bg-white/20 -translate-x-1/2"></div>
                  <div className="absolute top-[calc(100%+32px)] right-1/2 w-1/2 h-[1px] bg-white/20"></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: mIndex * 0.1 + 0.1 }}
                    className={`z-10 px-4 py-3 rounded text-sm font-bold text-center border shadow-lg whitespace-nowrap bg-[#87C9B1] text-black border-[#65a38d] w-full max-w-[160px] truncate ${match.team2 === 'BYE' ? 'opacity-60' : ''}`}
                  >
                    {formatName(match.team2) || "TBD"}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {rounds.map((round, rIndex) => {
          const roundsFromFinal = rounds.length - 1 - rIndex;
          
          return (
            <div key={round.id} className="flex flex-col items-center w-full relative">
              {/* Round Title */}
              <div className="text-white/40 font-bold tracking-widest uppercase text-[10px] mb-4">
                {round.title}
              </div>
              
              <div className="flex flex-row justify-around w-full relative mb-12">
                {round.matches.map((match, mIndex) => {
                  const colors = getRoundColors(roundsFromFinal);
                  const isBase = roundsFromFinal >= 2 && rIndex === 0;

                  return (
                    <div key={match.id} className="flex flex-col items-center relative w-full px-2">
                      {/* Connection lines to next round */}
                      {roundsFromFinal > 0 && (
                        <>
                          {/* Vertical drop */}
                          <div className="absolute top-full left-1/2 w-[1px] h-6 bg-white/20 -translate-x-1/2"></div>
                          {/* Horizontal connector (half width, left or right depending on even/odd) */}
                          <div 
                            className={`absolute top-[calc(100%+24px)] h-[1px] bg-white/20 ${
                              mIndex % 2 === 0 
                                ? "left-1/2 w-1/2" 
                                : "right-1/2 w-1/2"
                            }`}
                          ></div>
                          {/* Vertical drop to next node */}
                          {mIndex % 2 === 0 && (
                            <div className="absolute top-[calc(100%+24px)] left-full w-[1px] h-6 bg-white/20 -translate-x-1/2"></div>
                          )}
                        </>
                      )}

                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rIndex * 0.2 + mIndex * 0.1 }}
                        className={`z-10 px-4 py-3 rounded text-sm font-bold text-center border shadow-lg whitespace-nowrap ${colors} ${isBase ? 'w-[200px]' : 'w-[180px]'} ${match.team2 === 'BYE' ? 'opacity-60' : ''}`}
                      >
                        {isBase ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-white/50 uppercase">Match {mIndex + 1}</span>
                            <span>{formatName(match.team1)}</span>
                            <span className="text-[10px] text-white/30 italic">vs</span>
                            <span className={match.team2 === 'BYE' ? 'text-white/40 italic' : ''}>{formatName(match.team2)}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 w-full justify-center">
                            {match.winner ? (
                              <span>{formatName(match.winner)}</span>
                            ) : match.team1 && match.team2 ? (
                              <>
                                <span>{formatName(match.team1)}</span>
                                <span className="text-[10px] text-white/30 italic">vs</span>
                                <span className={match.team2 === 'BYE' ? 'text-white/40 italic' : ''}>{formatName(match.team2)}</span>
                              </>
                            ) : (
                              <span className="text-white/50 italic text-xs">{round.title} Winner</span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Champion Node */}
        <div className="flex flex-col items-center relative mt-4">
          <div className="absolute bottom-full left-1/2 w-[1px] h-8 bg-white/20 -translate-x-1/2"></div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: rounds.length * 0.2 }}
            className="z-10 bg-yellow-400 text-black border-2 border-yellow-500 px-8 py-4 rounded font-black text-xl shadow-[0_0_30px_rgba(250,204,21,0.3)] text-center flex flex-col items-center gap-2"
          >
            <Trophy className="w-6 h-6" />
            <div>
              <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Champion</div>
              {formatName(champion)}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
