import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";
import { getTestimonials } from "@/lib/testimonials";
import { gmailComposeUrl } from "@/lib/site";
import WorkGrid from "@/components/WorkGrid";
import Testimonials from "@/components/Testimonials";

const services = [
  { number: "01", title: "Brand identity", copy: "More than a logo. A distinctive visual world that tells your story and makes your business instantly recognizable.", items: "Logo systems · Visual identity · Brand guidelines", icon: "identity" },
  { number: "02", title: "Packaging & print", copy: "Thoughtful design you can hold. Packaging and print that connect with people, from the first look to the last detail.", items: "Product packaging · Editorial · Print production", icon: "package" },
  { number: "03", title: "Digital experiences", copy: "Your brand, brought to life online. Consistent, engaging design across the places your customers find you.", items: "Website design · Social media · Digital assets", icon: "digital" },
];

const process = [
  { title: "Discover", copy: "We talk about your business, your audience, and where you want to go." },
  { title: "Define", copy: "We find the right direction, rooted in strategy and a clear creative brief." },
  { title: "Design", copy: "I explore, create, and refine your visual identity with your feedback." },
  { title: "Deliver", copy: "You get a cohesive design system and the files you need to launch confidently." },
];

export const metadata: Metadata = {
  title: { absolute: "Mohamed Hesham — Senior Brand & Graphic Designer" },
  description: 'Independent brand and graphic designer in Egypt. Thoughtful brand identity, packaging, print, and digital design for ambitious businesses.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Mohamed Hesham — Senior Brand & Graphic Designer', description: 'Independent brand and graphic designer in Egypt. Thoughtful brand identity, packaging, print, and digital design for ambitious businesses.', url: '/' },
};

