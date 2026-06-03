import type { Metadata, Viewport } from "next";
import { withBasePath } from "@/lib/asset-path";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.GITHUB_PAGES === "true" ? `https://vincentzjw.github.io${basePath}` : "http://localhost:3000");
const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
const ogImageUrl = new URL("og-image.png", normalizedSiteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vincent’s AI Frontier",
  description: "Interactive RPG-style personal website for Vincent Zhou, focused on Embodied AI, Robotics, and Talent Consulting.",
  applicationName: "Vincent’s AI Frontier",
  keywords: [
    "Vincent Zhou",
    "Jiwen Zhou",
    "Vincent's AI Frontier",
    "Embodied Intelligence",
    "Embodied AI",
    "Robotics",
    "AI Talent Consulting",
    "Talent Mapping",
  ],
  icons: {
    icon: [
      { url: withBasePath("/favicon.ico"), sizes: "any" },
      { url: withBasePath("/icon.png"), sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: withBasePath("/apple-icon.png"), sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Vincent’s AI Frontier",
    description:
      "Explore Vincent Zhou’s background, projects, robotics focus, and talent consulting journey through an interactive RPG-style world.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Vincent’s AI Frontier - Interactive RPG-style Personal Website",
      },
    ],
    locale: "en_US",
    siteName: "Vincent’s AI Frontier",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vincent’s AI Frontier",
    description: "Interactive RPG-style personal website for Embodied AI, Robotics, and Talent Consulting.",
    images: [ogImageUrl],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030611",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
