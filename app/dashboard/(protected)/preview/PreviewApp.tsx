"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  fetchProjects,
  mergeProjects,
  type MergedProject,
} from "@/lib/dashboard/client";
import { loadOverlay } from "@/lib/dashboard/draft";
import type { ApiProject, Overlay } from "@/lib/dashboard/types";
import { emptyOverlay } from "@/lib/dashboard/types";

const HOME_RANK = ["alitalia", "crowd", "onvaca", "al-mashreq", "memo-trips"];

function cardCover(project: MergedProject): string {
  const coverName =
    typeof project.content.cover === "string"
      ? project.content.cover.split("/").pop()
      : "";
  const byCover = coverName
    ? project.images.find((img) => img.name === coverName)
    : undefined;
  return (byCover || project.images[0])?.src || "";
}

function Card({
  project,
  index,
}: {
  project: MergedProject;
  index: number;
}) {
  const cover = cardCover(project);
  return (
    <Link
      href={`/dashboard/preview/${project.slug}`}
      className="studio-project-card"
    >
      <div className="studio-project-art project-art-real">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`${project.title} — project cover`}
            className="studio-project-image"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
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

export default function PreviewApp() {
  const [apiProjects, setApiProjects] = useState<ApiProject[] | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(emptyOverlay());
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [projects, saved] = await Promise.all([
          fetchProjects(),
          loadOverlay(),
        ]);
        setApiProjects(projects);
        setOverlay(saved);
      } catch (err) {
        setError(String((err as Error).message || err));
      }
    })();
  }, []);

  const merged = useMemo(
    () => (apiProjects ? mergeProjects(apiProjects, overlay) : []),
    [apiProjects, overlay]
  );

  const homeSelection = useMemo(() => {
    const featured = merged.filter((p) => p.featured);
    const rank = (slug: string) => {
      const i = HOME_RANK.indexOf(slug);
      return i === -1 ? HOME_RANK.length : i;
    };
    return [...featured]
      .sort((a, b) => rank(a.slug) - rank(b.slug))
      .slice(0, 3);
  }, [merged]);

  if (error) return <p className="dash-error">{error}</p>;
  if (!apiProjects) return <p className="dash-muted">Loading preview…</p>;

  return (
    <div className="dash-preview">
      <h1>Preview</h1>
      <p className="dash-muted">
        Exactly how your changes will look, including unpublished edits. Cards
        open a full case-study preview.
      </p>

      <h2 className="dash-preview-h">Homepage — selected work</h2>
      <div className="studio-project-grid studio-project-grid-featured">
        {homeSelection.map((project, index) => (
          <Card key={project.slug} project={project} index={index} />
        ))}
      </div>

      <h2 className="dash-preview-h">Work page — all projects</h2>
      <div className="studio-project-grid">
        {merged.map((project, index) => (
          <Card key={project.slug} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
