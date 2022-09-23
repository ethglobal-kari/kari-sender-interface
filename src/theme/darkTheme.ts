import { deepmerge } from "@mui/utils";
import { getLightTheme } from "./lightTheme";
import type { ThemeOptions } from "@mui/material";

export const getDarkTheme = (): ThemeOptions => {
  const lightTheme = getLightTheme();

  const darkTheme: ThemeOptions = {
    name: "dark",
    palette: {
      mode: "dark",
      // grayscale: {
      //   main: "",
      // },
      // primary: {
      // light: "",
      // main: "",
      // dark: "",
      // contrastText: "",
      // },
      // secondary: {
      // light: "",
      // main: "",
      // dark: "",
      // contrastText: "",
      // },
      // success: {
      // light: "",
      // main: "",
      // dark: "",
      // contrastText: "",
      // },
      // info: {
      // light: "",
      // main: "",
      // dark: "",
      // contrastText: "",
      // },
      // warning: {
      // light: "",
      // main: "",
      // dark: "",
      // contrastText: "",
      // },
      // error: {
      // light: "",
      // main: "",
      // dark: "",
      // contrastText: "",
      // },
      // accent: {
      //   link: "",
      //   success: "",
      //   info: "",
      //   warning: "",
      //   error: "",
      // },
      // common: {},
      // element: {
      //   card: "",
      //   popup: "",
      //   background: "",
      //   divider: "",
      // },
      // gradient: {
      //   linear: {
      //     primary: "",
      //     secondary: "",
      //   },
      // },
      // border: {
      //   main: "",
      //   hover: "",
      //   active: "",
      // },
      // grey: {},
      // text: {
      // * defaults
      // primary: "",
      // secondary: "",
      // disabled: "",
      // * commons
      // * accents
      // success: "",
      // info: "",
      // warning: "",
      // error: "",
      // },
      // action: {
      //   active: '',
      //   hover: '',
      //   hoverOpacity: 0.04,
      //   selected: '',
      //   selectedOpacity: 0.08,
      // disabled: "",
      //   disabledOpacity: 0.38,
      //   disabledBackground: '',
      //   focus: '',
      //   focusOpacity: 0.12,
      //   activatedOpacity: 0.12,
      // },
      // background: {
      //   default: "",
      //   paper: "",
      //   popup: "",
      //   navbar: "",
      //   content: "",
      //   sidebar: "",
      //   footer: "",
      //   success: "",
      //   info: "",
      //   warning: "",
      //   error: "",
      // },
      // divider: "",
    },
    // components: {},
  };

  return deepmerge(lightTheme, darkTheme);
};
