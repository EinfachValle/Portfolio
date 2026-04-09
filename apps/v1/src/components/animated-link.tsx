import { memo } from "react";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { styled } from "@mui/material";

import Link from "next/link";

interface AnimatedLinkProps {
  href?: string;
  children: React.ReactNode;
  openInNewTab?: boolean;
  withIcon?: boolean;
  goBackIcon?: boolean;
}

interface StyledLinkProps {
  goBackIcon?: boolean;
}

const StyledLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "goBackIcon",
})<StyledLinkProps>(({ theme, goBackIcon }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  gap: theme.spacing(1),
  fontSize: "16px !important",
  fontWeight: "600 !important",
  lineHeight: "1.25",
  color: goBackIcon ? theme.palette.text.primary : theme.palette.text.default,
  textAlign: "left",
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.text.primary,
    transition: "color 0.3s ease-in-out",
    "& svg": {
      transform: goBackIcon ? "translate(-4px, 0px)" : "translate(2px, -2px)",
    },
  },
  "& svg": {
    fontSize: goBackIcon ? "16px" : "20px",
    transition: "transform 0.3s ease-in-out",
  },
}));

const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  href = "/",
  children,
  openInNewTab = false,
  withIcon = true,
  goBackIcon = false,
  ...otherProps
}) => {
  const targetProps = openInNewTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <StyledLink
      href={href}
      passHref
      goBackIcon={goBackIcon}
      {...targetProps}
      {...otherProps}
    >
      {goBackIcon && <ArrowBackRoundedIcon />}
      {children}
      {withIcon && (
        <ArrowOutwardRoundedIcon
          sx={{ fontSize: "14px", textAlign: "baseline" }}
        />
      )}
    </StyledLink>
  );
};

export default memo(AnimatedLink);
