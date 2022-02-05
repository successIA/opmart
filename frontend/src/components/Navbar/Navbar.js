import * as React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Link,
  styled,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Plus } from "react-feather";
import { useCategoriesQuery } from "../../features/categories/queries";
import CategoryBar from "./CategoryBar";
import { useAuthDialog } from "../../features/accounts/AuthDialogProvider";
import { useLogoutMutation, useUserQuery } from "../../features/accounts/api";
import UserMenu from "./UserMenu";
const Brand = styled("h1")`
  font-weight: 900;
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 0;
`;

function Navbar() {
  const { data: user } = useUserQuery();
  const { mutate } = useLogoutMutation();
  const { data } = useCategoriesQuery();
  const showAuthDialog = useAuthDialog();

  const handleLogout = () => {
    mutate(undefined, { onSuccess: window.location.assign("/") });
  };

  return (
    <Box as="header">
      <Container maxWidth="xl" sx={{ px: 6 }}>
        <Box display="flex" justifyContent="space-between" pt={1}>
          <Link
            component={RouterLink}
            to={`/`}
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            <Brand>OpMart</Brand>
          </Link>

          <Box display="flex" alignItems="center">
            {user ? (
              <>
                <Button
                  component={RouterLink}
                  to="/new-listing"
                  variant="outlined"
                  size="medium"
                  startIcon={<Plus size={20} />}
                  disableElevation
                  sx={{
                    mr: 3,
                    fontWeight: 600,
                    height: "35px",
                    textTransform: "none",
                  }}
                >
                  Add listing
                </Button>
                <UserMenu user={user} onLogout={handleLogout} />
              </>
            ) : (
              <Link
                component="button"
                color="inherit"
                underline="none"
                variant="outlined"
                onClick={() => showAuthDialog("login")}
              >
                <Typography component="span" variant="body1" fontWeight={600}>
                  Log in
                </Typography>
              </Link>
            )}
          </Box>
        </Box>
        <CategoryBar categories={data} />
      </Container>
      <Divider />
    </Box>
  );
}

export default Navbar;
