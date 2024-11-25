import React, { useState, useEffect, SyntheticEvent } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Header";
import { RootState } from "../../store/rootReducer";
import {
  actions,
  getProjectById,
  updateProjectName,
} from "../../slices/project";
import useSnackbar from "../../hooks/useSnackbar";
import ActionContainer from "./ActionContainer";
import FlowContainer from "./FlowContainer";
import TestCaseContainer from "./TestCaseContainer";
import { getPagesByProjectId, actions as pageActions } from "../../slices/pages";
import SelectorContainer from "./SelectorContainer";

type ProjectTab = "TEST_CASES" | "FLOWS" | "ACTIONS" | "XPATHS";

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
  const [activeTab, setActiveTab] = useState<ProjectTab>("TEST_CASES");

  const { notify, hideNotification } = useSnackbar();

  const { project, status } = useSelector((state: RootState) => state.project);
  const { pages, status: pageStatus } = useSelector((state: RootState) => state.pages);
  const dispatch = useDispatch();

  const handleNameUpdate = (name: string) => {
    dispatch(updateProjectName({ id: projectId, name }));
  };
  const handleTabChange = (_: SyntheticEvent<Element, Event>, tab: string) => {
    const params = { tab: "TEST_CASES" };
    if (tab === "FLOWS") params.tab = "FLOWS";
    if (tab === "ACTIONS") params.tab = "ACTIONS";
    if (tab === "XPATHS") params.tab = "XPATHS";
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
    dispatch(pageActions.clearStatus());
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "ACTIONS") {
      setActiveTab("ACTIONS");
    } else if (tab === "FLOWS") {
      setActiveTab("FLOWS");
    } else if (tab === "TEST_CASES") {
      setActiveTab("TEST_CASES");
    } else if (tab === "XPATHS") {
      setActiveTab("XPATHS");
    }
  }, [searchParams, setSearchParams, setActiveTab]);

  useEffect(() => {
    dispatch(getProjectById(projectId));
    dispatch(getPagesByProjectId(projectId));
  }, [projectId, activeTab]);

  useEffect(() => {
    const notifyStatus = status ?? pageStatus;
    if (notifyStatus) {
      notify({
        message: notifyStatus.message,
        onClose: handleSnackbarClose,
        type: notifyStatus.type,
      });
    }
  }, [status, pageStatus]);

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
            <TestCaseContainer
              list={project.testCases ?? []}
              projectId={project.id}
            />
          )}
          {activeTab === "XPATHS" && (
            <SelectorContainer
              list={pages ?? []}
              projectId={project.id}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProjectDetail;
