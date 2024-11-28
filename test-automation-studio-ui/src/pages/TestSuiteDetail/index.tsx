import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Header";
import { RootState } from "../../store/rootReducer";
import useSnackbar from "../../hooks/useSnackbar";
import { getTestSuiteHistoryById, actions as testSuiteActions } from "../../slices/testSuite";
import { actions as testSuiteRunActions } from "../../slices/testSuiteRun";
import TestSuiteRunContainer from "./TestSuiteRunContainer";

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

const TestSuiteDetail = () => {
  const classes = useStyles();
  const { testSuiteId } = useParams();
  const { notify, hideNotification } = useSnackbar();
  const { testSuite, status: testSuiteStatus } = useSelector((state: RootState) => state.testSuite);
  const { status: testSuiteRunStatus } = useSelector((state: RootState) => state.testSuiteRun);

  const dispatch = useDispatch();
  const handleSnackbarClose = () => {
    hideNotification();
    dispatch(testSuiteActions.clearStatus())
    dispatch(testSuiteRunActions.clearStatus())
  };

  useEffect(() => {
    dispatch(getTestSuiteHistoryById(testSuiteId));
  }, [testSuiteId]);

  useEffect(() => {
    const notifyStatus =
      testSuiteRunStatus
      ?? testSuiteStatus

    if (notifyStatus) {
      notify({
        message: notifyStatus.message,
        onClose: handleSnackbarClose,
        type: notifyStatus.type,
      });
    }
  }, [
    testSuiteRunStatus,
    testSuiteStatus,]);

  return (
    <>
      <Box height="100%">
        {testSuite && (
          <Header />
        )}
        {testSuite && (
          <Box className={classes.body}>
            <TestSuiteRunContainer
              list={testSuite.testSuiteRuns ?? []}
              testSuiteId={testSuite.id}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default TestSuiteDetail;
