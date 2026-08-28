/**
 * Past Streams Page — Server Component
 * Exports metadata. Interactive UI is in PastStreamsContent (client component).
 */
import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo/dynamic-metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const PastStreamsContent = dynamic(() => import("./_components/past-streams-content"), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMetadata("past-streams");
}


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
            description: "Watch previous Esports tournaments and scrims on the XYLO Esports VOD archive.",
            path: "/past-streams",
          }),
        ]}
        id="past-streams-schema"
      />
      <PastStreamsContent />
    </>
  );
}
