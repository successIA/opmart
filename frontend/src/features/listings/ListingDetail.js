import * as React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useParams } from "react-router";
import CircularProgress from "../../components/CircularProgress";
import { useListingQuery } from "./queries";
import { Edit3 } from "react-feather";

const Image = styled("img")`
  object-fit: cover;
  display: block;
  width: 100%;
  height: 38vh;
  @media (min-width: 600px) {
    height: 500px;
  } ;
`;

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
              src={
                data.images[0]
                  ? data.images[0].large
                  : "https://via.placeholder.com/800x500"
              }
              alt={data.title}
            />
          </Box>
        </Grid>
        <Grid
          item
          sx={{ width: { xs: "100%", md: "400px" } }}
          pl={{ xs: 0, md: 3 }}
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
          <Box mt={2}>
            <Button
              component={RouterLink}
              to={`/edit-listing/${data.id}`}
              variant="outlined"
              color="primary"
              sx={{ textTransform: "none" }}
              fullWidth
              startIcon={<Edit3 size={18} />}
            >
              Edit listing
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingDetail;
