/**
 * About Page — Server Component
 *
 * Exports metadata. The interactive content is in AboutContent (client component).
 */
import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo/dynamic-metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import dynamic from "next/dynamic";

const AboutContent = dynamic(() => import("./_components/about-content"), { ssr: true });

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMetadata("about");
}


export default function AboutPage() {
  const breadcrumbs = [{ name: "About", url: "/about" }];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([{ name: "Home", url: "/" }, ...breadcrumbs]),
          webPageSchema({
            title: "About XYLO Esports | Premium Esports Tournament Platform",
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
