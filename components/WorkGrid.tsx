"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import ProjectCard from "@/components/ProjectCard";

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

  const sizes = featured
    ? "(max-width: 550px) 90vw, (max-width: 800px) 45vw, 30vw"
    : "(max-width: 550px) 90vw, 45vw";

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
        {visible.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            sizes={sizes}
            from={activeTag}
          />
        ))}
      </div>
      {visible.length === 0 && <div className="studio-empty"><h3>No projects found.</h3><p>Try another service or a different search.</p><button type="button" className="studio-button" onClick={() => { setQuery(""); setActiveTag("All"); }}>Show all work <span aria-hidden="true">↗</span></button></div>}
      {featured && <div className="studio-work-bottom"><span>Like what you see? Let&apos;s make something that&apos;s unmistakably you.</span><Link href="/contact" className="studio-text-link">Your project could be next <span aria-hidden="true">↗</span></Link></div>}
    </>
  );
}
