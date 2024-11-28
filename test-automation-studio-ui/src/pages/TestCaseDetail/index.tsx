import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Header";
import { RootState } from "../../store/rootReducer";
import useSnackbar from "../../hooks/useSnackbar";
import { getTestCaseHistoryById, actions as testCaseActions } from "../../slices/testCase";
import { actions as testCaseRunActions } from "../../slices/testCaseRun";
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
  const { notify, hideNotification } = useSnackbar();
  const { testCase, status: testCaseStatus } = useSelector((state: RootState) => state.testCase);
  const { status: testCaseRunStatus } = useSelector((state: RootState) => state.testCaseRun);

  const dispatch = useDispatch();
  const handleSnackbarClose = () => {
    hideNotification();
    dispatch(testCaseActions.clearStatus())
    dispatch(testCaseRunActions.clearStatus())
  };

  useEffect(() => {
    dispatch(getTestCaseHistoryById(testCaseId));
  }, [testCaseId]);

  useEffect(() => {
    const notifyStatus =
      testCaseRunStatus
      ?? testCaseStatus

    if (notifyStatus) {
      notify({
        message: notifyStatus.message,
        onClose: handleSnackbarClose,
        type: notifyStatus.type,
      });
    }
  }, [
    testCaseRunStatus,
    testCaseStatus,]);

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
