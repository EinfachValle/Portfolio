"use client";

import { useTranslation } from "react-i18next";

import { alpha, styled } from "@mui/material/styles";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { TRANSITION } from "@/constants/animation";
import { FONT_FAMILY } from "@/constants/typography";

// ── Styled components ──────────────────────────────────────────────────

const TabGroup = styled("nav")(({ theme }) => ({
  // Block-level (own line below the back link) but only as wide as its content.
  display: "flex",
  flexWrap: "wrap",
  gap: 4,
  padding: 4,
  marginBottom: 40,
  width: "fit-content",
  maxWidth: "100%",
  borderRadius: 24,
  border: `1px solid ${theme.palette.border.default}`,
  backgroundColor: theme.palette.glass.background,
}));

interface TabProps {
  active: boolean;
}

const Tab = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})<TabProps>(({ theme, active }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 16px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 500,
  fontFamily: FONT_FAMILY.SANS,
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: `background-color ${TRANSITION.FAST}, color ${TRANSITION.FAST}, box-shadow ${TRANSITION.FAST}`,
  color: active ? theme.palette.text.onAccent : theme.palette.text.muted,
  backgroundColor: active ? theme.palette.accent.primary : "transparent",
  boxShadow: active
    ? `0 0 12px ${alpha(theme.palette.accent.primary, 0.38)}`
    : "none",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.accent.primary
      : alpha(theme.palette.accent.primary, 0.094),
    color: active ? theme.palette.text.onAccent : theme.palette.accent.primary,
  },
}));

// ── Config ───────────────────────────────────────────────────────────────

const LEGAL_LINKS = [
  { href: "/legal-notice", labelKey: "nav.legalNotice" },
  { href: "/privacy-policy", labelKey: "nav.privacyPolicy" },
  { href: "/accessibility", labelKey: "nav.accessibility" },
] as const;

// ── Component ──────────────────────────────────────────────────────────

/** Pill tab group to switch between the legal pages, shown at the top of each. */
export function LegalNav() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <TabGroup aria-label={t("a11y.legalNav")}>
      {LEGAL_LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Tab
            key={link.href}
            href={link.href}
            active={active}
            aria-current={active ? "page" : undefined}
          >
            {t(link.labelKey)}
          </Tab>
        );
      })}
    </TabGroup>
  );
}

export default LegalNav;
