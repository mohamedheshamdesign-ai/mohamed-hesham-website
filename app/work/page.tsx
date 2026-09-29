import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/projects";

export default function WorkPage() {
  const projects = getProjects();

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

          {/* Editorial Grid */}

          <div className="editorial-grid">
            {projects.map((project, index) => {
              const isEven = index % 2 === 0;

              return (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className={`editorial-project ${
                    isEven
                      ? "editorial-project-image-first"
                      : "editorial-project-text-first"
                  }`}
                >
                  {/* IMAGE */}

                  <div className="editorial-project-image">
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      sizes="(max-width: 800px) 100vw, 50vw"
                      className="editorial-project-photo"
                      priority={index < 2}
                    />

                    <div className="editorial-project-image-overlay">
                      <span>View Case Study</span>
                      <span>↗</span>
                    </div>
                  </div>

                  {/* INFO */}

                  <div className="editorial-project-content">
                    <div>
                      <p className="editorial-project-category">
                        {project.category}
                      </p>

                      <h2 className="editorial-project-title">
                        {project.title}
                      </h2>

                      <p className="editorial-project-description">
                        {project.description}
                      </p>
                    </div>

                    <span className="editorial-project-read">
                      View project
                      <span>↗</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>
    </main>
  );
}