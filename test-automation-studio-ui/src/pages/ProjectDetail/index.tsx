import React, { useState, useEffect, SyntheticEvent } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Header";
import { RootState } from "../../store/rootReducer";
import { Action, Input, Recording, Scrambling, Workflow } from "../../declarations/interface";
import {
  actions,
  getProjectById,
  updateProjectName,
} from "../../slices/project";
import { actions as projectsActions } from "../../slices/projects";
import { generateFlowUrl } from "../../util/UtilService";
import useSnackbar from "../../hooks/useSnackbar";
import ActionContainer from "./ActionContainer";
import FlowContainer from "./FlowContainer";
import TestCaseContaier from "./TestCaseContainer";

type ProjectTab = "TEST_CASES" | "FLOWS" | "ACTIONS";

const useStyles = makeStyles((theme) => ({
  body: {
    maxHeight: "calc(100vh - 116px)",
    overflow: "auto",
    height: "100%",
  },
  contentCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  fullWidth: {
    maxWidth: "100%",
  },
}));

const ProjectDetail = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ProjectTab>("ACTIONS");

  const { notify, hideNotification } = useSnackbar();

  const { project, status } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();

  const handleNameUpdate = (name: string) => {
    dispatch(updateProjectName({ id: projectId, name }));
  };
  const handleTabChange = (_: SyntheticEvent<Element, Event>, tab: string) => {
    const params = { tab: "1" };
    if (tab === "FLOWS") params.tab = "2";
    if (tab === "TEST_CASES") params.tab = "3";
    setSearchParams(params);
  };
  const getCount = () => {
    // if (activeTab === "FLOWS") return project?.workflow_lists?.length || 0;
    // if (activeTab === "TEST_CASES")
    //   return project?.recordings_lists?.length || 0;
    // if (activeTab === "ACTIONS") return project?.scramblings?.length || 0;
    return 0;
  };
  const handleSnackbarClose = () => {
    hideNotification();
    dispatch(actions.clearStatus());
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "1") {
      setActiveTab("ACTIONS");
    } else if (tab === "2") {
      setActiveTab("FLOWS");
    } else if (tab === "3") {
      setActiveTab("TEST_CASES");
    }
  }, [searchParams, setSearchParams, setActiveTab]);

  useEffect(() => {
    dispatch(getProjectById(projectId));
  }, [projectId]);
  
  useEffect(() => {
    if (status) {
      notify({
        message: status.message,
        onClose: handleSnackbarClose,
        type: status.type,
      });
    }
  }, [status]);

  return (
    <Box height="100%">
      {project && (
        <Header
          projectName={project.name}
          projectId={project.id}
          onProjectNameUpdate={handleNameUpdate}
          count={getCount()}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
      )}

      {project && (
        <Box className={classes.body}>
          {activeTab === "FLOWS" && (
            <FlowContainer
              list={project.flows ?? []}
              projectId={project.id}
            />
          )}
          {activeTab === "ACTIONS" && (
            <ActionContainer
              list={project.actions ?? []}
              projectId={project.id}
            />
          )}
          {activeTab === "TEST_CASES" && (
            <TestCaseContaier
              list={project.test_cases ?? []}
              projectId={project.id}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProjectDetail;
