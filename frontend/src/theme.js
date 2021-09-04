import { createMuiTheme } from "@mui/material";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "Public Sans",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default theme;
