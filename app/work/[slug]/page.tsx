import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";

import CaseStudyDeliverables from "@/components/case-study/CaseStudyDeliverables";
import CaseStudyFacts from "@/components/case-study/CaseStudyFacts";
import CaseStudyGallery from "@/components/case-study/CaseStudyGallery";
import CaseStudyNav from "@/components/case-study/CaseStudyNav";
import CaseStudyNarrative from "@/components/case-study/CaseStudyNarrative";
import CaseStudyPalette from "@/components/case-study/CaseStudyPalette";
import CaseStudyRelated from "@/components/case-study/CaseStudyRelated";
import ProjectBackLink from "@/components/ProjectBackLink";
import ProjectTypePreview from "@/components/ProjectTypePreview";

import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjects,
  getRelatedProjects,
} from "@/lib/projects";
import { ogImage, siteName } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({
    slug: project.slug,
  }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = getProjectBySlug(slug);
    const path = `/work/${slug}`;

    const cover = project.cover
      ? {
          url: project.cover,
          width: project.coverWidth,
          height: project.coverHeight,
          alt: `${project.title} — brand identity by ${siteName}`,
        }
      : ogImage;

    return {
      title: project.title,
      description: project.description,
      alternates: { canonical: path },
      openGraph: {
        type: "article",
        url: path,
        title: project.title,
        description: project.description,
        siteName,
        images: [cover],
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description: project.description,
        images: [cover.url],
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

  const allProjects = getProjects();

  const currentIndex = allProjects.findIndex(
    (p) => p.slug === project.slug
  );

  const { previous, next } = getAdjacentProjects(
    project.slug
  );

  const related = getRelatedProjects(project.slug, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    ...(project.cover ? { image: project.cover } : {}),
    creator: {
      "@type": "Person",
      name: "Mohamed Hesham",
    },
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="case-study"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="cs-header">
        <div className="cs-container">
          <div className="cs-header-top">
            <Suspense
              fallback={
                <Link
                  href="/work"
                  className="project-back-link"
                >
                  ← Back to work
                </Link>
              }
            >
              <ProjectBackLink />
            </Suspense>

            <p className="cs-kicker">
              Case study
              <span aria-hidden="true">
                {" "}
                /{" "}
                {(currentIndex + 1)
                  .toString()
                  .padStart(2, "0")}
              </span>
            </p>
          </div>

          <h1 className="cs-title">{project.title}</h1>

          <p className="cs-subtitle">
            {project.services.join("  ·  ")}
          </p>

          <p className="cs-lede">{project.description}</p>

          <CaseStudyFacts
            client={project.client ?? project.title}
            sector={project.sector}
            role={project.role}
            services={project.services}
          />
        </div>
      </header>

      {/* =====================================================
          COVER
      ===================================================== */}

      {project.hasRealCover ? (
        <section className="cs-cover">
          <Image
            src={project.cover}
            alt={`${project.title} — primary brand artwork`}
            width={project.coverWidth}
            height={project.coverHeight}
            priority
            sizes="100vw"
            className="cs-cover-image"
          />
        </section>
      ) : (
        <section
          className={`cs-cover cs-cover-art ${project.coverArt}`}
        >
          <ProjectTypePreview
            title={project.title}
            category={project.category}
            label="CASE STUDY"
          />
        </section>
      )}

      {/* =====================================================
          NARRATIVE
      ===================================================== */}

      <div className="cs-container">
        <CaseStudyNarrative
          overview={project.description}
          challenge={project.challenge}
          solution={project.solution}
          results={project.results}
        />

        {(project.palette?.length ?? 0) > 0 ||
        project.deliverables.length > 0 ? (
          <div className="cs-specs">
            <CaseStudyPalette
              palette={project.palette ?? []}
            />

            <CaseStudyDeliverables
              deliverables={project.deliverables}
            />
          </div>
        ) : null}
      </div>

      {/* =====================================================
          GALLERY
      ===================================================== */}

      {project.chapters.length > 0 && (
        <CaseStudyGallery
          title={project.title}
          chapters={project.chapters}
        />
      )}

      {/* =====================================================
          RELATED
      ===================================================== */}

      <CaseStudyRelated projects={related} />

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="cs-cta">
        <div className="cs-container cs-cta-inner">
          <p className="cs-cta-kicker">
            Have a brand that needs this level of detail?
          </p>

          <h2 className="cs-cta-title">
            Let&apos;s build something
            <br />
            <em>worth remembering.</em>
          </h2>

          <Link
            href="/contact"
            className="studio-button studio-button-light"
          >
            Start a project
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {/* =====================================================
          PREVIOUS / NEXT
      ===================================================== */}

      <CaseStudyNav previous={previous} next={next} />
    </main>
  );
}
