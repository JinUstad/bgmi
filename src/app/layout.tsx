import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/audio-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schemas";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SITE_CONFIG } from "@/lib/seo/config";
import { GoogleAnalytics } from "@next/third-parties/google";

// ─── Fonts ─────────────────────────────────────────────────────────────────
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// ─── Global Metadata ───────────────────────────────────────────────────────
// Applied to every page as the default. Individual pages override via their
// own generatePageMetadata() calls or metadata exports.
export const metadata: Metadata = {
  // metadataBase is required for absolute URL resolution of og:image etc.
  metadataBase: new URL(SITE_CONFIG.url),

  ...generatePageMetadata({
    path: "/",
  }),



  // Root-level manifest link
  manifest: "/manifest.json",

  // Verification tokens — add your codes here when ready
  verification: {
    google: "ADD_YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE_HERE",
    // yandex: "YOUR_YANDEX_CODE",
    // yahoo: "YOUR_YAHOO_CODE",
    // other: { "msvalidate.01": "YOUR_BING_CODE" },
  },

  // Ensure the title template is set at root level
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
};

// ─── Viewport & Theme Color ────────────────────────────────────────────────
// Next.js 15: viewport must be exported separately (not inside metadata)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE_CONFIG.themeColor },
    { media: "(prefers-color-scheme: dark)", color: SITE_CONFIG.themeColor },
  ],
  colorScheme: "dark",
};

// ─── Root Layout ───────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      dir="ltr"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark bg-black overflow-x-hidden`}
    >
      <head>
        {/* Preconnect to critical external origins for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for analytics (add IDs later) */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Global Organization + WebSite JSON-LD on every page */}
        <JsonLd
          schema={[organizationSchema(), websiteSchema()]}
          id="global-schema"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans text-white selection:bg-pubg-yellow selection:text-black overflow-x-hidden">
        <AudioProvider>
          <div className="max-w-[1440px] mx-auto w-full flex-grow flex flex-col bg-tactical-black shadow-2xl relative min-h-screen overflow-x-hidden">
            <Navbar />
            <main id="main-content" className="flex-grow pt-24">
              {children}
            </main>
            <Footer />
          </div>
        </AudioProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
