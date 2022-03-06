import * as React from "react";
import {
  Box,
  Container,
  Grid,
  styled,
  Tab,
  Tabs as MuiTabs,
  Typography,
} from "@mui/material";
import UserListings from "./UserListings";

const Tabs = styled(MuiTabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: "#1890ff",
  },
});

const Account = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3, px: 5 }}>
      <Grid container spacing={0} flexDirection="column">
        <div>
          <Typography component="h2" variant="h5" mb={2}>
            Account
          </Typography>
        </div>
        <Box sx={{ bgcolor: "background.paper" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
            aria-label="account tabs"
          >
            <Tab label="Selling" sx={{ textTransform: "none" }} />
          </Tabs>
        </Box>
        {value === 0 && <UserListings />}
      </Grid>
    </Container>
  );
};

export default Account;
