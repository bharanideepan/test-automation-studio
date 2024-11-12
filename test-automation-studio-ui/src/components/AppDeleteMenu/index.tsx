import React, { useState } from "react";
import { Box, Button, Typography, MenuItem, MenuProps } from "@mui/material";
import AppMenu from "../AppMenu";
import AppModal from "../AppModal";
import DeleteIcon from "../../assets/images/delete-icon.svg";

const AppDeleteMenu: React.FC<{
  anchorEl: MenuProps["anchorEl"];
  open: MenuProps["open"];
  handleClose: MenuProps["onClose"];
  handleDelete: (event: React.MouseEvent<HTMLElement>) => void;
  type: "PROJECT" | "PROJECTS" | "RECORDING" | "RECORDINGS" | "FLOW" | "FLOWS";
  name?: string;
}> = ({ anchorEl, open, handleClose, handleDelete, type, name }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setModalOpen(true);
  };
  const handleModalClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setModalOpen(false);
    handleClose && handleClose(event, "backdropClick");
  };
  const confirmDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handleDelete(event);
    setModalOpen(false);
  };

  return (
    <>
      {open && (
        <Box>
          <AppMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleModalOpen} data-testid="delete-menu">
              <img src={DeleteIcon} alt="delete" width="18" height="18" />
              <Typography variant="subtitle1">Delete</Typography>
            </MenuItem>
          </AppMenu>
          <AppModal
            open={modalOpen}
            onClose={handleModalClose}
            header={
              <Typography
                variant="h5"
                color="primaryHighlight.main"
                sx={{ fontWeight: 600 }}
              >
                DELETE {type}
              </Typography>
            }
          >
            <Box mb={0.5}>
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: 400, textAlign: "center" }}
              >
                Are you sure that you want to delete the {type.toLowerCase()}{" "}
                {name && <b>({name})</b>} ?
              </Typography>
              <Box display="flex" flexDirection="column" gap="8px" mt={2.75}>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    padding: 1.5,
                  }}
                  onClick={handleModalClose}
                >
                  <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
                    Cancel
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    padding: 1.5,
                  }}
                  onClick={confirmDelete}
                  aria-label="Confirm delete"
                >
                  <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
                    Delete {type.toLowerCase()}
                  </Typography>
                </Button>
              </Box>
            </Box>
          </AppModal>
        </Box>
      )}
    </>
  );
};

export default AppDeleteMenu;
