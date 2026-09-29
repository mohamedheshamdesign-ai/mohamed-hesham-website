import Image from "next/image";
import Link from "next/link";

import { getProjectBySlug } from "@/lib/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function isVideo(src: string) {
  const cleanSrc = src.split("?")[0].toLowerCase();

  return (
    cleanSrc.endsWith(".mp4") ||
    cleanSrc.endsWith(".webm") ||
    cleanSrc.endsWith(".mov") ||
    cleanSrc.endsWith(".m4v")
  );
}

function isGif(src: string) {
  const cleanSrc = src.split("?")[0].toLowerCase();

  return cleanSrc.endsWith(".gif");
}

export default async function ProjectPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const project = getProjectBySlug(slug);

  return (
    <main className="project-page bg-white text-black">

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

          <div className="project-gallery-list">

            {project.images.map((media: string) => {

              /* =========================
                 VIDEO
              ========================= */

              if (isVideo(media)) {
                return (
                  <figure
                    key={media}
                    className="project-media-item"
                  >
                    <video
                      className="project-media"
                      src={media}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  </figure>
                );
              }


              /* =========================
                 GIF
              ========================= */

              if (isGif(media)) {
                return (
                  <figure
                    key={media}
                    className="project-media-item"
                  >
                    <img
                      src={media}
                      alt={project.title}
                      className="project-media project-media-gif"
                    />
                  </figure>
                );
              }


              /* =========================
                 IMAGE
              ========================= */

              return (
                <figure
                  key={media}
                  className="project-media-item"
                >
                  <Image
                    src={media}
                    alt={project.title}
                    width={2000}
                    height={2000}
                    sizes="(max-width: 920px) calc(100vw - 48px), 900px"
                    className="project-media"
                  />
                </figure>
              );

            })}

          </div>

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

    </main>
  );
}