import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

import { ogImage, siteDescription, siteName, siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Mohamed Hesham — Senior Brand & Graphic Designer",
    template: "%s — Mohamed Hesham",
  },

  description: siteDescription,

  keywords: [
    "Mohamed Hesham",
    "Mohamed Hesham Designer",
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
      name: "Mohamed Hesham",
      url: siteUrl,
    },
  ],

  creator: "Mohamed Hesham",

  publisher: "Mohamed Hesham",

  applicationName: "Mohamed Hesham Portfolio",

  category: "Design",

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

    title: "Mohamed Hesham — Senior Brand & Graphic Designer",

    description:
      "Senior Brand & Graphic Designer based in Egypt specializing in brand identity, packaging, print design, visual systems, and production.",

    siteName: siteName,

    images: [ogImage],
  },

  twitter: {
    card: "summary_large_image",

    title: "Mohamed Hesham — Senior Brand & Graphic Designer",

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: siteName,
              url: siteUrl,
              jobTitle: "Senior Brand & Graphic Designer",
              address: {
                "@type": "PostalAddress",
                addressCountry: "EG",
              },
              sameAs: [
                "https://www.facebook.com/mohamed.hesham.design1/",
                "https://www.instagram.com/mohamed.hesham.design1/",
                "https://www.linkedin.com/in/mohamedheshamdesign/",
                "https://www.behance.net/mohamedheshamdesign",
              ],
            }),
          }}
        />

        <a className="skip-link" href="#main-content">Skip to content</a>

        <ScrollProgress />

        <Navbar />

        {children}

        <Footer />

        <BackToTop />

        <Analytics />

      </body>
    </html>
  );
}