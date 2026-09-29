"use client";

import { FormEvent, useState } from "react";

const EMAIL = "mohamed.hisham.design@gmail.com";

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/mohamed.hesham.design1/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mohamed.hesham.design1/?hl=en",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohamedheshamdesign/",
  },
  {
    label: "Behance",
    href: "https://www.behance.net/mohamedheshamdesign",
  },
];

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const openGmail = () => {
    const subject = encodeURIComponent(
      "Project Inquiry — Mohamed Hisham"
    );

    const body = encodeURIComponent(
      "Hi Mohamed,\n\nI'd like to discuss a project with you.\n\n"
    );

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(EMAIL)}` +
      `&su=${subject}` +
      `&body=${body}`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSending(true);
    setSent(false);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const service = String(formData.get("service") || "");
    const message = String(formData.get("message") || "");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            service,
            message,
            _subject: `New Project Inquiry from ${name}`,
            _template: "table",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error("Failed to send");
      }

      setSent(true);
      form.reset();
    } catch {
      setError(
        "Something went wrong while sending your message. Please try again or use Send Mail."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-container">
        <section className="contact-hero">
          <div className="contact-heading">
            <p className="contact-kicker">Get In Touch</p>

            <h1 className="contact-title">
              Let&apos;s create something
              <br />
              <span>memorable.</span>
            </h1>

            <p className="contact-intro">
              Have a project in mind? Tell me about it, and let&apos;s
              build a brand that people trust, remember, and choose.
            </p>
          </div>

          <div className="contact-layout">
            {/* CONTACT INFO */}
            <div className="contact-info">
              {/* EMAIL */}
              <div className="contact-block">
                <div className="contact-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </div>

                <div className="contact-block-content">
                  <p className="contact-label">Email</p>

                  <p className="contact-value">{EMAIL}</p>

                  <button
                    type="button"
                    onClick={openGmail}
                    className="contact-action"
                  >
                    Send Mail
                    <span>↗</span>
                  </button>
                </div>
              </div>

              {/* WHATSAPP */}
              <div className="contact-block">
                <div className="contact-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M20 11.5a8.5 8.5 0 0 1-12.7 7.4L4 20l1.2-3.2A8.5 8.5 0 1 1 20 11.5Z"
                    />
                    <path d="M8.8 8.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.4c.1.2.1.4-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1.4.3-2.8-.3-1.2-.5-2.2-1.3-3-2.2-.9-1-1.7-2-2.2-3.1-.6-1.4-.5-2.4-.3-2.8Z" />
                  </svg>
                </div>

                <div className="contact-block-content">
                  <p className="contact-label">WhatsApp</p>

                  <p className="contact-value">
                    Available for quick chats &amp; project inquiries.
                  </p>

                  <a
                    href="https://wa.link/366kyb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-action"
                  >
                    Chat on WhatsApp
                    <span>↗</span>
                  </a>
                </div>
              </div>

              {/* SOCIAL */}
              <div className="contact-block">
                <div className="contact-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </div>

                <div className="contact-block-content">
                  <p className="contact-label">Connect</p>

                  <p className="contact-value">
                    Find me on the platforms below.
                  </p>

                  <div className="social-links">
                    {SOCIALS.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FORM */}
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="name">Your Name</label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ahmed"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="email">Email</label>

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
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select a service
                  </option>

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

                  <option value="UX / Interaction">
                    UX / Interaction
                  </option>

                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="message">
                  Project Details
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project — timeline, goals, budget, or anything you'd like me to know..."
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
                <span>{isSending ? "…" : "↗"}</span>
              </button>

              {sent && (
                <p className="contact-success">
                  Message sent successfully. Thank you!
                </p>
              )}

              {error && (
                <p className="contact-error">
                  {error}
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}