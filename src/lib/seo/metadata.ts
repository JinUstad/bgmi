import type { Metadata } from "next";
import { SITE_CONFIG, buildUrl } from "./config";

/**
 * Options accepted by generatePageMetadata().
 * All fields are optional — sensible defaults are applied from SITE_CONFIG.
 */
export interface PageMetadataOptions {
  /** Page title (without site name suffix unless absolute object is used) */
  title?: string | { absolute?: string; default?: string; template?: string };
  /** Page-specific description */
  description?: string;
  /** Relative or absolute URL path for this page (e.g. "/about") */
  path?: string;
  /** OG image URL (relative to site root or absolute). Defaults to SITE_CONFIG.ogImage */
  ogImage?: string;
  /** OG image alt text */
  ogImageAlt?: string;
  /** Additional keywords merged with global defaults */
  keywords?: string[];
  /** OpenGraph type — "website" for regular pages, "article" for blog posts */
  ogType?: "website" | "article";
  /** Override robots directive */
  noIndex?: boolean;
  /** Article-specific: publish date */
  publishedTime?: string;
  /** Article-specific: modified date */
  modifiedTime?: string;
  /** Article-specific: author name */
  authorName?: string;
  /** Article-specific: section / category */
  section?: string;
  /** Article-specific: tags array */
  tags?: string[];
}

/**
 * Generates a complete Next.js Metadata object for any page.
 *
 * @example
 * // In a server component page:
 * export const metadata = generatePageMetadata({
 *   title: "About",
 *   description: "Learn about XYLO Esports...",
 *   path: "/about",
 * });
 *
 * @example
 * // For dynamic pages using generateMetadata():
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const post = await fetchPost(params.slug);
 *   return generatePageMetadata({
 *     title: post.title,
 *     description: post.excerpt,
 *     path: `/blog/${post.slug}`,
 *     ogImage: post.coverImage,
 *     ogType: "article",
 *     publishedTime: post.publishedAt,
 *     modifiedTime: post.updatedAt,
 *   });
 * }
 */
export function generatePageMetadata(options: PageMetadataOptions = {}): Metadata {
  const {
    title,
    description = SITE_CONFIG.description,
    path = "/",
    ogImage = SITE_CONFIG.ogImage,
    ogImageAlt,
    keywords = [],
    ogType = "website",
    noIndex = false,
    publishedTime,
    modifiedTime,
    authorName,
    section,
    tags = [],
  } = options;

  const canonicalUrl = buildUrl(path);
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : buildUrl(ogImage);
  const imageAlt = ogImageAlt ?? (title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name);
  const mergedKeywords = [...new Set([...SITE_CONFIG.keywords, ...keywords])];

  const metadata: Metadata = {
    title: (title
      ? (typeof title === "string" ? { default: title, template: `%s | ${SITE_CONFIG.name}` } : title)
      : {
        default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
        template: `%s | ${SITE_CONFIG.name}`,
      }) as any,

    // ── Core ───────────────────────────────────────────────────────────────
    description,
    keywords: mergedKeywords,
    authors: [...SITE_CONFIG.authors],
    creator: SITE_CONFIG.creator,
    publisher: SITE_CONFIG.publisher,
    category: SITE_CONFIG.category,

    // ── Canonical ──────────────────────────────────────────────────────────
    alternates: {
      canonical: canonicalUrl,
    },

    // ── Robots ─────────────────────────────────────────────────────────────
    robots: noIndex
      ? {
        index: false,
        follow: false,
      }
      : {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },

    // ── OpenGraph ──────────────────────────────────────────────────────────
    openGraph: {
      type: ogType,
      locale: SITE_CONFIG.locale,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: typeof title === "string" ? title : (title?.absolute || title?.default || `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`),
      description,
      images: [
        {
          url: ogImageUrl,
          width: SITE_CONFIG.ogImageWidth,
          height: SITE_CONFIG.ogImageHeight,
          alt: imageAlt,
        },
      ],
      ...(ogType === "article" && {
        publishedTime,
        modifiedTime,
        authors: authorName ? [authorName] : [SITE_CONFIG.name],
        section,
        tags,
      }),
    },

    // ── Twitter Card ────────────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      site: `@${SITE_CONFIG.twitterHandle}`,
      creator: `@${SITE_CONFIG.twitterHandle}`,
      title: typeof title === "string" ? title : (title?.absolute || title?.default || `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`),
      description,
      images: [
        {
          url: ogImageUrl,
          alt: imageAlt,
        },
      ],
    },

    // ── Icons ───────────────────────────────────────────────────────────────
    icons: {
      icon: [
        { url: "/icons/icon-72.png", sizes: "72x72", type: "image/png" },
        { url: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
        { url: "/icons/icon-128.png", sizes: "128x128", type: "image/png" },
        { url: "/icons/icon-144.png", sizes: "144x144", type: "image/png" },
        { url: "/icons/icon-152.png", sizes: "152x152", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-384.png", sizes: "384x384", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },
  };

  return metadata;
}
