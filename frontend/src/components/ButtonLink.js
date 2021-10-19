import { Link, styled } from "@mui/material";
import React from "react";

const ButtonLink = styled((props) => (
  <Link component="button" fontSize="inherit" underline="none" {...props} />
))({
  fontFamily: "inherit",
  verticalAlign: "inherit",
  userSelect: "text",
  lineHeight: "inherit",
  fontWeight: "inherit",
});

export default ButtonLink;
