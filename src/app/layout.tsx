// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { nunitoSans } from "./fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grabi - Petites Annonces au Sénégal",
  description:
    "Grabi : Trouvez les meilleures annonces au Sénégal. Immobilier, véhicules, emploi, et plus encore. Publiez votre annonce gratuitement !",
  keywords: [
    "petites annonces",
    "Sénégal",
    "immobilier",
    "voitures",
    "emploi",
    "Grabi",
  ],
  metadataBase: new URL("https://www.grabi.sn"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Grabi - Petites Annonces au Sénégal",
    description:
      "Grabi : Trouvez les meilleures annonces au Sénégal. Immobilier, véhicules, emploi, et plus encore. Publiez votre annonce gratuitement !",
    url: "https://www.grabi.sn",
    siteName: "Grabi",
    images: [
      {
        url: "https://www.grabi.sn/og-image.png",
        width: 1200,
        height: 630,
        alt: "Grabi - Petites Annonces au Sénégal",
      },
    ],
    locale: "fr_SN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grabi - Petites Annonces au Sénégal",
    description:
      "Trouvez les meilleures annonces au Sénégal. Immobilier, véhicules, emploi, et plus encore.",
    images: ["https://www.grabi.sn/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": "large",
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-16x16.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-body ${nunitoSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
