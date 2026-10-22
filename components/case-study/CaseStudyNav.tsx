import Link from "next/link";

import type { Project } from "@/lib/projects";

type CaseStudyNavProps = {
  previous: Project | null;
  next: Project | null;
};

/**
 * Previous / next project navigation.
 *
 * A case study is a dead end without it, so both directions are always
 * offered — never just "next".
 */
export default function CaseStudyNav({
  previous,
  next,
}: CaseStudyNavProps) {
  if (!previous && !next) return null;

  return (
    <nav
      className="cs-pagination"
      aria-label="Project navigation"
    >
      <div className="cs-container cs-pagination-inner">
        {previous ? (
          <Link
            href={`/work/${previous.slug}`}
            className="cs-pagination-link cs-pagination-prev"
            rel="prev"
          >
            <span className="cs-pagination-label">
              ← Previous project
            </span>
            <span className="cs-pagination-title">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next && (
          <Link
            href={`/work/${next.slug}`}
            className="cs-pagination-link cs-pagination-next"
            rel="next"
          >
            <span className="cs-pagination-label">
              Next project →
            </span>
            <span className="cs-pagination-title">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
