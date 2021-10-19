import { createTheme } from "@mui/material";
import { css } from "@mui/styled-engine";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: css`
        html {
          height: 100%;
        }
        body {
          height: 100%;
        }
        #root {
          height: 100%;
        }
      `,
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 992,
      lg: 1200,
      xl: 1536,
    },
  },
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
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
});

export default theme;
