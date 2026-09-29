"use client";

import Image from "next/image";
import { useState } from "react";

type TestimonialsProps = {
  testimonials: string[];
};

export default function Testimonials({
  testimonials,
}: TestimonialsProps) {
  const [current, setCurrent] = useState(0);

  const total = testimonials.length;

  const visibleSlides = 3;

  const maxIndex = Math.max(
    0,
    total - visibleSlides
  );

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

  if (total === 0) {
    return null;
  }

  return (
    <section className="testimonials-section">
      <div className="section-container">

        {/* Heading */}

        <div className="testimonials-heading">
          <p className="section-kicker">
            What Clients Say
          </p>

          <h2 className="testimonials-title">
            Trusted by brands
            <br />
            <span>that value great design.</span>
          </h2>
        </div>


        {/* Slider */}

        <div className="testimonials-slider">

          <div className="testimonials-viewport">

            <div
              className="testimonials-track"
              style={{
                transform: `translateX(-${
                  current * (100 / visibleSlides)
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
                {String(current + 1).padStart(2, "0")}
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