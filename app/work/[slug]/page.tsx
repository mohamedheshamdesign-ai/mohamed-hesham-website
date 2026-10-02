import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Link from "next/link";
import Image from "next/image";

import ProjectGallery from "@/components/ProjectGallery";

import {
  getProjectBySlug,
  getProjects,
} from "@/lib/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
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
  searchParams,
}: PageProps) {
  const { slug } = await params;

  const from = (await searchParams)?.from;

  const backHref =
    from && from !== "All"
      ? `/work?tag=${encodeURIComponent(from)}`
      : "/work";

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
              href={backHref}
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

          {/* Meta row */}

          <div className="project-meta">

            <div className="project-meta-item">
              <span className="project-meta-label">Role</span>
              <span className="project-meta-value">Brand &amp; Graphic Designer</span>
            </div>

            <div className="project-meta-item">
              <span className="project-meta-label">Services</span>
              <span className="project-meta-value">{project.category}</span>
            </div>

            <div className="project-meta-item">
              <span className="project-meta-label">Location</span>
              <span className="project-meta-value">Egypt</span>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          COVER IMAGE
      ===================================================== */}

      {project.cover && (
        <section className="project-cover">

          <div className="project-media-container">

            <Image
              src={project.cover}
              alt={project.title}
              width={2000}
              height={1300}
              priority
              sizes="(max-width: 920px) calc(100vw - 48px), 1100px"
              className="project-cover-image"
            />

          </div>

        </section>
      )}


      {/* =====================================================
          CHALLENGE / SOLUTION / RESULTS
      ===================================================== */}

      <section className="project-details">
        <div className="project-container">

          <div className="project-details-grid">

            {/* Challenge */}

            <div className="project-detail">

              <p className="project-detail-label">
                <span className="project-detail-icon">01</span>
                Challenge
              </p>

              <p className="project-detail-text">
                {project.challenge}
              </p>

            </div>


            {/* Solution */}

            <div className="project-detail">

              <p className="project-detail-label">
                <span className="project-detail-icon">02</span>
                Solution
              </p>

              <p className="project-detail-text">
                {project.solution}
              </p>

            </div>


            {/* Results */}

            <div className="project-detail">

              <p className="project-detail-label">
                <span className="project-detail-icon">03</span>
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