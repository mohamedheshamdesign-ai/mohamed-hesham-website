type CaseStudyDeliverablesProps = {
  deliverables: string[];
};

/**
 * What was actually produced for the project.
 */
export default function CaseStudyDeliverables({
  deliverables,
}: CaseStudyDeliverablesProps) {
  if (deliverables.length === 0) return null;

  return (
    <section
      className="cs-deliverables"
      aria-labelledby="cs-deliverables-heading"
    >
      <h3 id="cs-deliverables-heading" className="cs-subheading">
        Deliverables
      </h3>

      <ul className="cs-deliverables-list">
        {deliverables.map((deliverable) => (
          <li key={deliverable}>
            <span aria-hidden="true">✳</span>
            {deliverable}
          </li>
        ))}
      </ul>
    </section>
  );
}
