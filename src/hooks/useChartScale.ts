import { useMediaQuery, useTheme } from "@material-ui/core";
import { useMemo } from "react";

export function useChartScale() {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  return useMemo(
    () => (scale: number) => {
      if (xs) return 3 * scale;
      if (sm) return 2 * scale;
      return scale;
    },
    [xs, sm]
  );
}
