import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";
import { generatePageMetadata, PageMetadataOptions } from "./metadata";

export async function getActiveGameName(): Promise<string> {
  try {
    const { data: config } = await supabase.from("active_game_config").select("active_game_id").single();
    if (config?.active_game_id) {
      const { data: game } = await supabase.from("games").select("name").eq("id", config.active_game_id).single();
      if (game) return game.name;
    }
  } catch (e) {
    console.error(e);
  }
  return "Esports";
}

export async function generateDynamicMetadata(
  pageType: "home" | "about" | "tournaments" | "faq" | "registration" | "past-streams" | "privacy" | "terms" | "terms-of-service" | "results" | "blogs",
  options: Partial<PageMetadataOptions> = {}
): Promise<Metadata> {
  const gameName = await getActiveGameName();

  let title = options.title || "";
  let description = options.description || "";
  let keywords = options.keywords || [];

  switch (pageType) {
    case "home":
      title = `XYLO Esports | Play ${gameName} Tournaments & Win Cash`;
      description = `Join XYLO Esports for ${gameName} tournaments, esports competitions, secure registrations, exciting prize pools, and fair competitive gaming across India.`;
      keywords = [`${gameName} Tournament Platform`, `${gameName} Cash Tournament`, `Online ${gameName} Tournament`, `${gameName} Custom Room`];
      break;
    case "about":
      title = { absolute: `About XYLO Esports | Premium ${gameName} Tournament Platform` };
      description = `Learn about XYLO Esports, India's trusted ${gameName} tournament platform. Discover our mission, vision, fair play commitment, and our competitive esports community.`;
      options.ogImageAlt = `About XYLO Esports — India's Leading ${gameName} Tournament Platform`;
      keywords = [`${gameName} Tournament Platform`, `${gameName} Cash Tournament`, `Online ${gameName} Tournament`];
      break;
    case "faq":
      title = { absolute: `${gameName} Tournament FAQ & Rules | XYLO Esports` };
      description = `Find answers to common questions about XYLO Esports ${gameName} tournaments — registration process, entry fees, rules, match format, and prize payouts.`;
      keywords = [`${gameName} FAQ`, `${gameName} Registration Help`, `${gameName} Prize Payout`];
      break;
    case "registration":
      title = { absolute: `${gameName} Tournament Registration & Contact | XYLO Esports` };
      description = `Register for ${gameName} tournaments on XYLO Esports. Fill out the form, pay the entry fee, and secure your slot. Contact our 24/7 support team for any queries.`;
      keywords = [`${gameName} Tournament Registration`, `Register ${gameName}`, `${gameName} Entry Fee`, `${gameName} Squad Registration`, `${gameName} Payment`];
      break;
    case "past-streams":
      title = { absolute: `Past ${gameName} Live Streams & VODs | XYLO Esports` };
      description = `Catch up on all the action you missed. Watch previous ${gameName} tournaments, scrims, and community matches on the XYLO Esports VOD archive.`;
      keywords = [`${gameName} Live Streams`, `${gameName} Tournaments VOD`, `XYLO Esports YouTube`];
      break;
    case "privacy":
      title = { absolute: `Privacy Policy | XYLO Esports ${gameName} Platform Data` };
      description = `Read the XYLO Esports Privacy Policy. Learn how we collect, use, and protect your personal data when you register for ${gameName} tournaments on our platform.`;
      keywords = [`${gameName} Data Protection`, `Privacy Policy`];
      break;
    case "terms":
      title = { absolute: `Terms & Conditions | XYLO Esports ${gameName} Tournaments` };
      description = `Read the XYLO Esports Terms and Conditions for participating in ${gameName} tournaments. Rules include fair play, no refund policy, and match conduct guidelines.`;
      keywords = [`${gameName} Tournament Rules`, `Terms and Conditions`];
      break;
    case "terms-of-service":
      title = { absolute: `Terms of Service | XYLO Esports ${gameName} Tournament Rules` };
      description = `XYLO Esports Terms of Service — rules and guidelines for participating in ${gameName} tournaments. Covers registration, no-refund policy, fair play, and match conduct.`;
      keywords = [`${gameName} Tournament Rules`, `No Refund Policy ${gameName}`];
      break;
    case "tournaments":
      title = { absolute: `${gameName} Tournaments - Register & Compete | XYLO Esports` };
      description = `Browse all upcoming ${gameName} tournaments on XYLO Esports. Solo, Duo, and Squad modes available. Register, pay, and compete for massive cash prize pools.`;
      options.ogImageAlt = `XYLO Esports ${gameName} Tournaments — Compete for Cash Prizes`;
      keywords = [`${gameName} Tournament List`, `Upcoming ${gameName} Tournament`, `${gameName} Squad Tournament`, `${gameName} Solo Tournament`, `${gameName} Duo Tournament`, `${gameName} Prize Money`, `${gameName} Mega Championship`];
      break;
    case "results":
      title = { absolute: `${gameName} Tournament Results & Standings | XYLO Esports` };
      description = `Check out the latest results, leaderboards, and standings from recent ${gameName} tournaments on XYLO Esports.`;
      keywords = [`${gameName} Tournament Results`, `${gameName} Leaderboard`, `Esports Results`];
      break;
    case "blogs":
      title = { absolute: `Blogs & News | XYLO Esports ${gameName} Updates` };
      description = `Read the latest ${gameName} tournament strategies, esports news, and gaming tips on the XYLO Esports blog.`;
      keywords = [`${gameName} Esports News`, `${gameName} Tips`, `XYLO Esports Blog`];
      break;
  }

  return generatePageMetadata({
    title,
    description,
    keywords,
    ...options
  });
}
