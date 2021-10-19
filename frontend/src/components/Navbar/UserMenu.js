import {
  Box,
  ClickAwayListener,
  Divider,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  styled,
  Typography,
} from "@mui/material";
import * as React from "react";
import { grey } from "@mui/material/colors";
import { getInitials, getName } from "../../utils/user";

const UserAvatar = styled(
  React.forwardRef((props, ref) => (
    <Box as="button" sx={{ typography: "body2" }} {...props} ref={ref} />
  ))
)({
  border: "none",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: "#000",
  color: "#fff",
  fontWeight: 600,
});

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = React.useState(false);
  const prevOpen = React.useRef(open);
  const anchorRef = React.useRef(null);

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

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      handleClose(false);
    } else if (event.key === "Escape") {
      handleClose(false);
    }
  }

  function handleLogoutClick(event) {
    handleClose(event);
    onLogout();
  }

  return (
    <Box>
      <UserAvatar
        width={35}
        height={35}
        ref={anchorRef}
        onClick={() => setOpen(!open)}
      >
        {getInitials(user)}
      </UserAvatar>
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
              sx={{
                border: `1px solid ${grey[300]}`,
                width: 250,
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Box display="flex" alignItems="center" p={1.5}>
                    <Box flexBasis={60}>
                      <UserAvatar
                        width={60}
                        height={60}
                        sx={{ typography: "h5" }}
                        mr={1}
                        onClick={() => setOpen(!open)}
                      >
                        {getInitials(user)}
                      </UserAvatar>
                    </Box>
                    <Box display="flex" flexDirection="column" maxWidth="155px">
                      <Typography
                        component="div"
                        variant="subtitle1"
                        fontWeight={600}
                        noWrap
                      >
                        {getName(user)}
                      </Typography>
                      <Typography variant="caption" color="GrayText" noWrap>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />
                  <MenuList
                    id="user-menu"
                    aria-labelledby="user-menu-button"
                    onKeyDown={handleListKeyDown}
                    dense
                    sx={{ py: 0 }}
                  >
                    <MenuItem
                      sx={{ px: 1.5 }}
                      key="Log out"
                      onClick={handleLogoutClick}
                    >
                      Log out
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

export default UserMenu;
