import Image from "next/image";
import Link from "next/link";

import ProjectTypePreview from "@/components/ProjectTypePreview";

export type ProjectCardData = {
  slug: string;
  title: string;
  category: string;
  cover: string;
  hasRealCover: boolean;
  coverArt: string;
};

type ProjectCardProps = {
  project: ProjectCardData;
  index: number;
  sizes: string;
  from?: string;
};

/**
 * A single project tile.
 *
 * Projects that do not have their own artwork yet fall back to a
 * typographic tile, so the grid never implies work that is not there.
 */
export default function ProjectCard({
  project,
  index,
  sizes,
  from,
}: ProjectCardProps) {
  const query = from && from !== "All"
    ? `?from=${encodeURIComponent(from)}`
    : "";

  return (
    <Link
      href={`/work/${project.slug}${query}`}
      className="studio-project-card"
    >
      <div
        className={`studio-project-art ${
          project.hasRealCover
            ? "project-art-real"
            : project.coverArt
        }`}
      >
        {project.hasRealCover ? (
          <Image
            src={project.cover}
            fill
            sizes={sizes}
            alt={`${project.title} — project cover`}
            className="studio-project-image"
          />
        ) : (
          <ProjectTypePreview
            title={project.title}
            category={project.category}
            index={index + 1}
          />
        )}

        <span className="project-art-index" aria-hidden="true">
          {(index + 1).toString().padStart(2, "0")}
        </span>

        <span className="project-art-arrow" aria-hidden="true">
          ↗
        </span>
      </div>

      <div className="studio-project-meta">
        <div>
          <h3>{project.title}</h3>
          <p>
            {project.category
              .split("•")
              .slice(0, 2)
              .join(" / ")
              .trim()}
          </p>
        </div>

        <span aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}
