import { TextField as MuiTextField } from "@mui/material";
import { styled } from "@mui/material";

const TextField = styled(MuiTextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root:not(.Mui-error)": {
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "20px 12px 6px 12px",
  },
  "& .MuiInputBase-multiline": {
    padding: "16.5px 11.5px",
  },
  "& .MuiInputBase-inputMultiline": {
    padding: "10px 0",
  },
  "& .MuiInputLabel-outlined": {
    transform: "translate(12px, 13px) scale(1)",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(12px, 4px) scale(0.75)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    "& legend": {
      maxWidth: "0.01px",
    },
  },
  "& .MuiFormHelperText-contained": {
    marginLeft: 12,
  },
}));

export default TextField;
