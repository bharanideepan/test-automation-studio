import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Header";
import { RootState } from "../../store/rootReducer";
import AppModal from "../../components/AppModal";
import useSnackbar from "../../hooks/useSnackbar";
import SuccessIcon from "../../assets/images/success-tick.svg";
import { getTestCaseById, actions } from "../../slices/testCase";
import { getProjectById } from "../../slices/project";
import TestCaseRunContainer from "./TestCaseRunContainer";

const useStyles = makeStyles((theme) => ({
  body: {
    // borderTop: `0.5px solid ${theme.palette.primary40.main}`,
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
}));

const TestCaseDetail = () => {
  const classes = useStyles();
  const { testCaseId } = useParams();
  const { testCase } = useSelector((state: RootState) => state.testCase);
  const { status } = useSelector((state: RootState) => state.project);

  const dispatch = useDispatch();
  const { notify, hideNotification } = useSnackbar();
  const handleSnackbarClose = () => {
    hideNotification();
    dispatch(actions.clearStatus());
  };


  useEffect(() => {
    if (status) {
      notify({
        message: status.message,
        onClose: handleSnackbarClose,
        type: status.type,
      });
    }
  }, [status]);

  useEffect(() => {
    if (testCase)
      dispatch(getProjectById(testCase.projectId));
  }, [testCase]);

  useEffect(() => {
    dispatch(getTestCaseById(testCaseId));
  }, [testCaseId]);

  return (
    <>
      <Box height="100%">
        {testCase && (
          <Header />
        )}
        {testCase && (
          <Box className={classes.body}>
            <TestCaseRunContainer
              list={testCase.testCaseRuns ?? []}
              testCaseId={testCase.id}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default TestCaseDetail;
