import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Link from "next/link";

import ProjectGallery from "@/components/ProjectGallery";

import {
  getProjectBySlug,
  getProjects,
} from "@/lib/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = getProjectBySlug(slug);

    return {
      title: project.title,
      description: project.description,
      alternates: { canonical: `/work/${slug}` },
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.cover ? [project.cover] : [],
      },
    };
  } catch {
    return { title: "Project not found" };
  }
}

export default async function ProjectPage({
  params,
}: PageProps) {
  const { slug } = await params;

  let project;

  try {
    project = getProjectBySlug(slug);
  } catch {
    notFound();
  }

  const allProjects = getProjects().filter(
    (p, i, arr) =>
      arr.findIndex((q) => q.slug === p.slug) === i
  );

  const currentIndex = allProjects.findIndex(
    (p) => p.slug === project.slug
  );

  const nextProject =
    allProjects.length > 1
      ? allProjects[
          (currentIndex + 1) % allProjects.length
        ]
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.cover,
    creator: {
      "@type": "Person",
      name: "Mohamed Hesham",
    },
  };

  return (
    <main className="project-page bg-white text-black">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* =====================================================
          PROJECT HERO
      ===================================================== */}

      <section className="project-header">
        <div className="project-container">

          <div className="project-header-top">

            <p className="project-kicker">
              Case Study
            </p>

            <Link
              href="/work"
              className="project-back-link"
            >
              ← Back to work
            </Link>

          </div>

          <h1 className="project-title">
            {project.title}
          </h1>

          <p className="project-category">
            {project.category}
          </p>

          <div className="project-header-line" />

          <p className="project-description">
            {project.description}
          </p>

        </div>
      </section>


      {/* =====================================================
          CHALLENGE / SOLUTION / RESULTS
      ===================================================== */}

      <section className="project-details">
        <div className="project-container">

          <div className="project-details-grid">

            {/* Challenge */}

            <div className="project-detail">

              <p className="project-detail-label">
                Challenge
              </p>

              <p className="project-detail-text">
                {project.challenge}
              </p>

            </div>


            {/* Solution */}

            <div className="project-detail">

              <p className="project-detail-label">
                Solution
              </p>

              <p className="project-detail-text">
                {project.solution}
              </p>

            </div>


            {/* Results */}

            <div className="project-detail">

              <p className="project-detail-label">
                Results
              </p>

              <p className="project-detail-text">
                {project.results}
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          PROJECT MEDIA
      ===================================================== */}

      <section className="project-gallery">

        <div className="project-media-container">

        <ProjectGallery
          title={project.title}
          images={project.media.map((m) => m.src)}
        />

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="project-cta">

        <div className="project-container">

          <div className="project-cta-inner">

            <p className="project-cta-kicker">
              Interested in building a stronger brand?
            </p>

            <h2 className="project-cta-title">
              Let&apos;s create something
              <br />
              <span>meaningful.</span>
            </h2>

            <Link
              href="/contact"
              className="project-cta-button"
            >
              Get In Touch
              <span>↗</span>
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          NEXT PROJECT
      ===================================================== */}

      <section className="project-next">

        <div className="project-container">

          {nextProject && (
            <Link
              href={`/work/${nextProject.slug}`}
              className="project-next-link"
            >
              <span>Next project</span>

              <h3>{nextProject.title}</h3>

              <span>View case study ↗</span>
            </Link>
          )}

        </div>

      </section>

    </main>
  );
}