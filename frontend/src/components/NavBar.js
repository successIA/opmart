import React from "react";
import { Box, Container, Divider, Skeleton, Typography } from "@mui/material";
import { useCategoriesQuery } from "../features/categories/queries";

function Navbar() {
  const { data: categories, status } = useCategoriesQuery();

  return (
    <Box>
      <Box as="header">
        <Container maxWidth="xl" sx={{ px: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box as="h1" sx={{ fontWeight: 900, fontSize: "2rem", my: 0 }}>
              OpMart
            </Box>
          </Box>
          <Box as="nav">
            <Box
              as="ul"
              sx={{
                display: "flex",
                listStyleType: "none",
                justifyContent: "space-between",
                my: "0.6rem",
                mx: 0,
                px: 0,
              }}
            >
              {status === "loading" ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width="100%"
                  height={30}
                />
              ) : (
                categories.map((category) => (
                  <Box as="li" key={category.id}>
                    <Typography variant="body2">{category.name}</Typography>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Container>
        <Divider />
      </Box>
    </Box>
  );
}

export default Navbar;
