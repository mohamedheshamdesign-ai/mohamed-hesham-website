import fs from "fs";
import path from "path";

const testimonialsDirectory = path.join(
  process.cwd(),
  "public",
  "testimonials"
);

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
];

export function getTestimonials(): string[] {
  if (!fs.existsSync(testimonialsDirectory)) {
    return [];
  }

  const files = fs
    .readdirSync(testimonialsDirectory)
    .filter((file) => {
      const extension = path.extname(file).toLowerCase();

      return allowedExtensions.includes(extension);
    })
    .sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );

  return files.map(
    (file) => `/testimonials/${file}`
  );
}