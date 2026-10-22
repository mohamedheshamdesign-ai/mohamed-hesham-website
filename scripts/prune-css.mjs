/**
 * Removes exact CSS blocks that are no longer referenced by any
 * component. Run with `node scripts/prune-css.mjs`.
 */
import fs from "fs";

const file = "app/globals.css";

let css = fs.readFileSync(file, "utf8");

const blocks = [
  `.project-next {
  padding: 64px 0;
  border-top: 1px solid var(--border);
}

.project-next-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-next-link h3 {
  font-size: 32px;
  margin: 0;
}

`,

  `.project-media-button {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
}

`,

  `.project-detail-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.project-detail-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #111;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

`,

  `.project-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.project-meta-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin-bottom: 6px;
}

.project-meta-value {
  font-size: 14px;
}

.project-cover {
  padding: 0 0 64px;
}

.project-cover-image {
  width: 100%;
  height: auto;
  border-radius: 16px;
}

.project-media-item {
  position: relative;
}

`,

  `.project-cta-title span { color: var(--studio-teal); font-family: Georgia, serif; font-style: italic; }
.project-cta-button { background: var(--studio-teal); border-radius: 4px; }
.project-cta-button span { color: #fff; }
`,

  `.project-media-button:focus-visible { outline-offset: 3px; }
`,

  `.project-header { background: var(--studio-paper); }
.project-title { font-weight: 500; }
.project-gallery-pending { padding: 35px; margin-bottom: 50px; background: var(--studio-cream); border: 1px solid var(--border); border-radius: 5px; }
.project-gallery-pending h2 { font-weight: 500; font-size: 24px; margin: 0 0 12px; }
.project-gallery-pending p { color: var(--muted); font-size: 14px; line-height: 1.8; margin: 0; }
`,
];

for (const block of blocks) {
  const normalised = block.replace(/\n/g, "\r\n");

  if (css.includes(normalised)) {
    css = css.replace(normalised, "");
    console.log("removed block");
    continue;
  }

  if (css.includes(block)) {
    css = css.replace(block, "");
    console.log("removed block (lf)");
    continue;
  }

  console.log("NOT FOUND:", block.split("\n")[0]);
}

// The whole "PROJECT COVER ART" block is superseded by `.cs-cover-art`.
const coverArtStart = css.indexOf(
  `/* =========================================================\r\n   PROJECT COVER ART (no real cover photo yet)\r\n   ========================================================= */`
);

const coverArtEnd = css.indexOf(
  `/* =========================================================\r\n   CASE STUDY SYSTEM`
);

if (coverArtStart !== -1 && coverArtEnd !== -1) {
  css =
    css.slice(0, coverArtStart) +
    css.slice(coverArtEnd);

  console.log("removed project cover art block");
}

fs.writeFileSync(file, css, "utf8");
