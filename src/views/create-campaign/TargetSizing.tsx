import { Box, Stack, Typography } from "@mui/material";
import Color from "color";

import type { FC } from "react";

type Props = {
  totalSize?: number;
  nonActiveColors?: string[];
  activeColors?: string[];
  activeIndex: number;
  labels?: [string, string] | string[];
};

export const TargetSizing: FC<Props> = ({
  totalSize = 3,
  activeColors = ["#D2222D", "#238724", "#FFBE00"],
  nonActiveColors = activeColors.map((c) => Color(c).alpha(0.2).toString()),
  activeIndex,
  labels = ["Specific", "Broad"],
}) => {
  return (
    <Box>
      <Stack spacing={1} direction="row" mt={2}>
        {Array.from({ length: totalSize }).map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <Box
              key={`non-active-color::${index}`}
              width="100%"
              height={8}
              sx={{
                borderRadius: 4,
                backgroundColor: isActive ? activeColors[index] : nonActiveColors[index],
                boxShadow: isActive ? `0px 0px 8px 0px ${activeColors[index]}` : "none",
              }}
            />
          );
        })}
      </Stack>
      <Box display="flex" justifyContent="space-between" mt={1}>
        {labels.map((label, index) => (
          <Typography key={`${label}::${index}`} variant="body2" textTransform="capitalize">
            <b>{label}</b>
          </Typography>
        ))}
      </Box>
    </Box>
  );
};
