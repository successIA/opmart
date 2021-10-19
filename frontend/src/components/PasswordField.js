import { IconButton, InputAdornment } from "@mui/material";
import React from "react";
import { Eye, EyeOff } from "react-feather";
import TextField from "./TextField";

function PasswordField(props) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

export default PasswordField;
