const fs = require('fs');
const env = fs.readFileSync('d:/myWork/bgmi/bgmi-admin-pannel/.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) acc[k.trim()] = v.join('=').trim().replace(/^['"]|['"]$/g, '');
  return acc;
}, {});
process.env = { ...process.env, ...env };
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const gamesUpdates = {
  "tekken-8": [
    { title: "Wired Only", description: "Ethernet connection required." },
    { title: "Double Elimination", description: "Standard FGC bracket format." },
    { title: "Streamed Finals", description: "Top 8 broadcasted live." },
    { title: "Global Rankings", description: "Compete with players worldwide." }
  ],
  "tekken-tag-2": [
    { title: "2v2 Combat", description: "Master two characters." },
    { title: "Classic Meta", description: "Old school movement and mechanics." },
    { title: "Huge Roster", description: "The largest Tekken roster ever." },
    { title: "Retro Vibes", description: "Relive the golden era of tag fighters." }
  ],
  "free-fire": [
    { title: "No Emulator", description: "Mobile-only lobbies." },
    { title: "Fast Paced", description: "10-minute intense matches." },
    { title: "Character Skills", description: "Full skill synergy allowed." },
    { title: "Custom Rooms", description: "Exclusive custom rooms for tournaments." }
  ],
  "bgmi": [
    { title: "Fair Play", description: "Strict anti-cheat monitoring." },
    { title: "Instant Payouts", description: "Win and get paid immediately." },
    { title: "Daily Scrims", description: "Practice every day with top tier teams." },
    { title: "Live Support", description: "24/7 dedicated discord support." }
  ]
};

async function updateFeatures() {
  for (const [slug, features] of Object.entries(gamesUpdates)) {
    const { error } = await supabase.from('games').update({ why_choose_us_features: features }).eq('slug', slug);
    if (error) {
      console.error(`Error updating ${slug}:`, error);
    } else {
      console.log(`Successfully updated features for ${slug}`);
    }
  }
}

updateFeatures();
