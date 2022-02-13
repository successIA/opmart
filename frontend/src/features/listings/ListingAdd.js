import { useSnackbar } from "notistack";
import React from "react";
import { useHistory } from "react-router";
import ListingForm from "./ListingForm";
import { useListingCreateMutation } from "./queries";

const ListingAdd = () => {
  const { mutate, isLoading } = useListingCreateMutation();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const handleSuccess = (data) => {
    enqueueSnackbar("Your item has been successfully listed", {
      variant: "success",
    });
    history.replace(`/listings/${data.id}`);
  };

  const handleSubmit = (payload) => {
    mutate(payload, {
      onSuccess: handleSuccess,
    });
  };

  return (
    <ListingForm
      listing={{
        images: [],
        title: "",
        price: "",
        category: "",
        condition: "",
        description: "",
      }}
      heading="New Listing"
      submitButtonText="Add Listing"
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
    />
  );
};

export default ListingAdd;
