/**
 * Contact Page — Server Component
 * Exports metadata. Interactive registration form is in ContactContent (client).
 */
import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo/dynamic-metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const ContactContent = dynamic(() => import("./_components/contact-content"), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMetadata("registration");
}


export default function ContactPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Register", url: "/registration" },
          ]),
          webPageSchema({
            title: "Esports Tournament Registration & Contact | XYLO Esports",
            description:
              "Register for Esports tournaments on XYLO Esports. Secure your slot and win exciting cash prizes.",
            path: "/registration",
          }),
        ]}
        id="contact-schema"
      />
      <ContactContent />
    </>
  );
}
