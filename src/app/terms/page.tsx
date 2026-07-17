/**
 * Terms & Conditions Page — Server Component
 * Exports metadata. Interactive UI is in TermsContent (client component).
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const TermsContent = dynamic(() => import("./_components/terms-content"), { ssr: true });

export const metadata: Metadata = generatePageMetadata({
  title: { absolute: "Terms & Conditions | XYLO Esports BGMI Tournaments" },
  description:
    "Read the XYLO Esports Terms and Conditions for participating in BGMI tournaments. Rules include fair play, no refund policy, and match conduct guidelines.",
  path: "/terms",
  noIndex: false,
  keywords: [
    "XYLO Esports Terms",
    "BGMI Tournament Rules",
    "Tournament Terms Conditions",
    "No Refund Policy",
  ],
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Terms & Conditions", url: "/terms" },
          ]),
          webPageSchema({
            title: "Terms & Conditions | XYLO Esports BGMI Tournaments",
            description: "Read the XYLO Esports Terms and Conditions for participating in BGMI tournaments. Rules include fair play, no refund policy, and match conduct guidelines.",
            path: "/terms",
          }),
        ]}
        id="terms-schema"
      />
      <TermsContent />
    </>
  );
}
