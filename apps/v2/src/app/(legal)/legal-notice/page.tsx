import type { Metadata } from "next";

import LegalNoticeContent from "./LegalNoticeContent";

export const metadata: Metadata = {
  title: "Legal Notice",
  description: "Legal notice pursuant to §5 DDG",
};

export default function LegalNoticePage() {
  return <LegalNoticeContent />;
}
