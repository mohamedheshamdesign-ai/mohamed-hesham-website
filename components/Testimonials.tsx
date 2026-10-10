"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type TestimonialsProps = {
  testimonials: string[];
};

/**
 * Keep this in sync with the `.testimonial-slide` widths in globals.css:
 * 3 slides on desktop, 2 at <=900px, 1 at <=600px.
 */
function getSlidesPerView(): number {
  if (typeof window === "undefined") return 3;

  if (window.matchMedia("(max-width: 600px)").matches) return 1;
  if (window.matchMedia("(max-width: 900px)").matches) return 2;

  return 3;
}

export default function Testimonials({
  testimonials,
}: TestimonialsProps) {
  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  const total = testimonials.length;

  const maxIndex = Math.max(0, total - slidesPerView);

  // Clamp at render time (e.g. after a breakpoint change shrinks the track).
  const safeCurrent = Math.min(current, maxIndex);

  // Track the responsive breakpoint so the transform and max index stay correct.
  useEffect(() => {
    const update = () => setSlidesPerView(getSlidesPerView());

    update();

    const mobileQuery = window.matchMedia("(max-width: 600px)");
    const tabletQuery = window.matchMedia("(max-width: 900px)");

    mobileQuery.addEventListener("change", update);
    tabletQuery.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      mobileQuery.removeEventListener("change", update);
      tabletQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const next = () => {
    setCurrent((prev) => {
      if (prev >= maxIndex) {
        return 0;
      }

      return prev + 1;
    });
  };

  const previous = () => {
    setCurrent((prev) => {
      if (prev <= 0) {
        return maxIndex;
      }

      return prev - 1;
    });
  };

  useEffect(() => {
    if (maxIndex === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= maxIndex) {
          return 0;
        }

        return prev + 1;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [maxIndex]);

  if (total === 0) {
    return null;
  }

  return (
    <section
      className="studio-testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className="studio-container">

        {/* Heading */}

        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">
              <span>06 /</span> WHAT CLIENTS SAY
            </p>

            <h2 id="testimonials-heading">
              Trusted by brands.
              <br />
              <em>that value great design.</em>
            </h2>
          </div>

          <p className="section-aside">
            A few kind words from recent projects.
            <br />
            Real feedback, after real work.
          </p>
        </div>


        {/* Slider */}

        <div
          className="testimonials-slider"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >

          <div className="testimonials-viewport">

            <div
              className="testimonials-track"
              style={{
                transform: `translateX(-${
                  safeCurrent * (100 / slidesPerView)
                }%)`,
              }}
            >

              {testimonials.map((image, index) => (
                <div
                  className="testimonial-slide"
                  key={image}
                >

                  <div className="testimonial-image-card">

                    <Image
                      src={image}
                      alt={`Client testimonial ${index + 1}`}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    />

                  </div>

                </div>
              ))}

            </div>

          </div>


          {/* Controls */}

          <div className="testimonials-controls">

            <div className="testimonials-counter">

              <span>
                {String(safeCurrent + 1).padStart(2, "0")}
              </span>

              <span className="testimonial-counter-line">
                /
              </span>

              <span>
                {String(total).padStart(2, "0")}
              </span>

            </div>


            <div className="testimonials-arrows">

              <button
                type="button"
                onClick={previous}
                aria-label="Previous testimonial"
                className="testimonial-arrow"
              >
                ←
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="testimonial-arrow"
              >
                →
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}