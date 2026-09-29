import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 py-16">

        <div className="flex flex-col gap-10 md:flex-row md:justify-between">

          <div>
            <h3 className="text-2xl font-bold">
              Mohamed Hisham
            </h3>

            <p className="mt-3 max-w-sm text-neutral-600">
              Senior Brand & Graphic Designer helping businesses build brands
              people trust, remember, and choose.
            </p>
          </div>

          <div className="flex gap-12">

            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.18em] text-neutral-400">
                Connect
              </p>

              <div className="space-y-3">

                <a
                  href="mailto:mohamed.hisham.design@gmail.com"
                  className="block hover:text-blue-600"
                >
                  Email
                </a>

                <a
                  href="https://www.linkedin.com/in/mohamed-hisham-design/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-blue-600"
                >
                  LinkedIn
                </a>

                <a
                  href="https://www.behance.net/mohamedhisham1122"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-blue-600"
                >
                  Behance
                </a>

              </div>
            </div>

          </div>

        </div>

        <div className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
          © 2026 Mohamed Hisham. All rights reserved.
        </div>

      </div>
    </footer>
  );
}