import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import SideBar from "../../components/SideBar";

const AppLayout: React.FC = () => {
  return (
    <Box height="100%" sx={{ display: "flex" }}>
      <SideBar />
      <Box height="100%" width="100%">
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
