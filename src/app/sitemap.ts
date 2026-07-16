import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";

const BASE = SITE_CONFIG.url; // https://xyloesports.in

/**
 * sitemap.ts — Next.js App Router sitemap.xml generator
 *
 * Includes all static pages with appropriate priorities and change frequencies.
 * For dynamic blog/tournament pages, add a fetch here to include those URLs.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static Pages ─────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE}/tournaments`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${BASE}/contact`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${BASE}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ── Dynamic Blog Pages ────────────────────────────────────────────────────
  // When you have a CMS / Supabase blog table, fetch slugs here:
  //
  // const { data: posts } = await supabase
  //   .from("blog_posts")
  //   .select("slug, updated_at")
  //   .eq("published", true);
  //
  // const blogPages: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
  //   url: `${BASE}/blog/${post.slug}`,
  //   lastModified: new Date(post.updated_at),
  //   changeFrequency: "weekly",
  //   priority: 0.75,
  // }));
  //
  // return [...staticPages, ...blogPages];

  return staticPages;
}