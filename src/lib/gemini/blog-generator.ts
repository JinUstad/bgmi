import { GoogleGenAI, Type, Schema } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey });

export interface GenerateBlogParams {
  topic: string;
  category: string;
  focusKeyword: string;
}

export interface GeneratedBlog {
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  secondary_keywords: string[];
  category: string;
  tags: string[];
  featured_image_prompt: string;
  banner_title: string;
  banner_subtitle: string;
  content: string;
  faq: { question: string; answer: string }[];
  conclusion: string;
  cta: string;
  reading_time: number;
  seo_score: number;
}

export async function generateBlogWithGemini({
  topic,
  category,
  focusKeyword,
}: GenerateBlogParams): Promise<GeneratedBlog> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from environment variables.');
  }

  const prompt = `
You are an expert SEO Content Writer, Gaming Journalist, and Technical SEO Specialist.
Your task is to generate a PREMIUM QUALITY, HUMAN-WRITTEN, SEO-OPTIMIZED BLOG ARTICLE.

Website Name: XYLO Esports
Website URL: https://xyloesports.in
Industry: Gaming, BGMI, PUBG Mobile, Esports, Gaming Tournament

Topic: ${topic}
Category: ${category}
Focus Keyword: ${focusKeyword}

CONTENT REQUIREMENTS:
- Write between 1500 and 2000 words in the 'content' field using semantic HTML (h2, h3, p, ul, li).
- Generate SEO Friendly Title and URL Friendly Slug.
- Generate Meta Title (under 60 chars) and Meta Description (under 160 chars).
- Provide a Featured Image Prompt for AI generation.
- Use Focus Keyword and Secondary Keywords naturally.
- Content must be Google Helpful Content compliant.
`;

  // Define the schema for structured JSON output
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      slug: { type: Type.STRING },
      excerpt: { type: Type.STRING },
      meta_title: { type: Type.STRING },
      meta_description: { type: Type.STRING },
      focus_keyword: { type: Type.STRING },
      secondary_keywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      category: { type: Type.STRING },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      featured_image_prompt: { type: Type.STRING },
      banner_title: { type: Type.STRING },
      banner_subtitle: { type: Type.STRING },
      content: { type: Type.STRING, description: "HTML content using h2, h3, p, ul, li tags" },
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
      "focus_keyword", "secondary_keywords", "category", "tags",
      "featured_image_prompt", "banner_title", "banner_subtitle",
      "content", "faq", "conclusion", "cta", "reading_time", "seo_score"
    ],
  };

  try {
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
      throw new Error('Empty response from Gemini');
    }

    const blogData = JSON.parse(text) as GeneratedBlog;
    return blogData;
  } catch (error: any) {
    console.error('Error generating blog with Gemini:', error);
    throw error;
  }
}
