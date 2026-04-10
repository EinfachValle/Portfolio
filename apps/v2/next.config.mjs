import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// Load .env from monorepo root (Node 22+ built-in)
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(resolve(__dirname, "../../.env"));
} catch {
  // .env file may not exist in all environments (e.g. Vercel injects env vars)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@portfolio/shared"],
  experimental: {
    // Tree-shake barrel imports — massive dev-mode speedup for MUI
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
      "@reduxjs/toolkit",
      "react-redux",
    ],
  },
};

export default nextConfig;
