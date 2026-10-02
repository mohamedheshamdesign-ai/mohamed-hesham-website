import { getProjects } from "@/lib/projects";

import WorkGrid from "@/components/WorkGrid";

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const projects = getProjects();

  const { tag } = await searchParams;

  return (
    <main className="editorial-work-page">
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

          <WorkGrid projects={projects} initialTag={tag} />

        </div>
      </section>
    </main>
  );
}