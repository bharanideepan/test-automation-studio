import React from "react";
import { LinearProgress, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(3),
  },
}));

const AppLinearProgress: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box width={400}>
        <LinearProgress color="secondary" />
      </Box>
    </div>
  );
};

export default AppLinearProgress;
