import Image from "next/image";
import { getProjectBySlug } from "@/lib/projects";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = getProjectBySlug(slug);

  return (
    <main className="bg-white text-black">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gray-500">
          Case Study
        </p>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          {project.title}
        </h1>

        <p className="mt-6 text-lg text-gray-500">
          {project.category}
        </p>

        <div className="mt-12 h-px w-full bg-gray-200" />

        <p className="mt-12 max-w-3xl text-lg leading-relaxed text-gray-700">
          {project.description}
        </p>
      </section>

      <section>
        {project.images.map((image: string) => (
          <Image
            key={image}
            src={image}
            alt={project.title}
            width={2000}
            height={2000}
            priority
            className="block w-full"
          />
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="border-t border-gray-200 pt-12">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Interested in building a stronger brand?
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Let's create something meaningful.
          </h2>

          <a
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-white transition hover:opacity-90"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </main>
  );
}