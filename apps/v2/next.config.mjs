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
  // Expose non-NEXT_PUBLIC env vars to the client bundle (used by @portfolio/shared)
  env: {
    IMPRESSUM_FULL_NAME: process.env.IMPRESSUM_FULL_NAME,
    IMPRESSUM_EMAIL: process.env.IMPRESSUM_EMAIL,
    IMPRESSUM_PHONE: process.env.IMPRESSUM_PHONE,
    IMPRESSUM_STREET: process.env.IMPRESSUM_STREET,
    IMPRESSUM_HOUSE_NR: process.env.IMPRESSUM_HOUSE_NR,
    IMPRESSUM_ZIP: process.env.IMPRESSUM_ZIP,
    IMPRESSUM_CITY: process.env.IMPRESSUM_CITY,
    IMPRESSUM_COUNTRY: process.env.IMPRESSUM_COUNTRY,
  },
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
