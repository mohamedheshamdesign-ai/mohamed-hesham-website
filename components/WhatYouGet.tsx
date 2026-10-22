const deliverables = [
  {
    title: "Logo suite & variations",
    copy: "Primary logo, mark, and the practical variants a business actually needs — in English and Arabic where relevant.",
  },
  {
    title: "Brand guidelines",
    copy: "A documented system: construction, clear space, colour, typography, patterns, and the rules that keep it consistent.",
  },
  {
    title: "Packaging & print artwork",
    copy: "Production-ready artwork with dielines, colour builds, and specifications a printer can work from directly.",
  },
  {
    title: "Applications & campaigns",
    copy: "Stationery, social templates, promotional materials, and merchandising — the identity carried into real use.",
  },
  {
    title: "Editable source files",
    copy: "Organised, labelled files plus exports in the formats your team and your suppliers actually use.",
  },
  {
    title: "Handover & support",
    copy: "A walkthrough of the system, so the team maintaining the brand knows how to use it properly.",
  },
];

const principles = [
  {
    title: "One designer, start to finish",
    copy: "You work directly with me — no hand-offs, no lost context between the strategy and the artwork.",
  },
  {
    title: "Bilingual by default",
    copy: "Arabic and English identities are designed together, so both keep the same personality and balance.",
  },
  {
    title: "Production-aware",
    copy: "Dielines, colour builds, and print realities are considered from the first concept, not at the end.",
  },
  {
    title: "Remote-friendly",
    copy: "Calls, shared presentations, and regular feedback keep a distributed project moving in one direction.",
  },
];

/**
 * "What you receive" — replaces the previous testimonial carousel.
 *
 * Everything on this page is drawn from work already documented across
 * the portfolio: the deliverables listed are the ones that ship with
 * every identity, packaging, and print project.
 */
export default function WhatYouGet() {
  return (
    <section
      className="studio-deliverables studio-container"
      aria-labelledby="deliverables-heading"
    >
      <div className="studio-section-heading">
        <div>
          <p className="studio-eyebrow">
            <span>06 /</span> WHAT YOU RECEIVE
          </p>

          <h2 id="deliverables-heading">
            A complete system,
            <br />
            <em>not just a logo file.</em>
          </h2>
        </div>

        <p className="section-aside">
          Every project is delivered as a usable system —
          <br />
          documented, produced, and ready to apply.
        </p>
      </div>

      <div className="studio-deliverables-grid">
        <ul className="studio-deliverables-list">
          {deliverables.map((item, index) => (
            <li key={item.title}>
              <span className="studio-deliverable-index">
                {(index + 1).toString().padStart(2, "0")}
              </span>

              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </li>
          ))}
        </ul>

        <aside
          className="studio-principles"
          aria-label="How I work"
        >
          <h3>How I work</h3>

          <ul>
            {principles.map((principle) => (
              <li key={principle.title}>
                <strong>{principle.title}</strong>
                <span>{principle.copy}</span>
              </li>
            ))}
          </ul>

          <a
            href="/contact"
            className="studio-text-link"
          >
            Tell me about your project
            <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
