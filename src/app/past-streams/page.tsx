/**
 * Past Streams Page — Server Component
 * Exports metadata. Interactive UI is in PastStreamsContent (client component).
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const PastStreamsContent = dynamic(() => import("./_components/past-streams-content"), { ssr: true });

export const metadata: Metadata = generatePageMetadata({
  title: { absolute: "Past BGMI Live Streams & VODs | XYLO Esports" },
  description:
    "Catch up on all the action you missed. Watch previous BGMI tournaments, scrims, and community matches on the XYLO Esports VOD archive.",
  path: "/past-streams",
  noIndex: false,
  keywords: [
    "BGMI Live Streams",
    "Esports VODs",
    "Past Tournaments",
    "XYLO Esports Stream",
  ],
});

export default function PastStreamsPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Past Streams", url: "/past-streams" },
          ]),
          webPageSchema({
            title: "Past BGMI Live Streams & VODs | XYLO Esports",
            description: "Watch previous BGMI tournaments and scrims on the XYLO Esports VOD archive.",
            path: "/past-streams",
          }),
        ]}
        id="past-streams-schema"
      />
      <PastStreamsContent />
    </>
  );
}
