export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-6xl px-6 py-32">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gray-500">
            Mohamed Hisham
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Senior Brand & Graphic Designer
          </h1>

          <p className="mt-8 text-2xl font-medium text-gray-800">
            Design is easy. Building a brand people remember is different.
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            I help businesses create visual identities that strengthen
            perception, build trust, and deliver a consistent brand experience
            across print and digital media.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-full bg-black px-6 py-3 text-white">
              View Work
            </button>

            <button className="rounded-full border border-black px-6 py-3">
              Let&apos;s Talk
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}