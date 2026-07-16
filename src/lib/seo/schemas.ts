import { SITE_CONFIG, buildUrl } from "./config";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface TournamentSchemaData {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  organizer?: string;
  prizePool?: string;
  registrationUrl?: string;
  image?: string;
  status?: "EventScheduled" | "EventPostponed" | "EventCancelled" | "EventMovedOnline";
  entryFee?: string;
}

export interface ArticleSchemaData {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt: string;
  modifiedAt?: string;
  authorName: string;
  authorUrl?: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PersonSchemaData {
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Organization Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates an Organization JSON-LD schema.
 * Inject this on the home page and any key landing pages.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_CONFIG.url}/icons/icon-512.png`,
      width: 512,
      height: 512,
    },
    description: SITE_CONFIG.description,
    email: "support@xyloesports.in",
    telephone: "+918512889586",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rafikabad Colony Dasna",
      addressLocality: "Ghaziabad",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    sameAs: SITE_CONFIG.socialLinks,
    founder: {
      "@type": "Person",
      name: "XYLO Esports Team",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WebSite Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a WebSite JSON-LD schema with a sitelinks SearchAction.
 * Inject this on the home page only.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    publisher: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/tournaments?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-IN",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BreadcrumbList Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a BreadcrumbList JSON-LD schema.
 *
 * @example
 * breadcrumbSchema([
 *   { name: "Home", url: "/" },
 *   { name: "Tournaments", url: "/tournaments" },
 * ])
 */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildUrl(item.url),
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a FAQPage JSON-LD schema.
 * Use this on the /faq page and any page with an FAQ section.
 */
export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tournament / Event Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a SportsEvent JSON-LD schema for an esports tournament.
 * Use this on /tournaments and individual tournament detail pages.
 */
export function tournamentEventSchema(tournament: TournamentSchemaData) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: tournament.name,
    description: tournament.description,
    startDate: tournament.startDate,
    ...(tournament.endDate && { endDate: tournament.endDate }),
    eventStatus: `https://schema.org/${tournament.status ?? "EventScheduled"}`,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      name: tournament.location ?? "Online — BGMI Mobile",
      url: SITE_CONFIG.url,
    },
    organizer: {
      "@type": "Organization",
      name: tournament.organizer ?? SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    image: tournament.image
      ? buildUrl(tournament.image)
      : buildUrl(SITE_CONFIG.ogImage),
    url: buildUrl("/tournaments"),
    ...(tournament.registrationUrl && {
      offers: {
        "@type": "Offer",
        name: "Tournament Entry",
        price: tournament.entryFee?.replace(/[^\d.]/g, "") ?? "0",
        priceCurrency: "INR",
        url: buildUrl(tournament.registrationUrl),
        availability: "https://schema.org/InStock",
        validFrom: tournament.startDate,
      },
    }),
    ...(tournament.prizePool && {
      prize: tournament.prizePool,
    }),
    sport: "Battlegrounds Mobile India (BGMI)",
    competitor: {
      "@type": "SportsOrganization",
      name: "Open to All Registered Players",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Article / Blog Post Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a BlogPosting / Article JSON-LD schema.
 * Use this on every blog post page.
 */
export function articleSchema(article: ArticleSchemaData) {
  const articleUrl = buildUrl(`/blog/${article.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    description: article.description,
    url: articleUrl,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt ?? article.publishedAt,
    image: article.image ? buildUrl(article.image) : buildUrl(SITE_CONFIG.ogImage),
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "Blog",
      "@id": `${buildUrl("/blog")}#blog`,
      name: `${SITE_CONFIG.name} Blog`,
      publisher: {
        "@id": `${SITE_CONFIG.url}/#organization`,
      },
    },
    author: {
      "@type": "Person",
      name: article.authorName,
      url: article.authorUrl ?? SITE_CONFIG.url,
    },
    publisher: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(article.category && { articleSection: article.category }),
    ...(article.tags && article.tags.length > 0 && { keywords: article.tags.join(", ") }),
    ...(article.readingTime && {
      timeRequired: `PT${article.readingTime}M`,
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Person Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a Person JSON-LD schema.
 * Use this for team member / author pages.
 */
export function personSchema(person: PersonSchemaData) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    ...(person.url && { url: person.url }),
    ...(person.image && { image: buildUrl(person.image) }),
    ...(person.jobTitle && { jobTitle: person.jobTitle }),
    ...(person.description && { description: person.description }),
    ...(person.sameAs && { sameAs: person.sameAs }),
    worksFor: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WebPage Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a generic WebPage JSON-LD schema.
 * Useful for static pages like About, Privacy, Terms.
 */
export function webPageSchema(options: {
  title: string;
  description: string;
  path: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const pageUrl = buildUrl(options.path);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: options.title,
    description: options.description,
    isPartOf: {
      "@id": `${SITE_CONFIG.url}/#website`,
    },
    about: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    inLanguage: "en-IN",
    ...(options.breadcrumbs && {
      breadcrumb: breadcrumbSchema(options.breadcrumbs),
    }),
  };
}
