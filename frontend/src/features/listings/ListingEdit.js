import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router";

import ListingForm from "./ListingForm";
import CircularProgress from "../../components/CircularProgress";
import { useListingQuery, useListingUpdateMutation } from "./queries";
import { useSnackbar } from "notistack";

function ListingEdit() {
  const { listingId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useListingQuery(listingId);
  const { mutate, isLoading: isUpdating } = useListingUpdateMutation(listingId);

  const handleSuccess = () => {
    enqueueSnackbar("Listing has been updated", {
      variant: "success",
    });
  };

  const handleSubmit = (payload) => {
    mutate(payload, {
      onSuccess: handleSuccess,
    });
  };

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );

  const listing = {
    images: data.images,
    title: data.title,
    price: data.price,
    category: data.category.id,
    condition: data.condition,
    description: data.description,
  };

  return (
    <ListingForm
      listing={listing}
      heading="Edit Listing"
      submitButtonText="Update Listing"
      onSubmit={handleSubmit}
      isSubmitting={isUpdating}
    />
  );
}

export default ListingEdit;
