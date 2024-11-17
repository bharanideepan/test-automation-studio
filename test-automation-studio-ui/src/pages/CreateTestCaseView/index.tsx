import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Header";
import { RootState } from "../../store/rootReducer";
import { getProjectById } from "../../slices/project";
import AppModal from "../../components/AppModal";
import useSnackbar from "../../hooks/useSnackbar";
import SuccessIcon from "../../assets/images/success-tick.svg";

const useStyles = makeStyles((theme) => ({
  body: {
    borderTop: `0.5px solid ${theme.palette.primary40.main}`,
  },
  contentCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
}));

const CreateTestCaseView = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  const [testCaseName, setTestCaseName] = useState("New Test Case");
  const { project } = useSelector((state: RootState) => state.project);
  
  const dispatch = useDispatch();

  const handleSave = () => {
    if (!project) return;
  };

  useEffect(() => {
    dispatch(getProjectById(projectId));
  }, [projectId]);

  return (
    <>
      <Box height="100%">
        {project && (
          <Header
            projectId={project.id}
            projectName={project.name}
            testCaseName={testCaseName}
            onTestCaseNameUpdate={setTestCaseName}
            handleSave={handleSave}
            saveEnabled={false}
          />
        )}
      </Box>
    </>
  );
};

export default CreateTestCaseView;
