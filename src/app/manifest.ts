import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XYLO Esports",
    short_name: "XYLO",
    description:
      "India's #1 BGMI & Esports Tournament Platform. Compete in Esports tournaments and win exciting cash prizes.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#F0A500",
    orientation: "portrait",
    scope: "/",
    lang: "en-IN",
    categories: ["games", "sports", "entertainment"],
    icons: [
      {
        src: "/icons/icon-72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/og-image.jpg",
        sizes: "1200x630",
        type: "image/jpeg",
      },
    ],
  };
}
