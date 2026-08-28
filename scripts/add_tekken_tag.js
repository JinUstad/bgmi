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

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTekkenTag() {
  console.log("Adding Tekken Tag...");

  const { data: fgCategory } = await supabase.from('game_categories').select('id').eq('slug', 'fighting').single();
  
  if (!fgCategory) {
    console.log("Fighting category not found!");
    return;
  }

  const tekkenTagGame = {
    name: 'Tekken Tag Tournament 2',
    theme_identifier: 'tekkentag2',
    slug: 'tekken-tag-2',
    category_id: fgCategory.id,
    series_id: fgCategory.id,
    is_active: false,
    tagline: 'Tag Team Battle',
    short_description: 'The ultimate 2v2 Tag Team fighter.',
    long_description: 'Double the roster, double the combat. Experience classic Tag mechanics and insane combos.',
    game_primary_color: '#3B82F6', // Blue for TTT2
    game_secondary_color: '#1D4ED8',
    game_accent_color: '#F59E0B',
    hero_heading: 'Tag Team Action',
    hero_subheading: 'Classic 2v2 fighting game tournaments.',
    hero_paragraph: 'Master the tag mechanics and dominate the arena.',
    hero_primary_cta: 'Enter Tournament',
    hero_secondary_cta: 'View Brackets',
    why_choose_us_heading: 'Why Play TTT2?',
    why_choose_us_description: 'The best classic tag battles.',
    why_choose_us_features: [
      { title: "2v2 Combat", description: "Master two characters." },
      { title: "Classic Meta", description: "Old school movement and mechanics." },
      { title: "Huge Roster", description: "The largest Tekken roster ever." },
      { title: "Retro Vibes", description: "Relive the golden era of tag fighters." }
    ],
    about_heading: 'Tekken Tag 2 Circuit',
    about_subheading: 'Tag in.',
    about_paragraph: 'Compete in the retro tag team scene.',
    about_cta: 'Tournament Rules',
    tournaments_category_heading: 'Formats',
    tournaments_category_description: '2v2 Tag Combat.',
    tournament_formats: [
      { name: "2v2 Tag Singles", description: "Standard FT2 pools" }
    ],
    how_it_works_heading: 'How to Compete',
    how_it_works_description: 'Join the retro lobbies.',
    how_it_works_steps: [
      { title: "Register", description: "Sign up via the form" },
      { title: "Netplay", description: "Connect via emulator or console" },
      { title: "Fight", description: "Report scores" }
    ],
    cta_heading: 'Ready to Tag In?',
    cta_description: 'Find your perfect duo.',
    cta_button_text: 'Join Discord',
    registration_heading: 'TTT2 Registration',
    registration_description: 'Enter the retro weekly.',
    registration_instructions: 'Valid netplay setup required.',
    registration_requirements: ["Console/Emulator", "Wired Connection"],
    registration_confirmation: 'Registered! See you in the bracket.',
    tournament_page_heading: 'TTT2 Tournaments',
    tournament_page_description: 'Classic tag team brackets.',
    upcoming_battles_heading: 'Upcoming Throwbacks',
    daily_battle_heading: 'Netplay Lobbies',
    faq_heading: 'TTT2 FAQs',
    faq_description: 'Retro rules.',
    game_faqs: [
      { q: "Is emulator allowed?", a: "Yes, standard netplay rules apply." },
      { q: "What is the format?", a: "First to 2." }
    ],
    blog_page_heading: 'TTT2 News',
    blog_page_description: 'Retro scene updates.',
    blog_introductory_text: 'Revisiting the classic tag meta.',
    seo_meta_title: 'XYLO Esports | Tekken Tag 2 Tournaments',
    seo_meta_description: 'Compete in Tekken Tag Tournament 2.',
    seo_og_title: 'Tekken Tag Weeklies',
    seo_og_description: 'Join the retro tag team battles.',
    hero_background: '',
    why_choose_us_background: '',
    why_choose_us_side_image: '',
    tournament_categories_background: '',
    upcoming_battles_background: '',
    daily_battle_side_image: '',
    faq_background: '',
    registration_background: '',
    blog_background: ''
  };

  const { data: existing } = await supabase.from('games').select('id').eq('slug', tekkenTagGame.slug).single();
  if (existing) {
    const { error } = await supabase.from('games').update(tekkenTagGame).eq('id', existing.id);
    if (error) console.error("Error updating:", error);
    else console.log("Tekken Tag 2 updated.");
  } else {
    const { error } = await supabase.from('games').insert(tekkenTagGame);
    if (error) console.error("Error inserting:", error);
    else console.log("Tekken Tag 2 inserted.");
  }
}

addTekkenTag();
