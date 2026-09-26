import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/lib/projects";

export default function WorkPage() {
  const projects = getProjects();

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-24">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gray-500">
          Portfolio
        </p>

        <h1 className="text-5xl font-bold md:text-7xl">
          Selected Work
        </h1>
      </div>

      <div className="space-y-32">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="group block"
          >
            <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr] md:items-center">
              <div className="overflow-hidden">
                <Image
                  src={project.cover}
                  alt={project.title}
                  width={1600}
                  height={1000}
                  className="w-full transition duration-500 group-hover:scale-[1.02]"
                />
              </div>

              <div>
                <h2 className="text-3xl font-semibold md:text-5xl">
                  {project.title}
                </h2>

                <p className="mt-4 text-gray-600">
                  {project.category}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}