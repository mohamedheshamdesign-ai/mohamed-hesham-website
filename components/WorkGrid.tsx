"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type WorkProject = {
  slug: string;
  title: string;
  category: string;
  description: string;
  cover: string;
};

function getTags(category: string) {
  return category
    .split(/[•—,]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function WorkGrid({
  projects,
}: {
  projects: WorkProject[];
}) {
  const [activeTag, setActiveTag] = useState("All");

  const tags = useMemo(() => {
    const all = projects.flatMap((p) => getTags(p.category));

    return ["All", ...Array.from(new Set(all))];
  }, [projects]);

  const visible =
    activeTag === "All"
      ? projects
      : projects.filter((p) =>
          getTags(p.category).includes(activeTag)
        );

  return (
    <>
      <div className="work-filters">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`work-filter ${
              activeTag === tag ? "work-filter-active" : ""
            }`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="editorial-grid">
        {visible.map((project, index) => {
          const isEven = index % 2 === 0;

          return (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className={`editorial-project ${
                isEven
                  ? "editorial-project-image-first"
                  : "editorial-project-text-first"
              }`}
            >
              <div className="editorial-project-image">
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  sizes="(max-width: 800px) 100vw, 50vw"
                  className="editorial-project-photo"
                  priority={index < 2}
                />

                <div className="editorial-project-image-overlay">
                  <span>View Case Study</span>
                  <span>↗</span>
                </div>
              </div>

              <div className="editorial-project-content">
                <div>
                  <p className="editorial-project-category">
                    {project.category}
                  </p>

                  <h2 className="editorial-project-title">
                    {project.title}
                  </h2>

                  <p className="editorial-project-description">
                    {project.description}
                  </p>
                </div>

                <span className="editorial-project-read">
                  View project
                  <span>↗</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
