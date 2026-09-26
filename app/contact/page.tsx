export default function ContactPage() {
  return (
    <main className="bg-white text-black">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gray-500">
          Contact
        </p>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Let's build something people remember.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-700">
          Whether you're launching a new brand, refreshing an existing one,
          or looking for design support across print and digital media,
          I'd be happy to discuss your project.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="border-t border-gray-200 pt-12">
          <div className="space-y-10">

            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-500">
                Email
              </p>

              <a
                href="mailto:YOURMAIL@gmail.com"
                className="text-2xl font-semibold hover:underline"
              >
                YOURMAIL@gmail.com
              </a>
            </div>

            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-500">
                LinkedIn
              </p>

              <a
                href="YOUR_LINKEDIN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-semibold hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>

            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-500">
                Instagram
              </p>

              <a
                href="YOUR_INSTAGRAM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-semibold hover:underline"
              >
                @mohamed.hesham.design1
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}