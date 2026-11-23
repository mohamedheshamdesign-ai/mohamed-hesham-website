import fs from "fs";
import path from "path";

import { getProjects } from "@/lib/projects";
import { requireAuth, errorResponse } from "@/lib/dashboard/guard";
import type { ApiProject } from "@/lib/dashboard/types";

export const dynamic = "force-dynamic";

const worksDirectory = path.join(process.cwd(), "content", "works");
const publicProjectsDirectory = path.join(
  process.cwd(),
  "public",
  "projects"
);

export async function GET() {
  try {
    await requireAuth();
    const projects: ApiProject[] = getProjects().map((project) => {
      // Raw project.json: the dashboard edits on top of this verbatim, so
      // fields it does not manage are preserved exactly.
      let content: Record<string, unknown> = {};
      try {
        content = JSON.parse(
          fs.readFileSync(
            path.join(worksDirectory, project.slug, "project.json"),
            "utf8"
          )
        );
      } catch {
        content = { title: project.title, slug: project.slug };
      }
      let files: string[] = [];
      try {
        files = fs
          .readdirSync(path.join(publicProjectsDirectory, project.slug))
          .filter((file) => !file.startsWith("."))
          .sort();
      } catch {
        files = [];
      }
      return {
        slug: project.slug,
        title: project.title,
        category: project.category,
        primaryCategory: project.primaryCategory,
        description: project.description,
        featured: project.featured === true,
        order: project.order,
        content,
        cover: project.cover,
        hasRealCover: project.hasRealCover,
        coverArt: project.coverArt,
        coverWidth: project.coverWidth,
        coverHeight: project.coverHeight,
        media: project.media.map((item) => ({
          name: item.name,
          src: item.src,
          width: item.width,
          height: item.height,
        })),
        files,
      };
    });
    return Response.json({ projects });
  } catch (err) {
    return errorResponse(err);
  }
}
