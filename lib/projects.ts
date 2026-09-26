import fs from "fs";
import path from "path";

const worksDirectory = path.join(process.cwd(), "content", "works");

export function getProjects() {
  const folders = fs.readdirSync(worksDirectory);

  return folders.map((folder) => {
    const filePath = path.join(
      worksDirectory,
      folder,
      "project.json"
    );

    const fileContents = fs.readFileSync(filePath, "utf8");

    const project = JSON.parse(fileContents);

    return {
      ...project,
      cover: `/projects/${project.slug}/cover.jpg`,
    };
  });
}

export function getProjectBySlug(slug: string) {
  const filePath = path.join(
    worksDirectory,
    slug,
    "project.json"
  );

  const fileContents = fs.readFileSync(filePath, "utf8");

  const project = JSON.parse(fileContents);

  const imagesDirectory = path.join(
    process.cwd(),
    "public",
    "projects",
    slug
  );

  const images = fs
    .readdirSync(imagesDirectory)
    .filter(
      (file) =>
        file !== "cover.jpg" &&
        (file.endsWith(".jpg") ||
          file.endsWith(".jpeg") ||
          file.endsWith(".png") ||
          file.endsWith(".webp"))
    )
    .sort();

  return {
    ...project,
    images: images.map(
      (image) => `/projects/${slug}/${image}`
    ),
  };
}