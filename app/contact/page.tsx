"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { FormEvent } from "react";

export default function ContactPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    alert(
      "Thanks for reaching out! Please use the email or WhatsApp links if you need a direct response."
    );
  }

  return (
    <>

      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-container">
            {/* Header */}

            <div className="contact-heading">
              <p className="contact-kicker">
                Get In Touch
              </p>

              <h1 className="contact-title">
                Let&apos;s create something
                <br />
                <span>memorable.</span>
              </h1>

              <p className="contact-intro">
                Have a project? Send me a message and I&apos;ll
                get back to you within 24 hours.
              </p>
            </div>

            {/* Contact Content */}

            <div className="contact-layout">
              {/* LEFT SIDE */}

              <div className="contact-info">
                {/* Email */}

                <div className="contact-block">
                  <div className="contact-icon">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 5.5h18v13H3z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="m4 7 8 6 8-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  <div className="contact-block-content">
                    <p className="contact-label">
                      Email
                    </p>

                    <p className="contact-value">
                      mohamed.hisham.design@gmail.com
                    </p>

                    <a
                      href="mailto:mohamed.hisham.design@gmail.com"
                      className="contact-action"
                    >
                      Send email
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}

                <div className="contact-block">
                  <div className="contact-icon">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-3.8A8 8 0 1 1 20 11.5Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M9 9.5c.3-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.5c.1.3.1.5-.1.7l-.5.6c.6 1 1.4 1.7 2.4 2.2l.5-.6c.2-.2.4-.3.7-.2l1.5.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.5.8-.4.2-1 .3-1.4.2-2.3-.6-4.6-2.9-5.2-5.2-.1-.4 0-1 .2-1.4Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </div>

                  <div className="contact-block-content">
                    <p className="contact-label">
                      WhatsApp
                    </p>

                    <p className="contact-value">
                      Available for quick chats &amp; project
                      inquiries
                    </p>

                    <a
                      href="https://wa.link/366kyb"
                      target="_blank"
                      rel="noreferrer"
                      className="contact-action"
                    >
                      Chat on WhatsApp
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                {/* Social */}

                <div className="contact-block">
                  <div className="contact-icon">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 7h10v10H7z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M9 12h6M12 9v6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  <div className="contact-block-content">
                    <p className="contact-label">
                      Connect
                    </p>

                    <p className="contact-value">
                      Find me on the platforms below
                    </p>

                    <div className="social-links">
                      <a
                        href="https://www.linkedin.com/in/mohamedhishamdesign/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        LinkedIn
                      </a>

                      <a
                        href="https://www.behance.net/mohamedhisham1122"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Behance
                      </a>

                      <a
                        href="https://dribbble.com/mohamedghoraba11"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Dribbble
                      </a>

                      <a
                        href="https://instagram.com/mohamedghoraba11"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE — FORM */}

              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="name">
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ahmed"
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="email">
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ahmed@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="service">
                    Service Interested In
                  </label>

                  <select
                    id="service"
                    name="service"
                    defaultValue="Brand Identity"
                  >
                    <option value="Brand Identity">
                      Brand Identity
                    </option>

                    <option value="Packaging Design">
                      Packaging Design
                    </option>

                    <option value="Print Design">
                      Print Design
                    </option>

                    <option value="Digital & Social">
                      Digital &amp; Social
                    </option>

                    <option value="Illustration">
                      Illustration
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="contact-field">
                  <label htmlFor="details">
                    Project Details
                  </label>

                  <textarea
                    id="details"
                    name="details"
                    placeholder="Tell me about your project — timeline, goals, anything you'd like me to know..."
                    rows={6}
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit"
                >
                  Send Message
                  <span>↗</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}