import type { Metadata } from "next";
import { Syne, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "duomatch — Connection Through Play",
    template: "%s | duomatch",
  },
  description:
    "Play games with interesting strangers. No photos. No swiping. Just play. duomatch matches people by shared interests and connects them through cooperative two-player games.",
  keywords: [
    "social connection",
    "cooperative games",
    "matching platform",
    "meet people",
    "two-player games",
    "duomatch",
    "connection through play",
    "no swiping",
    "authentic connections",
    "social gaming",
  ],
  authors: [{ name: "duomatch" }],
  creator: "duomatch",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://duomatch.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "duomatch",
    title: "duomatch — Connection Through Play",
    description:
      "Play games with interesting strangers. No photos. No swiping. Just play. A new category of social platform where meaningful connections are built through cooperative play.",
    images: [
      {
        url: "https://froyxufzzberqkkjgbko.supabase.co/storage/v1/object/public/orchid-images/generated/ecbcdfaf-a004-4fdb-8e28-2a2808a2185b/hero-landing.png",
        width: 1920,
        height: 800,
        alt: "duomatch — Connection Through Play",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "duomatch — Connection Through Play",
    description:
      "Play games with interesting strangers. No photos. No swiping. Just play.",
    images: [
      "https://froyxufzzberqkkjgbko.supabase.co/storage/v1/object/public/orchid-images/generated/ecbcdfaf-a004-4fdb-8e28-2a2808a2185b/hero-landing.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${outfit.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen bg-background font-body text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
