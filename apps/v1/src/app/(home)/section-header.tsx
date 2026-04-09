import React, { memo } from "react";

import { Box, Typography, styled } from "@mui/material";

const RootContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "row",

  /* Base (no breakpoint) */
  position: "sticky",
  top: 0,
  zIndex: 20,
  marginLeft: "-1.5rem" /* -mx-6 */,
  marginRight: "-1.5rem",
  marginBottom: "1rem" /* mb-4 */,
  width: "100vw" /* w-screen */,
  backgroundColor: "rgba(15, 23, 42, 0.75)" /* bg-slate-900/75 */,
  padding: "1.25rem 1.5rem" /* py-5 px-6 */,
  backdropFilter: "blur(4px)" /* backdrop-blur */,

  /* @media (min-width: 768px) - md */
  [theme.breakpoints.up("md")]: {
    marginLeft: "-3rem" /* md:-mx-12 */,
    marginRight: "-3rem",
    paddingLeft: "3rem" /* md:px-12 */,
    paddingRight: "3rem",
  },

  /* @media (min-width: 1024px) - lg */
  [theme.breakpoints.up("lg")]: {
    position: "relative" /* lg:relative */,
    top: "auto" /* lg:top-auto */,
    marginLeft: "auto" /* lg:mx-auto */,
    marginRight: "auto",
    width: "100%" /* lg:w-full */,
    height: "1px",
    padding: 0 /* lg:py-0 lg:px-0 */,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
    opacity: 0 /* lg:opacity-0 */,
  },
}));

const Text = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem !important",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#e5e7eb",
  lineHeight: 1.625,
  textAlign: "left",
  [theme.breakpoints.up("lg")]: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
}));

interface SectionHeaderProps {
  children: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  children,
  ...otherProps
}) => {
  return (
    <RootContainer {...otherProps}>
      <Text>{children}</Text>
    </RootContainer>
  );
};

export default memo(SectionHeader);
