import type { ProjectPaletteEntry } from "@/lib/projects";

type CaseStudyPaletteProps = {
  palette: ProjectPaletteEntry[];
};

/**
 * Brand colour swatches, taken from the project's own artwork.
 */
export default function CaseStudyPalette({
  palette,
}: CaseStudyPaletteProps) {
  if (palette.length === 0) return null;

  return (
    <section
      className="cs-palette"
      aria-labelledby="cs-palette-heading"
    >
      <h3 id="cs-palette-heading" className="cs-subheading">
        Colour system
      </h3>

      <ul className="cs-palette-list">
        {palette.map((entry) => (
          <li className="cs-swatch" key={entry.value}>
            <span
              className="cs-swatch-chip"
              style={{ backgroundColor: entry.value }}
              aria-hidden="true"
            />

            <span className="cs-swatch-name">
              {entry.name}
            </span>

            <span className="cs-swatch-value">
              {entry.value.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
