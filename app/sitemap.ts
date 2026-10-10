import type { MetadataRoute } from "next";

import { getProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects();

  // De-duplicate by slug: content folders must map 1:1 to slugs
  const uniqueSlugs = [
    ...new Set(projects.map((project) => project.slug)),
  ];

  const projectUrls: MetadataRoute.Sitemap = uniqueSlugs.map(
    (slug) => ({
      url: `${siteUrl}/work/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },

    {
      url: `${siteUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },

    ...projectUrls,
  ];
}