import type { PaletteMode, Theme as MaterialTheme } from "@mui/material";
import type {
  AccentColors,
  ElementColors,
  GradientColors,
  BorderColors,
} from "@mui/material/styles/createPalette";

declare module "@mui/material/styles" {
  interface Theme {
    name: "light" | "dark";
    setPaletteMode: (mode: PaletteMode) => void;
    togglePaletteMode: () => void;
  }
  interface ThemeOptions {
    name: "light" | "dark";
  }

  interface Palette {
    grayscale: Palette["primary"];
    gray: Palette["primary"];
    element: Partial<ElementColors>;
    accent: Partial<AccentColors>;
    border: Partial<BorderColors>;
    gradient: {
      linear: Partial<GradientColors>;
      radial: Partial<GradientColors>;
    };
  }

  interface PaletteOptions {
    grayscale?: PaletteOptions["primary"];
    gray?: PaletteOptions["primary"];
    element?: Partial<ElementColors>;
    accent?: Partial<AccentColors>;
    border?: Partial<BorderColors>;
    gradient?: {
      linear?: Partial<GradientColors>;
      radial?: Partial<GradientColors>;
    };
  }

  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: false;
    xxxl: false;
  }
}

declare module "@mui/material/styles/createPalette" {
  interface AccentColors {
    link: string;
    success: string;
    info: string;
    warning: string;
    error: string;
  }

  interface ElementColors {
    card: string;
    popup: string;
    background: string;
    divider: string;
  }

  interface CommonColors {
    red: string;
    green: string;
    blue: string;
    yellow: string;
    pink: string;
    orange: string;
    gray: string;
  }

  interface BorderColors {
    main: string;
    active: string;
    hover: string;
    disabled: string;
    input: string;
  }

  interface GradientColors {
    primary: string;
    secondary: string;
  }

  interface TypeBackground extends AccentColors {
    // defaults
    default: string;
    paper: string;
    // added
    popup: string;
    navbar: string;
    content: string;
    sidebar: string;
    footer: string;
  }

  interface TypeText extends AccentColors, CommonColors {
    // defaults
    primary: string;
    secondary: string;
    disabled: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    grayscale?: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {}
}

declare module "@emotion/react" {
  // export interface Theme extends Omit<MaterialTheme, "setPaletteMode" | "togglePaletteMode"> {}
  export interface Theme extends MaterialTheme {}
}
