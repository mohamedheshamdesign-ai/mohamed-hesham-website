import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { pageMetadata } from "@/lib/site";

const services = [
  { title: "Brand identity systems", description: "More than a logo: the system and the rollout that keep every touchpoint consistent, from logo suites and typography to documented guidelines.", service: "Brand Identity" },
  { title: "Packaging & print production", description: "Production-aware design you can hold: ranges, labels, boxes and print-ready artwork built on real dielines and specifications.", service: "Packaging & Print" },
  { title: "Applications & touchpoints", description: "Your brand carried into the places people meet it: stationery, social, presentations and the everyday surfaces in between.", service: "Applications & Touchpoints" },
];

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Meet Mohamed Hesham, a brand identity designer unifying identities across every touchpoint, from brand thinking to real-world execution.",
  path: "/about",
});

export default function AboutPage() {
  return <main id="main-content" tabIndex={-1} className="studio-home">
    <section className="studio-about studio-container about-page-hero">
      <div className="studio-about-copy"><p className="studio-eyebrow">THE PERSON BEHIND THE WORK</p><h1 className="about-page-title">Not just a designer.<br /><em>Your creative partner.</em></h1><p>I&apos;m Mohamed Hesham, a brand identity designer based in Egypt. I help businesses build clear, consistent, and memorable brand experiences.</p><p>I build and unify brand identities across every touchpoint, from brand thinking to real-world execution: on screen, on product, and in print. I connect the big picture to the small details, so the identity works in the real world, not just in a presentation.</p><Link href="/contact" className="studio-button">Let&apos;s work together <span aria-hidden="true">↗</span></Link><div className="about-signature">Mohamed Hesham<span>Brand Identity Designer</span></div></div>
      <div className="studio-about-photo"><div className="about-photo-backdrop" /><Image src="/about-profile.png" alt="Mohamed Hesham, brand identity designer" width={600} height={700} priority sizes="(max-width: 800px) 90vw, 40vw" /><span className="about-photo-label">STRATEGY, CRAFT &amp; A LITTLE PERSONALITY</span></div>
    </section>
    <section className="studio-services"><div className="studio-container"><div className="studio-section-heading"><div><p className="studio-eyebrow">WHAT I BRING TO THE TABLE</p><h2>A focused set of skills.<br /><em>A complete brand perspective.</em></h2></div><p className="section-aside">From the first concept to the final file.<br />One creative partner, across every touchpoint.</p></div><div className="studio-service-grid">{services.map((service, index) => <Link key={service.title} href={`/contact?service=${encodeURIComponent(service.service)}`} className="studio-service-card"><div className="service-card-top"><span>0{index + 1}</span><span className="service-arrow" aria-hidden="true">↗</span></div><h3>{service.title}</h3><p>{service.description}</p><div className="service-deliverables">LET&apos;S TALK ABOUT {service.title.toUpperCase()}</div></Link>)}</div></div></section>
    <section className="studio-container about-experience"><div><p className="studio-eyebrow">BEYOND THE SCREEN</p><h2>Thoughtful design.<br /><em>Real-world experience.</em></h2></div><div><p>I&apos;ve worked with businesses across manufacturing, healthcare, food and beverage, telecommunications, retail, and service industries.</p><p>That experience means I consider not only how a design looks, but how it&apos;s produced, applied, and maintained. From bilingual identities to packaging dielines, I create systems with clarity and consistency at their core.</p><Link href="/work" className="studio-text-link">See the thinking in action <span aria-hidden="true">↗</span></Link></div></section>
    <section className="studio-cta"><div className="studio-container"><div className="cta-topline"><span className="studio-eyebrow">LET&apos;S BUILD SOMETHING MEANINGFUL</span></div><h2>A stronger brand.<br /><em>A more confident next step.</em></h2><div className="cta-bottom"><Link href="/contact" className="studio-button studio-button-light">Tell me about your business <span aria-hidden="true">↗</span></Link></div><div className="cta-decoration" aria-hidden="true">✳</div></div></section>
  </main>;
}
