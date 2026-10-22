import Image from "next/image";
import Link from "next/link";

import ProjectTypePreview from "@/components/ProjectTypePreview";
import type { Project } from "@/lib/projects";

type CaseStudyRelatedProps = {
  projects: Project[];
};

/**
 * Other work, shown at the end of a case study so the visitor has a
 * route back into the portfolio instead of a dead end.
 */
export default function CaseStudyRelated({
  projects,
}: CaseStudyRelatedProps) {
  if (projects.length === 0) return null;

  return (
    <section
      className="cs-related"
      aria-labelledby="cs-related-heading"
    >
      <div className="cs-container">
        <div className="cs-related-head">
          <h2 id="cs-related-heading" className="cs-subheading">
            More work
          </h2>

          <Link href="/work" className="studio-text-link">
            All projects
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="cs-related-grid">
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
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
                    sizes="(max-width: 700px) 90vw, 30vw"
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

                <span
                  className="project-art-index"
                  aria-hidden="true"
                >
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                <span
                  className="project-art-arrow"
                  aria-hidden="true"
                >
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
          ))}
        </div>
      </div>
    </section>
  );
}
