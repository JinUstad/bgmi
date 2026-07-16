import { NextResponse } from 'next/server';
import { generateBlogWithGemini } from '@/lib/gemini/blog-generator';
import { createAdminClient } from '@/lib/supabase';

const IDEAS = [
  { topic: "How to Win BGMI Tournaments in 2026", category: "Esports Guides", keyword: "BGMI Tournaments" },
  { topic: "Top 5 Weapon Combinations for BGMI Esports", category: "Gaming Tips", keyword: "BGMI Weapon Combinations" },
  { topic: "How to Build a Professional BGMI Squad", category: "Esports Guides", keyword: "BGMI Squad" },
  { topic: "The Future of Mobile Esports in India", category: "Gaming News", keyword: "Mobile Esports India" },
  { topic: "BGMI Advanced Movement Guide: Jiggle and Drop Shot", category: "Gaming Tips", keyword: "BGMI Movement Guide" },
  { topic: "How to qualify for BGIS 2026", category: "Tournament Guides", keyword: "BGIS 2026 Qualification" },
  { topic: "Best landing spots in Erangel for competitive BGMI", category: "Esports Guides", keyword: "Erangel Landing Spots" },
  { topic: "The role of the IGL in a BGMI team", category: "Esports Guides", keyword: "BGMI IGL Guide" }
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

    // 2. Select a random topic idea
    const randomIdea = IDEAS[Math.floor(Math.random() * IDEAS.length)];

    // 3. Generate the blog using Gemini
    const blogData = await generateBlogWithGemini({
      topic: randomIdea.topic,
      category: randomIdea.category,
      focusKeyword: randomIdea.keyword,
    });

    // 4. Save to Supabase database
    const supabaseAdmin = createAdminClient();
    
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
