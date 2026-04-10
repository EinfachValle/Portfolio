import type { Metadata } from "next";

import PrivacyPolicyContent from "./PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy pursuant to GDPR/DSGVO",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
