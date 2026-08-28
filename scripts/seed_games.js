const fs = require('fs');
const env = fs.readFileSync('d:/myWork/bgmi/bgmi-admin-pannel/.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) acc[k.trim()] = v.join('=').trim().replace(/^['"]|['"]$/g, '');
  return acc;
}, {});
process.env = { ...process.env, ...env };
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding categories and games...");

  // 1. Seed Categories
  const categories = [
    {
      name: 'Battle Royale',
      slug: 'battle-royale',
      emoji: '🪂',
      sort_order: 1,
      primary_color: '#F59E0B',
      secondary_color: '#D97706',
      accent_color: '#10B981',
      color_background: '#0a0a0a',
      color_text: '#ffffff',
      color_muted: '#737373',
      color_surface: '#171717',
      color_card: '#262626',
      color_border: '#404040',
      color_glow: '#F59E0B',
      gradient_start: '#F59E0B',
      gradient_end: '#000000',
      overall_feel: 'Intense, survival-focused, gritty',
      is_active: true
    },
    {
      name: 'Fighting Games',
      slug: 'fighting',
      emoji: '🥊',
      sort_order: 2,
      primary_color: '#EF4444',
      secondary_color: '#DC2626',
      accent_color: '#F59E0B',
      color_background: '#1a0505',
      color_text: '#ffffff',
      color_muted: '#991b1b',
      color_surface: '#2e0a0a',
      color_card: '#450a0a',
      color_border: '#7f1d1d',
      color_glow: '#EF4444',
      gradient_start: '#EF4444',
      gradient_end: '#1a0505',
      overall_feel: 'Aggressive, fast-paced, competitive',
      is_active: true
    }
  ];

  for (const cat of categories) {
    const { data, error } = await supabase.from('game_categories').upsert(cat, { onConflict: 'slug' }).select();
    if (error) console.error("Error inserting category:", error);
    else console.log(`Category seeded: ${cat.name}`);
  }

  // Get categories back
  const { data: catData } = await supabase.from('game_categories').select('*');
  const brCategory = catData.find(c => c.slug === 'battle-royale');
  const fgCategory = catData.find(c => c.slug === 'fighting');

  // 2. Seed Games
  const games = [
    {
      name: 'Battlegrounds Mobile India',
      theme_identifier: 'bgmi',
      slug: 'bgmi',
      category_id: brCategory.id,
      series_id: brCategory.id, // backward compatibility
      is_active: true,
      tagline: 'Survival of the fittest',
      short_description: 'Join the ultimate battle royale experience tailored for India.',
      long_description: 'Drop into diverse maps, loot, and outlast 99 other players in BGMI.',
      game_primary_color: '#F59E0B',
      game_secondary_color: '#D97706',
      game_accent_color: '#10B981',
      hero_heading: 'Dominate the Battlegrounds',
      hero_subheading: 'Compete in India\'s biggest mobile esports platform.',
      hero_paragraph: 'Prove your skills in daily scrims and weekly majors.',
      hero_primary_cta: 'Register Now',
      hero_secondary_cta: 'View Tournaments',
      why_choose_us_heading: 'Why Play BGMI Here?',
      why_choose_us_description: 'We offer the most competitive lobbies and fastest payouts.',
      why_choose_us_features: [
        { title: "Fair Play", description: "Strict anti-cheat monitoring." },
        { title: "Instant Payouts", description: "Win and get paid immediately." },
        { title: "Daily Scrims", description: "Practice every day with top tier teams." }
      ],
      about_heading: 'The Premier BGMI Hub',
      about_subheading: 'Where legends are made.',
      about_paragraph: 'XYLO Esports is home to the most intense BGMI tournaments.',
      about_cta: 'Learn More',
      tournaments_category_heading: 'BGMI Formats',
      tournaments_category_description: 'Choose your battle style.',
      tournament_formats: [
        { name: "Squads", description: "4v4 action" },
        { name: "Solos", description: "Lone wolf survival" }
      ],
      how_it_works_heading: 'How to Play',
      how_it_works_description: 'Start your journey to the top.',
      how_it_works_steps: [
        { title: "Register", description: "Sign up and link your BGMI ID" },
        { title: "Join Room", description: "Get ID/Pass 10 mins before match" },
        { title: "Dominate", description: "Survive and claim chicken dinner" }
      ],
      cta_heading: 'Ready for the Drop?',
      cta_description: 'Join thousands of active players.',
      cta_button_text: 'Join Discord',
      registration_heading: 'Squad Registration',
      registration_description: 'Sign up for the upcoming major.',
      registration_instructions: 'Fill out details for all 4 players.',
      registration_requirements: ["Level 40+", "KD 3.0+"],
      registration_confirmation: 'Registration Successful! Check email.',
      tournament_page_heading: 'BGMI Tournaments',
      tournament_page_description: 'Daily scrims and weekly prize pools.',
      upcoming_battles_heading: 'Upcoming Drops',
      daily_battle_heading: 'Daily Scrims',
      faq_heading: 'BGMI FAQs',
      faq_description: 'Everything you need to know.',
      game_faqs: [
        { q: "Is iPad allowed?", a: "No, mobile devices only." },
        { q: "When is room ID shared?", a: "15 minutes before match start." }
      ],
      blog_page_heading: 'BGMI Updates',
      blog_page_description: 'Patch notes, tips, and esports news.',
      blog_introductory_text: 'Stay updated with the latest in BGMI.',
      seo_meta_title: 'XYLO Esports | BGMI Tournaments',
      seo_meta_description: 'Play BGMI tournaments and win cash.',
      seo_og_title: 'BGMI Esports Hub',
      seo_og_description: 'Join the ultimate battle royale tournaments.',
      hero_background: '',
      why_choose_us_background: '',
      why_choose_us_side_image: '',
      tournament_categories_background: '',
      upcoming_battles_background: '',
      daily_battle_side_image: '',
      faq_background: '',
      registration_background: '',
      blog_background: ''
    },
    {
      name: 'Free Fire',
      theme_identifier: 'freefire',
      slug: 'free-fire',
      category_id: brCategory.id,
      series_id: brCategory.id,
      is_active: false,
      tagline: 'Booyah!',
      short_description: 'Fast-paced 50-player battle royale.',
      long_description: 'Drop in, loot, and survive 10 minutes of intense action.',
      game_primary_color: '#EAB308',
      game_secondary_color: '#CA8A04',
      game_accent_color: '#EF4444',
      hero_heading: 'Free Fire Esports',
      hero_subheading: 'Fastest BR tournaments on mobile.',
      hero_paragraph: 'Compete for daily Booyahs and huge cash prizes.',
      hero_primary_cta: 'Play Now',
      hero_secondary_cta: 'View Leaderboard',
      why_choose_us_heading: 'Why Free Fire?',
      why_choose_us_description: 'Quick matches, big rewards.',
      why_choose_us_features: [
        { title: "No Emulator", description: "Mobile-only lobbies." },
        { title: "Fast Paced", description: "10-minute intense matches." },
        { title: "Character Skills", description: "Full skill synergy allowed." }
      ],
      about_heading: 'Free Fire Hub',
      about_subheading: 'Where survivors clash.',
      about_paragraph: 'Join the fastest growing Free Fire community.',
      about_cta: 'About Us',
      tournaments_category_heading: 'FF Formats',
      tournaments_category_description: 'Clash Squad and Battle Royale.',
      tournament_formats: [
        { name: "Clash Squad", description: "4v4 round-based combat" },
        { name: "Battle Royale", description: "Classic 50-player survival" }
      ],
      how_it_works_heading: 'How to Play',
      how_it_works_description: 'Get your Booyah.',
      how_it_works_steps: [
        { title: "Sign Up", description: "Create an account" },
        { title: "Join", description: "Enter the custom room" },
        { title: "Win", description: "Get Booyah and claim prize" }
      ],
      cta_heading: 'Ready for Booyah?',
      cta_description: 'Jump into the next match.',
      cta_button_text: 'Play Free Fire',
      registration_heading: 'FF Registration',
      registration_description: 'Register your squad.',
      registration_instructions: 'Provide exact in-game names.',
      registration_requirements: ["Level 30+"],
      registration_confirmation: 'You are registered for the next Booyah event!',
      tournament_page_heading: 'Free Fire Events',
      tournament_page_description: 'Daily Clash Squads & BR.',
      upcoming_battles_heading: 'Next Matches',
      daily_battle_heading: 'Daily Clash',
      faq_heading: 'FF FAQs',
      faq_description: 'Common questions.',
      game_faqs: [
        { q: "Are gun skins allowed?", a: "No, all attributes disabled." }
      ],
      blog_page_heading: 'Free Fire News',
      blog_page_description: 'Latest OB updates and tips.',
      blog_introductory_text: 'Read about the new character metas.',
      seo_meta_title: 'XYLO Esports | Free Fire Tournaments',
      seo_meta_description: 'Win cash in daily Free Fire tournaments.',
      seo_og_title: 'Play Free Fire',
      seo_og_description: 'Fast-paced BR action.',
      hero_background: '',
      why_choose_us_background: '',
      why_choose_us_side_image: '',
      tournament_categories_background: '',
      upcoming_battles_background: '',
      daily_battle_side_image: '',
      faq_background: '',
      registration_background: '',
      blog_background: ''
    },
    {
      name: 'Tekken 8',
      theme_identifier: 'tekken8',
      slug: 'tekken-8',
      category_id: fgCategory.id,
      series_id: fgCategory.id,
      is_active: false,
      tagline: 'Fist Meets Fate',
      short_description: 'The King of Iron Fist Tournament.',
      long_description: 'Experience the next-gen fighting game with aggressive new mechanics.',
      game_primary_color: '#EF4444',
      game_secondary_color: '#DC2626',
      game_accent_color: '#F59E0B',
      hero_heading: 'The King of Iron Fist',
      hero_subheading: 'Next-gen fighting game tournaments.',
      hero_paragraph: 'Show your execution and fundamentals.',
      hero_primary_cta: 'Enter Tournament',
      hero_secondary_cta: 'View Brackets',
      why_choose_us_heading: 'Why Tekken Here?',
      why_choose_us_description: 'Lag-free brackets and strict rules.',
      why_choose_us_features: [
        { title: "Wired Only", description: "Ethernet connection required." },
        { title: "Double Elimination", description: "Standard FGC bracket format." },
        { title: "Streamed Finals", description: "Top 8 broadcasted live." }
      ],
      about_heading: 'Tekken 8 Circuit',
      about_subheading: 'Fist meets fate.',
      about_paragraph: 'Compete with the best players in the region.',
      about_cta: 'FGC Rules',
      tournaments_category_heading: 'Formats',
      tournaments_category_description: '1v1 Combat.',
      tournament_formats: [
        { name: "1v1 Singles", description: "Standard FT2 pools, FT3 finals" }
      ],
      how_it_works_heading: 'How to Compete',
      how_it_works_description: 'Check-in on time.',
      how_it_works_steps: [
        { title: "Register", description: "Sign up on smash.gg/xylo" },
        { title: "Check-in", description: "Discord check-in 1 hr before" },
        { title: "Fight", description: "Find opponent and play" }
      ],
      cta_heading: 'Ready for the Next Battle?',
      cta_description: 'Prove you are the best.',
      cta_button_text: 'Join Discord',
      registration_heading: 'T8 Registration',
      registration_description: 'Enter the next online weekly.',
      registration_instructions: 'Must be in the Asian region for ping.',
      registration_requirements: ["PC/PS5", "Wired Connection"],
      registration_confirmation: 'Registered! See you in the bracket.',
      tournament_page_heading: 'Tekken Tournaments',
      tournament_page_description: 'Weekly online brackets.',
      upcoming_battles_heading: 'Upcoming Weeklies',
      daily_battle_heading: 'Daily Lobbies',
      faq_heading: 'Tekken FAQs',
      faq_description: 'FGC rules.',
      game_faqs: [
        { q: "Is Wi-Fi allowed?", a: "No, you must use a wired connection." },
        { q: "What is the format?", a: "First to 2 until Top 8, then First to 3." }
      ],
      blog_page_heading: 'Tekken News',
      blog_page_description: 'Patch notes and tech.',
      blog_introductory_text: 'Learn match-ups and frame data.',
      seo_meta_title: 'XYLO Esports | Tekken 8 Tournaments',
      seo_meta_description: 'Compete in Tekken 8 online weeklies.',
      seo_og_title: 'Tekken 8 Weeklies',
      seo_og_description: 'Join the King of Iron Fist Tournament.',
      hero_background: '',
      why_choose_us_background: '',
      why_choose_us_side_image: '',
      tournament_categories_background: '',
      upcoming_battles_background: '',
      daily_battle_side_image: '',
      faq_background: '',
      registration_background: '',
      blog_background: ''
    }
  ];

  for (const game of games) {
    const { data: existing } = await supabase.from('games').select('id').eq('slug', game.slug).single();
    if (existing) {
      const { error } = await supabase.from('games').update(game).eq('id', existing.id);
      if (error) console.error("Error updating game:", error);
      else console.log(`Game updated: ${game.name}`);
    } else {
      const { error } = await supabase.from('games').insert(game);
      if (error) console.error("Error inserting game:", error);
      else console.log(`Game inserted: ${game.name}`);
    }
  }

  // Set active game config
  const { data: bgmiData } = await supabase.from('games').select('*').eq('slug', 'bgmi').single();
  if (bgmiData) {
    await supabase.from('active_game_config').upsert({ id: 1, active_game_id: bgmiData.id });
    console.log("Set BGMI as active game in config.");
  }

  console.log("Done!");
}

seed();
