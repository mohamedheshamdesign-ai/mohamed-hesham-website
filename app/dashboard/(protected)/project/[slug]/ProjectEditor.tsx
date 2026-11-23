"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { thumbSrc } from "@/lib/dashboard/types";
import {
  fetchProjects,
  mergeProjects,
  prepareImage,
  type MergedImage,
  type MergedProject,
} from "@/lib/dashboard/client";
import { loadOverlay, saveOverlay } from "@/lib/dashboard/draft";
import type {
  ApiProject,
  DraftImage,
  Overlay,
} from "@/lib/dashboard/types";
import { emptyOverlay } from "@/lib/dashboard/types";

type Chapter = {
  title: string;
  note?: string;
  layout?: "auto" | "full" | "wide" | "duo";
  media: string[];
};

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "project"
  );
}

function uniqueName(name: string, taken: Set<string>): string {
  if (!taken.has(name)) return name;
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  for (let i = 2; ; i++) {
    const candidate = `${base}-${i}${ext}`;
    if (!taken.has(candidate)) return candidate;
  }
}

/** Comma separated list that keeps what the user is typing (commas and spaces included). */
function ListInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (list: string[]) => void;
}) {
  const [text, setText] = useState(value.join(", "));
  return (
    <input
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(
          e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        );
      }}
      onBlur={() => setText(value.join(", "))}
    />
  );
}

type PaletteEntry = { name: string; value: string };

