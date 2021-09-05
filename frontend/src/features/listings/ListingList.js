import { Box, Container, Link, Typography, useTheme } from "@mui/material";
import React from "react";
import listings from "./data";

function ListingList() {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ mt: 3, px: 5 }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))"
        gap={2}
      >
        {listings.map((item) => (
          <Link
            sx={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
            }}
            href="#"
            key={item.title}
          >
            <img src={item.image} alt={item.title} />
            <Box my={1}>
              <Typography
                variant="body1"
                color={theme.palette.grey[800]}
                fontWeight={600}
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
              >
                {item.title}
              </Typography>
              <Typography variant="body1" color={theme.palette.grey[800]}>
                ${item.price}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
    </Container>
  );
}

export default ListingList;
