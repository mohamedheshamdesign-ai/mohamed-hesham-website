import { describe, expect, it } from "vitest";

import { groupMediaByRhythm } from "./case-study";
import { getProjectBySlug } from "./projects";
import type { ProjectMedia } from "./projects";

const media = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ name: `${i}.jpg` }) as ProjectMedia);

describe("chapter layout", () => {
  it("keeps the designed rhythm when layout is omitted or auto", () => {
    expect(groupMediaByRhythm(media(6))).toEqual(
      groupMediaByRhythm(media(6), "auto")
    );
    expect(groupMediaByRhythm(media(6))[0].layout).toBe("full");
  });

  it("applies an explicit layout to every group", () => {
    expect(groupMediaByRhythm(media(3), "wide").map((g) => g.layout)).toEqual([
      "wide", "wide", "wide",
    ]);
    const duo = groupMediaByRhythm(media(5), "duo");
    expect(duo.map((g) => g.media.length)).toEqual([2, 2, 1]);
    expect(duo[2].layout).toBe("wide");
  });

  it("reads a saved chapter layout through the project schema", () => {
    const project = getProjectBySlug("atractive-collection");
    const layouts = project?.chapters.map((c) => c.layout);
    expect(layouts).toContain("duo");
    expect(layouts?.[0]).toBeUndefined();
  });
});
