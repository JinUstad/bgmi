/**
 * Terms of Service Page — Server Component
 * Exports metadata. Interactive UI is in TermsOfServiceContent (client component).
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const TermsOfServiceContent = dynamic(() => import("./_components/terms-of-service-content"), { ssr: true });

export const metadata: Metadata = generatePageMetadata({
  title: { absolute: "Terms of Service | XYLO Esports BGMI Tournament Rules" },
  description:
    "XYLO Esports Terms of Service — rules and guidelines for participating in BGMI tournaments. Covers registration, no-refund policy, fair play, and match conduct.",
  path: "/terms-of-service",
  noIndex: false,
  keywords: [
    "XYLO Esports Terms of Service",
    "BGMI Tournament Rules",
    "Tournament Terms",
    "No Refund Policy BGMI",
  ],
});

export default function TermsOfServicePage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Terms of Service", url: "/terms-of-service" },
          ]),
          webPageSchema({
            title: "Terms of Service | XYLO Esports BGMI Tournament Rules",
            description: "XYLO Esports Terms of Service — rules and guidelines for participating in BGMI tournaments. Covers registration, no-refund policy, fair play, and match conduct.",
            path: "/terms-of-service",
          }),
        ]}
        id="terms-of-service-schema"
      />
      <TermsOfServiceContent />
    </>
  );
}
