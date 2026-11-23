"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  fetchProjects,
  mergeProjects,
  type MergedProject,
} from "@/lib/dashboard/client";
import { loadOverlay } from "@/lib/dashboard/draft";

type Chapter = { title: string; note?: string; media: string[] };

export default function CaseStudyPreview({ slug }: { slug: string }) {
  const [project, setProject] = useState<MergedProject | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [projects, saved] = await Promise.all([
          fetchProjects(),
          loadOverlay(),
        ]);
        const merged = mergeProjects(projects, saved);
        const found = merged.find((p) => p.slug === slug);
        if (!found) {
          setError("Project not found in the preview data.");
          return;
        }
        setProject(found);
      } catch (err) {
        setError(String((err as Error).message || err));
      }
    })();
  }, [slug]);

  const chapters: Chapter[] = useMemo(() => {
    const raw = project?.content.chapters;
    return Array.isArray(raw) ? (raw as Chapter[]) : [];
  }, [project]);

  if (error) return <p className="dash-error">{error}</p>;
  if (!project) return <p className="dash-muted">Loading preview…</p>;

  const content = project.content;
  const coverName =
    typeof content.cover === "string" ? content.cover.split("/").pop() : "";
  const cover = coverName
    ? project.images.find((img) => img.name === coverName)?.src
    : project.images[0]?.src;
  const services = Array.isArray(content.services)
    ? (content.services as string[])
    : [];
  const imageByName = new Map(project.images.map((img) => [img.name, img]));

  return (
    <main className="case-study dash-cs-preview">
      <p className="dash-preview-banner">
        Private preview — this is how the case study will look.{" "}
        <Link href="/dashboard">Back to projects</Link>
      </p>

      <header className="cs-header">
        <div className="cs-container">
          <p className="cs-kicker">Case study / preview</p>
          <h1 className="cs-title">{project.title}</h1>
          {services.length > 0 && (
            <p className="cs-subtitle">{services.join("  ·  ")}</p>
          )}
          <p className="cs-lede">{project.description}</p>
        </div>
      </header>

      {cover && (
        <section className="cs-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={`${project.title} — primary brand artwork`}
            className="cs-cover-image"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </section>
      )}

      <div className="cs-container">
        {chapters.length > 0 && (
          <div className="cs-gallery">
            {chapters.map((chapter, i) => (
              <section key={i} className="cs-chapter">
                <h2 className="cs-chapter-title">{chapter.title}</h2>
                {chapter.note && (
                  <p className="cs-chapter-note">{chapter.note}</p>
                )}
                {chapter.media.map((name) => {
                  const img = imageByName.get(name);
                  if (!img) return null;
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={name}
                      src={img.src}
                      alt={`${project.title} — ${chapter.title}`}
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  );
                })}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
