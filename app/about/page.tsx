import Link from "next/link";
import Image from "next/image";

const services = [
  {
    icon: "🎨",
    title: "Brand Identity",
    description:
      "Complete visual identity systems — logos, color palettes, typography, and brand guidelines that make your brand unmistakable.",
  },
  {
    icon: "📦",
    title: "Packaging Design",
    description:
      "Packaging that stands out on shelf and communicates your brand story at first glance — from concept to print-ready files.",
  },
  {
    icon: "🖨️",
    title: "Print Design",
    description:
      "Brochures, business cards, posters, and print collateral that reflects your brand with clarity, quality, and consistency.",
  },
  {
    icon: "📱",
    title: "Digital & Social",
    description:
      "Social media templates, campaign visuals, ad creatives, and digital assets designed to perform across platforms.",
  },
  {
    icon: "✏️",
    title: "Illustration",
    description:
      "Custom illustrations and visual elements that bring personality and uniqueness to your brand — on brand, on brief.",
  },
  {
    icon: "🔌",
    title: "UX / Interaction",
    description:
      "User experience thinking applied to brands — understanding how people interact with your visual identity across touchpoints.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-black">
      {/* ================= HERO ================= */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
          {/* TEXT */}
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.2em] text-gray-500">
              About
            </p>

            <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.05em] md:text-7xl">
              Building brands is more than creating logos.
            </h1>

            <div className="mt-8 max-w-xl space-y-5 text-lg leading-8 text-gray-600">
              <p>
                I help businesses create clear, consistent, and memorable
                brand experiences through branding, print design, packaging,
                and production expertise.
              </p>

              <p>
                With experience across multiple industries, I focus on
                building visual systems that strengthen brand perception,
                support business goals, and remain practical in real-world
                production.
              </p>
            </div>
          </div>

          {/* ABOUT IMAGE
              Different image from Home */}
          <div className="relative">
            <div className="overflow-hidden bg-[#f5f5f5]">
              <Image
                src="/about-profile.png"
                alt="Mohamed Hisham"
                width={800}
                height={950}
                priority
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="border-t border-gray-200 bg-[#f7f8fa]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-12">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gray-500">
              What I Do
            </p>

            <h2 className="text-4xl font-bold tracking-[-0.04em] md:text-5xl">
              Services & Expertise
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-7 text-gray-500">
              A focused set of skills I bring to every brand project — from
              strategy to final production.
            </p>
          </div>

          {/* SERVICES GRID */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="
                  group relative overflow-hidden
                  rounded-2xl border border-[#e2e7ee]
                  bg-white p-7
                  transition-all duration-300 ease-out
                  hover:-translate-y-1
                  hover:border-[#d7dee7]
                  hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]
                "
              >
                {/* YELLOW TOP LINE */}
                <span
                  className="
                    absolute left-0 right-0 top-0 h-[3px]
                    origin-left scale-x-0
                    bg-[#f0b429]
                    transition-transform duration-300
                    group-hover:scale-x-100
                  "
                />

                {/* ICON */}
                <div
                  className="
                    mb-6 flex h-12 w-12 items-center justify-center
                    rounded-[10px]
                    border border-[#e2e7ee]
                    bg-gradient-to-br from-[#f3f6fb] to-[#e9eef4]
                    text-xl
                    transition-all duration-300
                    group-hover:border-[#f0b429]
                    group-hover:bg-[#fff8df]
                  "
                >
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold tracking-tight">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="border-t border-gray-200 pt-14 md:pt-16">
          <p className="mb-10 text-sm uppercase tracking-[0.2em] text-gray-500">
            Experience
          </p>

          <div className="grid gap-10 md:grid-cols-[0.35fr_1fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Real-world
                <br />
                production.
              </h2>
            </div>

            <p className="max-w-3xl text-lg leading-8 text-gray-600">
              Worked with businesses across manufacturing, healthcare, food &
              beverage, telecommunications, retail, education, and service
              industries, delivering branding systems, packaging, print
              materials, and marketing assets.
            </p>
          </div>
        </div>
      </section>

      {/* ================= LET'S TALK ================= */}
      <section className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="border-t border-gray-200 pt-14">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Let's Talk
            </p>

            <h2 className="mt-5 max-w-5xl text-4xl font-bold leading-[0.95] tracking-[-0.05em] md:text-6xl">
              Looking for a stronger brand presence?
            </h2>

            {/* BUTTON */}
            <Link
              href="/contact"
              className="
                mt-9 inline-flex
                items-center justify-center gap-3
                rounded-full
                bg-black
                px-8 py-4
                text-sm font-medium
                text-white
                no-underline
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-[#2f6fed]
              "
            >
              Get In Touch
              <span className="text-base leading-none">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}