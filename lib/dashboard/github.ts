/**
 * Minimal GitHub Git-Data client used by the dashboard publish flow.
 * The token never leaves the server: it is read from GITHUB_TOKEN only here.
 */

const OWNER = "mohamedheshamdesign-ai";
const REPO = "mohamed-hesham-website";
const API = "https://api.github.com";

function token(): string {
  const t = process.env.GITHUB_TOKEN || "";
  if (!t) throw new Error("GITHUB_TOKEN is not configured");
  return t;
}

async function gh(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${init?.method || "GET"} ${path} -> ${res.status}: ${body.slice(0, 300)}`);
  }
  return res;
}

export type PublishFile =
  | { path: string; text: string }
  | { path: string; blobSha: string }
  | { path: string; remove: true };

/** Create a git blob from base64 content; returns its sha. */
export async function createBlob(base64: string): Promise<string> {
  const res = await gh(`/repos/${OWNER}/${REPO}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({ content: base64, encoding: "base64" }),
  });
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

/**
 * Apply a set of file changes to main as ONE commit on top of the current
 * head. Retries once after re-reading the head when the ref moved.
 */
export async function commitToMain(
  files: PublishFile[],
  message: string
): Promise<string> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await commitAttempt(files, message);
    } catch (err) {
      lastError = err;
      if (!(err instanceof Error && /422|non-fast-forward|reference/i.test(err.message))) {
        throw err;
      }
    }
  }
  throw lastError;
}

async function commitAttempt(
  files: PublishFile[],
  message: string
): Promise<string> {
  const refRes = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/main`);
  const refData = (await refRes.json()) as { object: { sha: string } };
  const headSha = refData.object.sha;

  const commitRes = await gh(`/repos/${OWNER}/${REPO}/git/commits/${headSha}`);
  const commitData = (await commitRes.json()) as { tree: { sha: string } };
  const baseTree = commitData.tree.sha;

  const tree = files.map((file) => {
    if ("remove" in file) {
      return { path: file.path, mode: "100644" as const, type: "blob" as const, sha: null };
    }
    if ("blobSha" in file) {
      return { path: file.path, mode: "100644" as const, type: "blob" as const, sha: file.blobSha };
    }
    return { path: file.path, mode: "100644" as const, type: "blob" as const, content: file.text };
  });

  const treeRes = await gh(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTree, tree }),
  });
  const treeData = (await treeRes.json()) as { sha: string };

  const newCommitRes = await gh(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: treeData.sha,
      parents: [headSha],
      author: {
        name: "Mohamed Hesham",
        email: "mohamed.hesham.design@gmail.com",
      },
      committer: {
        name: "mohamedheshamdesign-ai",
        email: "mohamedheshamdesign-ai@users.noreply.github.com",
      },
    }),
  });
  const newCommit = (await newCommitRes.json()) as { sha: string };

  const updateRes = await gh(`/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha, force: false }),
  });
  const updated = (await updateRes.json()) as { object: { sha: string } };
  return updated.object.sha;
}

/** Fetch one file's text content from main, or null when absent. */
export async function getFileText(path: string): Promise<string | null> {
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=main`,
    {
      headers: {
        Authorization: `Bearer ${token()}`,
        Accept: "application/vnd.github.raw+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub contents ${path} -> ${res.status}`);
  return res.text();
}
