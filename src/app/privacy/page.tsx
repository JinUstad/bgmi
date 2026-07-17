/**
 * Privacy Policy Page — Server Component
 * Exports metadata. Interactive UI is in PrivacyContent (client component).
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const PrivacyContent = dynamic(() => import("./_components/privacy-content"), { ssr: true });

export const metadata: Metadata = generatePageMetadata({
  title: { absolute: "Privacy Policy | XYLO Esports BGMI Platform Data" },
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
            title: "Privacy Policy | XYLO Esports BGMI Platform Data",
            description: "Read the XYLO Esports Privacy Policy. Learn how we collect, use, and protect your personal data when you register for BGMI tournaments on our platform.",
            path: "/privacy",
          }),
        ]}
        id="privacy-schema"
      />
      <PrivacyContent />
    </>
  );
}
