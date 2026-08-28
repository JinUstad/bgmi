/**
 * Privacy Policy Page — Server Component
 * Exports metadata. Interactive UI is in PrivacyContent (client component).
 */
import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo/dynamic-metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const PrivacyContent = dynamic(() => import("./_components/privacy-content"), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMetadata("privacy");
}


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
            description: "Read the XYLO Esports Privacy Policy. Learn how we collect, use, and protect your personal data when you register for Esports tournaments on our platform.",
            path: "/privacy",
          }),
        ]}
        id="privacy-schema"
      />
      <PrivacyContent />
    </>
  );
}
