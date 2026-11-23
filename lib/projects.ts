import crypto from "crypto";
import fs from "fs";
import path from "path";
import { z } from "zod";

const worksDirectory = path.join(
  process.cwd(),
  "content",
  "works"
);

const publicProjectsDirectory = path.join(
  process.cwd(),
  "public",
  "projects"
);

export type MediaType = "image" | "gif" | "video";

export type ProjectMedia = {
  src: string;
  type: MediaType;
  name: string;
  /** Intrinsic pixel width — keeps `next/image` from guessing an aspect ratio. */
  width: number;
  /** Intrinsic pixel height. */
  height: number;
};

export type ProjectPaletteEntry = {
  name: string;
  value: string;
};

export type ProjectChapter = {
  title: string;
  note?: string;
  /** File names (relative to the project folder), in reading order. */
  media: string[];
};

const chapterSchema = z.object({
  title: z.string().min(1),
  note: z.string().optional(),
  media: z.array(z.string()),
});

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string(),
  /**
   * Primary filter category: exactly one of the three public work
   * filters, so filter counts always sum to the All work total.
   * The free-text `category` stays as the descriptive service tags.
   */
  primaryCategory: z.enum(["brand-identity", "packaging", "digital"]),
  description: z.string(),
  challenge: z.string(),
  solution: z.string(),
  results: z.string(),
  featured: z.boolean().optional(),
  cover: z.string().optional(),
  images: z.array(z.string()).optional(),
  /** Explicit grid position managed by the private dashboard. */
  order: z.number().optional(),

  /* ---------------------------------------------------------
     Editorial case study extensions. Every field is optional so
     existing project folders keep working untouched.
     --------------------------------------------------------- */

  client: z.string().optional(),
  sector: z.string().optional(),
  role: z.string().optional(),
  services: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  palette: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  /** Ordered chapters. When present they drive the case study gallery. */
  chapters: z.array(chapterSchema).optional(),
  /**
   * The original project folders each contain the same four "00–03"
   * files. Those files are byte-identical to the Al Mashreq brand book,
   * so showing them inside a different project's case study would
   * misrepresent the work. A project must explicitly claim shared
   * media before it is displayed as its own.
   */
  ownsSharedMedia: z.boolean().optional(),
});

export type ProjectContent = z.infer<
  typeof projectSchema
>;

export { projectSchema };

export type Project = Omit<
  ProjectContent,
  "chapters"
> & {
  cover: string;
  hasRealCover: boolean;
  coverArt: string;
  coverWidth: number;
  coverHeight: number;
  images: string[];
  media: ProjectMedia[];
  /** Chapters with their media resolved to real files. */
  chapters: ResolvedChapter[];
  services: string[];
  deliverables: string[];
  role: string;
};

export type ResolvedChapter = {
  title: string;
  note?: string;
  media: ProjectMedia[];
};


/* =========================================================
   MEDIA HELPERS
   ========================================================= */

const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const gifExtensions = [
  ".gif",
];

const videoExtensions = [
  ".mp4",
  ".webm",
  ".mov",
  ".m4v",
];

function getMediaType(
  fileName: string
): MediaType | null {
  const extension = path.extname(fileName).toLowerCase();

  if (imageExtensions.includes(extension)) {
    return "image";
  }

  if (gifExtensions.includes(extension)) {
    return "gif";
  }

  if (videoExtensions.includes(extension)) {
    return "video";
  }

  return null;
}


function isMediaFile(fileName: string) {
  return getMediaType(fileName) !== null;
}


/* =========================================================
   SORT MEDIA
   ========================================================= */

export function sortMediaFiles(files: string[]) {
  return [...files].sort((a, b) => {
    const aName = path.basename(a, path.extname(a));
    const bName = path.basename(b, path.extname(b));

    const aLower = aName.toLowerCase();
    const bLower = bName.toLowerCase();

    // cover always comes first
    if (aLower === "cover") return -1;
    if (bLower === "cover") return 1;

    // 00 comes before numbered media
    if (aLower === "00") return -1;
    if (bLower === "00") return 1;

    const aNumber = Number(aLower);
    const bNumber = Number(bLower);

    const aIsNumber = !Number.isNaN(aNumber);
    const bIsNumber = !Number.isNaN(bNumber);

    if (aIsNumber && bIsNumber) {
      return aNumber - bNumber;
    }

    if (aIsNumber) return -1;
    if (bIsNumber) return 1;

    return a.localeCompare(
      b,
      undefined,
      {
        numeric: true,
        sensitivity: "base",
      }
    );
  });
}


/* =========================================================
   IMAGE DIMENSIONS
   ========================================================= */

const sizeCache = new Map<
  string,
  { width: number; height: number } | null
>();

/**
 * Reads the intrinsic size of an image straight from its header.
 *
 * `next/image` needs real width/height to reserve the correct amount of
 * space; without them the browser reserves a square box and every
 * project image shifts the layout while it loads.
 */
export function readImageSize(
  filePath: string
): { width: number; height: number } | null {
  if (sizeCache.has(filePath)) {
    return sizeCache.get(filePath) ?? null;
  }

  const size = parseImageSize(filePath);

  sizeCache.set(filePath, size);

  return size;
}

