import * as React from "react";
import {
  Box,
  Button,
  ClickAwayListener,
  Container,
  Divider,
  Grid,
  Grow,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  styled,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Link as RouterLink } from "react-router-dom";
import { Edit3, Trash2, MoreHorizontal } from "react-feather";
import { useHistory, useParams } from "react-router";

import CircularProgress from "../../components/CircularProgress";
import { useListingQuery } from "./queries";
import { useListingDeleteMutation } from "./queries";
import { useSnackbar } from "notistack";
import { useUserQuery } from "../accounts/api";
import ListingDeleteConfirmDialog from "../accounts/ListingDeleteConfirmDialog";

const Image = styled("img")`
  object-fit: cover;
  display: block;
  width: 100%;
  height: 38vh;
  @media (min-width: 600px) {
    height: 500px;
  } ;
`;

function ManageMenu({ listingId }) {
  const [open, setOpen] = React.useState(false);
  const prevOpen = React.useRef(open);
  const anchorRef = React.useRef(null);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate, isLoading: isDeleting } = useListingDeleteMutation();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      handleClose(false);
    } else if (event.key === "Escape") {
      handleClose(false);
    }
  };

  const handleListingDelete = () => {
    mutate(listingId, {
      onSuccess: () => {
        history.replace("/");
        enqueueSnackbar("Listing has been deleted", {
          variant: "success",
        });
      },
    });
  };

  const handleDeleteMenuItemClick = (event) => {
    setShowConfirmDialog(true);
    handleClose(event);
  };

  return (
    <Box>
      <IconButton
        ref={anchorRef}
        onClick={() => setOpen(!open)}
        sx={{ mb: -1.1 }}
      >
        <MoreHorizontal size={20} />
      </IconButton>

      <ListingDeleteConfirmDialog
        isOpen={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onSubmit={handleListingDelete}
        isSubmitting={isDeleting}
      />

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "right top" : "right bottom",
            }}
          >
            <Paper
              elevation={1}
              sx={{ border: `1px solid ${grey[300]}`, zIndex: 40 }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <MenuList
                    id="user-menu"
                    aria-labelledby="user-menu-button"
                    onKeyDown={handleListKeyDown}
                    dense
                    sx={{ py: 0 }}
                  >
                    <MenuItem
                      sx={{ px: 1.5 }}
                      key="Edit Listing"
                      onClick={handleDeleteMenuItemClick}
                    >
                      <ListItemIcon>
                        <Trash2 size={18} />
                      </ListItemIcon>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}

const ListingDetail = () => {
  const { listingId } = useParams();
  const { data, isLoading } = useListingQuery(listingId);
  const { data: user } = useUserQuery();

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
            <Image src={data.images[0].large} alt={data.title} />
          </Box>
        </Grid>
        <Grid
          item
          sx={{ width: { xs: "100%", md: "400px" } }}
          pl={{ xs: 0, md: 3 }}
          mb={3}
        >
          <Box>
            <Typography
              variant="h5"
              component="h2"
              mb={1}
              sx={{ wordBreak: "break-all" }}
            >
              {data.title}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="end"
              mb={1}
              mt={2}
            >
              <Box mt={{ xs: 3, md: 0 }} mb={0}>
                <Typography
                  variant="h4"
                  lineHeight={1}
                  sx={{ wordBreak: "break-all" }}
                >
                  ${data.price}
                </Typography>
              </Box>
              {user && (
                <Box display="flex" alignItems="end">
                  <Box display="flex" mb={-0.6}>
                    <Button
                      component={RouterLink}
                      to={`/edit-listing/${data.id}`}
                      color="secondary"
                      sx={{
                        textTransform: "none",
                        mr: 0.5,
                        border: 0,
                        fontWeight: 600,
                      }}
                      startIcon={<Edit3 size={16} />}
                      size="small"
                    >
                      Edit
                    </Button>
                  </Box>
                  <Box sx={{ mr: -1 }}>
                    <ManageMenu listingId={data.id} />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Divider sx={{ mt: 2 }} />

          <Box mt={2}>
            <Typography>{data.description}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingDetail;
