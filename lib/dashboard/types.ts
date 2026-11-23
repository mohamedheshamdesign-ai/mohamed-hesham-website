/** Shared dashboard types - client safe, no server imports. */

export type ApiMedia = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export type ApiProject = {
  slug: string;
  title: string;
  category: string;
  primaryCategory: "brand-identity" | "packaging" | "digital";
  description: string;
  featured: boolean;
  order?: number;
  /** Raw project.json content, editable in the dashboard. */
  content: Record<string, unknown>;
  cover: string;
  hasRealCover: boolean;
  coverArt: string;
  coverWidth: number;
  coverHeight: number;
  media: ApiMedia[];
  /** Every file currently in public/projects/<slug>/ (for safe deletes). */
  files: string[];
};

/** A new image staged in the browser (IndexedDB) until publish. */
export type DraftImage = {
  name: string;
  width: number;
  height: number;
  blob: Blob;
};

export type DraftProject = {
  slug: string;
  content: Record<string, unknown>;
  newImages: DraftImage[];
  removedImages: string[];
  deleted?: boolean;
  isNew?: boolean;
};

export type Overlay = {
  updatedAt: string;
  /** Slugs in the order the /work grid should show. */
  order: string[];
  projects: Record<string, DraftProject>;
};

export const emptyOverlay = (): Overlay => ({
  updatedAt: new Date().toISOString(),
  order: [],
  projects: {},
});

export type PublishProjectPayload = {
  slug: string;
  deleted?: boolean;
  content: Record<string, unknown> | null;
  newImages: Array<{ name: string; blobSha: string }>;
  removedImages: string[];
};
