import React, { useState } from "react";
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

const FlowCard: React.FC<{
  id: string;
  name: string;
  createdOn: string;
  link: string;
  onClick: () => void;
  onNameUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}> = ({ id, name, createdOn, link, onClick, onNameUpdate, onDelete }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onDelete(id);
    setAnchorEl(null);
  };
  return (
    <Box className={classes.container}>
      <Card
        classes={{
          root: classes.root,
        }}
        onClick={onClick}
        aria-label="Flow Card"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <img src={FlowIcon} alt="icon" height="32" width="32" />
          <Box>
            <IconButton
              className="more"
              onClick={handleClick}
              aria-label="More"
            >
              <img src={MoreIcon} alt="icon" height="20" width="20" />
            </IconButton>
            <AppDeleteMenu
              anchorEl={anchorEl}
              open={open}
              handleClose={handleClose}
              handleDelete={handleDelete}
              name={name}
              type="FLOW"
            />
          </Box>
        </Box>
        <Box mt={3.25} display="flex" flexDirection="column" gap="4px">
          <EditableTextField
            value={name}
            onSubmit={(value: string) => {
              onNameUpdate(id, value);
            }}
          />
          <Typography variant="body1" color="primary">
            Created on {moment(createdOn).format(constants.dateDisplayFormat)}
          </Typography>
        </Box>
      </Card>
      <Divider />
      <Box px={1.25} pt={1.25} pb={2.375}>
        <LinkContainer link={link} />
      </Box>
    </Box>
  );
};

FlowCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  createdOn: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FlowCard;
