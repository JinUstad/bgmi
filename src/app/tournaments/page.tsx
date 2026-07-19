/**
 * Tournaments Page — Server Component
 * Exports metadata + Event JSON-LD. All interactive content is in TournamentsContent.
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, tournamentEventSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const TournamentsContent = dynamic(() => import("./_components/tournaments-content"), { ssr: true });

export const metadata: Metadata = generatePageMetadata({
  title: { absolute: "BGMI Tournaments - Register & Compete | XYLO Esports" },
  description:
    "Browse all upcoming BGMI tournaments on XYLO Esports. Solo, Duo, and Squad modes available. Register, pay, and compete for massive cash prize pools.",
  path: "/tournaments",
  ogImage: "/tournaments_hero_bg.png",
  ogImageAlt: "XYLO Esports BGMI Tournaments — Compete for Cash Prizes",
  keywords: [
    "BGMI Tournament List",
    "Upcoming BGMI Tournament",
    "BGMI Squad Tournament",
    "BGMI Solo Tournament",
    "BGMI Duo Tournament",
    "Esports Competition India",
    "BGMI Prize Money",
    "BGMI Mega Championship",
  ],
});

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
