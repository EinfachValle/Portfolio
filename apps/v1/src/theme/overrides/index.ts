import type { Components, Theme } from "@mui/material";

import MuiDividerOverride from "./MuiDivider";

const overrides: Components<Theme> = {
  MuiDivider: {
    styleOverrides: MuiDividerOverride,
  },
};

export default overrides;
