"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ProjectTypePreview from "@/components/ProjectTypePreview";

type WorkProject = {
  slug: string;
  title: string;
  category: string;
  description: string;
  cover: string;
  hasRealCover: boolean;
  coverArt: string;
};

const filters = ["All", "Brand Identity", "Packaging", "Digital"];

function matchesFilter(project: WorkProject, filter: string) {
  if (filter === "All") return true;
  if (filter === "Brand Identity") return /brand identity|branding|visual identity/i.test(project.category);
  if (filter === "Packaging") return /packaging/i.test(project.category);
  if (filter === "Digital") return /UI\/UX|digital|interaction/i.test(project.category);
  return project.category.toLowerCase().includes(filter.toLowerCase());
}

export default function WorkGrid({ projects, initialTag, featured = false }: {
  projects: WorkProject[];
  initialTag?: string;
  featured?: boolean;
}) {
  const [activeTag, setActiveTag] = useState(initialTag || "All");
  const [query, setQuery] = useState("");
  const availableFilters = useMemo(() => {
    const supported = filters.filter(filter => filter === "All" || projects.some(project => matchesFilter(project, filter)));
    return initialTag && !supported.includes(initialTag) ? [...supported, initialTag] : supported;
  }, [projects, initialTag]);
  const filtered = projects.filter(project => matchesFilter(project, activeTag)).filter(project =>
    `${project.title} ${project.category} ${project.description}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const visible = featured ? filtered.slice(0, 3) : filtered;

  return (
    <>
      <div className="studio-work-tools">
        <div className="studio-filters" aria-label="Filter projects by service">
          {availableFilters.map(tag => <button key={tag} type="button" aria-pressed={activeTag === tag} className={`studio-filter ${activeTag === tag ? "is-active" : ""}`} onClick={() => setActiveTag(tag)}>{tag === "All" ? "All work" : tag}<span>{projects.filter(project => matchesFilter(project, tag)).length.toString().padStart(2, "0")}</span></button>)}
        </div>
        {!featured && <input className="studio-search" type="search" placeholder="Find a project…" value={query} onChange={event => setQuery(event.target.value)} aria-label="Search projects" />}
        {featured && <span className="work-selection-note">SELECTED PROJECTS / {visible.length.toString().padStart(2, "0")}</span>}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{filtered.length} projects found{featured ? `; showing ${visible.length} selected projects` : ""}.</p>
      <div className={`studio-project-grid ${featured ? "studio-project-grid-featured" : ""}`}>
        {visible.map((project, index) => {
          return <Link key={project.slug} href={`/work/${project.slug}?from=${encodeURIComponent(activeTag)}`} className="studio-project-card">
            <div className={`studio-project-art ${project.hasRealCover ? "project-art-real" : project.coverArt}`}>
              {project.hasRealCover ? (
                <Image
                  src={project.cover}
                  fill
                  sizes={featured ? "(max-width: 550px) 90vw, (max-width: 800px) 45vw, 30vw" : "(max-width: 550px) 90vw, 45vw"}
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
              <span className="project-art-index" aria-hidden="true">{(index + 1).toString().padStart(2, "0")}</span>
              <span className="project-art-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="studio-project-meta"><div><h3>{project.title}</h3><p>{project.category.split("•").slice(0, 2).join(" / ").trim()}</p></div><span aria-hidden="true">↗</span></div>
          </Link>;
        })}
      </div>
      {visible.length === 0 && <div className="studio-empty"><h3>No projects found.</h3><p>Try another service or a different search.</p><button type="button" className="studio-button" onClick={() => { setQuery(""); setActiveTag("All"); }}>Show all work <span aria-hidden="true">↗</span></button></div>}
      {featured && <div className="studio-work-bottom"><span>Like what you see? Let&apos;s make something that&apos;s unmistakably you.</span><Link href="/contact" className="studio-text-link">Your project could be next <span aria-hidden="true">↗</span></Link></div>}
    </>
  );
}
