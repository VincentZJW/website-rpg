import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Vincent’s AI Frontier",
    description:
      "Explore Vincent Zhou’s background, projects, robotics focus, and talent consulting journey through an interactive RPG-style world.",
    images: [
      {
        url: "/og-image.png",
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
    images: ["/og-image.png"],
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
