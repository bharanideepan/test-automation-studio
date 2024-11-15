import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    border: `0.3px solid ${theme.palette.primary.main}`,
    borderRadius: 3,
    fontWeight: "400 !important",
    fontSize: "14px !important",
    letterSpacing: "-0.02em !important",
    lineHeight: "16px !important",
    width: "100%",
    "& label": {
      lineHeight: "1em"
    },
    "& input": {
      padding: `${theme.spacing(1.375)} !important`,
      height: "38px !important",
      boxSizing: "border-box !important",
    },
    "& textarea": {
      padding: `${theme.spacing(1.375)} !important`,
      boxSizing: "border-box !important",
    },
  },
}));

const AppTextbox: React.FC<TextFieldProps> = ({ ...props }) => {
  const classes = useStyles();
  return (
    <TextField
      {...props}
      classes={{
        root: `${props?.classes?.root} ${classes.root}`,
      }}
    />
  );
};

export default AppTextbox;
