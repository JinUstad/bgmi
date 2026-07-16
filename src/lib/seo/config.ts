/**
 * XYLO Esports — Global SEO Configuration
 * Single source of truth for all SEO-related constants.
 * Import from this file everywhere — never hardcode these values.
 */

export const SITE_CONFIG = {
  /** Canonical site URL — no trailing slash, no www */
  url: "https://www.xyloesports.in",

  /** Brand name used in title template and OG */
  name: "XYLO Esports",

  /** Short tagline for meta descriptions */
  tagline: "India's #1 BGMI & Esports Tournament Platform",

  /** Full default description */
  description:
    "Join India's premier BGMI and Esports tournament platform. Play Solo, Duo, Squad, and Custom Room matches to win exciting cash prizes. Register online and compete with the best gamers.",

  /** Twitter handle (without @) */
  twitterHandle: "xyloesports",

  /** Default OG / Twitter card image (relative to site root) */
  ogImage: "/og-image.jpg",

  /** OG image dimensions */
  ogImageWidth: 1200,
  ogImageHeight: 630,

  /** Locale for OpenGraph */
  locale: "en_IN",

  /** Site category for metadata */
  category: "Gaming",

  /** Publisher / creator */
  publisher: "XYLO Esports",
  creator: "XYLO Esports",

  /** Author array */
  authors: [{ name: "XYLO Esports", url: "https://www.xyloesports.in" }],

  /** Default global keywords */
  keywords: [
    "BGMI Tournament",
    "BGMI Registration",
    "Esports India",
    "BGMI Cash Tournament",
    "PUBG Tournament",
    "Gaming Tournament",
    "XYLO Esports",
    "Online Tournament",
    "BGMI Custom Room",
    "Esports Platform",
    "Mobile Gaming India",
    "BGMI Prize Pool",
  ],

  /** PWA / manifest theme colours */
  themeColor: "#F0A500",
  backgroundColor: "#000000",

  /** Social links used in Organization schema */
  socialLinks: [
    "https://www.instagram.com/xyloesports",
    "https://www.youtube.com/@xyloesports",
    "https://twitter.com/xyloesports",
  ],
} as const;

/** Canonical page paths — keeps URLs centralised */
export const PAGE_PATHS = {
  home: "/",
  about: "/about",
  tournaments: "/tournaments",
  contact: "/contact",
  faq: "/faq",
  blog: "/blog",
  privacy: "/privacy",
  terms: "/terms",
  termsOfService: "/terms-of-service",
  userDashboard: "/user-dashboard",
} as const;

/** Helper: build an absolute URL from a relative path */
export function buildUrl(path: string = "/"): string {
  const base = SITE_CONFIG.url.replace(/\/$/, "");
  const slug = path.startsWith("/") ? path : `/${path}`;
  return `${base}${slug}`;
}
