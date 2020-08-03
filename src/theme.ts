import { createMuiTheme } from "@material-ui/core";

export default createMuiTheme({
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
  },
});
