import { MetadataRoute } from "next";

/**
 * robots.ts — Next.js App Router robots.txt generator
 *
 * NOTE: This file MUST be named "robots.ts" (plural) for Next.js to pick it up.
 * The previous file was incorrectly named "robot.ts" and was silently ignored.
 *
 * Disallows crawling of private/API routes while allowing all public pages.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/user-dashboard",
          "/_next/",
          "/static/",
        ],
      },
      // Prevent crawling of internal Next.js assets by specific bots
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/user-dashboard"],
      },
    ],
    sitemap: "https://xyloesports.in/sitemap.xml",
    host: "https://xyloesports.in",
  };
}
