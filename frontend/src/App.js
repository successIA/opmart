import { QueryClient, QueryClientProvider } from "react-query";
import { Box, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListingList from "./features/listings/ListingList";
import theme from "./theme";
import ListingDetail from "./features/listings/ListingDetail";
import { useCategoriesQuery } from "./features/categories/queries";
import CircularProgress from "./components/CircularProgress";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoute = () => {
  const { isLoading } = useCategoriesQuery();

  if (isLoading) {
    return (
      <Box
        display="flex"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={ListingList} />
        <Route path="/listings/:listingId" component={ListingDetail} />
      </Switch>
    </Router>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoute />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
