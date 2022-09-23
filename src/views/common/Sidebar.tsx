import { Box, Button, Drawer, Stack, Typography } from "@mui/material";
import { useResponsive } from "src/hooks/useResponsive";

import type { DrawerProps } from "@mui/material";
import type { FC } from "react";
import { useMuiTheme } from "src/hooks/themes";
import { navbarHeight } from "./Layout";
import Link from "next/link";

type Props = {} & DrawerProps;

export const Sidebar: FC<Props> = (props) => {
  const { ...drawerProps } = props;
  const { isMobile } = useResponsive({ noSsr: true });
  const theme = useMuiTheme();

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        width: 240,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          border: "none",
          mt: `${navbarHeight}px`,
          borderRight: "2px solid",
          borderColor: "border.main",
        },
      }}
      ModalProps={{ keepMounted: true }}
      variant={isMobile ? "temporary" : "permanent"}
      anchor="left"
      {...drawerProps}
    >
      <Box height="100%" py={2.25}>
        <Stack alignItems="center" spacing={2}>
          <Box
            component="img"
            src="https://cryptologos.cc/logos/aave-aave-logo.png"
            sx={{ width: 86, height: 86, borderRadius: 999 }}
          />
          <Typography variant="h5">Aave Protocol</Typography>
          <Link href="/create-campaign" passHref>
            <Button
              variant="text"
              sx={{ background: theme.palette.gradient.linear.primary, borderRadius: 8 }}
            >
              <Typography variant="h6" color="white">
                Create Campaign
              </Typography>
            </Button>
          </Link>
        </Stack>
      </Box>
    </Drawer>
  );
};
