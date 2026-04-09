export const IMPRESSUM = {
  fullName: process.env.IMPRESSUM_FULL_NAME ?? "",
  email: process.env.IMPRESSUM_EMAIL ?? "",
  address: process.env.IMPRESSUM_ADDRESS ?? "",
  city: process.env.IMPRESSUM_CITY ?? "",
} as const;

export const SOCIAL_LINKS = {
  github: process.env.GITHUB_URL ?? "",
  linkedin: process.env.LINKEDIN_URL ?? "",
} as const;

export const GITHUB_CONFIG = {
  token: process.env.GITHUB_TOKEN ?? "",
  username: process.env.GITHUB_USERNAME ?? "",
} as const;
