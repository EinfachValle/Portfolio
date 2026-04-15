"use client";

import { useEffect } from "react";

import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navigation, SkipToContent } from "@/components/Navigation";
import { ProjectsPreview } from "@/components/ProjectsPreview";
import { ELEMENT_ID } from "@/constants/elements";
import { Z_INDEX } from "@/constants/layout";

export default function Home() {
  // Consume a pending section scroll stashed by Navigation when coming back
  // from a sub-page. Avoids using URL hashes for section navigation.
  useEffect(() => {
    try {
      const pending = sessionStorage.getItem("pendingSectionScroll");
      if (!pending) return;
      sessionStorage.removeItem("pendingSectionScroll");
      // Wait one frame so sections are mounted before scrolling.
      requestAnimationFrame(() => {
        document
          .getElementById(pending)
          ?.scrollIntoView({ behavior: "smooth" });
      });
    } catch {
      // sessionStorage unavailable — ignore.
    }
  }, []);

  return (
    <>
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
