import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-white text-black">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gray-500">
          About
        </p>

        <div className="grid gap-16 md:grid-cols-2 md:items-start">
          <div>
            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              Building brands is more than creating logos.
            </h1>

            <p className="mt-8 text-lg leading-relaxed text-gray-700">
              I help businesses create clear, consistent, and memorable brand
              experiences through branding, print design, packaging, and
              production expertise.
            </p>

            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              With experience across multiple industries, I focus on building
              visual systems that strengthen brand perception, support business
              goals, and remain practical in real-world production.
            </p>
          </div>

          <div>
            <Image
              src="/profile.png"
              alt="Mohamed Hisham"
              width={700}
              height={900}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="border-t border-gray-200 pt-16">
          <p className="mb-10 text-sm uppercase tracking-[0.2em] text-gray-500">
            What I Do
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold">Brand Identity</h3>
            </div>

            <div>
              <h3 className="text-2xl font-semibold">Packaging Design</h3>
            </div>

            <div>
              <h3 className="text-2xl font-semibold">Print Design</h3>
            </div>

            <div>
              <h3 className="text-2xl font-semibold">Production Support</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="border-t border-gray-200 pt-16">
          <p className="mb-10 text-sm uppercase tracking-[0.2em] text-gray-500">
            Experience
          </p>

          <p className="max-w-3xl text-lg leading-relaxed text-gray-700">
            Worked with businesses across manufacturing, healthcare,
            food & beverage, telecommunications, retail, education,
            and service industries, delivering branding systems,
            packaging, print materials, and marketing assets.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="border-t border-gray-200 pt-16">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Let's Talk
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Looking for a stronger brand presence?
          </h2>

          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-white transition hover:opacity-90"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </main>
  );
}