import type { Metadata } from "next";

import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Mohamed Hesham to discuss brand identity, packaging, print design, or visual system projects.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
