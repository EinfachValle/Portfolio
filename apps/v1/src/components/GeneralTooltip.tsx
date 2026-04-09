import React, { memo } from "react";

import { Fade, Tooltip } from "@mui/material";
import type { TooltipProps } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

interface GeneralTooltipProps {
  children: React.ReactElement;
  title: React.ReactNode;
  placement: TooltipProps["placement"];
  arrow?: boolean;
  leaveDelay?: number;
  withTransition?: boolean;
  open?: boolean;
}

const CustomTooltip = styled(
  ({ className, ...props }: TooltipProps & { className?: string }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ),
)(({ theme, placement }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    top: placement?.includes("top") && theme.spacing(-1),
    bottom: placement?.includes("bottom") && theme.spacing(1),
    backgroundColor: theme.palette.surface.interface.dark,
    backgroundImage: "unset",
    color: theme.palette.text.contrast,
    boxShadow: "none",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "14px",
    fontFamily: "Roboto, sans-serif",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.surface.interface.dark,
  },
}));

const GeneralTooltip: React.FC<GeneralTooltipProps> = memo(
  ({
    children,
    arrow = true,
    title,
    placement,
    leaveDelay = 0,
    withTransition = false,
    open,
    ...otherProps
  }) => {
    return (
      <CustomTooltip
        arrow={arrow}
        placement={placement}
        leaveDelay={leaveDelay}
        open={open}
        title={title}
        {...(withTransition && {
          TransitionComponent: Fade,
          TransitionProps: { timeout: 300 },
        })}
        {...otherProps}
      >
        {children}
      </CustomTooltip>
    );
  },
);

export default GeneralTooltip;
