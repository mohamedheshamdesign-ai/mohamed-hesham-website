import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  findCoverFile,
  getProjects,
  getProjectBySlug,
  sortMediaFiles,
} from "./projects";

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

describe("portfolio project assets", () => {
  const projects = getProjects();

  it("loads all supplied projects without duplicate routes", () => {
    expect(projects).toHaveLength(9);
    expect(new Set(projects.map(project => project.slug)).size).toBe(projects.length);
  });

  it.each(projects)("keeps the cover and full gallery for $slug", project => {
    const detail = getProjectBySlug(project.slug);
    expect(detail.cover).toBe(project.cover);
    expect(detail.media.length).toBeGreaterThan(0);
    for (const src of [detail.cover, ...detail.media.map(media => media.src)]) {
      expect(fs.existsSync(path.join(process.cwd(), "public", src))).toBe(true);
    }
  });
});
