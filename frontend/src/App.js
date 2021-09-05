import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import NavBar from "./components/NavBar";
import ListingList from "./features/listings/ListingList";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <ListingList />
    </ThemeProvider>
  );
}

export default App;
