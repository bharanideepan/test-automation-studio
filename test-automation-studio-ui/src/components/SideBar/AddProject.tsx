import React, { useState, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Button, Box, IconButton } from "@mui/material";
import AppModal from "../AppModal";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { RootState } from "../../store/rootReducer";
import { actions, createProject } from "../../slices/projects";
import AppTextbox from "../AppTextbox";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  input: {
    "& input": {
      height: "38px !important",
    },
  },
}));

const AddProject = () => {
  const classes = useStyles();
  const [projectName, setProjectName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { status } = useSelector((state: RootState) => state.projects);
  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    dispatch(actions.clearStatus());
  };
  const handleSubmit = () => {
    setModalOpen(false);
    dispatch(createProject(projectName));
  };
  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjectName(event.target.value);
  };

  return (
    <Box>
      <IconButton onClick={handleModalOpen} aria-label="Add Project">
        <img src={AddIcon} alt="addIcon" width="14" height="14" />
      </IconButton>
      <AppModal
        open={modalOpen}
        onClose={handleModalClose}
        header={
          <Typography
            variant="h5"
            color="primaryHighlight.main"
            sx={{ fontWeight: 600 }}
          >
            Create Project
          </Typography>
        }
      >
        <Box mb={0.5}>
          <AppTextbox
            placeholder="Enter Project Title"
            value={projectName}
            onChange={handleNameChange}
            classes={{ root: classes.input }}
          />
          <Box mt={2.75}>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                padding: 1.5,
              }}
              onClick={handleSubmit}
              fullWidth
              aria-label="Create Project"
            >
              <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
                Create Project
              </Typography>
            </Button>
          </Box>
        </Box>
      </AppModal>
    </Box>
  );
};

export default AddProject;
