import { describe, expect, it } from "vitest";

import { buildPlan } from "./plan";
import { emptyOverlay } from "./types";
import type { ApiProject, DraftProject } from "./types";

function api(slug: string, order: number, extra: Record<string, unknown> = {}): ApiProject {
  return {
    slug,
    title: slug,
    category: "Logo",
    primaryCategory: "brand-identity",
    description: "",
    featured: false,
    order,
    content: { title: slug, slug, order, featured: false, ...extra },
    cover: "",
    hasRealCover: false,
    coverArt: "",
    coverWidth: 0,
    coverHeight: 0,
    media: [],
    files: [`${slug}.jpg`],
  };
}

const server = [api("a", 1), api("b", 2), api("c", 3)];

describe("publish plan", () => {
  it("is empty when the draft equals the live site", () => {
    const overlay = emptyOverlay();
    overlay.projects.a = {
      slug: "a",
      content: { ...server[0].content },
      newImages: [],
      removedImages: [],
    };
    expect(buildPlan(server, overlay).projects).toHaveLength(0);
  });

  it("never resurrects a deleted, never-published draft", () => {
    const overlay = emptyOverlay();
    overlay.projects.fixture = {
      slug: "fixture",
      content: { title: "Fixture", slug: "fixture" },
      newImages: [],
      removedImages: [],
      deleted: true,
      isNew: true,
    };
    expect(buildPlan(server, overlay).projects).toHaveLength(0);
  });

  it("ignores a stale non-new edit of a project that no longer exists", () => {
    const overlay = emptyOverlay();
    const stale: DraftProject = {
      slug: "ghost",
      content: { title: "Ghost", slug: "ghost" },
      newImages: [],
      removedImages: [],
    };
    overlay.projects.ghost = stale;
    expect(buildPlan(server, overlay).projects).toHaveLength(0);
  });

  it("writes only the two swapped projects when ordering changes", () => {
    const overlay = emptyOverlay();
    overlay.order = ["b", "a", "c"];
    const plan = buildPlan(server, overlay);
    expect(plan.projects.map((p) => p.slug).sort()).toEqual(["a", "b"]);
    expect(plan.projects.find((p) => p.slug === "a")?.content?.order).toBe(2);
  });

  it("removal uses the server file list and does not rewrite others", () => {
    const overlay = emptyOverlay();
    overlay.projects.b = {
      slug: "b",
      content: server[1].content,
      newImages: [],
      removedImages: ["stale.jpg"],
      deleted: true,
    };
    const plan = buildPlan(server, overlay);
    expect(plan.projects).toHaveLength(1);
    expect(plan.projects[0]).toMatchObject({ slug: "b", deleted: true, removedImages: ["b.jpg"] });
  });

  it("reports a text edit as the only change", () => {
    const overlay = emptyOverlay();
    overlay.projects.c = {
      slug: "c",
      content: { ...server[2].content, title: "C renamed" },
      newImages: [],
      removedImages: [],
    };
    const plan = buildPlan(server, overlay);
    expect(plan.items).toHaveLength(1);
    expect(plan.items[0].kind).toBe("edited");
  });

  it("counts a video separately from images when added to a project", () => {
    const overlay = emptyOverlay();
    overlay.projects.a = {
      slug: "a",
      content: { ...server[0].content },
      newImages: [
        { name: "clip.mp4", width: 1280, height: 720, blob: new Blob(["x"], { type: "video/mp4" }), kind: "video" },
        { name: "still.jpg", width: 800, height: 600, blob: new Blob(["x"], { type: "image/jpeg" }), kind: "image" },
      ],
      removedImages: [],
    };
    const plan = buildPlan(server, overlay);
    expect(plan.items).toHaveLength(1);
    expect(plan.items[0].details).toContain("1 image(s) added");
    expect(plan.items[0].details).toContain("1 video(s) added");
    expect(plan.projects[0].newImages).toHaveLength(2);
  });

  it("counts a video in a brand-new project", () => {
    const overlay = emptyOverlay();
    overlay.projects.fresh = {
      slug: "fresh",
      content: { title: "Fresh", slug: "fresh" },
      newImages: [
        { name: "clip.webm", width: 1280, height: 720, blob: new Blob(["x"], { type: "video/webm" }), kind: "video" },
      ],
      removedImages: [],
      isNew: true,
    };
    const plan = buildPlan(server, overlay);
    expect(plan.items[0].details).toContain("1 video");
    expect(plan.projects[0].newImages).toHaveLength(1);
  });
});
