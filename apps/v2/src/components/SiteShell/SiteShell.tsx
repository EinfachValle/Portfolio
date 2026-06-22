"use client";

import { Footer } from "@/components/Footer";
import { Navigation, SkipToContent } from "@/components/Navigation";

/**
 * Persistent page chrome: navigation, skip link and footer live here — mounted
 * once in the root layout — so client-side route changes only swap the page
 * body. This is what stops the header from re-running its slide-in animation
 * (and the footer from re-mounting) on every navigation.
 *
 * The flex column keeps the footer at the bottom on short pages: the page body
 * grows to fill the viewport, the footer sits below it.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipToContent />
      <Navigation />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default SiteShell;
