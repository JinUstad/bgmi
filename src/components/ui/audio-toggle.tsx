"use client";

import { useAudio } from "@/context/audio-context";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export function AudioToggle() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleMute}
      className="p-2 rounded-full border border-white/20 bg-black/50 text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10 transition-colors"
      title={isMuted ? "Unmute Ambience" : "Mute Ambience"}
    >
      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </motion.button>
  );
}
