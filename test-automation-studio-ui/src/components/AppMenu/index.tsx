import React from "react";
import { Menu, MenuProps, styled } from "@mui/material";

const AppMenu = styled((props: MenuProps) => (
  <Menu
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 3,
    minWidth: 180,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
    border: `0.3px solid ${theme.palette.primary.main}`,
    "& .MuiMenu-list": {
      padding: 0,
    },
    "& .MuiMenuItem-root": {
      padding: `${theme.spacing(0.75)} ${theme.spacing(1.25)}`,
      gap: "2px",
      alignItems: "center",
    },
  },
}));

export default AppMenu;
