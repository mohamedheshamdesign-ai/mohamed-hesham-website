import ProjectEditor from "./ProjectEditor";

export default async function ProjectEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProjectEditor key={slug} slug={slug} />;
}
