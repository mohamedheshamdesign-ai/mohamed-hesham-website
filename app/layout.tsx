import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mohamed Hisham | Senior Brand & Graphic Designer",
    template: "%s | Mohamed Hisham",
  },

  description:
    "Senior Brand & Graphic Designer specializing in brand identity, packaging, print design, and production-focused visual communication.",

  keywords: [
    "Brand Designer",
    "Graphic Designer",
    "Brand Identity",
    "Packaging Design",
    "Print Design",
    "Logo Design",
    "Branding",
    "Egypt Designer",
    "Visual Identity",
    "Creative Designer",
  ],

  authors: [{ name: "Mohamed Hisham" }],

  creator: "Mohamed Hisham",

  openGraph: {
    title: "Mohamed Hisham | Senior Brand & Graphic Designer",
    description:
      "Helping businesses build brands people trust, remember, and choose.",
    siteName: "Mohamed Hisham",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-950">
        <Navbar />
        {children}  
        <Footer />
      </body>
    </html>
  );
}