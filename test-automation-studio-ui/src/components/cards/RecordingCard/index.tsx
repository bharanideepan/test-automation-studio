import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Typography, Box, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";

import RecordingIcon from "../../../assets/images/recordings-icon.svg";
import MoreIcon from "../../../assets/images/more-icon.svg";
import AppDeleteMenu from "../../AppDeleteMenu";
import EditableTextField from "../../EditableTextField";
import constants from "../../../util/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    border: `0.3px solid ${theme.palette.primary.main}`,
    borderRadius: `6px !important`,
    padding: theme.spacing(1.5),
    boxShadow: "none !important",
    cursor: "pointer",
    // width: 270, //
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

const RecordingCard: React.FC<{
  id: string;
  name: string;
  createdOn: string;
  onClick: () => void;
  onNameUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}> = ({ id, name, createdOn, onClick, onNameUpdate, onDelete }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
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
    <Card
      classes={{
        root: classes.root,
      }}
      onClick={onClick}
      aria-label="Recording Card"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <img src={RecordingIcon} alt="icon" height="32" width="32" />
        <Box>
          <IconButton
            className="more"
            onClick={handleMoreClick}
            aria-label="More"
          >
            <img src={MoreIcon} alt="icon" height="20" width="20" />
          </IconButton>
          <AppDeleteMenu
            anchorEl={anchorEl}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
            type="RECORDING"
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
  );
};

RecordingCard.propTypes = {
  name: PropTypes.string.isRequired,
  createdOn: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RecordingCard;
