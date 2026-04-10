import type { Metadata } from "next";

import ProjectsContent from "./ProjectsContent";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open-source projects and GitHub repositories",
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
