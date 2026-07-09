import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/audio-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xyloesports | Premium Tournament Platform",
  description: "Join India's Biggest Xyloesports Tournament Platform. Play Solo, Duo, or Squad matches and win massive cash prizes.",
  openGraph: {
    title: "Xyloesports | Premium Tournament Platform",
    description: "Join India's Biggest Xyloesports Tournament Platform. Play Solo, Duo, or Squad matches and win massive cash prizes.",
    images: [{ url: "/og-image.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark bg-black overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col font-sans text-white selection:bg-pubg-yellow selection:text-black overflow-x-hidden">
        <AudioProvider>
          <div className="max-w-[1440px] mx-auto w-full flex-grow flex flex-col bg-tactical-black shadow-2xl relative min-h-screen overflow-x-hidden">
            <Navbar />
            <main className="flex-grow pt-24">{children}</main>
            <Footer />
          </div>
        </AudioProvider>
      </body>
    </html>
  );
}
