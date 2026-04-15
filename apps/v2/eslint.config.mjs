import { FlatCompat } from "@eslint/eslintrc";

import rootConfig from "../../eslint.config.mjs";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  ...rootConfig,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default config;
