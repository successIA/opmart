import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import NavBar from "./components/NavBar";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
    </ThemeProvider>
  );
}

export default App;
