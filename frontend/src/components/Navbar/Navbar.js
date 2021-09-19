import * as React from "react";
import { Box, Container, Divider, Link, styled } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useCategoriesQuery } from "../../features/categories/queries";
import CategoryBar from "./CategoryBar";

const Brand = styled("h1")`
  font-weight: 900;
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 0;
`;

function Navbar() {
  const { data } = useCategoriesQuery();

  return (
    <Box as="header">
      <Container maxWidth="xl" sx={{ px: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
          <Link
            component={RouterLink}
            to={`/`}
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            <Brand>OpMart</Brand>
          </Link>
        </Box>
        <CategoryBar categories={data} />
      </Container>
      <Divider />
    </Box>
  );
}

export default Navbar;
