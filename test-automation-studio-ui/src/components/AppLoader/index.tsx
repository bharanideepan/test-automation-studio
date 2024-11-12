import React from "react";
import PropTypes from "prop-types";
import { Backdrop, CircularProgress } from "@mui/material";

const LOADER_DATA: any = {
  CIRCULAR: <CircularProgress color="inherit" />,
};

const AppLoader: React.FC<{
  show: boolean;
  type: string;
}> = ({ show, type }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={show}
    >
      {LOADER_DATA[type]}
    </Backdrop>
  );
};

AppLoader.propTypes = {
  show: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(["CIRCULAR"]).isRequired,
};

AppLoader.defaultProps = {
  type: "CIRCULAR",
};

export default AppLoader;
