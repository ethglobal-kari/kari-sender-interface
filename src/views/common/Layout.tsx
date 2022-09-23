import { useMemo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Footer } from "./Footer";
import { Routes } from "src/constants/routes";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import color from "color";
import { Window, useLaunch } from "@relaycc/receiver";
import { useSigner } from "wagmi";

// * Type Imports
import type { FC, ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { WrongNetworkDialog } from "./WrongNetworkDialog";

type Props = {
  children: ReactNode;
};

export const navbarHeight = 112;

// * Main can only appear once in html (see: https://www.w3schools.com/tags/tag_main.asp)
const Main = styled("main", {
  shouldForwardProp: (prop: string) => ![""].includes(prop),
})<{}>(() => ({
  flexGrow: 1, // full-height
  marginLeft: 240, // sidebar width
}));

export const Layout: FC<Props> = ({ children }) => {
  const router = useRouter();
  const isFooterHidden = useMemo(() => {
    return Routes.FOOTER_HIDDEN.some((route) =>
      route instanceof RegExp ? route.test(router.pathname) : route === router.pathname,
    );
  }, [router.pathname]);

  const signer = useSigner();
  const launch = useLaunch(signer.data);

  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar sx={{ position: "fixed", top: 0, height: navbarHeight }} />
        <Box flex={1} display="flex" flexDirection="column" sx={{ mt: 14 }}>
          <Sidebar />
          <Main>
            {children}
            {!isFooterHidden && <Footer />}
          </Main>
        </Box>
        <Box
          sx={{
            "& > div": {
              right: 30,
              bottom: 80,
              "& > div": {
                overflow: "hidden",
              },
            },
          }}
        >
          <Window />
        </Box>
        <Tooltip title="Chat with us" placement="left" arrow>
          <IconButton
            sx={{
              color: "white",
              backgroundColor: "#3876FF",
              width: 48,
              height: 48,
              position: "fixed",
              bottom: 20,
              right: 20,
              ":hover": {
                backgroundColor: color("#3876FF").lighten(0.12).hex(),
              },
            }}
            onClick={() => launch("0xC03F2d02Bd611d16772263484ea052Fa1D240cE9")}
          >
            <FontAwesomeIcon icon={faMessage} size="xs" />
          </IconButton>
        </Tooltip>
      </Box>
      {/* <WrongNetworkDialog /> */}
    </>
  );
};