function parseImageSize(
  filePath: string
): { width: number; height: number } | null {
  let buffer: Buffer;

  try {
    buffer = fs.readFileSync(filePath);
  } catch {
    return null;
  }

  if (buffer.length < 16) return null;

  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  // GIF
  if (
    buffer.toString("ascii", 0, 3) === "GIF"
  ) {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8),
    };
  }

  // WEBP
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    const chunk = buffer.toString("ascii", 12, 16);

    if (chunk === "VP8 ") {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }

    if (chunk === "VP8L") {
      const bits = buffer.readUInt32LE(21);

      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }

    if (chunk === "VP8X") {
      return {
        width: buffer.readUIntLE(24, 3) + 1,
        height: buffer.readUIntLE(27, 3) + 1,
      };
    }

    return null;
  }

  // JPEG
  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8
  ) {
    let offset = 2;

    while (offset < buffer.length - 1) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      const marker = buffer[offset + 1];

      // Standalone markers carry no payload.
      if (
        marker === 0x01 ||
        (marker >= 0xd0 && marker <= 0xd9)
      ) {
        offset += 2;
        continue;
      }

      if (offset + 4 > buffer.length) break;

      const length = buffer.readUInt16BE(offset + 2);

      const isStartOfFrame =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;

      if (isStartOfFrame) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }

      offset += 2 + length;
    }
  }

  return null;
}


/* =========================================================
   GET PROJECT FILES
   ========================================================= */

function getProjectFiles(slug: string) {
  const directory = path.join(
    publicProjectsDirectory,
    slug
  );

  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = fs
    .readdirSync(directory)
    .filter(isMediaFile);

  return sortMediaFiles(files);
}


/* =========================================================
   FIND COVER
   ========================================================= */

export function findCoverFile(files: string[]) {
  if (files.length === 0) {
    return null;
  }

  // 1. cover.*
  const coverFile = files.find(
    (file) =>
      path.basename(
        file,
        path.extname(file)
      ).toLowerCase() === "cover"
  );

  if (coverFile) {
    return coverFile;
  }

  // 2. 00.*
  const zeroFile = files.find(
    (file) =>
      path.basename(
        file,
        path.extname(file)
      ).toLowerCase() === "00"
  );

  if (zeroFile) {
    return zeroFile;
  }

  // 3. First media
  return files[0];
}


/* =========================================================
   PLACEHOLDER COVER DETECTION
   ========================================================= */

/**
 * Typographic tile variants used when a project has no real cover photo
 * (see `getSharedHashes`). A project shows its tile as long as it
 * only contains placeholder media — adding a real cover swaps it out.
 */
export const PLACEHOLDER_ART: Record<string, string> = {
  "al-mashreq": "project-art-bold",
  alitalia: "project-art-bold",
  "atractive-collection": "project-art-beauty",
  "diana-essential-body-hair-care": "project-art-beauty",
  everest: "project-art-connect",
  "infinity-connect-group": "project-art-connect",
  "memo-trips": "project-art-travel",
  "olive-branch": "project-art-olive",
  ultrascan: "project-art-bold",
};

const hashCache = new Map<string, string>();

function sha256File(filePath: string): string {
  const cached = hashCache.get(filePath);

  if (cached) return cached;

  const hash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");

  hashCache.set(filePath, hash);

  return hash;
}

/**
 * Every media file is hashed at build time. A file is treated as shared
 * filler when the exact same bytes appear in two or more project folders
 * (the original "00–03" files were copied into every project folder).
 *
 * Shared files are only shown when a project explicitly claims them
 * through `ownsSharedMedia` — otherwise they would be presented as
 * another client's work.
 */
let sharedHashesCache: Set<string> | null = null;

function buildSharedHashes(): Set<string> {
  const owners = new Map<string, Set<string>>();

  for (const folder of getProjectFolders()) {
    for (const file of getProjectFiles(folder)) {
      const hash = sha256File(
        path.join(publicProjectsDirectory, folder, file)
      );

      if (!owners.has(hash)) {
        owners.set(hash, new Set());
      }

      owners.get(hash)!.add(folder);
    }
  }

  const shared = new Set<string>();

  for (const [hash, slugs] of owners) {
    if (slugs.size >= 2) shared.add(hash);
  }

  return shared;
}

function getSharedHashes(): Set<string> {
  if (!sharedHashesCache) {
    sharedHashesCache = buildSharedHashes();
  }

  return sharedHashesCache;
}

/**
 * Files inside a project folder that genuinely belong to that project.
 */
function getOwnedFiles(
  slug: string,
  files: string[],
  ownsSharedMedia: boolean
) {
  if (ownsSharedMedia) return files;

  const shared = getSharedHashes();

  return files.filter((file) => {
    const hash = sha256File(
      path.join(publicProjectsDirectory, slug, file)
    );

    return !shared.has(hash);
  });
}


/* =========================================================
   BUILD MEDIA
   ========================================================= */

