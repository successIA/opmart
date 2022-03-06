import * as React from "react";
import {
  MenuItem,
  Typography,
  styled,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  Paper,
  ButtonBase,
} from "@mui/material";
import useWindowSize from "../../hooks/useWindowSize";
import { css } from "@mui/styled-engine";
import { grey } from "@mui/material/colors";

const AVAILABLE_SPACE_RATIO = 0.7638;

const NavUl = styled("ul")`
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;
  justify-content: space-between;
  white-space: nowrap;
  margin: 0;
  padding: 0;
`;

const NavLi = styled("li")(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    padding: ${theme.spacing(1)} 0 0;
  `
);

const findLastVisibleItemIndex = (navbarWidth, widthList) => {
  let widthTotal = 0;
  for (let i = 0; i < widthList.length; i++) {
    widthTotal += widthList[i];

    if (widthTotal / navbarWidth > AVAILABLE_SPACE_RATIO) {
      return i;
    }
  }

  return widthList.length;
};

const FlyoutMenu = React.forwardRef(function FlyoutMenu(props, ref) {
  const { open, onClose, categories } = props;

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      onClose(false);
    } else if (event.key === "Escape") {
      onClose(false);
    }
  }

  return (
    <Popper
      open={open}
      anchorEl={ref.current}
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
            sx={{ border: `1px solid ${grey[300]}`, minWidth: 200, mt: 0.185 }}
          >
            <ClickAwayListener onClickAway={onClose}>
              <MenuList
                id="flyout-menu"
                aria-labelledby="flyout-button"
                onKeyDown={handleListKeyDown}
                dense
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} onClick={onClose}>
                    {category.name}
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
});

function CategoryBar({ categories }) {
  const navbarRef = React.useRef([]);
  const navItemWidthListRef = React.useRef([]);

  const [lastVisibleItemIndex, setLastVisibileItemIndex] = React.useState(
    categories.length
  );

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const [width, height] = useWindowSize();

  React.useLayoutEffect(() => {
    const index = findLastVisibleItemIndex(
      navbarRef.current.offsetWidth,
      navItemWidthListRef.current
    );

    if (index !== lastVisibleItemIndex) {
      setLastVisibileItemIndex(index);
    }
  }, [lastVisibleItemIndex, width, height]);

  const handleNavItemListRef = (navItemNode) => {
    if (navItemNode && navItemWidthListRef.length !== categories.length) {
      navItemWidthListRef.current.push(navItemNode.offsetWidth);
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = React.useRef(open);

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const menuCategories = categories.slice(
    lastVisibleItemIndex,
    categories.length
  );

  return (
    <nav ref={navbarRef}>
      <NavUl>
        {categories.slice(0, lastVisibleItemIndex).map((category) => (
          <NavLi key={category.id} ref={handleNavItemListRef}>
            <Typography variant="body2">{category.name}</Typography>
          </NavLi>
        ))}

        {lastVisibleItemIndex < categories.length ? (
          <NavLi sx={{ py: 0 }} onMouseLeave={() => setOpen(false)}>
            <ButtonBase
              ref={anchorRef}
              id="flyout-button"
              aria-controls={open ? "flyout-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={() => setOpen(true)}
              onMouseEnter={() => setOpen(true)}
              disableRipple
              sx={{ height: "100%" }}
            >
              <Typography variant="body2">More</Typography>
            </ButtonBase>
            <FlyoutMenu
              open={open}
              onClose={handleClose}
              categories={menuCategories}
              ref={anchorRef}
            />
          </NavLi>
        ) : null}
      </NavUl>
    </nav>
  );
}

export default CategoryBar;
