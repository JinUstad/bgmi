/**
 * Contact Page — Server Component
 * Exports metadata. Interactive registration form is in ContactContent (client).
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import ContactContent from "./_components/contact-content";

export const metadata: Metadata = generatePageMetadata({
  title: "Tournament Registration & Contact",
  description:
    "Register for BGMI tournaments on XYLO Esports. Fill out the form, pay the entry fee, and secure your slot. Contact our 24/7 support team for any queries.",
  path: "/contact",
  ogImage: "/pubg_contact_bg.png",
  ogImageAlt: "XYLO Esports Tournament Registration",
  keywords: [
    "BGMI Tournament Registration",
    "Register BGMI",
    "BGMI Entry Fee",
    "BGMI Squad Registration",
    "Contact XYLO Esports",
    "Esports Support",
    "BGMI Payment",
  ],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Register & Contact", url: "/contact" },
          ]),
          webPageSchema({
            title: "Tournament Registration & Contact | XYLO Esports",
            description:
              "Register for BGMI tournaments on XYLO Esports. Secure your slot and win exciting cash prizes.",
            path: "/contact",
          }),
        ]}
        id="contact-schema"
      />
      <ContactContent />
    </>
  );
}
