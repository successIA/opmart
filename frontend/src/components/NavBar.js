import { Box, Container, Divider, Typography } from "@mui/material";
import React from "react";
import { categoryData } from "../data/categories";

function NavBar() {
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
              {categoryData.map((category) => (
                <Box as="li">
                  <Typography variant="body2">{category}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
        <Divider />
      </Box>
    </Box>
  );
}

export default NavBar;
