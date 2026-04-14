"use client";

import { About } from "@/components/About";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navigation, SkipToContent } from "@/components/Navigation";
import { ProjectsPreview } from "@/components/ProjectsPreview";
import { ELEMENT_ID } from "@/constants/elements";
import { Z_INDEX } from "@/constants/layout";

export default function Home() {
  return (
    <>
      <AmbientBackground />
      <SkipToContent />
      <Navigation />
      <main
        id={ELEMENT_ID.MAIN_CONTENT}
        style={{ position: "relative", zIndex: Z_INDEX.CONTENT }}
      >
        <Hero />
        <About />
        <ProjectsPreview />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
