import type { Metadata } from "next";
import { getProjects } from "@/lib/projects";

import WorkGrid from "@/components/WorkGrid";

export const metadata: Metadata = {
  title: 'Selected Work',
  description: 'Explore brand identities, packaging, and digital experiences by Mohamed Hesham, with the strategy and design thinking behind each project.',
  alternates: { canonical: '/work' },
  openGraph: { title: 'Selected Work', description: 'Explore brand identities, packaging, and digital experiences by Mohamed Hesham, with the strategy and design thinking behind each project.', url: '/work' },
};

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const projects = getProjects();

  const { tag } = await searchParams;

  return (
    <main id="main-content" tabIndex={-1} className="editorial-work-page">
      <section className="editorial-work">
        <div className="work-container">

          {/* Header */}

          <div className="editorial-work-header">
            <p className="work-kicker">
              Selected Work
            </p>

            <h1 className="editorial-work-title">
              A collection of brands,
              <br />
              <span>systems &amp; visual stories.</span>
            </h1>

            <p className="editorial-work-intro">
              A selection of brand identities, packaging,
              print design, and visual systems created to
              build stronger brand experiences.
            </p>
          </div>

          <WorkGrid key={tag || "All"} projects={projects} initialTag={tag} />

        </div>
      </section>
    </main>
  );
}