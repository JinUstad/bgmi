/**
 * Home Page — Server Component
 *
 * Exports metadata for SEO. The interactive client components
 * are imported and rendered here without "use client" at the page level.
 */
import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo/dynamic-metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { HeroSection } from "@/components/home/hero-section";
import { UpcomingTournament } from "@/components/home/upcoming-tournament";
import dynamic from "next/dynamic";

const PastLiveStreams = dynamic(() => import("@/components/home/past-live-streams").then(mod => mod.PastLiveStreams), { ssr: true });
const LiveStats = dynamic(() => import("@/components/home/live-stats").then(mod => mod.LiveStats), { ssr: true });
const AboutSection = dynamic(() => import("@/components/home/about-section").then(mod => mod.AboutSection), { ssr: true });
const CategoriesSection = dynamic(() => import("@/components/home/categories").then(mod => mod.CategoriesSection), { ssr: true });
const TimelineSection = dynamic(() => import("@/components/home/timeline").then(mod => mod.TimelineSection), { ssr: true });
const GameExpoSection = dynamic(() => import("@/components/home/game-expo-section").then(mod => mod.GameExpoSection), { ssr: true });
const HomeCtaSection = dynamic(() => import("./_components/home-cta-section"), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMetadata("home");
}


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
      <PastLiveStreams />
      <LiveStats />
      <AboutSection />
      <GameExpoSection />
      <CategoriesSection />
      <TimelineSection />
      <HomeCtaSection />
    </div>
  );
}
