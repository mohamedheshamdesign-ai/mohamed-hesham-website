import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <h1>404</h1>

      <p>The page you are looking for does not exist.</p>

      <Link href="/">Back to home</Link>
    </main>
  );
}
