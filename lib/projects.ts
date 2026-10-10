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

export type ProjectMedia = {
  src: string;
  type: "image" | "gif" | "video";
  name: string;
};

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string(),
  description: z.string(),
  challenge: z.string(),
  solution: z.string(),
  results: z.string(),
  featured: z.boolean().optional(),
  cover: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type Project = z.infer<typeof projectSchema> & {
  cover: string;
  hasRealCover: boolean;
  coverArt: string;
  images: string[];
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
): ProjectMedia["type"] | null {
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
 * (see `getPlaceholderHashes`). A project shows its tile as long as it
 * only contains placeholder media — adding a real cover swaps it out.
 */
export const PLACEHOLDER_ART: Record<string, string> = {
  "al-mashreq": "project-art-travel",
  alitalia: "project-art-bold",
  "atractive-collection": "project-art-beauty",
  "diana-essential-body-hair-care": "project-art-beauty",
  everest: "project-art-connect",
  "infinity-connect-group": "project-art-connect",
  "memo-trips": "project-art-travel",
  "olive-branch": "project-art-olive",
  ultrascan: "project-art-bold",
};

function sha256File(filePath: string): string {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

/**
 * Every media file is hashed at build time. A file is treated as a generic
 * placeholder when the exact same bytes appear in two or more projects
 * (the original "00–03" stock images were copied into every project
 * folder). All other images are genuinely unique to their project.
 */
let placeholderHashesCache: Set<string> | null = null;

function buildPlaceholderHashes(): Set<string> {
  const counts = new Map<string, number>();

  for (const folder of getProjectFolders()) {
    for (const file of getProjectFiles(folder)) {
      const hash = sha256File(
        path.join(publicProjectsDirectory, folder, file)
      );
      counts.set(hash, (counts.get(hash) ?? 0) + 1);
    }
  }

  const placeholders = new Set<string>();

  for (const [hash, count] of counts) {
    if (count >= 2) placeholders.add(hash);
  }

  return placeholders;
}

function getPlaceholderHashes(): Set<string> {
  if (!placeholderHashesCache) {
    placeholderHashesCache = buildPlaceholderHashes();
  }

  return placeholderHashesCache;
}

type CoverResolution = {
  cover: string;
  hasRealCover: boolean;
  coverFile: string | null;
};

function resolveCover(
  slug: string,
  files: string[]
): CoverResolution {
  const coverFile = findCoverFile(files);

  if (!coverFile) {
    return {
      cover: "",
      hasRealCover: false,
      coverFile: null,
    };
  }

  const directory = path.join(
    publicProjectsDirectory,
    slug
  );

  const placeholders = getPlaceholderHashes();

  const declaredIsReal = !placeholders.has(
    sha256File(path.join(directory, coverFile))
  );

  if (declaredIsReal) {
    return {
      cover: `/projects/${slug}/${coverFile}`,
      hasRealCover: true,
      coverFile,
    };
  }

  // The declared cover is a placeholder. Fall back to the first genuinely
  // unique photo in the project, if one exists.
  const realFile = files.find((file) => {
    if (file === coverFile) return false;

    return (
      getMediaType(file) === "image" &&
      !placeholders.has(
        sha256File(path.join(directory, file))
      )
    );
  });

  if (realFile) {
    return {
      cover: `/projects/${slug}/${realFile}`,
      hasRealCover: true,
      coverFile: realFile,
    };
  }

  return {
    cover: "",
    hasRealCover: false,
    coverFile,
  };
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

    return {
      src: `/projects/${slug}/${file}`,
      type,
      name: file,
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
    });
}

export function getProjects(): Project[] {
  return getProjectFolders()
    .map((folder) => {
      const filePath = path.join(
        worksDirectory,
        folder,
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

      const files = getProjectFiles(
        project.slug
      );

      const coverResolved = resolveCover(
        project.slug,
        files
      );

      if (!coverResolved.coverFile) {
        return null;
      }

      return {
        ...project,

        cover: coverResolved.cover,

        hasRealCover: coverResolved.hasRealCover,

        coverArt:
          PLACEHOLDER_ART[project.slug] ??
          "project-art-travel",

        images: files
          .filter(
            (file) =>
              file !== coverResolved.coverFile &&
              getMediaType(file) === "image"
          )
          .map(
            (file) =>
              `/projects/${project.slug}/${file}`
          ),

        media: buildMedia(
          project.slug,
          files
        ).filter(
          (media) =>
            media.name !== coverResolved.coverFile
        ),
      };
    })
    .filter(
      (project): project is Project =>
        project !== null
    )

    // De-duplicate by slug (folder name and JSON slug must match;
    // this guards against placeholder duplicates)
    .filter(
      (project, index, array) =>
        array.findIndex(
          (p) => p.slug === project.slug
        ) === index
    );
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
  const filePath = path.join(
    worksDirectory,
    slug,
    "project.json"
  );

  const fileContents = fs.readFileSync(
    filePath,
    "utf8"
  );

  const project = projectSchema.parse(
    JSON.parse(fileContents)
  );

  const files = getProjectFiles(slug);

  const coverResolved = resolveCover(
    slug,
    files
  );

  const allMedia = buildMedia(
    slug,
    files
  );

  const galleryMedia = coverResolved.coverFile
    ? allMedia.filter(
        (media) =>
          media.name !== coverResolved.coverFile
      )
    : allMedia;

  return {
    ...project,

    cover: coverResolved.cover,

    hasRealCover: coverResolved.hasRealCover,

    coverArt:
      PLACEHOLDER_ART[slug] ??
      "project-art-travel",

    images: galleryMedia
      .filter(
        (media) =>
          media.type === "image"
      )
      .map(
        (media) => media.src
      ),

    media: galleryMedia,
  };
}