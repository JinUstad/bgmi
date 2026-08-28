/**
 * SEO Library — Barrel Export
 *
 * Import everything from "@/lib/seo" for convenience.
 *
 * @example
 * import { generatePageMetadata, SITE_CONFIG, organizationSchema } from "@/lib/seo";
 */
export { SITE_CONFIG, PAGE_PATHS, buildUrl } from "./config";
export type { PageMetadataOptions } from "./metadata";
export { generatePageMetadata } from "./metadata";
export {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  faqSchema,
  tournamentEventSchema,
  articleSchema,
  personSchema,
  webPageSchema,
} from "./schemas";
export type {
  BreadcrumbItem,
  TournamentSchemaData,
  ArticleSchemaData,
  FaqItem,
  PersonSchemaData,
} from "./schemas";
