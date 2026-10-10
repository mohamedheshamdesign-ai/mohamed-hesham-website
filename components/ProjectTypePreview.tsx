type ProjectTypePreviewProps = {
  title: string;
  category: string;
  index?: number;
  label?: string;
};

/**
 * Designed typographic tile shown when a project has no real cover photo
 * yet (see placeholder detection in lib/projects.ts). Uses the editorial
 * system's own `.project-type-preview` / `.preview-*` classes, so it
 * automatically swaps out for the real photo as soon as one is added.
 */
export default function ProjectTypePreview({
  title,
  category,
  index,
  label,
}: ProjectTypePreviewProps) {
  const caption = (category.split("•")[0] || "Project")
    .trim()
    .toUpperCase();

  const tag =
    label ??
    (index
      ? `PROJECT ${String(index).padStart(3, "0")}`
      : "PROJECT");

  return (
    <div className="project-type-preview">
      <span className="preview-caption">{caption}</span>

      <div className="preview-emblem" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <path
            d="M50 0 59 32 85 15 68 41 100 50 68 59 85 85 59 68 50 100 41 68 15 85 32 59 0 50 32 41 15 15 41 32Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <strong>{title}</strong>

      <span className="preview-subtitle">
        BRAND &amp; GRAPHIC DESIGN
      </span>

      <span className="preview-label">{tag}</span>
    </div>
  );
}