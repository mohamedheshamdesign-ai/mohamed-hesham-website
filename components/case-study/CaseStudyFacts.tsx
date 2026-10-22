type CaseStudyFactsProps = {
  client?: string;
  sector?: string;
  role: string;
  services: string[];
};

/**
 * The "at a glance" table that opens every case study.
 *
 * Clients evaluating a portfolio scan for scope, so the facts sit
 * directly under the title where they can be read in a second.
 */
export default function CaseStudyFacts({
  client,
  sector,
  role,
  services,
}: CaseStudyFactsProps) {
  const facts = [
    { label: "Client", value: client },
    { label: "Sector", value: sector },
    { label: "Role", value: role },
    {
      label: "Scope",
      value: services.join(" · "),
    },
  ].filter((fact) => Boolean(fact.value));

  return (
    <dl className="cs-facts">
      {facts.map((fact) => (
        <div className="cs-fact" key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
