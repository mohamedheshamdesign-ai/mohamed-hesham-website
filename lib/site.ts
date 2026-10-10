import type { Metadata } from "next";

/**
 * Single source of truth for site-level metadata.
 *
 * The deployment URL can be overridden with NEXT_PUBLIC_SITE_URL without
 * touching code. The fallback keeps the current production URL working.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://mohamed-hesham-design.vercel.app";

export const siteName = "Mohamed Hesham";

export const siteDescription =
  "Mohamed Hesham is a Senior Brand & Graphic Designer based in Egypt, specializing in brand identity, packaging design, print design, visual systems, and production.";

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

/**
 * Open Gmail's compose window with the recipient (and optional subject)
 * pre-filled. Used instead of `mailto:` for email actions so they always
 * open a working compose box — even on machines with no mail client set
 * up (where a `mailto:` link can otherwise open an empty URL).
 */
export function gmailComposeUrl({
  to,
  subject,
  body,
}: {
  to: string;
  subject?: string;
  body?: string;
}) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to,
  });

  if (subject) params.set("su", subject);
  if (body) params.set("body", body);

  return `https://mail.google.com/mail/?${params.toString()}`;
}

/** Shared Open Graph/Twitter image used by pages without a dedicated image. */
export const ogImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: `${siteName} — Senior Brand & Graphic Designer`,
};

/**
 * Build page-specific metadata with a correct canonical URL and complete
 * Open Graph / Twitter tags (openGraph is replaced, not merged, so each
 * page must supply the full object).
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${title} — ${siteName}`,
      description,
      siteName,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteName}`,
      description,
      images: ["/og-image.jpg"],
    },
  };
}
