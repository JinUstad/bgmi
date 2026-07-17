/**
 * User Dashboard Page — Server Component
 * Exports metadata. Interactive UI is in UserDashboardContent (client component).
 */
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";

const UserDashboardContent = dynamic(() => import("./_components/user-dashboard-content"), { ssr: true });

export const metadata: Metadata = generatePageMetadata({
  title: { absolute: "Player Dashboard & Registration Details | XYLO Esports" },
  description:
    "View your BGMI tournament registration details, download payment receipts, and track your match history on the XYLO Esports Player Dashboard.",
  path: "/user-dashboard",
  noIndex: true, // Dashboards with PII shouldn't be indexed
});

export default function UserDashboardPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "User Dashboard", url: "/user-dashboard" },
          ]),
          webPageSchema({
            title: "Player Dashboard & Registration Details | XYLO Esports",
            description: "View your BGMI tournament registration details and payment receipts.",
            path: "/user-dashboard",
          }),
        ]}
        id="user-dashboard-schema"
      />
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-pubg-yellow animate-spin" />
        </div>
      }>
        <UserDashboardContent />
      </Suspense>
    </>
  );
}
