import Link from "next/link";
import Image from "next/image";

import { getFeaturedProjects } from "@/lib/projects";
import { getTestimonials } from "@/lib/testimonials";

import Testimonials from "@/components/Testimonials";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  const featuredProjects = getFeaturedProjects();
  const testimonials = getTestimonials();

  return (
    <main className="home-page bg-white text-neutral-950">

      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="hero-section">
        <div className="hero-grid">

          {/* Hero Copy */}

          <div className="hero-content">

            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />

              <span>
                Senior Brand & Graphic Designer
              </span>
            </div>

            <p className="hero-name">
              Mohamed Hesham
            </p>

            <FadeIn>
              <h1 className="hero-title">
                I build brands
                <br />
                people <span>remember.</span>
              </h1>
            </FadeIn>

            <p className="hero-lead">
              Helping businesses build brands people trust,
              remember, and choose.
            </p>

            <p className="hero-description">
              I help businesses create visual identities that
              strengthen perception, build trust, and deliver
              a consistent brand experience across print and
              digital media.
            </p>

            <div className="hero-actions">

              <Link
                href="/work"
                className="button button-primary"
              >
                View My Work
                <span>↗</span>
              </Link>

              <Link
                href="/contact"
                className="button button-secondary"
              >
                Let&apos;s Talk
                <span>↗</span>
              </Link>

            </div>

          </div>


          {/* Hero Image */}

          <div className="hero-visual">

            <div className="hero-image-frame hero-image-no-frame">

              <Image
                src="/profile.png"
                alt="Mohamed Hesham"
                width={700}
                height={1500}
                priority
                className="hero-image"
              />

              <div className="hero-image-accent" />

            </div>


            <div className="hero-floating-card hero-floating-card-top">

              <span className="floating-number">
                8+
              </span>

              <span className="floating-label">
                Years
                <br />
                Experience
              </span>

            </div>


            <div className="hero-floating-card hero-floating-card-bottom">

              <span className="floating-status" />

              <span>
                Based in Egypt
              </span>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          MARQUEE
      ========================================================== */}

      <section
        className="marquee-section"
        aria-label="Expertise"
      >

        <div className="marquee-wrapper">

          <div className="marquee-track">

            <span>Brand Identity</span>
            <i>✦</i>

            <span>Packaging Design</span>
            <i>✦</i>

            <span>Print Design</span>
            <i>✦</i>

            <span>Production</span>
            <i>✦</i>

            <span>Visual Systems</span>
            <i>✦</i>

            <span>Brand Guidelines</span>
            <i>✦</i>

            <span>Brand Identity</span>
            <i>✦</i>

            <span>Packaging Design</span>
            <i>✦</i>

            <span>Print Design</span>
            <i>✦</i>

            <span>Production</span>
            <i>✦</i>

            <span>Visual Systems</span>
            <i>✦</i>

            <span>Brand Guidelines</span>
            <i>✦</i>

          </div>

        </div>

      </section>


      {/* =========================================================
          FEATURED WORK
      ========================================================== */}

      <section className="work-section">

        <div className="section-container">

          <div className="section-heading">

            <div>

              <p className="section-kicker">
                Selected Work
              </p>

              <h2 className="section-title">
                Work that builds
                <br />
                <span>perception.</span>
              </h2>

            </div>


            <Link
              href="/work"
              className="section-link"
            >
              View all projects
              <span>↗</span>
            </Link>

          </div>


          {/* Project Grid */}

          <div className="home-project-grid">

            {featuredProjects.map((project, index) => (

              <FadeIn key={project.slug} delay={index * 0.08}>
              <Link
                href={`/work/${project.slug}`}
                className="home-project-card"
              >

                <div className="home-project-image">

                  <Image
                    src={project.cover}
                    alt={project.title}
                    fill
                    sizes="(max-width: 800px) 100vw, 33vw"
                    className="home-project-photo"
                  />


                  <div className="home-project-overlay">

                    <span>
                      View Case Study
                    </span>

                    <span>
                      ↗
                    </span>

                  </div>


                  <div className="home-project-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                </div>


                <div className="home-project-info">

                  <p className="home-project-category">
                    {project.category}
                  </p>

                  <h3 className="home-project-title">
                    {project.title}
                  </h3>

                  <span className="home-project-link">
                    View project
                    <span>↗</span>
                  </span>

                </div>

              </Link>
              </FadeIn>

            ))}

          </div>


          {/* Mobile / Bottom Link */}

          <div className="projects-mobile-link">

            <Link
              href="/work"
              className="button button-secondary"
            >
              View All Projects
              <span>↗</span>
            </Link>

          </div>

        </div>

      </section>


      {/* =========================================================
          ABOUT
      ========================================================== */}

      <section className="about-section">

        <div className="section-container">

          <div className="about-grid">

            <div>

              <p className="section-kicker">
                About
              </p>

              <h2 className="about-title">
                Design with purpose,
                <br />
                <span>not decoration.</span>
              </h2>

            </div>


            <div className="about-copy">

              <p>
                I&apos;m Mohamed Hesham, a Senior Brand &
                Graphic Designer based in Egypt. I help
                businesses build visual identities that
                strengthen perception, communicate value,
                and create memorable brand experiences
                across print and digital touchpoints.
              </p>

              <Link
                href="/about"
                className="text-link"
              >
                More about me
                <span>↗</span>
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          TESTIMONIALS
      ========================================================== */}

      <Testimonials testimonials={testimonials} />

      {/* =========================================================
          CTA
      ========================================================== */}

      <section className="cta-section">

        <div className="section-container">

          <div className="cta-inner">

            <p className="cta-kicker">
              Let&apos;s Work Together
            </p>

            <h2 className="cta-title">
              Let&apos;s build a brand
              <br />
              people <span>remember.</span>
            </h2>


            <div className="cta-actions">

              <Link
                href="/contact"
                className="button button-light"
              >
                Start a Project
                <span>↗</span>
              </Link>

              <Link
                href="/work"
                className="button button-dark-outline"
              >
                View Portfolio
                <span>↗</span>
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}