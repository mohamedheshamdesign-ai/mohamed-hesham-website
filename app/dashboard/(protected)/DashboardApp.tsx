"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchProjects,
  mergeProjects,
  overlayHasChanges,
  publishOverlay,
} from "@/lib/dashboard/client";
import {
  clearOverlay,
  loadOverlay,
  saveOverlay,
} from "@/lib/dashboard/draft";
import type { ApiProject, Overlay } from "@/lib/dashboard/types";
import { emptyOverlay } from "@/lib/dashboard/types";

export default function DashboardApp() {
  const [apiProjects, setApiProjects] = useState<ApiProject[] | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(emptyOverlay());
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    const [projects, saved] = await Promise.all([
      fetchProjects(),
      loadOverlay(),
    ]);
    setApiProjects(projects);
    setOverlay(saved);
  }, []);

  useEffect(() => {
    reload().catch((err) => setError(String(err.message || err)));
  }, [reload]);

  const merged = useMemo(
    () => (apiProjects ? mergeProjects(apiProjects, overlay) : []),
    [apiProjects, overlay]
  );

  const changes = overlayHasChanges(overlay);

  async function update(next: Overlay) {
    setOverlay(next);
    await saveOverlay(next);
  }

  function move(slug: string, dir: -1 | 1) {
    const order = merged.map((p) => p.slug);
    const i = order.indexOf(slug);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    update({ ...overlay, order });
  }

  function toggleHome(slug: string) {
    const project = merged.find((p) => p.slug === slug);
    if (!project) return;
    const existing = overlay.projects[slug];
    const content = {
      ...(existing?.content || project.content),
      featured: !project.featured,
    };
    update({
      ...overlay,
      projects: {
        ...overlay.projects,
        [slug]: {
          slug,
          content,
          newImages: existing?.newImages || [],
          removedImages: existing?.removedImages || [],
          isNew: existing?.isNew,
        },
      },
    });
  }

  function remove(slug: string) {
    const project = merged.find((p) => p.slug === slug);
    if (!project) return;
    if (
      !window.confirm(
        `Remove "${project.title}" from the site? This takes effect when you publish.`
      )
    ) {
      return;
    }
    const existing = overlay.projects[slug];
    update({
      ...overlay,
      projects: {
        ...overlay.projects,
        [slug]: {
          slug,
          content: existing?.content || project.content,
          newImages: [],
          removedImages: project.isNew
            ? []
            : [...new Set([...(existing?.removedImages || []), ...project.files])],
          deleted: true,
          isNew: existing?.isNew,
        },
      },
    });
  }

  async function publish() {
    if (
      !window.confirm(
        "Publish all pending changes to the live site? The site updates in about a minute."
      )
    ) {
      return;
    }
    setError("");
    try {
      setBusy("Preparing…");
      await publishOverlay(merged, overlay, (message) => setBusy(message));
      await clearOverlay();
      setOverlay(emptyOverlay());
      setBusy("");
      window.alert(
        "Published. The live site rebuilds in about a minute — open it shortly to see your changes."
      );
      await reload();
    } catch (err) {
      setBusy("");
      setError(String((err as Error).message || err));
    }
  }

  async function discard() {
    if (!window.confirm("Discard all unpublished changes?")) return;
    await clearOverlay();
    setOverlay(emptyOverlay());
  }

  if (error && !apiProjects) {
    return <p className="dash-error">{error}</p>;
  }
  if (!apiProjects) {
    return <p className="dash-muted">Loading your projects…</p>;
  }

  return (
    <div>
      <div className="dash-page-head">
        <div>
          <h1>Your projects</h1>
          <p className="dash-muted">
            Reorder, pick homepage projects, edit or add case studies. Nothing
            goes live until you publish.
          </p>
        </div>
        <Link href="/dashboard/project/new" className="dash-button">
          + Add project
        </Link>
      </div>

      {changes && (
        <div className="dash-publishbar">
          <span>You have unpublished changes.</span>
          <div>
            <Link href="/dashboard/preview" className="dash-button ghost">
              Preview
            </Link>
            <button
              type="button"
              className="dash-button ghost"
              onClick={discard}
            >
              Discard
            </button>
            <button
              type="button"
              className="dash-button primary"
              onClick={publish}
              disabled={Boolean(busy)}
            >
              {busy || "Publish changes"}
            </button>
          </div>
        </div>
      )}
      {error && <p className="dash-error">{error}</p>}

      <ul className="dash-list">
        {merged.map((project, index) => (
          <li key={project.slug} className="dash-row">
            <span className="dash-pos">{String(index + 1).padStart(2, "0")}</span>
            <span className="dash-thumb">
              {project.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.images[0].src} alt="" />
              ) : (
                <span className="dash-thumb-empty">No image</span>
              )}
            </span>
            <span className="dash-row-main">
              <strong>{project.title}</strong>
              <small>{project.category}</small>
              <span className="dash-badges">
                {project.isNew && <em className="dash-badge new">New</em>}
                {project.changed && !project.isNew && (
                  <em className="dash-badge changed">Edited</em>
                )}
                {project.featured && <em className="dash-badge home">Homepage</em>}
              </span>
            </span>
            <span className="dash-row-actions">
              <button
                type="button"
                onClick={() => move(project.slug, -1)}
                disabled={index === 0}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(project.slug, 1)}
                disabled={index === merged.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className={project.featured ? "on" : ""}
                onClick={() => toggleHome(project.slug)}
                title="Show on homepage"
              >
                {project.featured ? "Homepage ✓" : "Set homepage"}
              </button>
              <Link href={`/dashboard/project/${project.slug}`}>Edit</Link>
              <button
                type="button"
                className="danger"
                onClick={() => remove(project.slug)}
              >
                Remove
              </button>
            </span>
          </li>
        ))}
      </ul>
      <p className="dash-muted small">
        Tip: the homepage shows the first three projects marked “Homepage”.
        Changes stay private on this device until you publish.
      </p>
    </div>
  );
}
