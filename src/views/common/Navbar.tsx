import styled from "@emotion/styled";
import { Box, Stack, useScrollTrigger, useTheme } from "@mui/material";
import Link from "next/link";

import type { BoxProps } from "@mui/material";

import type { FC } from "react";
import { ConnectWalletButton } from "src/components/ConnectWalletButton";
import { KariLogo } from "src/svgs";

const Wrapper = styled(Box, {
  shouldForwardProp: (props: string) => props !== "isScrollTriggered",
})<{ isScrollTriggered: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 43px;
  padding-right: 78px;
  box-shadow: ${({ theme, isScrollTriggered }) => (isScrollTriggered ? theme.shadows[5] : "none")};
  background-color: white;
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
  transition: background-color 200ms;
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.main};
`;

type Props = {
  sx?: BoxProps["sx"];
};

export const Navbar: FC<Props> = (props) => {
  const theme = useTheme();
  const isScrollTriggered = useScrollTrigger({ disableHysteresis: true, threshold: 30 });
  return (
    <Wrapper sx={{ ...props.sx }} isScrollTriggered={isScrollTriggered}>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "calc(240px - 0.5rem) 1fr",
          columnGap: "1rem",
          alignItems: "center",
          [theme.breakpoints.down("md")]: {
            display: "flex",
            justifyContent: "space-between",
          },
        }}
      >
        <Link href="/" passHref>
          <Box
            component="a"
            color={theme.palette.mode === "light" ? "black" : "white"}
            sx={{
              display: "flex",
              alignItems: "flex-end",
              width: "fit-content",
              textDecoration: "none",
            }}
          >
            <KariLogo height={22} width={null} />
            {/* <Box
              sx={{ background: "#3876FF", width: 40, height: 40, borderRadius: 999, mr: 0.5 }}
            />
            <Typography
              sx={{
                fontFamily: "DM Sans",
                fontSize: 32,
                lineHeight: "100%",
                fontWeight: 700,
              }}
            >
              Kari
            </Typography> */}
          </Box>
        </Link>
        <Box display="flex" justifyContent="flex-end" alignItems="center" pr={1} width="100%">
          <Stack direction="row" spacing={3}>
            <ConnectWalletButton />
          </Stack>
        </Box>
      </Box>
    </Wrapper>
  );
};
