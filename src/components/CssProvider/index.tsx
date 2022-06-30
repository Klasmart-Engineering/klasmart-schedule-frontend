import { createGenerateClassName, StylesProvider } from "@material-ui/core";
import React from "react";
import { buildTheme, ThemeProvider } from "@kl-engineering/kidsloop-px";

const generateClassName = createGenerateClassName({
  productionPrefix: "schedule",
  seed: "schedule",
});

// export default function CssProvider(props: { children: React.ReactNode }) {
//   return <StylesProvider generateClassName={generateClassName} disableGeneration>{props.children}</StylesProvider>;
// }

export default function CssProvider(props: { children: React.ReactNode }) {
  const theme = buildTheme({ locale: `en` });

  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </StylesProvider>
  );
}
