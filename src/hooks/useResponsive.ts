import { useMediaQuery, useTheme } from "@mui/material";
import type { Options } from "@mui/material";

export const useResponsive = (options?: Options) => {
  const theme = useTheme();
  const mobileMediaquery = theme.breakpoints.down("sm");
  const isMobile = useMediaQuery(mobileMediaquery, options);
  const tabletMediaquery = theme.breakpoints.down("md");
  const isTablet = useMediaQuery(tabletMediaquery, options);
  const isDesktop = !isMobile && !isTablet;
  const isXs = useMediaQuery(theme.breakpoints.only("xs"), options);
  const isSm = useMediaQuery(theme.breakpoints.only("sm"), options);
  const isMd = useMediaQuery(theme.breakpoints.only("md"), options);
  const isLg = useMediaQuery(theme.breakpoints.only("lg"), options);
  const isXl = useMediaQuery(theme.breakpoints.only("xl"), options);
  const upLg = useMediaQuery(theme.breakpoints.up("lg"), options);
  const upSm = useMediaQuery(theme.breakpoints.up("sm"), options);

  return {
    mobileMediaquery,
    tabletMediaquery,
    isMobile,
    isTablet,
    isDesktop,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    upLg,
    upSm,
  };
};
