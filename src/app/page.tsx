/**
 * Home Page — Server Component
 *
 * Exports metadata for SEO. The interactive client components
 * are imported and rendered here without "use client" at the page level.
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { HeroSection } from "@/components/home/hero-section";
import { UpcomingTournament } from "@/components/home/upcoming-tournament";
import { LiveStats } from "@/components/home/live-stats";
import { AboutSection } from "@/components/home/about-section";
import { CategoriesSection } from "@/components/home/categories";
import { TimelineSection } from "@/components/home/timeline";
import { GameExpoSection } from "@/components/home/game-expo-section";
import HomeCtaSection from "./_components/home-cta-section";

export const metadata: Metadata = generatePageMetadata({
  title: "XYLO Esports | India's #1 BGMI & Esports Tournament Platform",
  description:
    "Join India's premier BGMI and Esports tournament platform. Play Solo, Duo, Squad, and Custom Room matches to win exciting cash prizes. Register online and compete with the best gamers.",
  path: "/",
  keywords: [
    "BGMI Solo Tournament",
    "BGMI Duo Tournament",
    "BGMI Squad Tournament",
    "India Gaming",
    "Esports Cash Prizes",
    "BGMI Custom Room",
  ],
});

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Home page breadcrumb JSON-LD */}
      <JsonLd
        schema={breadcrumbSchema([{ name: "Home", url: "/" }])}
        id="home-breadcrumb"
      />

      <HeroSection />
      <UpcomingTournament />
      <LiveStats />
      <AboutSection />
      <GameExpoSection />
      <CategoriesSection />
      <TimelineSection />
      <HomeCtaSection />
    </div>
  );
}
