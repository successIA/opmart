import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
  IconButton,
  DialogContent as MuiDialogContent,
  Dialog,
  Typography,
  Box,
  DialogActions,
  styled,
} from "@mui/material";
import { X as IconX } from "react-feather";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import ButtonLink from "../../components/ButtonLink";

const CancelIconButton = styled(IconButton)({
  position: "absolute",
  right: 12,
  top: 11,
  color: (theme) => theme.palette.grey[500],
});

const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  paddingTop: 0,
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
}));

export default function AuthDialog({ isOpen, show, hide, mode }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSuccess = () => {
    hide();
    window.location.assign("/");
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="xs"
      open={isOpen}
      onClose={hide}
      aria-labelledby="responsive-dialog-title"
    >
      <Box sx={{ py: 2, px: 3 }} id="responsive-dialog-title">
        <Typography variant="h5" component="h2">
          {mode === "login" ? "Login" : "Create an account"}
        </Typography>
        <CancelIconButton aria-label="close" onClick={hide}>
          <IconX />
        </CancelIconButton>
      </Box>
      <DialogContent>
        {mode === "login" ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Typography as="p" variant="subtitle2">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <ButtonLink
                sx={{ fontWeight: 600 }}
                onClick={() => show("register")}
              >
                Sign up
              </ButtonLink>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <ButtonLink
                sx={{ fontWeight: 600 }}
                onClick={() => show("login")}
              >
                Login
              </ButtonLink>
            </>
          )}
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
