import { createTheme } from "@material-ui/core";

export default createTheme({
  palette: {
    primary: {
      main: "#0E78D5",
    },
    secondary: {
      main: "#9C27B0",
    },
    error: {
      main: "#D32F2F",
    },
    success: {
      main: "#4CAF50",
    },
    warning: {
      main: "#FFC107",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
    fontFamily: `"Source Han Sans SC", -apple-system, "Segoe UI", Helvetica, sans-serif`,
  },
  props: {
    MuiTextField: {
      variant: "outlined",
    },
  },
  overrides: {
    MuiFormLabel: {
      asterisk: {
        color: "#D32F2F",
      },
    },
  },
});
