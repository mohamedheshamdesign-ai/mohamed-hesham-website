import type { ProjectMedia } from "./projects";

/**
 * Layout patterns used by the case study gallery.
 *
 * - `full`   — edge-to-edge image, the loudest moment in the sequence.
 * - `duo`    — two images side by side.
 * - `wide`   — a single image held inside the content column.
 * - `offset` — a single image pushed to one side with a caption.
 */
export type MediaLayout =
  | "full"
  | "duo"
  | "wide"
  | "offset";

export type MediaGroup = {
  layout: MediaLayout;
  media: ProjectMedia[];
};

/**
 * The rhythm a gallery walks through. Repeating the same two or three
 * layouts for every project is what makes a portfolio feel like a
 * template, so the pattern deliberately alternates scale.
 */
const RHYTHM: MediaLayout[] = [
  "full",
  "duo",
  "duo",
  "wide",
  "duo",
  "offset",
  "duo",
  "full",
];

/**
 * Groups media into a varied sequence of compositions.
 *
 * A `duo` that only has one image left becomes an `offset` so the
 * sequence never ends on a half-empty pair.
 */
export function groupMediaByRhythm(
  media: ProjectMedia[],
  layout?: "auto" | "full" | "wide" | "duo"
): MediaGroup[] {
  if (layout && layout !== "auto") {
    const fixed: MediaGroup[] = [];
    const size = layout === "duo" ? 2 : 1;
    for (let i = 0; i < media.length; i += size) {
      const slice = media.slice(i, i + size);
      fixed.push({
        layout: layout === "duo" && slice.length < 2 ? "wide" : layout,
        media: slice,
      });
    }
    return fixed;
  }

  const groups: MediaGroup[] = [];

  let cursor = 0;
  let step = 0;

  while (cursor < media.length) {
    const layout = RHYTHM[step % RHYTHM.length];

    step += 1;

    if (layout === "duo") {
      const remaining = media.length - cursor;

      if (remaining >= 2) {
        groups.push({
          layout: "duo",
          media: media.slice(cursor, cursor + 2),
        });

        cursor += 2;
      } else {
        groups.push({
          layout: "offset",
          media: media.slice(cursor),
        });

        cursor = media.length;
      }

      continue;
    }

    groups.push({
      layout,
      media: media.slice(cursor, cursor + 1),
    });

    cursor += 1;
  }

  return groups;
}
