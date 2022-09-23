import { TextField } from "@mui/material";
import type { FC } from "react";
import type { TextFieldProps } from "@mui/material";

type Props = {
  fontSize?: number | string;
  lineHeight?: number | string;
  padding?: number | string;
  small?: boolean;
  multilineMinHeight?: number | string;
} & TextFieldProps;

export const GeneralFilledTextField: FC<Props> = ({
  fontSize = 18,
  lineHeight = "150%",
  padding = "0.75rem 1rem",
  small = false,
  multilineMinHeight = 160,
  ...props
}) => {
  if (small) {
    fontSize = 12;
    lineHeight = "150%";
    padding = "8px 11px";
  }

  return (
    <TextField
      type={"text"}
      {...props}
      variant="filled"
      sx={{
        "& > .MuiFilledInput-root": {
          backgroundColor: "#F6F9FF",
          borderRadius: 8,
          "::before": { display: "none" },
          "::after": { display: "none" },
          ":hover": {
            backgroundColor: "#F6F9FF",
          },
          "&.Mui-focused": {
            backgroundColor: "#F6F9FF",
          },
          "&.MuiInputBase-multiline": {
            alignItems: "flex-start",
            padding: 0,
            minHeight: multilineMinHeight,
            textarea: {
              fontSize,
              lineHeight,
              padding,
              "::placeholder": {
                opacity: 1,
                color: "#D9D9D9",
              },
            },
          },
        },
        input: {
          fontSize,
          lineHeight,
          padding,
          "::placeholder": {
            opacity: 1,
            color: "#D9D9D9",
          },
        },
        ...props.sx,
      }}
    />
  );
};
