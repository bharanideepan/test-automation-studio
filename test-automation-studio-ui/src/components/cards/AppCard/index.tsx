import React, { Children, useState } from "react";
import PropTypes from "prop-types";
import { Card, Typography, Box, IconButton, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";

import FlowIcon from "../../../assets/images/flow-icon.svg";
import MoreIcon from "../../../assets/images/more-icon.svg";
import AppDeleteMenu from "../../AppDeleteMenu";
import LinkContainer from "../../LinkContainer";
import EditableTextField from "../../EditableTextField";
import constants from "../../../util/constants";

const useStyles = makeStyles((theme) => ({
  container: {
    border: `0.3px solid ${theme.palette.primary.main}`,
    borderRadius: `6px !important`,
    // width: 556, //
  },
  root: {
    cursor: "pointer",
    padding: theme.spacing(1.25),
    boxShadow: "none !important",
    borderRadius: `6px !important`,
    "& .more": {
      visibility: "hidden",
      padding: theme.spacing(0.25),
    },
    "&:hover": {
      backgroundColor: "#F7F8F8",
      "& .more": {
        visibility: "visible",
      },
    },
  },
}));

const AppCard: React.FC<{
  id: string;
}> = ({ id, children }) => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Card
        classes={{
          root: classes.root,
        }}
        aria-label="App Card"
      >
        {children}
      </Card>
    </Box>
  );
};

AppCard.propTypes = {
  id: PropTypes.string.isRequired,
};

export default AppCard;
