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
    <main>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-5xl font-bold">
          {project.title}
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          {project.category}
        </p>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-gray-700">
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
            className="block w-full"
          />
        ))}
      </section>
    </main>
  );
}