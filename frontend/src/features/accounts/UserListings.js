import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  IconButton,
  styled,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Link as RouterLink } from "react-router-dom";
import { Edit3, Trash2 } from "react-feather";
import { useSnackbar } from "notistack";

import { useListingDeleteMutation } from "../listings/queries";
import { useUserListingsQuery, useUserQuery } from "./api";
import CircularProgress from "../../components/CircularProgress";
import { useQueryClient } from "react-query";
import ListingDeleteConfirmDialog from "./ListingDeleteConfirmDialog";

const Image = styled("img")`
  object-fit: cover;
  display: block;
  width: 200px;
  height: 120px;
`;

function UserListings() {
  const { data: user } = useUserQuery();
  const queryClient = useQueryClient();
  const { data: listings, isLoading } = useUserListingsQuery(user.id);
  const { mutate, isLoading: isDeleting } = useListingDeleteMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [listingIdToDelete, setListingIdToDelete] = React.useState();

  const handleListingDelete = () => {
    if (listingIdToDelete) {
      mutate(listingIdToDelete, {
        onSuccess() {
          enqueueSnackbar("Listing has been deleted", {
            variant: "success",
          });
          setListingIdToDelete(null);
          queryClient.invalidateQueries(["userListings", user.id]);
        },
      });
    } else {
      setListingIdToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mb={5}>
      <ListingDeleteConfirmDialog
        isOpen={!!listingIdToDelete}
        onCancel={() => setListingIdToDelete(null)}
        onSubmit={handleListingDelete}
        isSubmitting={isDeleting}
      />
      {listings.map((listing) => (
        <Box
          key={uuidv4()}
          sx={{
            mt: 1,
            border: `1px solid ${grey[200]}`,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Box display="flex">
            <Image src={listing.images[0].small} alt="listing" />
            <Box
              paddingX={2}
              paddingTop={1.5}
              flex={1}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  component="h3"
                  variant="h6"
                  sx={{ wordBreak: "break-all" }}
                >
                  <Link
                    sx={{
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      color: "inherit",
                    }}
                    component={RouterLink}
                    to={`/listings/${listing.id}`}
                  >
                    {listing.title}
                  </Link>
                </Typography>
                <Typography variant="subtitle" sx={{ wordBreak: "break-all" }}>
                  ${listing.price}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="row" pb={0.5}>
                <Box ml="auto">
                  <Tooltip title="Edit">
                    <IconButton
                      component={RouterLink}
                      to={`/edit-listing/${listing.id}`}
                      color="secondary"
                      sx={{ mr: 0.25 }}
                    >
                      <Edit3 size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => setListingIdToDelete(listing.id)}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default UserListings;
