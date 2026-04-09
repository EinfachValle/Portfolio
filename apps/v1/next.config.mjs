import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// Load .env from monorepo root (Node 22+ built-in)
const __dirname = dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(resolve(__dirname, "../../.env"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@portfolio/shared"],
};

export default nextConfig;
