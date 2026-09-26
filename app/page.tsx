import Link from "next/link";
import Image from "next/image";

import { getFeaturedProjects } from "@/lib/projects";

export default function Home() {
  const featuredProjects = getFeaturedProjects();

  return (
    <main className="bg-white text-black">
      {/* Hero */}
      <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl items-center px-6 py-12 md:py-16">
        <div className="grid w-full items-center gap-12 md:grid-cols-2 md:gap-20">

          {/* Hero Content */}
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-500">
              Mohamed Hisham
            </p>

            <p className="mb-6 text-sm uppercase tracking-[0.2em] text-gray-500">
              Senior Brand & Graphic Designer
            </p>

            <h1 className="text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              I build brands
              <br />
              people remember.
            </h1>

            <p className="mt-7 max-w-xl text-xl font-medium leading-snug text-gray-800 md:text-2xl">
              Helping businesses build brands people trust, remember, and choose.
            </p>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-600 md:text-lg">
              I help businesses create visual identities that strengthen perception, build trust, and deliver a consistent brand experience across print and digital media.


            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/work"
                className="rounded-full bg-black px-6 py-3 text-white transition hover:opacity-90"
              >
                View My Work
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-black px-6 py-3 transition hover:bg-black hover:text-white"
              >
                Let's Talk
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex items-end justify-center md:justify-end">
            <Image
              src="/profile.png"
              alt="Mohamed Hisham"
              width={700}
              height={1500}
              priority
              className="w-full max-w-[620px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-500">
            Selected Work
          </p>

          <h2 className="text-4xl font-bold">
            Featured Projects
          </h2>
        </div>

        <div className="space-y-24">
          {featuredProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group block"
            >
              <div className="overflow-hidden">
                <Image
                  src={project.cover}
                  alt={project.title}
                  width={1600}
                  height={900}
                  className="w-full transition duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-6">
                <h3 className="text-3xl font-semibold">
                  {project.title}
                </h3>

                <p className="mt-2 text-gray-600">
                  {project.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}