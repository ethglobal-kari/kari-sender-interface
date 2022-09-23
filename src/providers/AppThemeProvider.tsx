import { useCallback, useMemo } from "react";
import { createTheme, CssBaseline, ThemeProvider as MaterialThemeProvider } from "@mui/material";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { observer } from "mobx-react-lite";
import { getDarkTheme } from "src/theme/darkTheme";
import { getLightTheme } from "src/theme/lightTheme";
import { useNextTheme } from "src/hooks/themes";
import { useMounted } from "src/hooks/useMounted";

import type { FC, PropsWithChildren } from "react";
import type { PaletteMode } from "@mui/material";

import "src/utils/string";

export const AppThemeProvider: FC<PropsWithChildren<{}>> = observer(({ children }) => {
  const mounted = useMounted();
  const { theme: _unusedTheme, forcedTheme, resolvedTheme, systemTheme, setTheme } = useNextTheme();

  const setPaletteMode = useCallback(
    (mode: PaletteMode | "system") => {
      setTheme(mode);
    },
    [setTheme],
  );

  const togglePaletteMode = useCallback(() => {
    const newMode = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newMode);
  }, [resolvedTheme, setTheme]);

  const materialTheme = useMemo(() => {
    const darkTheme = createTheme(getDarkTheme());
    const lightTheme = createTheme(getLightTheme());

    switch (forcedTheme ?? resolvedTheme) {
      case "dark":
        return darkTheme;
      case "light":
        return lightTheme;
      default:
        return systemTheme === "light" ? lightTheme : darkTheme;
    }
  }, [forcedTheme, resolvedTheme, systemTheme]);

  const emotionTheme = useMemo(() => {
    return { ...materialTheme };
  }, [materialTheme]);

  const extendedMaterialTheme = useMemo(
    () => ({
      ...materialTheme,
      setPaletteMode,
      togglePaletteMode,
    }),
    [materialTheme, setPaletteMode, togglePaletteMode],
  );

  return (
    <MaterialThemeProvider theme={extendedMaterialTheme}>
      <EmotionThemeProvider theme={emotionTheme}>
        <CssBaseline />
        {mounted && children}
      </EmotionThemeProvider>
    </MaterialThemeProvider>
  );
});
