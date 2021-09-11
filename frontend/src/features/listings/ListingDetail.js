import { Box, Container, Grid, styled, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import CircularProgress from "../../components/CircularProgress";
import { useListingQuery } from "./queries";

const Image = styled("img")({
  objectFit: "cover",
  display: "block",
});

const ListingDetail = () => {
  const { listingId } = useParams();
  const { data, isLoading } = useListingQuery(listingId);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="xl" sx={{ mt: 3, px: 5 }}>
      <Grid container spacing={0}>
        <Grid item xs={12} md>
          <Box
            border={(theme) => `1px solid ${theme.palette.grey[400]}`}
            borderRadius={1}
            overflow="hidden"
          >
            <Image
              src="https://via.placeholder.com/800x500"
              width="100%"
              height="100%"
              alt="detail"
            />
          </Box>
        </Grid>
        <Grid
          item
          sx={{ width: { xs: "100%", md: "400px" } }}
          px={{ xs: 0, md: 3 }}
          mb={3}
        >
          <Box mt={{ xs: 3, md: 0 }} mb={2}>
            <Typography variant="h5" component="h2" mb={1}>
              {data.title}
            </Typography>
            <Typography variant="h4">${data.price}</Typography>
          </Box>
          <Box>
            <Typography>{data.description}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingDetail;