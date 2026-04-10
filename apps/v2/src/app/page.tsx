"use client";

import { About } from "@/components/About";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navigation, SkipToContent } from "@/components/Navigation";
import { ProjectsPreview } from "@/components/ProjectsPreview";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Valentin Röhle",
  jobTitle: "Full-Stack Developer",
  url: "https://valentin-roehle.de",
  sameAs: [
    "https://github.com/Valentin-Roehle",
    "https://linkedin.com/in/valentin-roehle",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AmbientBackground />
      <SkipToContent />
      <Navigation />
      <main id="main-content" style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <About />
        <ProjectsPreview />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
