/**
 * FAQ Page — Server Component
 * Exports metadata + FAQPage JSON-LD. Interactive accordion is in FAQContent.
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const FAQContent = dynamic(() => import("./_components/faq-content"), { ssr: true });

// Keep FAQs here so they appear in JSON-LD (server-side) even though the
// accordion UI is client-side.
const FAQS = [
  {
    question: "How do I register for the tournament?",
    answer:
      "You can register by visiting the Tournament Registration page, filling out the form with your BGMI ID, team name, mobile number, and selecting a time slot. Pay the entry fee via UPI to confirm your slot.",
  },
  {
    question: "What is the entry fee?",
    answer:
      "The entry fee varies by tournament. The current Squad tournament entry fee is ₹99 (or as displayed on the registration page). Make sure to read all the details before registering.",
  },
  {
    question: "Can I change my team after registration?",
    answer:
      "No, once your team is registered, you cannot make any changes to the team members. Registration is final.",
  },
  {
    question: "What are the rules of the tournament?",
    answer:
      "All matches are played in BGMI's classic battle royale mode. Cheating, hacking, teaming with enemies, or using third-party software results in immediate disqualification. Tournament decisions by organizers are final.",
  },
  {
    question: "How will the matches be played?",
    answer:
      "Matches will be played online in the classic battle royale mode. Room IDs and passwords are shared via WhatsApp/email before the match. Players must join the room before the reporting time.",
  },
  {
    question: "How will the winners be decided?",
    answer:
      "Winners are decided based on the total points scored in all matches, combining placement points and kill points according to the official BGMI point system.",
  },
];

export const metadata: Metadata = generatePageMetadata({
  title: { absolute: "FAQ - Frequently Asked Questions | XYLO Esports" },
  description:
    "Find answers to common questions about XYLO Esports BGMI tournaments — registration process, entry fees, rules, match format, and prize payouts.",
  path: "/faq",
  keywords: [
    "BGMI FAQ",
    "Tournament Questions",
    "BGMI Registration Help",
    "Esports Rules",
    "BGMI Prize Payout",
    "Tournament Rules",
  ],
});

export default function FAQPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "FAQ", url: "/faq" },
          ]),
          faqSchema(FAQS),
        ]}
        id="faq-schema"
      />
      <FAQContent faqs={FAQS} />
    </>
  );
}
