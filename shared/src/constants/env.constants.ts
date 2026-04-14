export const IMPRESSUM = {
  fullName: process.env.IMPRESSUM_FULL_NAME ?? "",
  email: process.env.IMPRESSUM_EMAIL ?? "",
  phone: process.env.IMPRESSUM_PHONE ?? "",
  street: process.env.IMPRESSUM_STREET ?? "",
  houseNr: process.env.IMPRESSUM_HOUSE_NR ?? "",
  zip: process.env.IMPRESSUM_ZIP ?? "",
  city: process.env.IMPRESSUM_CITY ?? "",
  country: process.env.IMPRESSUM_COUNTRY ?? "",
} as const;

/** Formatted address line: "Street Nr" */
export function formatAddressLine(impressum: typeof IMPRESSUM): string {
  return [impressum.street, impressum.houseNr].filter(Boolean).join(" ");
}

/** Formatted city line: "ZIP City" */
export function formatCityLine(impressum: typeof IMPRESSUM): string {
  return [impressum.zip, impressum.city].filter(Boolean).join(" ");
}

export const GITHUB_CONFIG = {
  token: process.env.GITHUB_TOKEN ?? "",
  username: process.env.GITHUB_USERNAME ?? "",
} as const;
