import type { Components, Theme } from "@mui/material";

const MuiDividerOverride: NonNullable<
  Components<Theme>["MuiDivider"]
>["styleOverrides"] = {
  root: ({ theme }) => ({
    borderColor: theme.palette.border.seperator,

    // For a vertical divider:
    "&.MuiDivider-vertical": {
      borderColor: theme.palette.border.seperator,
    },
  }),
};

export default MuiDividerOverride;
