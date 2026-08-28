import { NextResponse } from 'next/server';
import { generateBlogWithGemini } from '@/lib/gemini/blog-generator';
import { createAdminClient } from '@/lib/supabase';

export const runtime = 'edge';

const IDEAS = [
  { topic: "How to Win Esports Tournaments in 2026", category: "Esports Guides", keyword: "Esports Tournaments" },
  { topic: "Top 5 Weapon Combinations for BGMI Esports", category: "Gaming Tips", keyword: "BGMI Weapon Combinations" },
  { topic: "How to Build a Professional BGMI Squad", category: "Esports Guides", keyword: "BGMI Squad" },
  { topic: "The Future of Mobile Esports in India", category: "Gaming News", keyword: "Mobile Esports India" },
  { topic: "BGMI Advanced Movement Guide: Jiggle and Drop Shot", category: "Gaming Tips", keyword: "BGMI Movement Guide" },
  { topic: "How to qualify for BGIS 2026", category: "Tournament Guides", keyword: "BGIS 2026 Qualification" },
  { topic: "Best landing spots in Erangel for competitive BGMI", category: "Esports Guides", keyword: "Erangel Landing Spots" },
  { topic: "The role of the IGL in a BGMI team", category: "Esports Guides", keyword: "BGMI IGL Guide" },
  { topic: "How to Improve Close Range Combat in BGMI", category: "Gaming Tips", keyword: "BGMI Close Range" },
  { topic: "Best Sensitivity Settings for BGMI 2026", category: "Gaming Tips", keyword: "BGMI Sensitivity Settings" },
  { topic: "Why Game Sense is More Important Than Aim in BGMI", category: "Esports Guides", keyword: "BGMI Game Sense" },
  { topic: "Top 10 Emerging BGMI Players to Watch", category: "Gaming News", keyword: "Emerging BGMI Players" },
  { topic: "How to survive hot drops in competitive BGMI", category: "Gaming Tips", keyword: "BGMI Hot Drops" },
  { topic: "The psychology of a clutch in BGMI", category: "Esports Guides", keyword: "BGMI Clutch Mentality" },
  { topic: "Common mistakes amateur BGMI teams make", category: "Tournament Guides", keyword: "BGMI Amateur Mistakes" },
  { topic: "The ultimate guide to using throwables in BGMI", category: "Gaming Tips", keyword: "BGMI Throwables Guide" }
];

export async function GET(request: Request) {
  try {
    // 1. Verify Vercel Cron Secret (if set)
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;
    
    // Only verify if CRON_SECRET is actually configured in the environment
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Init Supabase and fetch existing blogs to avoid duplicates
    const supabaseAdmin = createAdminClient();
    
    const { data: existingBlogs } = await supabaseAdmin
      .from('ai_blogs')
      .select('focus_keyword');
      
    const usedKeywords = existingBlogs?.map((b: any) => b.focus_keyword) || [];
    
    // Filter out ideas that have already been generated
    const availableIdeas = IDEAS.filter(idea => !usedKeywords.includes(idea.keyword));
    
    // Select a random topic idea from available ones, or fallback to all if exhausted
    const pool = availableIdeas.length > 0 ? availableIdeas : IDEAS;
    const randomIdea = pool[Math.floor(Math.random() * pool.length)];

    // 3. Generate the blog using Gemini
    const blogData = await generateBlogWithGemini({
      topic: randomIdea.topic,
      category: randomIdea.category,
      focusKeyword: randomIdea.keyword,
    });

    // 4. Save to Supabase database
    const { data: existing } = await supabaseAdmin
      .from('ai_blogs')
      .select('id')
      .eq('slug', blogData.slug)
      .single();

    if (existing) {
      blogData.slug = `${blogData.slug}-${Math.random().toString(36).substring(2, 7)}`;
    }
    
    // Remove field not in schema
    const { secondary_keywords, ...dataToInsert } = blogData as any;

    const { error } = await supabaseAdmin
      .from('ai_blogs')
      .insert([{ ...dataToInsert, status: 'published' }]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: `Successfully generated and published: ${blogData.title}` });
  } catch (error: any) {
    console.error('Cron Blog Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
