import {
  siDocker,
  siExpress,
  siFigma,
  siGit,
  siGithubactions,
  siMongodb,
  siMui,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siReact,
  siRedux,
  siShadcnui,
  siSocketdotio,
  siTailwindcss,
  siTauri,
  siTypescript,
  siVercel,
  siVite,
} from "simple-icons";

export interface TechIconProps {
  size?: number;
  className?: string;
}

interface SimpleIcon {
  path: string;
  hex: string;
}

const ICON_MAP: Record<string, SimpleIcon> = {
  typescript: siTypescript,
  react: siReact,
  nextjs: siNextdotjs,
  nodejs: siNodedotjs,
  express: siExpress,
  socketio: siSocketdotio,
  mui: siMui,
  redux: siRedux,
  shadcnui: siShadcnui,
  tailwindcss: siTailwindcss,
  vite: siVite,
  mongodb: siMongodb,
  docker: siDocker,
  nginx: siNginx,
  vercel: siVercel,
  githubactions: siGithubactions,
  git: siGit,
  figma: siFigma,
  tauri: siTauri,
};

interface TechIconBySlugProps extends TechIconProps {
  slug: string;
}

export function getBrandHex(slug: string): string {
  return ICON_MAP[slug]?.hex ?? "ffffff";
}

export function TechIcon({ slug, size = 24, className }: TechIconBySlugProps) {
  const icon = ICON_MAP[slug];
  if (!icon) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}
