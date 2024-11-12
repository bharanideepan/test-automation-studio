import React, { useState } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import MuiDrawer from "@mui/material/Drawer";
import {
  Typography,
  Divider,
  Box,
  Avatar,
  Button,
  Popover,
  IconButton,
} from "@mui/material";
import TreeView from "../../components/TreeView";
import AppProject from "./AddProject";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: `${theme.palette.background.secondaryLight} !important`,
    border: "0 !important",
  },
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SideBar = () => {
  const classes = useStyles();

  return (
    <Drawer variant="permanent" open={true} classes={classes}>
      <Box px={2} pt={2} pb={1.25}>
        <Box display="flex" alignItems="center" gap="12px" mb={1.25}>
          {/* {user && <Profile user={user} onLogout={logout} />} */}
          <Box>
            <Typography variant="h5" color="primaryHighlight.main">
              Test Automation Studio UI
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={0.5}
        >
          <Typography variant="subtitle2" color="primary">
            PROJECTS
          </Typography>
          <AppProject />
        </Box>
      </Box>
      <TreeView />
    </Drawer>
  );
};

export default SideBar;
