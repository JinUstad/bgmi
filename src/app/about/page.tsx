/**
 * About Page — Server Component
 *
 * Exports metadata. The interactive content is in AboutContent (client component).
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const AboutContent = dynamic(() => import("./_components/about-content"), { ssr: true });

export const metadata: Metadata = generatePageMetadata({
  title: { absolute: "About XYLO Esports | Premium BGMI Tournament Platform" },
  description:
    "Learn about XYLO Esports, India's trusted BGMI tournament platform. Discover our mission, vision, fair play commitment, and our competitive esports community.",
  path: "/about",
  ogImage: "/about_bg.png",
  ogImageAlt: "About XYLO Esports — India's Leading BGMI Tournament Platform",
  keywords: [
    "About XYLO Esports",
    "BGMI Tournament Platform",
    "Esports India",
    "Gaming Community",
    "BGMI Cash Tournament",
    "Professional Gaming",
    "Esports Organization",
    "Online BGMI Tournament",
  ],
});

export default function AboutPage() {
  const breadcrumbs = [{ name: "About", url: "/about" }];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([{ name: "Home", url: "/" }, ...breadcrumbs]),
          webPageSchema({
            title: "About XYLO Esports | Premium BGMI Tournament Platform",
            description:
              "Learn about XYLO Esports, India's trusted BGMI tournament platform. Discover our mission, vision, fair play commitment, and our competitive esports community.",
            path: "/about",
          }),
        ]}
        id="about-schema"
      />
      <AboutContent />
    </>
  );
}
