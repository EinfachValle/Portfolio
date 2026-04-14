/**
 * Shared skill definitions — stack-agnostic data only.
 *
 * Each app maps `slug` to its own icon component.
 */

export interface SkillDefinition {
  /** Display name shown in the UI */
  name: string;
  /** Unique identifier used to map to framework-specific icons */
  slug: string;
}

export const SKILLS: SkillDefinition[] = [
  { name: "TypeScript", slug: "typescript" },
  { name: "React", slug: "react" },
  { name: "NextJS", slug: "nextjs" },
  { name: "Node.js", slug: "nodejs" },
  { name: "Express", slug: "express" },
  { name: "Socket.IO", slug: "socketio" },
  { name: "MUI", slug: "mui" },
  { name: "Redux", slug: "redux" },
  { name: "shadcn/ui", slug: "shadcnui" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Vite", slug: "vite" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "Docker", slug: "docker" },
  { name: "Nginx", slug: "nginx" },
  { name: "Vercel", slug: "vercel" },
  { name: "GitHub Actions", slug: "githubactions" },
  { name: "Git", slug: "git" },
  { name: "Figma", slug: "figma" },
  { name: "Tauri", slug: "tauri" },
];
