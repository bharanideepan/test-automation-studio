import React, { useState, useEffect, SyntheticEvent } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Header";
import { RootState } from "../../store/rootReducer";
import useSnackbar from "../../hooks/useSnackbar";
import ActionContainer from "./ActionContainer";
import FlowContainer from "./FlowContainer";
import TestCaseContainer from "./TestCaseContainer";
import SelectorContainer from "./SelectorContainer";
import {
  actions as projectActions,
  getProjectById,
  updateProjectName,
} from "../../slices/project";
import { getByProjectId as getFlowsByProjectId, actions as flowsActions } from "../../slices/flows";
import { actions as projectsActions } from "../../slices/projects";
import { actions as flowActions } from "../../slices/flow";
import { actions as testCaseActions } from "../../slices/testCase";
import { actions as testCaseRunActions } from "../../slices/testCaseRun";
import { getByProjectId as getActionsByProjectId, actions as actionsActions } from "../../slices/actions";
import { getByProjectId as getTestCasesByProjectId, actions as testCasesActions } from "../../slices/testCases";
import { getByProjectId as getPagesByProjectId, actions as pagesActions } from "../../slices/pages";
import { getByProjectId as getTagsByProjectId, actions as tagsActions } from "../../slices/tags";

type ProjectTab = "TEST_CASES" | "FLOWS" | "ACTIONS" | "XPATHS" | "TAGS";

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

  const { project, status: projectStatus } = useSelector((state: RootState) => state.project);
  const { status: projectsStatus } = useSelector((state: RootState) => state.projects);
  const { pages, status: pageStatus } = useSelector((state: RootState) => state.pages);
  const { status: actionsStatus } = useSelector((state: RootState) => state.actions);
  const { status: flowsStatus } = useSelector((state: RootState) => state.flows);
  const { status: flowStatus } = useSelector((state: RootState) => state.flow);
  const { status: testCasesStatus } = useSelector((state: RootState) => state.testCases);
  const { status: testCaseRunStatus } = useSelector((state: RootState) => state.testCaseRun);
  const { status: testCaseStatus } = useSelector((state: RootState) => state.testCase);
  const { status: tagsStatus } = useSelector((state: RootState) => state.tags);
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
    dispatch(projectActions.clearStatus())
    dispatch(flowsActions.clearStatus())
    dispatch(projectsActions.clearStatus())
    dispatch(flowActions.clearStatus())
    dispatch(testCaseActions.clearStatus())
    dispatch(testCaseRunActions.clearStatus())
    dispatch(actionsActions.clearStatus())
    dispatch(testCasesActions.clearStatus())
    dispatch(pagesActions.clearStatus())
    dispatch(tagsActions.clearStatus())
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
    } else if (tab === "TAGS") {
      setActiveTab("TAGS");
    }
  }, [searchParams, setSearchParams, setActiveTab]);

  useEffect(() => {
    dispatch(getProjectById(projectId));
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      dispatch(getFlowsByProjectId(projectId));
      dispatch(getActionsByProjectId(projectId));
      dispatch(getPagesByProjectId(projectId));
      dispatch(getTestCasesByProjectId(projectId));
      dispatch(getTagsByProjectId(projectId));
    }
  }, [projectId]);

  useEffect(() => {
    const notifyStatus =
      projectStatus
      ?? projectsStatus
      ?? pageStatus
      ?? actionsStatus
      ?? flowsStatus
      ?? flowStatus
      ?? testCasesStatus
      ?? testCaseRunStatus
      ?? testCaseStatus
      ?? tagsStatus

    if (notifyStatus) {
      notify({
        message: notifyStatus.message,
        onClose: handleSnackbarClose,
        type: notifyStatus.type,
      });
    }
  }, [projectStatus,
    projectsStatus,
    pageStatus,
    actionsStatus,
    flowsStatus,
    flowStatus,
    testCasesStatus,
    testCaseRunStatus,
    testCaseStatus,
    tagsStatus]);

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
              // list={project.flows ?? []}
              projectId={project.id}
            />
          )}
          {activeTab === "ACTIONS" && (
            <ActionContainer
              // list={project.actions ?? []}
              projectId={project.id}
            />
          )}
          {activeTab === "TEST_CASES" && (
            <TestCaseContainer
              // list={project.testCases ?? []}
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
