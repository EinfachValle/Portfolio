"use client";

import { type ComponentProps } from "react";

import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

import { THEME_MODE } from "@/constants/elements";
import { FONT_FAMILY } from "@/constants/typography";

/**
 * App-wide tooltip. A theme-bound surface (light/dark) with a border and a
 * small shadow instead of MUI's default dark-grey block — adapted from the
 * Recrest GeneralTooltip. Same prop surface as MUI's Tooltip, so it's a
 * drop-in swap anywhere we'd otherwise reach for raw `@mui/material/Tooltip`.
 *
 * No arrow by design (cleaner at the small type sizes used here; placement +
 * offset already communicate the trigger), and no enter delay so it appears
 * immediately on hover. The fade comes from MUI's built-in transition, which
 * honours reduced-motion.
 */
type Props = ComponentProps<typeof Tooltip>;

const Styled = styled(({ className, ...rest }: Props) => (
  <Tooltip {...rest} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.surface.interface.base,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.border.default}`,
    borderRadius: 8,
    padding: "6px 10px",
    fontFamily: FONT_FAMILY.SANS,
    fontSize: 11.5,
    fontWeight: 500,
    lineHeight: 1.4,
    boxShadow:
      theme.palette.mode === THEME_MODE.DARK
        ? "0 8px 24px -12px rgba(0,0,0,0.7), 0 2px 6px -2px rgba(0,0,0,0.55)"
        : "0 8px 24px -12px rgba(20,22,28,0.22), 0 2px 6px -2px rgba(20,22,28,0.10)",
    // Tabular nums for any numerals that fall inside.
    fontVariantNumeric: "tabular-nums",
    maxWidth: 280,
  },
}));

export function GeneralTooltip(props: Props) {
  return <Styled enterDelay={0} leaveDelay={0} {...props} />;
}

export default GeneralTooltip;
