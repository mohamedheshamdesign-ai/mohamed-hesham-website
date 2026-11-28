"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  fetchProjects,
  mergeProjects,
  type MergedProject,
} from "@/lib/dashboard/client";
import { loadOverlay } from "@/lib/dashboard/draft";
import { groupMediaByRhythm } from "@/lib/case-study";
import CaseStudyFacts from "@/components/case-study/CaseStudyFacts";
import CaseStudyNarrative from "@/components/case-study/CaseStudyNarrative";
import CaseStudyPalette from "@/components/case-study/CaseStudyPalette";
import CaseStudyDeliverables from "@/components/case-study/CaseStudyDeliverables";

type Chapter = { title: string; note?: string; layout?: "auto" | "full" | "wide" | "duo"; media: string[] };

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
    : project.images.find((img) => img.kind !== "video")?.src;
  const services = Array.isArray(content.services)
    ? (content.services as string[])
    : [];
  const palette = Array.isArray(content.palette)
    ? (content.palette as { name: string; value: string }[]).filter(
        (c) => c && /^#[0-9a-fA-F]{6}$/.test(c.value)
      )
    : [];
  const deliverables = Array.isArray(content.deliverables)
    ? (content.deliverables as string[])
    : [];
  const text = (k: string) => String(content[k] ?? "");
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
          <CaseStudyFacts
            client={text("client") || project.title}
            sector={text("sector") || undefined}
            role={text("role")}
            services={services}
          />
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
        <CaseStudyNarrative
          overview={project.description}
          challenge={text("challenge")}
          solution={text("solution")}
          results={text("results")}
        />
        {palette.length > 0 || deliverables.length > 0 ? (
          <div className="cs-specs">
            <CaseStudyPalette palette={palette} />
            <CaseStudyDeliverables deliverables={deliverables} />
          </div>
        ) : null}
      </div>

      {chapters.length > 0 && (
        <div className="cs-gallery">
          {chapters.map((chapter, i) => {
            const items = chapter.media
              .map((name) => imageByName.get(name))
              .filter((img): img is NonNullable<typeof img> => Boolean(img))
              .map((img) => ({
                src: img.src,
                type: (img.kind === "video"
                  ? "video"
                  : /\.gif$/i.test(img.name)
                    ? "gif"
                    : "image") as "image" | "gif" | "video",
                name: img.name,
                width: img.width,
                height: img.height,
              }));
            return (
              <section key={i} className="cs-chapter">
                <header className="cs-chapter-head">
                  <h3>{chapter.title}</h3>
                  {chapter.note && <p>{chapter.note}</p>}
                </header>
                {groupMediaByRhythm(items, chapter.layout).map((group, gi) => (
                  <div key={gi} className={`cs-group cs-group-${group.layout}`}>
                    {group.media.map((item) => (
                      <figure key={item.src} className="cs-media">
                        {item.type === "video" ? (
                                    <video
                            className="cs-media-video"
                            src={item.src}
                            controls
                            playsInline
                            preload="metadata"
                            aria-label={`${project.title} - ${chapter.title}`}
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            className="cs-media-image"
                            src={item.src}
                            alt={`${project.title} - ${chapter.title}`}
                          />
                        )}
                      </figure>
                    ))}
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
