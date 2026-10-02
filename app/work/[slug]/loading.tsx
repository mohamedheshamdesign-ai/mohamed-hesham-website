export default function Loading() {
  return (
    <main className="project-page bg-white text-black">
      <section className="project-header">
        <div className="project-container">
          <p className="project-kicker">Case Study</p>

          <div
            style={{
              height: 56,
              marginTop: 16,
              borderRadius: 12,
              background:
                "linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%)",
              backgroundSize: "200% 100%",
              animation: "skeleton 1.2s infinite",
            }}
          />
        </div>
      </section>
    </main>
  );
}
