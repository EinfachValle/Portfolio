import { styled } from "@mui/material/styles";

/**
 * Uppercase gradient overline used as each section's label (About, Projects,
 * Contact).
 *
 * `display: inline-block` + `lineHeight: 1.5` give the glyph box headroom:
 * with `background-clip: text` the gradient only fills the glyph *inside* the
 * box, so a tight line-height clips uppercase diacritics — e.g. the dots of
 * "Ü" in "ÜBER MICH" disappear. The extra leading keeps them painted.
 */
export const GradientSectionLabel = styled("span")(({ theme }) => ({
  display: "inline-block",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "4px",
  textTransform: "uppercase",
  lineHeight: 1.5,
  backgroundImage: `linear-gradient(135deg, ${theme.palette.accent.primary}, ${theme.palette.accent.secondary})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
}));
