import { Button, CircularProgress } from "@mui/material";
import { useMuiTheme } from "src/hooks/themes";

import type { FC } from "react";
import type { ButtonProps } from "@mui/material";

export const PrimaryGradientButton: FC<{ loading?: boolean } & ButtonProps> = ({
  loading,
  ...props
}) => {
  const theme = useMuiTheme();
  return (
    <Button
      {...props}
      variant="contained"
      sx={{
        position: "relative",
        background: theme.palette.gradient.linear.primary,
        borderRadius: 8,
        width: 125,
        color: "white",
        ...props.sx,
        "&.Mui-disabled": {
          color: "white",
          "::before": {
            content: '""',
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: 8,
            background: "rgba(0, 0, 0, 0.2)",
          },
        },
      }}
      startIcon={loading && <CircularProgress size={20} sx={{ color: props.color || "white" }} />}
      disabled={loading || props.disabled}
    />
  );
};
