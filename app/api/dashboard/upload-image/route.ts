import { createBlob } from "@/lib/dashboard/github";
import {
  assertSameOrigin,
  errorResponse,
  requireAuth,
} from "@/lib/dashboard/guard";

export const dynamic = "force-dynamic";

const MAX_BYTES = 4_300_000; // stays under the platform request limit
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,80}$/;

const MAGIC: Array<{ ext: string; bytes: number[] }> = [
  { ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: "gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { ext: "webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF....WEBP checked below
  { ext: "avif", bytes: [] }, // checked via ftyp below
];

function sniffExt(buf: Buffer): string | null {
  for (const { ext, bytes } of MAGIC) {
    if (bytes.length && bytes.every((b, i) => buf[i] === b)) {
      if (ext === "webp") {
        return buf.toString("ascii", 8, 12) === "WEBP" ? "webp" : null;
      }
      return ext;
    }
  }
  const ftyp = buf.toString("ascii", 4, 12);
  if (ftyp.startsWith("ftypavif") || ftyp.startsWith("ftypavis")) return "avif";
  if (ftyp.startsWith("ftypheic") || ftyp.startsWith("ftypheix")) return "heic";
  return null;
}

/**
 * Receives one validated image and stores it as a GitHub git blob (no commit).
 * The publish step references the returned blob sha in a single commit, so
 * half-published states are impossible.
 */
export async function POST(req: Request) {
  try {
    await requireAuth();
    assertSameOrigin(req);

    const form = await req.formData();
    const file = form.get("file");
    const rawName = String(form.get("name") || "");
    if (!(file instanceof File)) {
      return Response.json({ error: "Missing file." }, { status: 400 });
    }
    if (!NAME_RE.test(rawName)) {
      return Response.json({ error: "Bad file name." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json(
        { error: "Image is too large even after optimization." },
        { status: 413 }
      );
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = sniffExt(buf);
    if (!ext) {
      return Response.json(
        { error: "Only image files (jpg, png, gif, webp, avif) are allowed." },
        { status: 415 }
      );
    }
    if (!rawName.toLowerCase().endsWith(`.${ext === "jpg" ? "jpg" : ext}`) && ext !== "jpg") {
      // Keep the on-disk extension truthful; jpeg files may end in .jpeg too.
      const okJpeg = ext === "jpg" && /\.jpe?g$/i.test(rawName);
      if (!okJpeg) {
        return Response.json(
          { error: `File content is ${ext} but the name says otherwise.` },
          { status: 400 }
        );
      }
    }
    const blobSha = await createBlob(buf.toString("base64"));
    return Response.json({ blobSha, name: rawName });
  } catch (err) {
    return errorResponse(err);
  }
}
