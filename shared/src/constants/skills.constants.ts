/**
 * Shared skill definitions — stack-agnostic data only.
 *
 * Each app maps `slug` to its own icon component.
 */

/** Broad stack grouping used to lay skills out in separate lanes. */
export type SkillCategory = "frontend" | "backend";

export interface SkillDefinition {
  /** Display name shown in the UI */
  name: string;
  /** Unique identifier used to map to framework-specific icons */
  slug: string;
  /** Stack grouping (frontend = UI/client, backend = server/tooling/devops) */
  category: SkillCategory;
}

export const SKILLS: SkillDefinition[] = [
  { name: "TypeScript", slug: "typescript", category: "frontend" },
  { name: "React", slug: "react", category: "frontend" },
  { name: "NextJS", slug: "nextjs", category: "frontend" },
  { name: "MUI", slug: "mui", category: "frontend" },
  { name: "Redux", slug: "redux", category: "frontend" },
  { name: "shadcn/ui", slug: "shadcnui", category: "frontend" },
  { name: "Tailwind CSS", slug: "tailwindcss", category: "frontend" },
  { name: "Vite", slug: "vite", category: "frontend" },
  { name: "Figma", slug: "figma", category: "frontend" },
  { name: "Node.js", slug: "nodejs", category: "backend" },
  { name: "Express", slug: "express", category: "backend" },
  { name: "Socket.IO", slug: "socketio", category: "backend" },
  { name: "MongoDB", slug: "mongodb", category: "backend" },
  { name: "Docker", slug: "docker", category: "backend" },
  { name: "Nginx", slug: "nginx", category: "backend" },
  { name: "Vercel", slug: "vercel", category: "backend" },
  { name: "GitHub Actions", slug: "githubactions", category: "backend" },
  { name: "Git", slug: "git", category: "backend" },
  { name: "Tauri", slug: "tauri", category: "backend" },
];
