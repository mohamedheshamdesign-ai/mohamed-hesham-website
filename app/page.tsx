import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-32">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gray-500">
            Mohamed Hisham
          </p>

          <p className="mb-6 text-sm uppercase tracking-[0.2em] text-gray-500">
            Senior Brand & Graphic Designer
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Building memorable brands through strategy, design, and production
            expertise.
          </h1>

          <p className="mt-8 text-xl font-medium text-gray-800 md:text-2xl">
            Design is easy. Building a brand people remember is different.
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            I help businesses create visual identities that strengthen
            perception, build trust, and deliver a consistent brand experience
            across print and digital media.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/work"
              className="rounded-full bg-black px-6 py-3 text-white transition hover:opacity-90"
            >
              View Work
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-black px-6 py-3 transition hover:bg-black hover:text-white"
            >
              Let's Talk
            </Link>
          </div>
        </div>
      </section>

      {/* Selected Work Preview */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-500">
            Portfolio
          </p>

          <h2 className="text-4xl font-bold">Selected Work</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold">AI Mashreq</h3>
            <p className="mt-2 text-gray-600">
              Brand Identity • Print Design • Production
            </p>
          </div>

          <div className="border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold">Alitalia</h3>
            <p className="mt-2 text-gray-600">
              Brand Identity • Print Materials
            </p>
          </div>

          <div className="border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold">Ultra Scan</h3>
            <p className="mt-2 text-gray-600">
              Branding • Marketing Materials
            </p>
          </div>

          <div className="border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold">Everest</h3>
            <p className="mt-2 text-gray-600">
              Packaging Design • Brand Identity
            </p>
          </div>

          <div className="border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold">Lux Cafe</h3>
            <p className="mt-2 text-gray-600">
              Cafe Branding • Print Design
            </p>
          </div>

          <div className="border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold">ICG Telecom</h3>
            <p className="mt-2 text-gray-600">
              Brand Identity • Corporate Materials
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}