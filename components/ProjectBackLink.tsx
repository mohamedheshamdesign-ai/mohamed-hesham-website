"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Filter-aware "back to work" link.
 *
 * The `from` query parameter is read on the client so the project page can be
 * statically generated (reading `searchParams` on the server forces dynamic
 * rendering). The server renders the plain `/work` fallback while hydrating.
 */
export default function ProjectBackLink() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const href =
    from && from !== "All"
      ? `/work?tag=${encodeURIComponent(from)}`
      : "/work";

  return (
    <Link href={href} className="project-back-link">
      ← Back to work
    </Link>
  );
}
