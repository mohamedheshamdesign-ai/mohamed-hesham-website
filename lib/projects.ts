import fs from "fs";
import path from "path";

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

export type Project = {
  title: string;
  slug: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  featured?: boolean;
  cover: string;
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

function sortMediaFiles(files: string[]) {
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

function findCoverFile(files: string[]) {
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

export function getProjects(): Project[] {
  if (!fs.existsSync(worksDirectory)) {
    return [];
  }

  const folders = fs
    .readdirSync(worksDirectory)
    .filter((folder) => {
      const folderPath = path.join(
        worksDirectory,
        folder
      );

      return fs.statSync(folderPath).isDirectory();
    });

  return folders
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

      const project = JSON.parse(fileContents);

      const files = getProjectFiles(
        project.slug
      );

      const coverFile = findCoverFile(files);

      if (!coverFile) {
        return null;
      }

      return {
        ...project,

        cover: `/projects/${project.slug}/${coverFile}`,

        images: files
          .filter(
            (file) =>
              file !== coverFile &&
              getMediaType(file) !== "video" &&
              getMediaType(file) !== "gif"
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
            media.name !== coverFile
        ),
      };
    })
    .filter(
      (project): project is Project =>
        project !== null
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

  const project = JSON.parse(
    fileContents
  );

  const files = getProjectFiles(slug);

  const coverFile = findCoverFile(files);

  const allMedia = buildMedia(
    slug,
    files
  );

  const galleryMedia = allMedia.filter(
    (media) =>
      media.name !== coverFile
  );

  return {
    ...project,

    cover: coverFile
      ? `/projects/${slug}/${coverFile}`
      : "",

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