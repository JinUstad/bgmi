/**
 * Tournaments Page — Server Component
 * Exports metadata + Event JSON-LD. All interactive content is in TournamentsContent.
 */
import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo/dynamic-metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, tournamentEventSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const TournamentsContent = dynamic(() => import("./_components/tournaments-content"), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMetadata("tournaments");
}


export default function TournamentsPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tournaments", url: "/tournaments" },
          ]),
          // Feature the current active tournament in Event schema
          tournamentEventSchema({
            name: "XYLO Esports Mega Championship",
            description:
              "India's premier BGMI Squad tournament by XYLO Esports. Compete in TDM Squad mode and win exciting cash prizes. 100 slots available — register now.",
            startDate: "2026-09-05T10:00:00+05:30",
            endDate: "2026-09-06T22:00:00+05:30",
            prizePool: "1st: ₹800 | 2nd: ₹500",
            entryFee: "₹220",
            registrationUrl: "/registration",
            image: "/tournaments_hero_bg.png",
            status: "EventScheduled",
          }),
        ]}
        id="tournaments-schema"
      />
      <TournamentsContent />
    </>
  );
}
