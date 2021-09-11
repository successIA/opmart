import * as React from "react";
import MuiCircularProgress from "@mui/material/CircularProgress";
import circularProgressClasses from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

function CircularProgress(props) {
  return (
    <Box sx={{ position: "relative" }}>
      <MuiCircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <MuiCircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) =>
            theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

export default CircularProgress;
