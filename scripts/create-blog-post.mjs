import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const apiKey = process.env.GEMINI_API_KEY || '';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is missing from .env.local');
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase environment variables missing');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateAndInsertBlog() {
  const topic = "Top 5 Weapon Combinations for BGMI Esports 2026";
  const category = "Gaming Tips";
  const focusKeyword = "BGMI Weapon Combinations";

  console.log(`Generating blog post for topic: "${topic}"...`);

  const prompt = `
You are an expert SEO Content Writer, BGMI Analyst, and Esports Specialist.
Generate a PREMIUM QUALITY, COMPREHENSIVE, HUMAN-WRITTEN, SEO-OPTIMIZED BLOG ARTICLE.

Website Name: XYLO Esports
Website URL: https://xyloesports.in
Industry: BGMI, Esports, Competitive Mobile Gaming

Topic: ${topic}
Category: ${category}
Focus Keyword: ${focusKeyword}

CONTENT REQUIREMENTS:
- Write detailed, highly actionable gaming content in the 'content' field using clean semantic HTML (h2, h3, p, ul, li, strong).
- Provide 5 distinct, powerful weapon setups for close range, mid range, DMR/Sniper combos, and IGL/Assaulter loadouts.
- Include tactical tips on attachment setups, recoil control, ammo management, and squad role synergy.
- Generate SEO Friendly Title and clean URL Slug.
- Generate Meta Title (under 60 chars) and Meta Description (under 160 chars).
- Focus Keyword and Secondary Keywords must be integrated naturally.
`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      slug: { type: Type.STRING },
      excerpt: { type: Type.STRING },
      meta_title: { type: Type.STRING },
      meta_description: { type: Type.STRING },
      focus_keyword: { type: Type.STRING },
      category: { type: Type.STRING },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      featured_image_prompt: { type: Type.STRING },
      banner_title: { type: Type.STRING },
      banner_subtitle: { type: Type.STRING },
      content: { type: Type.STRING },
      faq: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
          },
        },
      },
      conclusion: { type: Type.STRING },
      cta: { type: Type.STRING },
      reading_time: { type: Type.INTEGER },
      seo_score: { type: Type.INTEGER },
    },
    required: [
      "title", "slug", "excerpt", "meta_title", "meta_description",
      "focus_keyword", "category", "tags", "featured_image_prompt",
      "banner_title", "banner_subtitle", "content", "faq", "conclusion",
      "cta", "reading_time", "seo_score"
    ],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
      temperature: 0.7,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('No content returned from Gemini API');
  }

  const blogData = JSON.parse(text);

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from('ai_blogs')
    .select('id')
    .eq('slug', blogData.slug)
    .single();

  if (existing) {
    blogData.slug = `${blogData.slug}-${Math.random().toString(36).substring(2, 7)}`;
  }

  console.log(`Inserting blog into Supabase: "${blogData.title}"...`);

  const { data, error } = await supabase
    .from('ai_blogs')
    .insert([{
      ...blogData,
      status: 'published',
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) {
    console.error('Failed to insert blog into Supabase:', error);
    process.exit(1);
  }

  console.log('Blog successfully created and published!');
  console.log('Blog Title:', blogData.title);
  console.log('Blog Slug:', blogData.slug);
  console.log('Blog ID:', data[0].id);
}

generateAndInsertBlog().catch((err) => {
  console.error('Error generating blog:', err);
  process.exit(1);
});
