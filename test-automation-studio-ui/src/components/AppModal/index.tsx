import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Box, Dialog, DialogProps, IconButton } from "@mui/material";
import CloseIcon from "../../assets/images/cancel-icon-white.svg";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: `${theme.spacing(1.75)} ${theme.spacing(2.5)}`,
    borderBottom: `0.5px solid ${theme.palette.primary40.main}`,
  },
  closeBtn: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: theme.spacing(0.75),
  },
  body: {
    background: theme.palette.background.paper,
    border: `0.5px solid ${theme.palette.primary.main}`,
    borderRadius: 6,
  },
  content: {
    padding: theme.spacing(2.5),
  },
}));

const AppModal: React.FC<{
  open: boolean;
  onClose: DialogProps["onClose"];
  disableEscapeKeyDown?: DialogProps["disableEscapeKeyDown"];
  fullScreen?: DialogProps["fullScreen"];
  fullWidth?: DialogProps["fullWidth"];
  maxWidth?: DialogProps["maxWidth"];
  onBackdropClick?: DialogProps["onBackdropClick"];
  header?: JSX.Element;
}> = ({
  open,
  onClose,
  disableEscapeKeyDown,
  fullScreen,
  fullWidth,
  maxWidth,
  onBackdropClick,
  children,
  header,
}) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onBackdropClick={onBackdropClick}
      BackdropProps={{
        style: {
          background: "rgba(0, 0, 0, 0.75)",
        },
      }}
      PaperProps={{
        style: {
          background: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Box className={classes.closeBtn}>
        <IconButton
          sx={{ padding: 0.5 }}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            onClose && onClose(event, "backdropClick");
          }}
          data-testid="close-app-modal"
        >
          <img src={CloseIcon} alt="close" height="24" width="24" />
        </IconButton>
      </Box>
      <Box className={classes.body}>
        {header && <Box className={classes.header}>{header}</Box>}
        <Box className={classes.content}>{children}</Box>
      </Box>
    </Dialog>
  );
};
AppModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  disableEscapeKeyDown: PropTypes.bool,
  fullScreen: PropTypes.bool,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.any,
  onBackdropClick: PropTypes.func,
  header: PropTypes.any,
};

AppModal.defaultProps = {
  disableEscapeKeyDown: false,
  fullScreen: false,
  fullWidth: true,
  maxWidth: "xs",
};
export default AppModal;
