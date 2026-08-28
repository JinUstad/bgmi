"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type ThemeContextType = {
  activeGame: any | null;
  activeCategory: any | null;
  theme: any | null;
  settings: any | null;
  loading: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  activeGame: null,
  activeCategory: null,
  theme: null,
  settings: null,
  loading: true,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeGame, setActiveGame] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<any | null>(null);
  const [theme, setTheme] = useState<any | null>(null);
  const [settings, setSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveTheme() {
      try {
        // Fetch active game config
        const { data: config } = await supabase
          .from('active_game_config')
          .select('active_game_id')
          .eq('id', 1)
          .single();

        if (config?.active_game_id) {
          const { data: game } = await supabase
            .from('games')
            .select(`
              *,
              game_categories!games_category_id_fkey (
                *
              )
            `)
            .eq('id', config.active_game_id)
            .single();

          if (game) {
            setActiveGame(game);
            setActiveCategory(game.game_categories);
            setTheme(game.game_categories); // Part 1: theme is driven by category
            applyThemeColors(game, game.game_categories);
          }
        }

        // Fetch global settings
        const { data: settingsData } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .single();
          
        if (settingsData) {
          setSettings(settingsData);
        }

      } catch (error) {
        console.error('Error fetching theme/settings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveTheme();

    // Listen for realtime changes
    const channel = supabase
      .channel('theme-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'active_game_config' }, () => {
        fetchActiveTheme();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games' }, (payload) => {
        if (payload.new.id === activeGame?.id) {
          fetchActiveTheme();
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        fetchActiveTheme();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const applyThemeColors = (game: any, category: any) => {
    const root = document.documentElement;
    if (!category) return;
    
    // Core brand colors (with game overrides if needed)
    const primary = game.game_primary_color || category.primary_color || '#F2A900';
    const secondary = game.game_secondary_color || category.secondary_color || '#2E4A32';
    const accent = game.game_accent_color || category.accent_color || '#FF6B00';
    
    // Theme colors from category
    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-secondary', secondary);
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-background', category.color_background || '#000000');
    root.style.setProperty('--color-text', category.color_text || '#FFFFFF');
    root.style.setProperty('--color-muted', category.color_muted || '#888888');
    root.style.setProperty('--color-surface', category.color_surface || '#111111');
    root.style.setProperty('--color-card', category.color_card || '#222222');
    root.style.setProperty('--color-border', category.color_border || '#333333');
    root.style.setProperty('--color-glow', category.color_glow || primary);
    root.style.setProperty('--gradient-start', category.gradient_start || primary);
    root.style.setProperty('--gradient-end', category.gradient_end || '#000000');
    
    // Legacy support for existing components
    root.style.setProperty('--theme-primary', primary);
    root.style.setProperty('--theme-secondary', secondary);
    root.style.setProperty('--theme-accent', accent);
    root.style.setProperty('--theme-bg', category.color_background || category.bg_tint || '#0A0A0A');
  };

  return (
    <ThemeContext.Provider value={{ activeGame, activeCategory, theme, settings, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}
