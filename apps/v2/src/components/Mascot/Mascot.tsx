"use client";

import { Box } from "@mui/material";
import { alpha, keyframes, styled, useTheme } from "@mui/material/styles";

/**
 * Playful mascot illustration for status pages (404, error).
 * Two variants share the same character, only expression + pose differ.
 * Animated subtly: bob/wobble + blink + sparks.
 */

const bob = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const wobble = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2.5deg); }
  50% { transform: translateY(-4px) rotate(2.5deg); }
`;

const blink = keyframes`
  0%, 92%, 100% { transform: scaleY(1); }
  94%, 96% { transform: scaleY(0.1); }
`;

const spark = keyframes`
  0%, 100% { opacity: 0.25; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.15); }
`;

type MascotVariant = "lost" | "broken";

interface MascotProps {
  variant: MascotVariant;
  size?: number;
}

const MascotContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "variant",
})<{ variant: MascotVariant }>(({ variant }) => ({
  display: "inline-block",
  lineHeight: 0,
  animation:
    variant === "lost"
      ? `${bob} 4s ease-in-out infinite`
      : `${wobble} 3.2s ease-in-out infinite`,
  willChange: "transform",
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
}));

export function Mascot({ variant, size = 180 }: MascotProps) {
  const theme = useTheme();

  const stroke = theme.palette.text.primary;
  const accent =
    variant === "lost"
      ? theme.palette.accent.secondary
      : theme.palette.accent.primary;
  const bodyFill = alpha(accent, 0.08);
  const strokeWidth = 2.5;

  return (
    <MascotContainer variant={variant}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* ── Antenna ───────────────────────────────── */}
        {variant === "lost" ? (
          <g>
            <line
              x1="100"
              y1="50"
              x2="100"
              y2="28"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <text
              x="100"
              y="22"
              textAnchor="middle"
              fontSize="22"
              fontWeight="700"
              fill={accent}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              ?
            </text>
          </g>
        ) : (
          <g>
            <path
              d="M100 50 L100 40 L110 28"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="110" cy="28" r="3" fill={accent}>
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="1.1s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="118"
              cy="22"
              r="1.8"
              fill={accent}
              style={{ animation: `${spark} 1.4s ease-in-out infinite 0.2s` }}
            />
            <circle
              cx="120"
              cy="34"
              r="1.5"
              fill={accent}
              style={{ animation: `${spark} 0.95s ease-in-out infinite 0.5s` }}
            />
          </g>
        )}

        {/* ── Arms ──────────────────────────────────── */}
        {variant === "lost" ? (
          <g>
            {/* Shrug: arms angled outward and up */}
            <path
              d="M52 88 Q34 86 28 62"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M148 88 Q166 86 172 62"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
            {/* Hands (open palms) */}
            <circle
              cx="28"
              cy="62"
              r="4.5"
              fill={bodyFill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            <circle
              cx="172"
              cy="62"
              r="4.5"
              fill={bodyFill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </g>
        ) : (
          <g>
            {/* Panic: arms reaching up */}
            <path
              d="M56 76 Q42 56 48 28"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M144 76 Q158 56 152 28"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
            <circle
              cx="48"
              cy="28"
              r="4.5"
              fill={bodyFill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
            <circle
              cx="152"
              cy="28"
              r="4.5"
              fill={bodyFill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </g>
        )}

        {/* ── Body ──────────────────────────────────── */}
        <rect
          x="50"
          y="50"
          width="100"
          height="100"
          rx="26"
          ry="26"
          fill={bodyFill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />

        {/* ── Face ──────────────────────────────────── */}
        {variant === "lost" ? (
          <g>
            {/* Eyes — looking slightly left (searching) */}
            <g
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: `${blink} 4.5s infinite`,
              }}
            >
              <circle cx="77" cy="92" r="5" fill={stroke} />
              <circle cx="117" cy="92" r="5" fill={stroke} />
            </g>
            {/* Open "o" mouth */}
            <ellipse
              cx="100"
              cy="122"
              rx="6"
              ry="7"
              stroke={stroke}
              strokeWidth="2"
              fill={alpha(stroke, 0.15)}
            />
          </g>
        ) : (
          <g>
            {/* X eyes */}
            <path
              d="M73 86 L87 100 M87 86 L73 100"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <path
              d="M113 86 L127 100 M127 86 L113 100"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Zigzag frown mouth */}
            <path
              d="M84 124 L92 118 L100 124 L108 118 L116 124"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        )}

        {/* ── Feet ──────────────────────────────────── */}
        <line
          x1="76"
          y1="150"
          x2="76"
          y2="162"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1="124"
          y1="150"
          x2="124"
          y2="162"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <ellipse cx="76" cy="164" rx="7" ry="2.5" fill={stroke} />
        <ellipse cx="124" cy="164" rx="7" ry="2.5" fill={stroke} />
      </svg>
    </MascotContainer>
  );
}
