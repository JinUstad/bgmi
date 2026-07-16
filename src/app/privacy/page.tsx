/**
 * Privacy Policy Page — Server Component
 * Exports metadata. Interactive UI is in PrivacyContent (client component).
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import PrivacyContent from "./_components/privacy-content";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  description:
    "Read the XYLO Esports Privacy Policy. Learn how we collect, use, and protect your personal data when you register for BGMI tournaments on our platform.",
  path: "/privacy",
  noIndex: false,
  keywords: [
    "XYLO Esports Privacy Policy",
    "BGMI Data Protection",
    "Esports Privacy",
    "User Data Policy",
  ],
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Privacy Policy", url: "/privacy" },
          ]),
          webPageSchema({
            title: "Privacy Policy | XYLO Esports",
            description: "XYLO Esports Privacy Policy — how we collect and protect your data.",
            path: "/privacy",
          }),
        ]}
        id="privacy-schema"
      />
      <PrivacyContent />
    </>
  );
}
