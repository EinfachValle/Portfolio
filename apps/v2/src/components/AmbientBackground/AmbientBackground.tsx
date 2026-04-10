"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function AmbientBackground() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Top-left indigo glow */}
      <Box
        sx={{
          position: "absolute",
          top: "-5%",
          left: "-10%",
          width: "45vw",
          height: "45vw",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.035) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 65%)",
        }}
      />

      {/* Top-right cyan glow */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(6, 182, 212, 0.03) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, transparent 70%)",
        }}
      />

      {/* Center-left indigo glow */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "-15%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.025) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)",
        }}
      />

      {/* Bottom-right subtle glow */}
      <Box
        sx={{
          position: "absolute",
          bottom: "5%",
          right: "10%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(6, 182, 212, 0.02) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(15, 23, 42, 0.02) 0%, transparent 70%)",
        }}
      />
    </Box>
  );
}
