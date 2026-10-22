type CaseStudyNarrativeProps = {
  overview: string;
  challenge: string;
  solution: string;
  results: string;
};

const blocks = [
  { key: "overview", label: "Overview", number: "01" },
  { key: "challenge", label: "The challenge", number: "02" },
  { key: "solution", label: "The response", number: "03" },
  { key: "results", label: "The outcome", number: "04" },
] as const;

/**
 * The written part of a case study.
 *
 * Four short movements — overview, challenge, response, outcome — laid
 * out as an editorial spread rather than three equal boxes, so the
 * reasoning behind the artwork is as visible as the artwork itself.
 */
export default function CaseStudyNarrative({
  overview,
  challenge,
  solution,
  results,
}: CaseStudyNarrativeProps) {
  const copy = { overview, challenge, solution, results };

  return (
    <section
      className="cs-narrative"
      aria-label="Project narrative"
    >
      <div className="cs-narrative-list">
        {blocks.map((block) => (
          <article className="cs-narrative-block" key={block.key}>
            <p className="cs-narrative-label">
              <span aria-hidden="true">{block.number}</span>
              {block.label}
            </p>

            <div className="cs-narrative-copy">
              {copy[block.key]
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
