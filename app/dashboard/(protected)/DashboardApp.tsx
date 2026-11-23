"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchProjects,
  mergeProjects,
  executePlan,
  overlayHasChanges,
} from "@/lib/dashboard/client";
import {
  clearOverlay,
  loadOverlay,
  saveOverlay,
} from "@/lib/dashboard/draft";
import { buildPlan, type PublishPlan } from "@/lib/dashboard/plan";
import type { ApiProject, Overlay } from "@/lib/dashboard/types";
import { emptyOverlay } from "@/lib/dashboard/types";

function thumbFor(project: { content: Record<string, unknown>; images: { name: string; src: string }[] }): string {
  const cover = typeof project.content.cover === "string" ? project.content.cover : "";
  const name = cover.split("/").pop();
  const match = name ? project.images.find((img) => img.name === name) : undefined;
  const byName = project.images.find((img) => /^cover\./i.test(img.name));
  return (match || byName || project.images[0])?.src || "";
}

export default function DashboardApp() {
  const [apiProjects, setApiProjects] = useState<ApiProject[] | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(emptyOverlay());
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [review, setReview] = useState<PublishPlan | null>(null);
  const [ask, setAsk] = useState<{ kind: "remove" | "discard"; slug?: string } | null>(null);

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
    setAsk({ kind: "remove", slug });
  }

  function doRemove(slug: string) {
    const project = merged.find((p) => p.slug === slug);
    setAsk(null);
    if (!project) return;
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

  /** Step 1: re-read BOTH the live site and the saved draft, then show exactly what will change. */
  async function startPublish() {
    setError("");
    setNotice("");
    try {
      setBusy("Checking changes…");
      const [fresh, saved] = await Promise.all([fetchProjects(), loadOverlay()]);
      setApiProjects(fresh);
      setOverlay(saved);
      const plan = buildPlan(fresh, saved);
      setBusy("");
      if (plan.projects.length === 0) {
        await clearOverlay();
        setOverlay(emptyOverlay());
        setNotice("Nothing differs from the live site, so there is nothing to publish.");
        return;
      }
      setReview(plan);
    } catch (err) {
      setBusy("");
      setError(String((err as Error).message || err));
    }
  }

  /** Step 2: publish exactly the reviewed plan. */
  async function confirmPublish() {
    if (!review) return;
    const plan = review;
    setReview(null);
    setError("");
    try {
      setBusy("Preparing…");
      await executePlan(plan, (message) => setBusy(message));
      await clearOverlay();
      setOverlay(emptyOverlay());
      setBusy("");
      setNotice(
        "Published. The live site rebuilds in about a minute. Open it shortly to see your changes."
      );
      await reload();
    } catch (err) {
      setBusy("");
      setError(String((err as Error).message || err));
    }
  }

  async function doDiscard() {
    setAsk(null);
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
              onClick={() => setAsk({ kind: "discard" })}
            >
              Discard
            </button>
            <button
              type="button"
              className="dash-button primary"
              onClick={startPublish}
              disabled={Boolean(busy)}
            >
              {busy || "Publish changes"}
            </button>
          </div>
        </div>
      )}
      {notice && <p className="dash-notice" role="status">{notice}</p>}
      {error && <p className="dash-error">{error}</p>}
      {ask && (
        <div className="dash-review" role="alertdialog">
          <p>
            {ask.kind === "remove"
              ? `Remove "${merged.find((p) => p.slug === ask.slug)?.title || ask.slug}" from the site? This takes effect when you publish.`
              : "Discard all unpublished changes?"}
          </p>
          <div>
            <button type="button" className="dash-button ghost" onClick={() => setAsk(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="dash-button primary"
              onClick={() => (ask.kind === "remove" ? doRemove(ask.slug as string) : doDiscard())}
            >
              {ask.kind === "remove" ? "Yes, remove" : "Yes, discard"}
            </button>
          </div>
        </div>
      )}
      {review && (
        <div className="dash-review" role="alertdialog">
          <strong>Review before publishing</strong>
          <ul>
            {review.items.map((item) => (
              <li key={item.slug}>
                <b>{item.title}</b> - {item.kind === "new" ? "New" : item.kind === "removed" ? "Removed" : item.kind === "reordered" ? "Moved" : "Edited"}
                <small> {item.details.join(" · ")}</small>
              </li>
            ))}
          </ul>
          <div>
            <button type="button" className="dash-button ghost" onClick={() => setReview(null)}>
              Back
            </button>
            <button type="button" className="dash-button primary" onClick={confirmPublish}>
              Publish {review.items.length} change{review.items.length === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      )}

      <ul className="dash-list">
        {merged.map((project, index) => (
          <li key={project.slug} className="dash-row">
            <span className="dash-pos">{String(index + 1).padStart(2, "0")}</span>
            <span className="dash-thumb">
              {thumbFor(project) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbFor(project)} alt="" />
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
