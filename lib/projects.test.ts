import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  findCoverFile,
  getAdjacentProjects,
  getProjectBySlug,
  getProjects,
  getRelatedProjects,
  readImageSize,
  sortMediaFiles,
} from "./projects";
import { groupMediaByRhythm } from "./case-study";

describe("sortMediaFiles", () => {
  it("puts cover first, then 00, then numbers", () => {
    expect(
      sortMediaFiles([
        "10.jpg",
        "cover.jpg",
        "02.jpg",
        "00.jpg",
      ])
    ).toEqual(["cover.jpg", "00.jpg", "02.jpg", "10.jpg"]);
  });

  it("sorts non-numeric names alphabetically", () => {
    expect(
      sortMediaFiles(["zebra.jpg", "apple.jpg", "mango.jpg"])
    ).toEqual(["apple.jpg", "mango.jpg", "zebra.jpg"]);
  });
});

describe("findCoverFile", () => {
  it("prefers cover.*", () => {
    expect(
      findCoverFile(["01.jpg", "cover.png"])
    ).toBe("cover.png");
  });

  it("falls back to 00.*", () => {
    expect(findCoverFile(["05.jpg", "00.jpg"])).toBe(
      "00.jpg"
    );
  });

  it("falls back to the first file", () => {
    expect(findCoverFile(["03.jpg", "01.jpg"])).toBe(
      "03.jpg"
    );
  });

  it("returns null for empty input", () => {
    expect(findCoverFile([])).toBeNull();
  });
});

describe("readImageSize", () => {
  it("reads the intrinsic size of a supplied image", () => {
    const size = readImageSize(
      path.join(
        process.cwd(),
        "public",
        "projects",
        "al-mashreq",
        "00.jpg"
      )
    );

    expect(size).toEqual({ width: 4000, height: 2334 });
  });
});

describe("portfolio project assets", () => {
  const projects = getProjects();

  it("loads all supplied projects without duplicate routes", () => {
    expect(projects).toHaveLength(9);
    expect(new Set(projects.map(project => project.slug)).size).toBe(projects.length);
  });

  it.each(projects)("keeps the cover and gallery for $slug", project => {
    const detail = getProjectBySlug(project.slug);
    expect(detail.cover).toBe(project.cover);

    for (const src of [detail.cover, ...detail.media.map(media => media.src)]) {
      if (!src) continue;
      expect(fs.existsSync(path.join(process.cwd(), "public", src))).toBe(true);
    }
  });

  it("gives every media item real dimensions", () => {
    for (const project of projects) {
      for (const media of project.media) {
        expect(media.width).toBeGreaterThan(0);
        expect(media.height).toBeGreaterThan(0);
      }
    }
  });

  it("never shows the same file in two different case studies", () => {
    const seen = new Map<string, string>();

    for (const project of projects) {
      for (const media of project.media) {
        const owner = seen.get(media.src);

        expect(owner).toBeUndefined();

        seen.set(media.src, project.slug);
      }
    }
  });

  it("only shows the Al Mashreq brand book in the Al Mashreq case study", () => {
    const alMashreq = getProjectBySlug("al-mashreq");

    expect(alMashreq.hasRealCover).toBe(true);
    expect(alMashreq.media.length).toBeGreaterThan(10);

    for (const project of projects) {
      if (project.slug === "al-mashreq") continue;

      expect(project.media).toHaveLength(0);
      expect(project.hasRealCover).toBe(false);
    }
  });

  it("resolves chapters to real media files", () => {
    const alMashreq = getProjectBySlug("al-mashreq");

    expect(alMashreq.chapters.length).toBeGreaterThan(0);

    const names = alMashreq.chapters.flatMap(chapter =>
      chapter.media.map(media => media.name)
    );

    expect(names).toHaveLength(
      alMashreq.media.length
    );
  });
});

describe("project navigation", () => {
  it("links every project to a next project", () => {
    const { next } = getAdjacentProjects("al-mashreq");

    expect(next).not.toBeNull();
    expect(next?.slug).not.toBe("al-mashreq");
  });

  it("returns related projects that are not the current one", () => {
    const related = getRelatedProjects("al-mashreq", 3);

    expect(related).toHaveLength(3);
    expect(
      related.some(project => project.slug === "al-mashreq")
    ).toBe(false);
  });
});

describe("groupMediaByRhythm", () => {
  const media = Array.from({ length: 7 }, (_, index) => ({
    src: `/projects/demo/${index}.jpg`,
    type: "image" as const,
    name: `${index}.jpg`,
    width: 4000,
    height: 2334,
  }));

  it("alternates between full-bleed, pairs and details", () => {
    const groups = groupMediaByRhythm(media);

    expect(groups[0].layout).toBe("full");
    expect(groups[1].layout).toBe("duo");
    expect(groups[1].media).toHaveLength(2);
  });

  it("never drops or duplicates media", () => {
    const groups = groupMediaByRhythm(media);

    const flattened = groups.flatMap(group => group.media);

    expect(flattened).toHaveLength(media.length);
    expect(flattened.map(item => item.src)).toEqual(
      media.map(item => item.src)
    );
  });

  it("turns a trailing single image into an offset", () => {
    const groups = groupMediaByRhythm(media.slice(0, 3));

    expect(groups.map(group => group.layout)).toEqual([
      "full",
      "duo",
    ]);
  });
});
