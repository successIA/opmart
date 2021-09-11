import * as React from "react";
import { Box, Container, Link, Skeleton, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useListingsQuery } from "./queries";

function ListingCardSkeleton() {
  return (
    <Box>
      <Skeleton variant="rectangular" width="100%" height={160} />
      <Skeleton width="100%" />
      <Skeleton width="30%" />
    </Box>
  );
}

function ListingCard({ item }) {
  return (
    <Link
      sx={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
      }}
      component={RouterLink}
      to={`/listings/${item.id}`}
    >
      <img src="https://via.placeholder.com/170" alt={item.title} />
      <Box my={1}>
        <Typography
          variant="body1"
          color={(theme) => theme.palette.grey[800]}
          fontWeight={600}
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
        >
          {item.title}
        </Typography>
        <Typography variant="body1" color={(theme) => theme.palette.grey[800]}>
          ${item.price}
        </Typography>
      </Box>
    </Link>
  );
}

function ListingList() {
  const { data: listings, isLoading } = useListingsQuery();

  return (
    <Container maxWidth="xl" sx={{ mt: 3, px: 5 }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))"
        gap={2}
      >
        {isLoading
          ? Array(18)
              .fill()
              .map((_, index) => <ListingCardSkeleton key={index} />)
          : listings.map((item) => <ListingCard key={item.id} item={item} />)}
      </Box>
    </Container>
  );
}

export default ListingList;
