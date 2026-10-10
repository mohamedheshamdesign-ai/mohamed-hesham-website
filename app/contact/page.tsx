"use client";

import { FormEvent, Suspense, use, useState } from "react";

import { gmailComposeUrl } from "@/lib/site";

const EMAIL = "mohamed.hesham.design@gmail.com";

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

type ContactPageProps = {
  searchParams: Promise<{ service?: string | string[] }>;
};

function ContactContent({ searchParams }: ContactPageProps) {
  const params = use(searchParams);
  const requestedService = typeof params.service === "string" ? params.service : "";
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setSent(false);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (formData.get("website")) { setIsSending(false); return; }

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const service = String(formData.get("service") || "");
    const message = String(formData.get("message") || "").trim();

    if (!name || !message) {
      setError("Please add your name and a few details about your project.");
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${EMAIL}`,
        {
          method: "POST",
          signal: AbortSignal.timeout(15000),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            service,
            message,
            budget: String(formData.get("budget") || "Not specified"),
            timeline: String(formData.get("timeline") || "Not specified"),
            _replyto: email,
            _subject: `New Project Inquiry from ${name}`,
            _template: "table",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || (data.success !== true && data.success !== "true")) {
        throw new Error("Failed to send");
      }

      setSent(true);
      form.reset();
    } catch {
      setError(
        "Something went wrong while sending your message. Your details are still here. Please try again or email me directly."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className="contact-page">
      <div className="contact-container">
        <section className="contact-hero">
          <div className="contact-heading">
            <p className="contact-kicker">YOUR NEXT CHAPTER STARTS HERE</p>

            <h1 className="contact-title">
              Let&apos;s create something
              <br />
              <span>memorable.</span>
            </h1>

            <p className="contact-intro">
              Tell me a little about your business and what you have in mind.
              I’ll review your brief and get back to you with the next steps.
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

                  <a className="contact-value" href={gmailComposeUrl({ to: EMAIL })} target="_blank" rel="noopener noreferrer">{EMAIL}</a>

                  <a href={gmailComposeUrl({ to: EMAIL, subject: "Project Inquiry" })} target="_blank" rel="noopener noreferrer" className="contact-action">
                    Send an email <span aria-hidden="true">↗</span>
                  </a>
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
              action={`https://formsubmit.co/${EMAIL}`}
              method="post"
              aria-busy={isSending}
              onSubmit={handleSubmit}
            >
              <noscript><p className="contact-error">JavaScript is disabled. Submitting will open the form provider, or you can <a href={gmailComposeUrl({ to: EMAIL })} target="_blank" rel="noopener noreferrer" className="underline">email me directly</a>.</p></noscript>
              <div className="contact-form-intro"><h2>Tell me about your project.</h2><p>A few details are all we need to get the conversation started.</p></div>
              <div className="sr-only" aria-hidden="true"><label htmlFor="website">Leave this blank</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="name">Your Name</label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="email">Email</label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    maxLength={254}
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
                  key={requestedService}
                  name="service"
                  defaultValue={["Brand Identity", "Packaging Design", "Print Design", "Digital & Social", "Illustration", "UX / Interaction", "Other"].includes(requestedService) ? requestedService : ""}
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

              <div className="contact-form-row">
                <div className="contact-field"><label htmlFor="budget">Budget (optional)</label><select id="budget" name="budget" defaultValue=""><option value="">Let’s discuss</option><option>Under $1,000</option><option>$1,000 – $3,000</option><option>$3,000 – $5,000</option><option>$5,000+</option></select></div>
                <div className="contact-field"><label htmlFor="timeline">Timeline (optional)</label><select id="timeline" name="timeline" defaultValue=""><option value="">I’m flexible</option><option>Within a month</option><option>1–3 months</option><option>3+ months</option></select></div>
              </div>
              <div className="contact-field">
                <label htmlFor="message">
                  Project Details
                </label>

                <textarea
                  id="message"
                  name="message"
                  maxLength={5000}
                  placeholder="Tell me about your project — timeline, goals, budget, or anything you'd like me to know..."
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Let’s start a conversation"}
                <span>{isSending ? "…" : "↗"}</span>
              </button>

              <p className="contact-privacy">Your details are used only to respond to your inquiry. This form is delivered via FormSubmit. Prefer not to use it? <a href={gmailComposeUrl({ to: EMAIL })} target="_blank" rel="noopener noreferrer" className="underline">Email me directly.</a></p>
              {sent && (
                <p className="contact-success" role="status" aria-live="polite">
                  Thank you — your inquiry has been submitted. I’ll be in touch to discuss your project.
                </p>
              )}

              {error && (
                <p className="contact-error" role="alert">
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
export default function ContactPage({ searchParams }: ContactPageProps) {
  return (
    <Suspense fallback={<main id="main-content" className="contact-page"><div className="contact-container contact-hero">Preparing your project inquiry… <a className="underline" href={gmailComposeUrl({ to: EMAIL })} target="_blank" rel="noopener noreferrer">You can also email me directly.</a></div></main>}>
      <ContactContent searchParams={searchParams} />
    </Suspense>
  );
}
