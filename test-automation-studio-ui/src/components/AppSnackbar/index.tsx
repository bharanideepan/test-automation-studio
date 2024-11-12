import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Snackbar, Box, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import CloseIcon from "../../assets/images/cancel-icon-white.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: 3,
    padding: `${theme.spacing(1)} ${theme.spacing(6.25)}`,
    color: "",
    "&.SUCCESS": {
      backgroundColor: theme.palette.success.main,
    },

    "&.FAILURE": {
      backgroundColor: theme.palette.error.main,
    },

    "&.ERROR": {
      backgroundColor: theme.palette.warning.main,
    },
  },
  closeBtn: {
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    top: 0,
    right: 0,
  },
}));

const AppSnackbar: React.FC<{
  open: boolean;
  onClose: () => void;
  type: "SUCCESS" | "FAILURE" | "ERROR";
  message: string;
  autoHideDuration?: number;
}> = ({ open, onClose, type, message, autoHideDuration }) => {
  const classes = useStyles();
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Box className={clsx(classes.root, type)}>
        <Typography variant="h5" color="white">
          {message}
        </Typography>
        <Box className={classes.closeBtn}>
          <IconButton onClick={onClose} aria-label="Snackbar Close">
            <img src={CloseIcon} alt="close" width="14" height="14" />
          </IconButton>
        </Box>
      </Box>
    </Snackbar>
  );
};

AppSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.any.isRequired,
  message: PropTypes.string.isRequired,
  autoHideDuration: PropTypes.number,
};

AppSnackbar.defaultProps = {
  autoHideDuration: 3000,
};

export default AppSnackbar;
