import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent as MuiDialogContent,
  IconButton,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { X as IconX } from "react-feather";
import { useTheme } from "@emotion/react";

const CancelIconButton = styled(IconButton)({
  position: "absolute",
  right: 9,
  top: 11,
  color: (theme) => theme.palette.grey[500],
});

const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  padding: `0 ${theme.spacing(1.5)} ${theme.spacing(3)}`,
  paddingTop: 0,
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
}));

function ListingDeleteConfirmDialog({
  isOpen,
  onCancel,
  onSubmit,
  isSubmitting,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="xs"
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="responsive-dialog-title"
    >
      <Box sx={{ py: 2, px: 1.5 }} id="responsive-dialog-title">
        <Typography variant="h5" component="h2">
          Delete listing?
        </Typography>
        <CancelIconButton aria-label="close" onClick={onCancel}>
          <IconX />
        </CancelIconButton>
      </Box>
      <DialogContent>
        <Typography variant="body1" component="p">
          Are you sure you want to delete this listing?
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "center", py: 1, px: 1.5, display: "flex" }}
      >
        <Button
          color="secondary"
          onClick={onCancel}
          sx={{ ml: "auto" }}
          autoFocus
        >
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ListingDeleteConfirmDialog;
