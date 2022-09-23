import { Box, Select } from "@mui/material";
import type { SelectProps } from "@mui/material";
import type { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export const GeneralSelect: FC<SelectProps> = (props) => {
  return (
    <Select
      {...props}
      sx={{
        background: "#F6F9FF",
        borderRadius: 8,
        ".MuiSelect-outlined": {
          padding: "0.75rem 1rem",
          fontSize: 18,
          lineHeight: "150%",
        },
        fieldset: {
          border: "none",
        },
      }}
      IconComponent={(props) => (
        <Box
          {...props}
          sx={{
            "&.MuiSelect-icon": { color: "#3876FF", right: 45, transition: "all 150ms ease-out" },
          }}
        >
          <FontAwesomeIcon icon={faChevronDown} size="lg" />
        </Box>
      )}
      inputProps={{ "aria-label": "Without label" }}
    />
  );
};
