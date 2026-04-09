import type { TFunction } from "i18next";

interface ResumeItem {
  from: string;
  to: string;
  title: string;
  company: string;
  description: string;
  link: string;
  location: string;
  keys?: string[];
}

const resume = (t: TFunction): ResumeItem[] => [
  {
    from: "2021",
    to: "2022",
    title: t("resume.join.title"),
    company: "Join GmbH",
    description: t("resume.join.description"),
    link: "https://join.de",
    location: "Johannisplatz, 99817 Eisenach, Germany",
    keys: t("resume.join.keys", { returnObjects: true }) as string[],
  },
  {
    from: "2022",
    to: "2023",
    title: t("resume.nahrstedt.title"),
    company: "Backhaus Nahrstedt Premium GmbH",
    description: t("resume.nahrstedt.description"),
    link: "https://nahrstedt.de",
    location: "Onkel Carl Eisenach, 99817 Eisenach, Germany",
    keys: t("resume.nahrstedt.keys", { returnObjects: true }) as string[],
  },
  {
    from: "2023",
    to: "2026",
    title: t("resume.aimway.title"),
    company: "AimWay GmbH",
    description: t("resume.aimway.description"),
    link: "https://aimway.de",
    location: "Badestube 6, 36251 Bad Hersfeld, Germany",
    keys: t("resume.aimway.keys", { returnObjects: true }) as string[],
  },
];

export type { ResumeItem };
export default resume;
