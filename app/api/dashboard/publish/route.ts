import { commitToMain, PublishFile } from "@/lib/dashboard/github";
import {
  assertSameOrigin,
  errorResponse,
  requireAuth,
} from "@/lib/dashboard/guard";
import { projectSchema } from "@/lib/projects";
import type { PublishProjectPayload } from "@/lib/dashboard/types";

export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,60}$/;
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,80}$/;
const IMG_EXT_RE = /\.(jpe?g|png|gif|webp|avif)$/i;
const BLOB_SHA_RE = /^[a-f0-9]{40}$/;

function bad(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    assertSameOrigin(req);

    const body = (await req.json().catch(() => null)) as {
      projects?: PublishProjectPayload[];
    } | null;
    if (!body?.projects || !Array.isArray(body.projects) || body.projects.length === 0) {
      return bad("Nothing to publish.");
    }
    if (body.projects.length > 60) {
      return bad("Too many changes in one publish.");
    }

    const files: PublishFile[] = [];

    for (const project of body.projects) {
      if (!project || !SLUG_RE.test(project.slug || "")) {
        return bad("Bad project slug.");
      }
      const base = `content/works/${project.slug}`;
      const assets = `public/projects/${project.slug}`;

      if (project.deleted) {
        // Remove the content file; media files come through removedImages or
        // are listed by the caller after a tree read. Content removal is
        // enough to unpublish; leftover orphan files are removed below when
        // the caller supplied them.
        files.push({ path: `${base}/project.json`, remove: true });
        for (const name of project.removedImages || []) {
          if (!NAME_RE.test(name)) return bad("Bad file name.");
          files.push({ path: `${assets}/${name}`, remove: true });
        }
        continue;
      }

      if (!project.content) {
        return bad(`Missing content for ${project.slug}.`);
      }
      const parsed = projectSchema.safeParse(project.content);
      if (!parsed.success) {
        return bad(
          `Content for ${project.slug} is invalid: ${parsed.error.issues[0]?.message || "schema"}`
        );
      }
      if (parsed.data.slug !== project.slug) {
        return bad(`Slug mismatch for ${project.slug}.`);
      }

      files.push({
        path: `${base}/project.json`,
        text: JSON.stringify(parsed.data, null, 2) + "\n",
      });

      for (const img of project.newImages || []) {
        if (!NAME_RE.test(img.name) || !IMG_EXT_RE.test(img.name)) {
          return bad("Bad image name.");
        }
        if (!BLOB_SHA_RE.test(img.blobSha)) {
          return bad("Bad image reference.");
        }
        files.push({ path: `${assets}/${img.name}`, blobSha: img.blobSha });
      }
      for (const name of project.removedImages || []) {
        if (!NAME_RE.test(name)) return bad("Bad file name.");
        files.push({ path: `${assets}/${name}`, remove: true });
      }
    }

    const sha = await commitToMain(
      files,
      "Update portfolio from dashboard"
    );
    return Response.json({ ok: true, commit: sha });
  } catch (err) {
    return errorResponse(err);
  }
}
