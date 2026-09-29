import type { Metadata } from "next";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const siteUrl = "https://mohamed-hesham-design.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Mohamed Hisham — Senior Brand & Graphic Designer",
    template: "%s — Mohamed Hisham",
  },

  description:
    "Mohamed Hisham is a Senior Brand & Graphic Designer based in Egypt, specializing in brand identity, packaging design, print design, visual systems, and production.",

  keywords: [
    "Mohamed Hisham",
    "Mohamed Hisham Designer",
    "Senior Brand Designer",
    "Brand Designer Egypt",
    "Graphic Designer Egypt",
    "Cairo Graphic Designer",
    "Brand Identity",
    "Brand Identity Designer",
    "Visual Identity",
    "Branding",
    "Packaging Design",
    "Print Design",
    "Brand Guidelines",
    "Visual Systems",
    "Production Design",
  ],

  authors: [
    {
      name: "Mohamed Hisham",
      url: siteUrl,
    },
  ],

  creator: "Mohamed Hisham",

  publisher: "Mohamed Hisham",

  applicationName: "Mohamed Hisham Portfolio",

  category: "Design",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",

    url: siteUrl,

    locale: "en_US",

    title: "Mohamed Hisham — Senior Brand & Graphic Designer",

    description:
      "Senior Brand & Graphic Designer based in Egypt specializing in brand identity, packaging, print design, visual systems, and production.",

    siteName: "Mohamed Hisham",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mohamed Hisham — Senior Brand & Graphic Designer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Mohamed Hisham — Senior Brand & Graphic Designer",

    description:
      "Senior Brand & Graphic Designer specializing in brand identity, packaging, print design, and visual systems.",

    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}