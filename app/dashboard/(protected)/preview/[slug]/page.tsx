import CaseStudyPreview from "./CaseStudyPreview";

export default async function CaseStudyPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CaseStudyPreview key={slug} slug={slug} />;
}
