"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We create the audio element only on the client side
    audioRef.current = new Audio("/music/bgmi_india.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    const startAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      // Clean up listeners after first interaction
      document.removeEventListener("click", startAudio);
      document.removeEventListener("keydown", startAudio);
      document.removeEventListener("touchstart", startAudio);
    };

    // Try to play immediately (might be blocked by browser)
    audioRef.current.play().catch(() => {
      // If blocked, wait for any user interaction to start playing
      document.addEventListener("click", startAudio);
      document.addEventListener("keydown", startAudio);
      document.addEventListener("touchstart", startAudio);
    });

    return () => {
      document.removeEventListener("click", startAudio);
      document.removeEventListener("keydown", startAudio);
      document.removeEventListener("touchstart", startAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Ignored, will be handled by global interaction listener if it's the first time
      });
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
