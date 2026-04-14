"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import useDeviceTypeDetection from "@/hooks/useDeviceTypeDetection";

/**
 * Circular circuit decoration for light mode sections.
 * Positioned at the left or right page edge, fading toward the border.
 */

type Side = "left" | "right";

interface CircuitCircleProps {
  side: Side;
  top?: string;
  size?: number;
}

function LeftVariant(props: { trace: string; node: string; pad: string }) {
  const { trace, node, pad } = props;
  const cx = 100;
  const cy = 260;

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={60}
        stroke={trace}
        strokeWidth={1.2}
        fill="none"
        strokeDasharray="28 8 45 8 30 8 70 8 50 8 40 8"
        transform={`rotate(-15, ${cx}, ${cy})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={110}
        stroke={trace}
        strokeWidth={1.4}
        fill="none"
        strokeDasharray="60 10 90 10 55 10 80 10 45 10"
        transform={`rotate(25, ${cx}, ${cy})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={170}
        stroke={trace}
        strokeWidth={1.2}
        fill="none"
        strokeDasharray="100 12 75 12 120 12 85 12 65 12"
        transform={`rotate(-40, ${cx}, ${cy})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={240}
        stroke={trace}
        strokeWidth={1}
        fill="none"
        strokeDasharray="140 14 180 14 110 14 160 14"
        transform={`rotate(10, ${cx}, ${cy})`}
      />

      <circle cx={cx - 55} cy={cy + 23} r={2.5} fill={node} />
      <circle cx={cx + 30} cy={cy - 52} r={2.5} fill={node} />
      <circle cx={cx - 10} cy={cy + 59} r={3} fill={node} />
      <circle cx={cx - 95} cy={cy - 56} r={3} fill={node} />
      <circle cx={cx + 60} cy={cy + 92} r={2.5} fill={node} />
      <circle cx={cx - 45} cy={cy + 100} r={3} fill={node} />
      <circle cx={cx - 140} cy={cy + 96} r={3} fill={node} />
      <circle cx={cx + 80} cy={cy - 150} r={2.5} fill={node} />
      <circle cx={cx - 200} cy={cy + 130} r={3} fill={node} />

      <line
        x1={cx - 55}
        y1={cy + 23}
        x2={cx - 65}
        y2={cy + 35}
        stroke={trace}
        strokeWidth={1}
      />
      <line
        x1={cx - 95}
        y1={cy - 56}
        x2={cx - 110}
        y2={cy - 72}
        stroke={trace}
        strokeWidth={1}
      />
      <line
        x1={cx + 60}
        y1={cy + 92}
        x2={cx + 72}
        y2={cy + 108}
        stroke={trace}
        strokeWidth={1}
      />
      <line
        x1={cx - 140}
        y1={cy + 96}
        x2={cx - 158}
        y2={cy + 112}
        stroke={trace}
        strokeWidth={1}
      />

      <rect
        x={cx - 99}
        y={cy - 60}
        width={8}
        height={8}
        rx={1.5}
        stroke={pad}
        strokeWidth={1}
        fill="none"
      />
      <rect
        x={cx - 144}
        y={cy + 92}
        width={8}
        height={8}
        rx={1.5}
        stroke={pad}
        strokeWidth={1}
        fill="none"
      />
    </>
  );
}

function RightVariant(props: { trace: string; node: string; pad: string }) {
  const { trace, node, pad } = props;
  const cx = 420;
  const cy = 260;

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={55}
        stroke={trace}
        strokeWidth={1.3}
        fill="none"
        strokeDasharray="32 9 40 9 25 9 48 9 35 9"
        transform={`rotate(30, ${cx}, ${cy})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={120}
        stroke={trace}
        strokeWidth={1.2}
        fill="none"
        strokeDasharray="70 11 55 11 85 11 65 11 50 11"
        transform={`rotate(-20, ${cx}, ${cy})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={195}
        stroke={trace}
        strokeWidth={1.1}
        fill="none"
        strokeDasharray="110 13 90 13 130 13 75 13 95 13"
        transform={`rotate(45, ${cx}, ${cy})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={280}
        stroke={trace}
        strokeWidth={0.9}
        fill="none"
        strokeDasharray="170 15 200 15 150 15 190 15"
        transform={`rotate(-10, ${cx}, ${cy})`}
      />

      <circle cx={cx + 50} cy={cy - 22} r={2.5} fill={node} />
      <circle cx={cx - 30} cy={cy + 46} r={3} fill={node} />
      <circle cx={cx + 105} cy={cy + 58} r={3} fill={node} />
      <circle cx={cx - 80} cy={cy - 90} r={2.5} fill={node} />
      <circle cx={cx + 40} cy={cy - 113} r={3} fill={node} />
      <circle cx={cx + 170} cy={cy - 90} r={3} fill={node} />
      <circle cx={cx - 120} cy={cy + 155} r={2.5} fill={node} />
      <circle cx={cx + 240} cy={cy - 145} r={2.5} fill={node} />

      <line
        x1={cx + 50}
        y1={cy - 22}
        x2={cx + 62}
        y2={cy - 10}
        stroke={trace}
        strokeWidth={1}
      />
      <line
        x1={cx + 105}
        y1={cy + 58}
        x2={cx + 118}
        y2={cy + 45}
        stroke={trace}
        strokeWidth={1}
      />
      <line
        x1={cx - 80}
        y1={cy - 90}
        x2={cx - 92}
        y2={cy - 105}
        stroke={trace}
        strokeWidth={1}
      />
      <line
        x1={cx + 170}
        y1={cy - 90}
        x2={cx + 185}
        y2={cy - 102}
        stroke={trace}
        strokeWidth={1}
      />

      <rect
        x={cx + 101}
        y={cy + 54}
        width={8}
        height={8}
        rx={1.5}
        stroke={pad}
        strokeWidth={1}
        fill="none"
      />
      <rect
        x={cx + 36}
        y={cy - 117}
        width={8}
        height={8}
        rx={1.5}
        stroke={pad}
        strokeWidth={1}
        fill="none"
      />
    </>
  );
}

export function CircuitCircle({
  side,
  top = "10%",
  size = 420,
}: CircuitCircleProps) {
  const theme = useTheme();
  const { isMobile } = useDeviceTypeDetection();

  // Decorative element overflows on mobile screens — hide it
  if (isMobile) return null;

  const trace = theme.palette.circuit.trace;
  const node = theme.palette.circuit.node;
  const pad = theme.palette.circuit.pad;

  const isLeft = side === "left";

  const maskImage = isLeft
    ? "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)"
    : "linear-gradient(to left, transparent 0%, black 15%, black 85%, transparent 100%)";

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        zIndex: 0,
        width: size,
        height: size,
        pointerEvents: "none",
        top,
        ...(isLeft ? { left: -size * 0.15 } : { right: -size * 0.15 }),
        maskImage,
        WebkitMaskImage: maskImage,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 520 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isLeft ? (
          <LeftVariant trace={trace} node={node} pad={pad} />
        ) : (
          <RightVariant trace={trace} node={node} pad={pad} />
        )}
      </svg>
    </Box>
  );
}