function buildMedia(
  slug: string,
  files: string[]
): ProjectMedia[] {
  return files.map((file) => {
    const type = getMediaType(file)!;

    const size =
      type === "video"
        ? null
        : readImageSize(
            path.join(publicProjectsDirectory, slug, file)
          );

    return {
      src: `/projects/${slug}/${file}`,
      type,
      name: file,
      width: size?.width ?? 1600,
      height: size?.height ?? 1200,
    };
  });
}


/* =========================================================
   GET ALL PROJECTS
   ========================================================= */

function getProjectFolders(): string[] {
  if (!fs.existsSync(worksDirectory)) {
    return [];
  }

  return fs
    .readdirSync(worksDirectory)
    .filter((folder) => {
      const folderPath = path.join(
        worksDirectory,
        folder
      );

      return fs.statSync(folderPath).isDirectory();
    })
    .sort((a, b) => a.localeCompare(b));
}

function splitServices(category: string) {
  return category
    .split("•")
    .map((service) => service.trim())
    .filter(Boolean);
}

function resolveChapters(
  slug: string,
  chapters: ProjectChapter[] | undefined,
  media: ProjectMedia[]
): ResolvedChapter[] {
  if (!chapters || chapters.length === 0) {
    return [];
  }

  const byName = new Map(
    media.map((item) => [item.name, item])
  );

  return chapters
    .map((chapter) => ({
      title: chapter.title,
      note: chapter.note,
      media: chapter.media
        .map((name) => byName.get(name))
        .filter(
          (item): item is ProjectMedia => Boolean(item)
        ),
    }))
    .filter((chapter) => chapter.media.length > 0);
}

function buildProject(slug: string) {
  const filePath = path.join(
    worksDirectory,
    slug,
    "project.json"
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(
    filePath,
    "utf8"
  );

  const project = projectSchema.parse(
    JSON.parse(fileContents)
  );

  const files = getProjectFiles(project.slug);

  if (files.length === 0) return null;

  const ownedFiles = getOwnedFiles(
    project.slug,
    files,
    project.ownsSharedMedia === true
  );

  const requestedCover = project.cover ? path.basename(project.cover) : null;
  const coverFile = requestedCover && ownedFiles.includes(requestedCover)
    ? requestedCover
    : findCoverFile(ownedFiles);

  const hasRealCover = Boolean(coverFile);

  const media = buildMedia(
    project.slug,
    coverFile
      ? ownedFiles.filter((file) => file !== coverFile)
      : ownedFiles
  );

  const coverSize = coverFile
    ? readImageSize(
        path.join(publicProjectsDirectory, project.slug, coverFile)
      )
    : null;

  return {
    ...project,

    cover: coverFile
      ? `/projects/${project.slug}/${coverFile}`
      : "",

    hasRealCover,

    coverArt:
      PLACEHOLDER_ART[project.slug] ??
      "project-art-travel",

    coverWidth: coverSize?.width ?? 1600,
    coverHeight: coverSize?.height ?? 1200,

    images: media
      .filter((item) => item.type === "image")
      .map((item) => item.src),

    media,

    chapters: resolveChapters(
      project.slug,
      project.chapters,
      media
    ),

    services:
      project.services ?? splitServices(project.category),

    deliverables: project.deliverables ?? [],

    role:
      project.role ?? "Brand & Graphic Designer",
  } satisfies Project;
}

let projectsCache: Project[] | null = null;

export function getProjects(): Project[] {
  if (projectsCache) return projectsCache;

  const projects = getProjectFolders()
    .map((folder) => buildProject(folder))
    .filter(
      (project): project is Project =>
        project !== null
    );

  // De-duplicate by slug (folder name and JSON slug must match;
  // this guards against placeholder duplicates)
  const unique = projects.filter(
    (project, index, array) =>
      array.findIndex(
        (p) => p.slug === project.slug
      ) === index
  );

  // Dashboard-managed order first; untouched projects keep their
  // original folder order (stable sort).
  unique.sort(
    (a, b) =>
      (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER)
  );

  projectsCache = unique;

  return unique;
}


/* =========================================================
   FEATURED PROJECTS
   ========================================================= */

export function getFeaturedProjects() {
  return getProjects().filter(
    (project) =>
      project.featured === true
  );
}


/* =========================================================
   GET PROJECT BY SLUG
   ========================================================= */

export function getProjectBySlug(
  slug: string
): Project {
  const project = getProjects().find(
    (item) => item.slug === slug
  );

  if (!project) {
    throw new Error(
      `Unknown project slug: ${slug}`
    );
  }

  return project;
}


/* =========================================================
   PROJECT NAVIGATION
   ========================================================= */

export function getAdjacentProjects(
  slug: string
): {
  previous: Project | null;
  next: Project | null;
} {
  const projects = getProjects();

  const index = projects.findIndex(
    (project) => project.slug === slug
  );

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous:
      projects[
        (index - 1 + projects.length) % projects.length
      ] ?? null,
    next:
      projects[(index + 1) % projects.length] ??
      null,
  };
}

/**
 * Other projects to surface at the end of a case study.
 */
export function getRelatedProjects(
  slug: string,
  limit = 3
): Project[] {
  return getProjects()
    .filter((project) => project.slug !== slug)
    .slice(0, limit);
}
