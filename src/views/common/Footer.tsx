import { Box, Typography } from "@mui/material";

import type { FC } from "react";

type Props = {};

export const Footer: FC<Props> = () => {
  return (
    // magic css: footer stick at bottom
    <Box sx={{ position: "sticky", top: "100vh", height: 150 }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        sx={{ border: "2px dashed", backgroundColor: "background.footer" }}
      >
        <Typography variant="h1">Footer</Typography>
      </Box>
    </Box>
  );
};
