"use client";

/** Client helpers: API access, overlay merging, image preparation, publish. */

import type {
  ApiProject,
  DraftImage,
  DraftProject,
  Overlay,
  PublishProjectPayload,
} from "./types";

export async function fetchProjects(): Promise<ApiProject[]> {
  const res = await fetch("/api/dashboard/projects", { cache: "no-store" });
  if (res.status === 401) {
    window.location.href = "/dashboard/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error("Could not load projects.");
  const data = (await res.json()) as { projects: ApiProject[] };
  return data.projects;
}

/** A display image in the merged (published + draft) view. */
export type MergedImage = {
  name: string;
  src: string; // repo path or object URL
  width: number;
  height: number;
  draft: boolean;
  blob?: Blob;
};

export type MergedProject = {
  slug: string;
  title: string;
  category: string;
  description: string;
  featured: boolean;
  content: Record<string, unknown>;
  images: MergedImage[];
  files: string[];
  isNew: boolean;
  changed: boolean;
};

const objectUrls = new Map<string, string>();

function draftUrl(image: DraftImage): string {
  const key = `${image.name}:${image.blob.size}:${image.blob.type}`;
  let url = objectUrls.get(key);
  if (!url) {
    url = URL.createObjectURL(image.blob);
    objectUrls.set(key, url);
  }
  return url;
}

/** Merge published projects with the local overlay into one ordered list. */
export function mergeProjects(
  apiProjects: ApiProject[],
  overlay: Overlay
): MergedProject[] {
  const merged: MergedProject[] = [];

  for (const api of apiProjects) {
    const draft = overlay.projects[api.slug];
    if (draft?.deleted) continue;
    if (!draft) {
      merged.push({
        slug: api.slug,
        title: api.title,
        category: api.category,
        description: api.description,
        featured: api.featured,
        content: api.content,
        files: api.files,
        isNew: false,
        changed: false,
        images: api.files.map((name) => {
          const known = api.media.find((item) => item.name === name);
          return {
            name,
            src: `/projects/${api.slug}/${name}`,
            width: known?.width || 0,
            height: known?.height || 0,
            draft: false,
          };
        }),
      });
      continue;
    }
    const content = draft.content;
    const kept = api.files
      .filter((name) => !draft.removedImages.includes(name))
      .map((name) => {
        const known = api.media.find((item) => item.name === name);
        return {
          name,
          src: `/projects/${api.slug}/${name}`,
          width: known?.width || 0,
          height: known?.height || 0,
          draft: false,
        };
      });
    const added = draft.newImages.map((img) => ({
      name: img.name,
      src: draftUrl(img),
      width: img.width,
      height: img.height,
      draft: true,
      blob: img.blob,
    }));
    merged.push({
      slug: api.slug,
      title: String(content.title || api.title),
      category: String(content.category || ""),
      description: String(content.description || ""),
      featured: content.featured === true,
      content,
      files: [],
      isNew: false,
      changed: true,
      images: [...kept, ...added],
    });
  }

  for (const [slug, draft] of Object.entries(overlay.projects)) {
    if (!draft.isNew || draft.deleted) continue;
    merged.push({
      slug,
      title: String(draft.content.title || slug),
      category: String(draft.content.category || ""),
      description: String(draft.content.description || ""),
      featured: draft.content.featured === true,
      content: draft.content,
      files: [],
      isNew: true,
      changed: true,
      images: draft.newImages.map((img) => ({
        name: img.name,
        src: draftUrl(img),
        width: img.width,
        height: img.height,
        draft: true,
        blob: img.blob,
      })),
    });
  }

  if (overlay.order.length) {
    const rank = new Map(overlay.order.map((slug, i) => [slug, i]));
    merged.sort(
      (a, b) =>
        (rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
        (rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
    );
  }
  return merged;
}

export function overlayHasChanges(overlay: Overlay): boolean {
  return (
    Object.keys(overlay.projects).length > 0 || overlay.order.length > 0
  );
}

/* ---------------------------------------------------------
   Image preparation: keep originals when small enough, else
   recompress to fit the publish request limit.
--------------------------------------------------------- */

const DIRECT_LIMIT = 3_500_000;
const TARGET_LIMIT = 4_000_000;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function measureImage(
  blob: Blob
): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Not a readable image"));
      img.src = url;
    });
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function recompress(
  blob: Blob,
  maxDim: number,
  quality: number
): Promise<Blob> {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Not a readable image"));
      img.src = url;
    });
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const out = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!out) throw new Error("Could not compress image");
    return out;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Returns the blob to publish plus a truthful file name. Small, web-ready
 * images keep their original bytes; oversized ones are recompressed.
 */
