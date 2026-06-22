import type { Metadata } from "next";

import AccessibilityContent from "./AccessibilityContent";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Accessibility statement aligned with WCAG 2.1 AA",
};

export default function AccessibilityPage() {
  return <AccessibilityContent />;
}
