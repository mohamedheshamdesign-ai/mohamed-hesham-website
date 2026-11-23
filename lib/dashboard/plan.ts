/**
 * Publish plan: a strict, reviewable diff between the server's current
 * content and the browser draft. Pure (no browser or server APIs) so it can
 * be unit tested. Only projects that really differ are included, so deleted
 * or untouched projects can never be rewritten or resurrected by a stale
 * draft.
 */

import type { ApiProject, DraftImage, Overlay } from "./types";

export type PlanItem = {
  slug: string;
  title: string;
  kind: "new" | "edited" | "removed" | "reordered";
  details: string[];
};

export type PlanProject = {
  slug: string;
  deleted?: boolean;
  content: Record<string, unknown> | null;
  newImages: DraftImage[];
  removedImages: string[];
};

export type PublishPlan = {
  items: PlanItem[];
  projects: PlanProject[];
};

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .filter((key) => record[key] !== undefined)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function withoutOrder(content: Record<string, unknown>) {
  const copy = { ...content };
  delete copy.order;
  delete copy.__files;
  return copy;
}

/** Final slug order the dashboard list shows (server + draft). */
export function finalOrder(api: ApiProject[], overlay: Overlay): string[] {
  const slugs = api
    .filter((p) => !overlay.projects[p.slug]?.deleted)
    .map((p) => p.slug);
  for (const [slug, draft] of Object.entries(overlay.projects)) {
    if (draft.isNew && !draft.deleted && !slugs.includes(slug)) slugs.push(slug);
  }
  if (overlay.order.length) {
    const rank = new Map(overlay.order.map((slug, i) => [slug, i]));
    slugs.sort(
      (a, b) =>
        (rank.get(a) ?? Number.MAX_SAFE_INTEGER) -
        (rank.get(b) ?? Number.MAX_SAFE_INTEGER)
    );
  }
  return slugs;
}

export function buildPlan(api: ApiProject[], overlay: Overlay): PublishPlan {
  const items: PlanItem[] = [];
  const projects: PlanProject[] = [];
  const byApi = new Map(api.map((p) => [p.slug, p]));
  const handled = new Set<string>();

  const survivors = finalOrder(api, overlay);
  const serverSeq = api.filter((p) => survivors.includes(p.slug)).map((p) => p.slug);
  const keptSeq = survivors.filter((s) => byApi.has(s));
  const hasNew = survivors.some((s) => !byApi.has(s));
  const needOrder = hasNew || canonical(serverSeq) !== canonical(keptSeq);
  const rankOf = new Map(survivors.map((s, i) => [s, i + 1]));

  for (const [slug, draft] of Object.entries(overlay.projects)) {
    const server = byApi.get(slug);

    if (draft.deleted) {
      // Never published, or already gone: nothing to do.
      if (!server) continue;
      projects.push({
        slug,
        deleted: true,
        content: null,
        newImages: [],
        // Always the SERVER's file list, never a stale copy.
        removedImages: [...server.files],
      });
      items.push({
        slug,
        title: server.title,
        kind: "removed",
        details: ["Removed from the site"],
      });
      handled.add(slug);
      continue;
    }

    if (!server) {
      if (!draft.isNew) continue; // stale edit of a project that no longer exists
      const content = {
        ...draft.content,
        slug,
        order: rankOf.get(slug) ?? survivors.length,
      };
      projects.push({
        slug,
        content,
        newImages: draft.newImages,
        removedImages: [],
      });
      items.push({
        slug,
        title: String(draft.content.title || slug),
        kind: "new",
        details: [
          "New project",
          `${draft.newImages.length} image${draft.newImages.length === 1 ? "" : "s"}`,
        ],
      });
      handled.add(slug);
      continue;
    }

    const removedImages = draft.removedImages.filter((n) => server.files.includes(n));
    const contentChanged =
      canonical(withoutOrder(draft.content)) !==
      canonical(withoutOrder(server.content));
    if (!contentChanged && !draft.newImages.length && !removedImages.length) {
      continue; // draft equals the live project
    }
    const details: string[] = [];
    if (contentChanged) details.push("Text or settings changed");
    if (draft.newImages.length) details.push(`${draft.newImages.length} image(s) added`);
    if (removedImages.length) details.push(`${removedImages.length} image(s) removed`);
    const content: Record<string, unknown> = {
      ...draft.content,
      slug,
    };
    delete content.__files;
    if (needOrder) content.order = rankOf.get(slug);
    else if (server.content.order !== undefined) content.order = server.content.order;
    projects.push({ slug, content, newImages: draft.newImages, removedImages });
    items.push({ slug, title: String(draft.content.title || server.title), kind: "edited", details });
    handled.add(slug);
  }

  if (needOrder) {
    for (const slug of survivors) {
      if (handled.has(slug)) continue;
      const server = byApi.get(slug);
      if (!server) continue;
      const rank = rankOf.get(slug);
      if (server.content.order === rank) continue;
      projects.push({
        slug,
        content: { ...server.content, slug, order: rank },
        newImages: [],
        removedImages: [],
      });
      items.push({
        slug,
        title: server.title,
        kind: "reordered",
        details: [`Position ${rank}`],
      });
    }
  }

  return { items, projects };
}