export async function prepareImage(
  file: File
): Promise<{ blob: Blob; name: string; width: number; height: number; optimized: boolean }> {
  const base = file.name.replace(/\.[^.]+$/, "").replace(/[^A-Za-z0-9._-]+/g, "-") || "image";
  if (file.size <= DIRECT_LIMIT && OK_TYPES.includes(file.type)) {
    const { width, height } = await measureImage(file);
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
    return { blob: file, name: `${base}.${ext}`, width, height, optimized: false };
  }
  let blob = await recompress(file, 2600, 0.88);
  if (blob.size > TARGET_LIMIT) blob = await recompress(file, 2200, 0.82);
  if (blob.size > TARGET_LIMIT) blob = await recompress(file, 1800, 0.78);
  if (blob.size > TARGET_LIMIT) {
    throw new Error("This image stays too large even after optimization.");
  }
  const { width, height } = await measureImage(blob);
  return { blob, name: `${base}.jpg`, width, height, optimized: true };
}

/* ---------------------------------------------------------
   Publish
--------------------------------------------------------- */

async function uploadOne(
  file: File | Blob,
  name: string
): Promise<string> {
  const form = new FormData();
  form.append("name", name);
  form.append("file", file, name);
  const res = await fetch("/api/dashboard/upload-image", {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Upload failed for ${name}`);
  return data.blobSha as string;
}

export async function publishOverlay(
  merged: MergedProject[],
  overlay: Overlay,
  onProgress?: (message: string) => void
): Promise<string> {
  const payloads: PublishProjectPayload[] = [];

  // Order is written for every project so the grid order is exactly what
  // the dashboard list shows.
  const orderBySlug = new Map(merged.map((p, i) => [p.slug, i + 1]));

  // Deleted projects first. removedImages already carries every repo file
  // (set when the delete happened), so folders do not orphan.
  for (const [slug, draft] of Object.entries(overlay.projects)) {
    if (!draft.deleted) continue;
    payloads.push({
      slug,
      deleted: true,
      content: null,
      newImages: [],
      removedImages: draft.isNew ? [] : draft.removedImages,
    });
  }

  const changed = merged.filter((p) => p.changed);
  for (const project of changed) {
    const draft = overlay.projects[project.slug];
    if (!draft) continue;
    onProgress?.(`Uploading images for ${project.title}…`);
    const newImages: Array<{ name: string; blobSha: string }> = [];
    for (const img of draft.newImages) {
      const blobSha = await uploadOne(img.blob, img.name);
      newImages.push({ name: img.name, blobSha });
    }
    const content: Record<string, unknown> = {
      ...draft.content,
      slug: project.slug,
      order: orderBySlug.get(project.slug) ?? 1,
    };
    delete content.__files;
    payloads.push({
      slug: project.slug,
      content,
      newImages,
      removedImages: draft.removedImages,
    });
  }

  // Unchanged projects only get their order written when the order changed.
  const ordered = merged.filter(
    (p) => !p.changed && (overlay.order.length > 0)
  );
  for (const project of ordered) {
    const content: Record<string, unknown> = {
      ...project.content,
      slug: project.slug,
      order: orderBySlug.get(project.slug) ?? 1,
    };
    payloads.push({
      slug: project.slug,
      content,
      newImages: [],
      removedImages: [],
    });
  }

  if (payloads.length === 0) throw new Error("Nothing to publish.");

  onProgress?.("Publishing to the site…");
  const res = await fetch("/api/dashboard/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projects: payloads }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Publish failed.");
  return data.commit as string;
}