export default function Home() {
  const projects = getFeaturedProjects();
  const testimonials = getTestimonials();
  const order = ["al-mashreq", "atractive-collection", "memo-trips"];
  const selected = [...projects].sort((a, b) => {
    const rank = (slug: string) => order.includes(slug) ? order.indexOf(slug) : order.length;
    return rank(a.slug) - rank(b.slug);
  });

  return (
    <main id="main-content" tabIndex={-1} className="studio-home">
      <section className="studio-hero studio-container" aria-labelledby="hero-heading">
        <div className="studio-hero-copy">
          <div className="availability"><span className="status-dot" /> Independent designer. Open to collaborations.</div>
          <p className="studio-eyebrow hero-intro">HI, I’M MOHAMED HESHAM</p>
          <h1 id="hero-heading">Good design.<br />Great brands.<br /><em>Lasting impact.</em></h1>
          <p className="studio-hero-description">I turn ambitious businesses into memorable brands.<br className="desktop-break" /> Brand identity, packaging, and digital design —<br className="desktop-break" /> with purpose, personality, and a little unexpected.</p>
          <div className="studio-actions">
            <Link className="studio-button" href="/contact">Let&apos;s build your brand <span aria-hidden="true">↗</span></Link>
            <a className="studio-text-link" href="#selected-work">Explore my work <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-signoff"><span className="tiny-globe" aria-hidden="true">◎</span> Based in Egypt. Designing beyond borders.</div>
        </div>
        <div className="studio-portrait">
          <div className="portrait-orbit" aria-hidden="true" />
          <svg className="portrait-star" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0 59 32 85 15 68 41 100 50 68 59 85 85 59 68 50 100 41 68 15 85 32 59 0 50 32 41 15 15 41 32Z" fill="currentColor" /></svg>
          <div className="portrait-type" aria-hidden="true">DESIGN<br />WITH<br />PURPOSE.</div>
          <Image src="/profile.png" width={700} height={900} priority sizes="(max-width: 800px) 90vw, 44vw" alt="Mohamed Hesham, independent brand and graphic designer" className="studio-portrait-image" />
          <div className="portrait-stamp"><span>THOUGHTFUL DESIGN</span><svg viewBox="0 0 50 50" aria-hidden="true"><path d="M25 2v46M2 25h46M9 9l32 32M9 41 41 9" stroke="currentColor" strokeWidth="4" /></svg><span>MEANINGFUL IMPACT</span></div>
          <div className="portrait-caption"><div className="caption-monogram">mh<span>.</span></div><div><strong>Your next creative partner.</strong><span>Big-picture thinking. Detail-driven design.</span></div><span className="caption-arrow" aria-hidden="true">↗</span></div>
          <span className="portrait-side-note">A LITTLE STRATEGY. A LOT OF SOUL.</span>
        </div>
      </section>

      <div className="studio-proof studio-container">
        <div className="proof-experience"><strong>8<span>+</span></strong><span>Years of experience.<br />Always a fresh perspective.</span></div>
        <div className="proof-note">From a first idea to a full brand world.<br /><strong>Thoughtfully made. Ready for the real world.</strong></div>
        <a href="#selected-work" className="scroll-cue">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
      </div>

      <div className="expertise-ribbon" aria-label="Design expertise"><div className="studio-container"><span>BRAND IDENTITY</span><span className="ribbon-star" aria-hidden="true">✳</span><span>PACKAGING &amp; PRINT</span><span className="ribbon-star" aria-hidden="true">✳</span><span>DIGITAL EXPERIENCES</span><span className="ribbon-star" aria-hidden="true">✳</span><span>DESIGN THAT CONNECTS</span><span className="ribbon-star" aria-hidden="true">✳</span></div></div>

      <section id="selected-work" className="studio-work studio-container" aria-labelledby="work-heading">
        <div className="studio-section-heading"><div><p className="studio-eyebrow"><span>01 /</span> SELECTED WORK</p><h2 id="work-heading">Different brands.<br /><em>Same thoughtful approach.</em></h2></div><div className="section-aside"><p>A selection of identities and experiences.<br />Each with a story. Each with a purpose.</p><Link className="studio-text-link" href="/work">View all projects <span aria-hidden="true">↗</span></Link></div></div>
        <WorkGrid projects={selected} featured />
      </section>

      <section id="services" className="studio-services" aria-labelledby="services-heading"><div className="studio-container">
        <div className="studio-section-heading"><div><p className="studio-eyebrow"><span>02 /</span> HOW I CAN HELP</p><h2 id="services-heading">Your vision.<br /><em>My creative toolkit.</em></h2></div><p className="section-aside">Starting something new or ready for a refresh?<br />Let&apos;s give your brand the attention it deserves.</p></div>
        <div className="studio-service-grid">{services.map(service => <Link href={`/contact?service=${encodeURIComponent(service.title === "Brand identity" ? "Brand Identity" : service.title === "Packaging & print" ? "Packaging Design" : "Digital & Social")}`} className="studio-service-card" key={service.number}><div className="service-card-top"><span>{service.number}</span><svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">{service.icon === "identity" ? <><circle cx="20" cy="20" r="14" /><rect x="18" y="18" width="25" height="25" rx="1" /></> : service.icon === "package" ? <><path d="m24 4 18 10v21L24 45 6 35V14Z M6 14l18 10 18-10M24 24v21M15 9l18 10" /></> : <><rect x="5" y="7" width="38" height="29" rx="3" /><path d="M5 15h38M17 43h14M24 36v7M10 11h1M14 11h1M18 11h1" /></>}</svg><span className="service-arrow" aria-hidden="true">↗</span></div><h3>{service.title}</h3><p>{service.copy}</p><div className="service-deliverables">{service.items}</div></Link>)}</div>
      </div></section>

      <section className="studio-about studio-container" aria-labelledby="about-heading"><div className="studio-about-photo"><div className="about-photo-backdrop" /><Image src="/about-profile.png" alt="Mohamed Hesham in his design studio" width={600} height={700} sizes="(max-width: 800px) 90vw, 35vw" /><span className="about-photo-label">THE PERSON BEHIND THE PIXELS</span></div><div className="studio-about-copy"><p className="studio-eyebrow"><span>03 /</span> A DESIGNER. A THINKER. YOUR PARTNER.</p><h2 id="about-heading">Good work starts<br />with <em>a good connection.</em></h2><p>I&apos;m Mohamed, a senior brand and graphic designer with a belief that the best design doesn&apos;t just look good. It makes people feel something.</p><p>I bring strategic thinking, hands-on production experience, and a genuine investment in your business to every project. You work directly with me — from our first conversation to the final detail.</p><Link href="/about" className="studio-text-link">A little more about me <span aria-hidden="true">↗</span></Link><div className="about-signature">Mohamed Hesham<span>Brand &amp; Graphic Designer</span></div></div></section>

      <section className="studio-process" aria-labelledby="process-heading"><div className="studio-container"><div className="studio-section-heading"><div><p className="studio-eyebrow"><span>04 /</span> THE WAY WE WORK</p><h2 id="process-heading">A clear process.<br /><em>A shared direction.</em></h2></div><p className="section-aside">No guesswork. No disappearing acts.<br />Just open communication and considered design.</p></div><div className="process-grid">{process.map((step, index) => <div className="process-step" key={step.title}><div className="process-number">0{index + 1}<span aria-hidden="true">{index === 3 ? "✓" : "→"}</span></div><h3>{step.title}</h3><p>{step.copy}</p></div>)}</div></div></section>

      <section className="studio-faq studio-container" aria-labelledby="faq-heading"><div><p className="studio-eyebrow"><span>05 /</span> BEFORE WE SAY HELLO</p><h2 id="faq-heading">A few things<br /><em>you might be wondering.</em></h2></div><div className="faq-list"><details><summary>What does a project typically cost?<span aria-hidden="true">+</span></summary><p>Every business and brief is different. Share your goals, scope, and budget, and I&apos;ll put together a tailored proposal with clear deliverables before we start.</p></details><details><summary>Can we work together remotely?<span aria-hidden="true">+</span></summary><p>Absolutely. I&apos;m based in Egypt and collaborate remotely, using calls, shared presentations, and regular feedback to keep everything moving in the same direction.</p></details><details><summary>What do you need to get started?<span aria-hidden="true">+</span></summary><p>A little about your business, what you want to achieve, and your ideal timeline. You don&apos;t need a perfect brief — we&apos;ll work through the details together.</p></details><details><summary>Will I receive production-ready files?<span aria-hidden="true">+</span></summary><p>Yes. Final deliverables are agreed in your proposal and can include editable source files, print-ready artwork, digital exports, and guidelines for using your new identity.</p></details></div></section>

      <Testimonials testimonials={testimonials} />

      <section className="studio-cta"><div className="studio-container"><div className="cta-topline"><span className="studio-eyebrow">HAVE SOMETHING IN MIND?</span><span>LET&apos;S MAKE IT HAPPEN <span aria-hidden="true">↙</span></span></div><h2>Your next chapter<br />starts with <em>a conversation.</em></h2><div className="cta-bottom"><Link href="/contact" className="studio-button studio-button-light">Let&apos;s talk about your project <span aria-hidden="true">↗</span></Link><a href={gmailComposeUrl({ to: "mohamed.hesham.design@gmail.com" })} target="_blank" rel="noopener noreferrer" className="cta-email">Prefer email? Say hello <span aria-hidden="true">↗</span></a></div><div className="cta-decoration" aria-hidden="true">✳</div></div></section>
    </main>
  );
}
