"use client";

/** Client helpers: API access, overlay merging, image preparation, publish. */

import type {
  ApiProject,
  DraftImage,
  DraftProject,
  Overlay,
  PublishProjectPayload,
} from "./types";
import type { PublishPlan } from "./plan";

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

/** A display image or video in the merged (published + draft) view. */
export type MergedImage = {
  name: string;
  src: string; // repo path or object URL
  width: number;
  height: number;
  draft: boolean;
  blob?: Blob;
  kind: "image" | "video";
};

export function isVideoFileName(name: string): boolean {
  return /\.(mp4|webm|mov|m4v)$/i.test(name);
}

function mediaKind(name: string): "image" | "video" {
  return isVideoFileName(name) ? "video" : "image";
}

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
            kind: mediaKind(name),
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
          kind: mediaKind(name),
        };
      });
    const added = draft.newImages.map((img) => ({
      name: img.name,
      src: draftUrl(img),
      width: img.width,
      height: img.height,
      draft: true,
      blob: img.blob,
      kind: img.kind ?? mediaKind(img.name),
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
        kind: img.kind ?? mediaKind(img.name),
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
 * A GIF is never recompressed to JPEG: that would kill its animation, so
 * an oversized GIF is rejected instead.
 */
export async function prepareImage(
  file: File
): Promise<{ blob: Blob; name: string; width: number; height: number; optimized: boolean; kind: "image" }> {
  const base = file.name.replace(/\.[^.]+$/, "").replace(/[^A-Za-z0-9._-]+/g, "-") || "image";
  if (file.type === "image/gif" && file.size > DIRECT_LIMIT) {
    throw new Error(
      "This GIF is too large (max 3.5 MB). Keep the GIF under 3.5 MB so its animation is preserved."
    );
  }
  if (file.size <= DIRECT_LIMIT && OK_TYPES.includes(file.type)) {
    const { width, height } = await measureImage(file);
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
    return { blob: file, name: `${base}.${ext}`, width, height, optimized: false, kind: "image" };
  }
  let blob = await recompress(file, 2600, 0.88);
  if (blob.size > TARGET_LIMIT) blob = await recompress(file, 2200, 0.82);
  if (blob.size > TARGET_LIMIT) blob = await recompress(file, 1800, 0.78);
  if (blob.size > TARGET_LIMIT) {
    throw new Error("This image stays too large even after optimization.");
  }
  const { width, height } = await measureImage(blob);
  return { blob, name: `${base}.jpg`, width, height, optimized: true, kind: "image" };
}

/* ---------------------------------------------------------
   Video preparation: videos are uploaded as-is (no browser
   transcoding), so they must already fit the upload limit.
--------------------------------------------------------- */

export const MAX_VIDEO_BYTES = 4_300_000; // same cap as the upload route
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];
const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".m4v"];

export function isVideoFile(file: File): boolean {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return VIDEO_TYPES.includes(file.type) || VIDEO_EXTS.includes(ext);
}

export async function measureVideo(
  blob: Blob
): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(blob);
  try {
    const video = document.createElement("video");
    video.preload = "metadata";
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Not a readable video"));
      video.src = url;
    });
    return { width: video.videoWidth || 0, height: video.videoHeight || 0 };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Returns the video file to publish plus a truthful file name. Videos are
 * never recompressed in the browser: upload a short, pre-compressed clip
 * (mp4/webm/mov/m4v) that already fits under 4.3 MB.
 */
export async function prepareVideo(
  file: File
): Promise<{ blob: Blob; name: string; width: number; height: number; optimized: boolean; kind: "video" }> {
  const base = file.name.replace(/\.[^.]+$/, "").replace(/[^A-Za-z0-9._-]+/g, "-") || "video";
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!VIDEO_EXTS.includes(ext)) {
    throw new Error("Only mp4, webm, mov and m4v videos are supported.");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error(
      "This video is too large for the dashboard (max 4.3 MB). Compress it to a short clip under 4.3 MB before uploading."
    );
  }
  const { width, height } = await measureVideo(file);
  return { blob: file, name: `${base}${ext}`, width, height, optimized: false, kind: "video" };
}

/** Dispatches an uploaded file to image or video preparation. */
export async function prepareMedia(
  file: File
): Promise<{ blob: Blob; name: string; width: number; height: number; optimized: boolean; kind: "image" | "video" }> {
  return isVideoFile(file) ? prepareVideo(file) : prepareImage(file);
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

export async function executePlan(
  plan: PublishPlan,
  onProgress?: (message: string) => void
): Promise<string> {
  if (plan.projects.length === 0) throw new Error("Nothing to publish.");
  const payloads: PublishProjectPayload[] = [];
  for (const project of plan.projects) {
    const newImages: Array<{ name: string; blobSha: string }> = [];
    for (const img of project.newImages) {
      onProgress?.(`Uploading ${img.name}…`);
      newImages.push({ name: img.name, blobSha: await uploadOne(img.blob, img.name) });
    }
    payloads.push({
      slug: project.slug,
      deleted: project.deleted,
      content: project.content,
      newImages,
      removedImages: project.removedImages,
    });
  }
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