function PaletteEditor({
  palette,
  onChange,
}: {
  palette: PaletteEntry[];
  onChange: (next: PaletteEntry[]) => void;
}) {
  const update = (i: number, patch: Partial<PaletteEntry>) =>
    onChange(palette.map((c, ci) => (ci === i ? { ...c, ...patch } : c)));
  const valid = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);
  return (
    <div className="dash-palette">
      <h3>Colour system</h3>
      <p className="dash-muted small">
        Brand colours shown as swatches on the case study. Pick a colour or type a hex code.
      </p>
      {palette.map((c, i) => (
        <div className="dash-palette-row" key={i}>
          <input
            type="color"
            aria-label={`Colour ${i + 1}`}
            value={valid(c.value) ? c.value : "#000000"}
            onChange={(e) => update(i, { value: e.target.value })}
          />
          <input
            aria-label={`Colour ${i + 1} hex`}
            value={c.value}
            onChange={(e) => update(i, { value: e.target.value })}
            placeholder="#17372C"
            className={valid(c.value) ? "" : "invalid"}
          />
          <input
            aria-label={`Colour ${i + 1} name`}
            value={c.name}
            onChange={(e) => update(i, { name: e.target.value })}
            placeholder="Colour name"
          />
          <button
            type="button"
            className="dash-button ghost danger"
            onClick={() => onChange(palette.filter((_, ci) => ci !== i))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="dash-button ghost"
        onClick={() => onChange([...palette, { name: "", value: "#17372C" }])}
      >
        + Add colour
      </button>
    </div>
  );
}

export default function ProjectEditor({ slug }: { slug: string }) {
  const isNew = slug === "new";
  const router = useRouter();
  const [apiProjects, setApiProjects] = useState<ApiProject[] | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(emptyOverlay());
  const [project, setProject] = useState<MergedProject | null>(null);
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [newImages, setNewImages] = useState<DraftImage[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const [projects, saved] = await Promise.all([
          fetchProjects(),
          loadOverlay(),
        ]);
        setApiProjects(projects);
        setOverlay(saved);
        const merged = mergeProjects(projects, saved);
        if (isNew) {
          setContent({
            title: "",
            slug: "",
            category: "Brand Identity",
            primaryCategory: "brand-identity",
            description: "",
            challenge: "",
            solution: "",
            results: "",
            featured: false,
            chapters: [{ title: "Selected work", media: [] }],
            ownsSharedMedia: true,
          });
          setProject({
            slug: "new",
            title: "New project",
            category: "",
            description: "",
            featured: false,
            content: {},
            files: [],
            images: [],
            isNew: true,
            changed: true,
          });
        } else {
          const found = merged.find((p) => p.slug === slug);
          if (!found) {
            setError("Project not found.");
            return;
          }
          setProject(found);
          setContent({ ...found.content });
          const draft = saved.projects[slug];
          setNewImages(draft?.newImages || []);
          setRemovedImages(draft?.removedImages || []);
        }
      } catch (err) {
        setError(String((err as Error).message || err));
      }
    })();
  }, [slug, isNew]);

  const images: MergedImage[] = useMemo(() => {
    if (!project) return [];
    if (isNew) {
      return newImages.map((img) => ({
        name: img.name,
        src: URL.createObjectURL(img.blob),
        width: img.width,
        height: img.height,
        draft: true,
        blob: img.blob,
      }));
    }
    const kept = project.images.filter(
      (img) => img.draft || !removedImages.includes(img.name)
    );
    // project.images already merges draft images when a draft exists; when
    // editing fresh (no draft yet) local newImages are not in it yet.
    const known = new Set(kept.map((img) => img.name));
    const extra = newImages
      .filter((img) => !known.has(img.name))
      .map((img) => ({
        name: img.name,
        src: URL.createObjectURL(img.blob),
        width: img.width,
        height: img.height,
        draft: true,
        blob: img.blob,
      }));
    return [...kept, ...extra];
  }, [project, newImages, removedImages, isNew]);

  const chapters: Chapter[] = useMemo(() => {
    const raw = content.chapters;
    return Array.isArray(raw) ? (raw as Chapter[]) : [];
  }, [content]);

  function set(field: string, value: unknown) {
    setContent((prev) => ({ ...prev, [field]: value }));
  }

  function setChapter(index: number, patch: Partial<Chapter>) {
    const next = chapters.map((chapter, i) =>
      i === index ? { ...chapter, ...patch } : chapter
    );
    set("chapters", next);
  }

  function chapterMove(ci: number, name: string, dir: -1 | 1) {
    const chapter = chapters[ci];
    const i = chapter.media.indexOf(name);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= chapter.media.length) return;
    const media = [...chapter.media];
    [media[i], media[j]] = [media[j], media[i]];
    setChapter(ci, { media });
  }

  function chapterRemove(ci: number, name: string) {
    setChapter(ci, {
      media: chapters[ci].media.filter((item) => item !== name),
    });
  }

  function chapterAdd(ci: number, name: string) {
    if (!name) return;
    const chapter = chapters[ci];
    if (chapter.media.includes(name)) return;
    setChapter(ci, { media: [...chapter.media, name] });
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const taken = new Set(images.map((img) => img.name));
    const added: DraftImage[] = [];
    let optimizedCount = 0;
    for (const file of Array.from(files)) {
      try {
        const prepared = await prepareImage(file);
        const name = uniqueName(prepared.name, taken);
        taken.add(name);
        if (prepared.optimized) optimizedCount += 1;
        added.push({
          name,
          width: prepared.width,
          height: prepared.height,
          blob: prepared.blob,
        });
      } catch (err) {
        setError(`${file.name}: ${(err as Error).message}`);
      }
    }
    if (added.length) {
      setNewImages((prev) => [...prev, ...added]);
      setNotice(
        optimizedCount
          ? `${added.length} image(s) added. ${optimizedCount} large image(s) were optimized for the web - originals stay untouched on your device.`
          : `${added.length} image(s) added.`
      );
    }
  }

  function removeImage(img: MergedImage) {
    if (img.draft) {
      setNewImages((prev) => prev.filter((item) => item.name !== img.name));
    } else {
      setRemovedImages((prev) => [...prev, img.name]);
    }
    setContent((prev) => ({
      ...prev,
      chapters: (Array.isArray(prev.chapters) ? (prev.chapters as Chapter[]) : []).map(
        (chapter) => ({
          ...chapter,
          media: chapter.media.filter((name) => name !== img.name),
        })
      ),
      cover:
        typeof prev.cover === "string" && prev.cover.endsWith(`/${img.name}`)
          ? ""
          : prev.cover,
    }));
  }

  const coverName =
    typeof content.cover === "string" ? content.cover.split("/").pop() : "";

  async function save() {
    setError("");
    const title = String(content.title || "").trim();
    if (!title) {
      setError("Give the project a title first.");
      return;
    }
    const finalSlug = isNew
      ? slugify(String(content.slug || title))
      : slug;
    if (isNew && apiProjects?.some((p) => p.slug === finalSlug)) {
      setError(`A project with the address "${finalSlug}" already exists.`);
      return;
    }
    if (images.length === 0) {
      setError("Add at least one image before saving.");
      return;
    }
    const finalContent: Record<string, unknown> = {
      ...content,
      title,
      slug: finalSlug,
      category: String(content.category || ""),
      primaryCategory: ["brand-identity", "packaging", "digital"].includes(
        String(content.primaryCategory)
      )
        ? String(content.primaryCategory)
        : "brand-identity",
      description: String(content.description || ""),
      challenge: String(content.challenge || ""),
      solution: String(content.solution || ""),
      results: String(content.results || ""),
      featured: content.featured === true,
      ownsSharedMedia: true,
      chapters: chapters
        .map((chapter) => ({
          title: chapter.title,
          ...(chapter.note ? { note: chapter.note } : {}),
          ...(chapter.layout && chapter.layout !== "auto"
            ? { layout: chapter.layout }
            : {}),
          media: chapter.media,
        }))
        .filter((chapter) => chapter.title && chapter.media.length),
    };
    if (coverName) {
      finalContent.cover = `/projects/${finalSlug}/${coverName}`;
    } else {
      delete finalContent.cover;
    }
    for (const key of ["client", "sector", "role"]) {
      if (!String(finalContent[key] || "").trim()) delete finalContent[key];
    }
    for (const key of ["services", "deliverables"]) {
      if (!Array.isArray(finalContent[key]) || !(finalContent[key] as string[]).length) {
        delete finalContent[key];
      }
    }

    const next: Overlay = {
      ...overlay,
      projects: {
        ...overlay.projects,
        [finalSlug]: {
          slug: finalSlug,
          content: finalContent,
          newImages,
          removedImages,
          isNew,
        },
      },
    };
    // Keep the dashboard order list consistent for brand-new projects.
    if (isNew && next.order.length && !next.order.includes(finalSlug)) {
      next.order = [...next.order, finalSlug];
    }
    await saveOverlay(next);
    router.push("/dashboard");
  }

  if (error && !project) return <p className="dash-error">{error}</p>;
  if (!project) return <p className="dash-muted">Loading…</p>;

  const unassigned = images.filter(
    (img) => !chapters.some((chapter) => chapter.media.includes(img.name))
  );

  return (
    <div className="dash-editor">
      <div className="dash-page-head">
        <h1>{isNew ? "Add project" : `Edit: ${project.title}`}</h1>
      </div>
      {error && <p className="dash-error">{error}</p>}
      {notice && <p className="dash-notice">{notice}</p>}

      <section className="dash-card">
        <h2>Basics</h2>
        <div className="dash-grid2">
          <label>
            Title
            <input
              value={String(content.title || "")}
              onChange={(e) => set("title", e.target.value)}
            />
          </label>
          <label>
            Category (shown under the title)
            <input
              value={String(content.category || "")}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Brand Identity • Packaging"
            />
          </label>
          <label>
            Main filter (decides which filter shows this project)
            <select
              required
              value={String(content.primaryCategory || "brand-identity")}
              onChange={(e) => set("primaryCategory", e.target.value)}
            >
              <option value="brand-identity">Brand Identity</option>
              <option value="packaging">Packaging</option>
              <option value="digital">Digital</option>
            </select>
          </label>
          {isNew && (
            <label>
              Web address (slug)
              <input
                value={String(content.slug || "")}
                onChange={(e) => set("slug", slugify(e.target.value))}
                placeholder={slugify(String(content.title || "project"))}
              />
            </label>
          )}
          <label className="dash-check">
            <input
              type="checkbox"
              checked={content.featured === true}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Show on homepage
          </label>
        </div>
        <label>
          Short description
          <textarea
            rows={3}
            value={String(content.description || "")}
            onChange={(e) => set("description", e.target.value)}
          />
        </label>
        <div className="dash-grid3">
          <label>
            Challenge
            <textarea
              rows={3}
              value={String(content.challenge || "")}
              onChange={(e) => set("challenge", e.target.value)}
            />
          </label>
          <label>
            Solution
            <textarea
              rows={3}
              value={String(content.solution || "")}
              onChange={(e) => set("solution", e.target.value)}
            />
          </label>
          <label>
            Results
            <textarea
              rows={3}
              value={String(content.results || "")}
              onChange={(e) => set("results", e.target.value)}
            />
          </label>
        </div>
        <div className="dash-grid3">
          <label>
            Client (optional)
            <input
              value={String(content.client || "")}
              onChange={(e) => set("client", e.target.value)}
            />
          </label>
          <label>
            Sector (optional)
            <input
              value={String(content.sector || "")}
              onChange={(e) => set("sector", e.target.value)}
            />
          </label>
          <label>
            Role (optional)
            <input
              value={String(content.role || "")}
              onChange={(e) => set("role", e.target.value)}
            />
          </label>
        </div>
        <div className="dash-grid2">
          <label>
            Services (comma separated, optional)
            <ListInput
              value={Array.isArray(content.services) ? (content.services as string[]) : []}
              onChange={(list) => set("services", list)}
            />
          </label>
          <label>
            Deliverables (comma separated, optional)
            <ListInput
              value={Array.isArray(content.deliverables) ? (content.deliverables as string[]) : []}
              onChange={(list) => set("deliverables", list)}
            />
          </label>
        </div>
        <PaletteEditor
          palette={
            Array.isArray(content.palette)
              ? (content.palette as PaletteEntry[])
              : []
          }
          onChange={(next) => set("palette", next)}
        />
      </section>

      <section className="dash-card">
        <h2>Images</h2>
        <p className="dash-muted small">
          Upload your designs, then pick the cover and arrange the case-study
          chapters below.
        </p>
        <button
          type="button"
          className="dash-button ghost"
          onClick={() => fileInput.current?.click()}
        >
          + Upload images
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            onUpload(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="dash-card-preview">
          <p className="dash-muted small">
            Card preview: how this project looks on the homepage and the work
            page. It follows the cover and the title and services you edit.
          </p>
          <div className="dash-card-preview-box">
            <div className="studio-project-card">
              <div className="studio-project-art project-art-real">
                {(images.find((img) => img.name === coverName) || images.find((img) => /^cover\./i.test(img.name)) || images[0]) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbSrc((images.find((img) => img.name === coverName) || images.find((img) => /^cover\./i.test(img.name)) || images[0]).src, 640)}
                    alt=""
                    className="studio-project-image"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                  />
                )}
                <span className="project-art-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="studio-project-meta">
                <div>
                  <h3>{String(content.title || "Untitled project")}</h3>
                  <p>
                    {String(content.category || "")
                      .split("•")
                      .slice(0, 2)
                      .join(" / ")
                      .trim()}
                  </p>
                </div>
                <span aria-hidden="true">↗</span>
              </div>
            </div>
          </div>
        </div>
        <div className="dash-images">
          {images.map((img) => (
            <figure key={img.name} className={coverName === img.name ? "cover" : ""}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbSrc(img.src)} alt={img.name} loading="lazy" decoding="async" />
              <figcaption>{img.name}</figcaption>
              <div className="dash-img-actions">
                <button
                  type="button"
                  onClick={() =>
                    set("cover", `/projects/${isNew ? slugify(String(content.slug || content.title || "project")) : slug}/${img.name}`)
                  }
                >
                  {coverName === img.name ? "Cover ✓" : "Set cover"}
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => removeImage(img)}
                >
                  Delete
                </button>
              </div>
            </figure>
          ))}
        </div>
      </section>

      <section className="dash-card">
        <h2>Case-study chapters</h2>
        {chapters.map((chapter, ci) => (
          <div key={ci} className="dash-chapter">
            <div className="dash-chapter-head">
              <input
                value={chapter.title}
                onChange={(e) => setChapter(ci, { title: e.target.value })}
                placeholder={`Chapter ${ci + 1} title`}
              />
              <input
                value={chapter.note || ""}
                onChange={(e) => setChapter(ci, { note: e.target.value })}
                placeholder="Small note (optional)"
              />
              <select
                aria-label="Chapter layout"
                value={chapter.layout || "auto"}
                onChange={(e) =>
                  setChapter(ci, {
                    layout: e.target.value as Chapter["layout"],
                  })
                }
              >
                <option value="auto">Layout: Auto (designed rhythm)</option>
                <option value="full">Layout: Full width, one per row</option>
                <option value="wide">Layout: Contained, one per row</option>
                <option value="duo">Layout: Two side by side</option>
              </select>
              <button
                type="button"
                className="danger"
                onClick={() =>
                  set("chapters", chapters.filter((_, i) => i !== ci))
                }
              >
                Remove chapter
              </button>
            </div>
            <div className="dash-chapter-images">
              {chapter.media.map((name) => {
                const img = images.find((item) => item.name === name);
                if (!img) return null;
                return (
                  <figure key={name}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbSrc(img.src)} alt={name} loading="lazy" decoding="async" />
                    <div className="dash-img-actions">
                      <button type="button" onClick={() => chapterMove(ci, name, -1)}>
                        ←
                      </button>
                      <button type="button" onClick={() => chapterMove(ci, name, 1)}>
                        →
                      </button>
                      <button type="button" onClick={() => chapterRemove(ci, name)}>
                        ×
                      </button>
                    </div>
                  </figure>
                );
              })}
              {unassigned.length > 0 && (
                <select
                  value=""
                  onChange={(e) => chapterAdd(ci, e.target.value)}
                >
                  <option value="">+ Add image…</option>
                  {unassigned.map((img) => (
                    <option key={img.name} value={img.name}>
                      {img.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="dash-button ghost"
          onClick={() =>
            set("chapters", [
              ...chapters,
              { title: `Chapter ${chapters.length + 1}`, media: [] },
            ])
          }
        >
          + Add chapter
        </button>
      </section>

      <div className="dash-editor-actions">
        <button
          type="button"
          className="dash-button ghost"
          onClick={() => router.push("/dashboard")}
        >
          Back
        </button>
        <button type="button" className="dash-button primary" onClick={save}>
          Save changes
        </button>
      </div>
      <p className="dash-muted small">
        Saving keeps your changes private on this device. Use “Publish
        changes” on the projects page when you are ready to go live.
      </p>
    </div>
  );
}
