import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  Box,
  Tooltip,
  IconButton,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { TestCaseRun, TestSuiteRun, } from "../../declarations/interface";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { executeRun, getTestSuiteRunById } from "../../slices/testSuiteRun";
import constants from "../../util/constants";
import moment from "moment";
import PlayIcon from "../../assets/images/play-icon.png";
// import { socket } from "../../services/util";
import { actions } from "../../slices/testSuite";
import { TestCaseRunHistoryView } from "../TestCaseDetail/TestCaseRunContainer";
import { getTestCaseRunById } from "../../slices/testCaseRun";

const useStyles = makeStyles((theme) => ({
  body: {
    // borderTop: `0.5px solid ${theme.palette.primary40.main}`,
  },
  container: {
    height: "100%",
  },
  item: {
    height: "100%",
    "&:first-child": {
      borderRight: `0.5px solid ${theme.palette.primary40.main}`,
    },
    "&:last-child": {
      borderLeft: `0.5px solid ${theme.palette.primary40.main}`,
      // background: theme.palette.background.previewBg,
    },
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
  listContainer: {
    height: "calc(100% - 40px)",
    overflow: "auto",
    boxShadow: "0px -4px 5px -4px rgba(0, 0, 0, 0.15)",
  },
  stickyContainer: {
    display: "flex",
    alignItems: "center",
    height: "24px",
  },
  active: {
    border: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: "rgba(0, 0, 0, 0.1) !important",
  },
  PENDING: {
    color: `${theme.palette.warning.main} !important`,
  },
  ADDED_TO_QUEUE: {
    color: `${theme.palette.warning.main} !important`,
  },
  STARTED: {
    color: `${theme.palette.warning.main} !important`,
  },
  PASS: {
    color: `${theme.palette.success.main} !important`,
  },
  COMPLETED: {
    color: `${theme.palette.success.main} !important`,
  },
  FAIL: {
    color: `${theme.palette.error.main} !important`,
  },
  FAILED: {
    color: `${theme.palette.error.main} !important`,
  },
  vertLine: {
    height: 20,
    border: `1px dashed ${theme.palette.primary35.main}`,
    width: 0,
  }
}));

const getClassName = (classes: any, status: string) => {
  const newClasses = classes as any;
  return newClasses[status];
}

const TestSuiteRunContainer: React.FC<{
  list: TestSuiteRun[];
  testSuiteId: string;
}> = ({ list, testSuiteId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [selectedTestSuiteRun, setSelectedTestSuiteRun] = useState<TestSuiteRun | undefined>(undefined);
  const [selectedTestCaseRun, setSelectedTestCaseRun] = useState<TestCaseRun | undefined>(undefined);
  const { addedTestSuiteRun, testSuiteRun: fetchedTestSuitRun } = useSelector((state: RootState) => state.testSuiteRun);
  const [updates, setUpdates] = useState<any>([]);
  const handleRun = (id: string) => {
    dispatch(executeRun(id))
  }

  useEffect(() => {
    if (selectedTestCaseRun) dispatch(getTestCaseRunById(selectedTestCaseRun?.id))
  }, [selectedTestCaseRun]);

  useEffect(() => {
    if (selectedTestSuiteRun) dispatch(getTestSuiteRunById(selectedTestSuiteRun?.id))
  }, [selectedTestSuiteRun]);

  useEffect(() => {
    if (selectedTestSuiteRun) dispatch(getTestSuiteRunById(selectedTestSuiteRun?.id))
  }, [list]);

  useEffect(() => {
    if (fetchedTestSuitRun && fetchedTestSuitRun.testCaseRuns) {
      setSelectedTestCaseRun(fetchedTestSuitRun.testCaseRuns[0])
    }
  }, [fetchedTestSuitRun])

  useEffect(() => {
    if (list) {
      if (list.length !== count) {
        setSelectedTestSuiteRun(list[0])
      }
      setCount(list.length)
    }
  }, [list])

  useEffect(() => {
    if (addedTestSuiteRun) {
      dispatch(actions.addTestSuiteRun(addedTestSuiteRun))
    }
  }, [addedTestSuiteRun])

  // useEffect(() => {
  //   const event = `testSuiteRunUpdates`;
  //   socket.on('connection', () => {
  //     console.log('Connected to server');
  //   });
  //   socket.on('test-Suite-run-updates', (update) => {
  //     console.log(update);
  //   });
  //   return () => {
  //     socket.off(event);
  //   };
  // }, []);

  return (
    <>
      {list.length === 0 && (
        <Box className={clsx(classes.contentCenter, classes.body)}>
          {/* <Box mr={1}>
            <AddTestSuite
              projectId={projectId}
              onModalClose={() => { console.log("Add/edit Test Suite modal closed") }}
            />
          </Box> */}
          <Typography variant="h5" color="primary">
            No history
          </Typography>
        </Box>
      )}
      {list.length > 0 && (
        <Grid
          container
          classes={{ container: classes.container }}
          sx={{
            height: "100%",
          }}
        >
          <Grid item xs={4} classes={{ item: classes.item }} py={2}>
            <TestSuiteRunsListView
              testSuiteId={testSuiteId}
              testSuiteRuns={list}
              selectedTestSuiteRun={list.find((testSuiteRun: TestSuiteRun) => testSuiteRun.id == selectedTestSuiteRun?.id)}
              setSelectedTestSuiteRun={setSelectedTestSuiteRun}
              handleRun={handleRun} />
          </Grid>
          <Grid item xs={5} classes={{ item: classes.item }} py={2}>
            <TestCaseRunsListView
              testCaseRuns={fetchedTestSuitRun?.testCaseRuns ?? []}
              selectedTestCaseRun={fetchedTestSuitRun?.testCaseRuns?.find((testCaseRun: TestCaseRun) => testCaseRun.id == selectedTestCaseRun?.id)}
              setSelectedTestCaseRun={setSelectedTestCaseRun} />
          </Grid>
          <Grid item xs={3} classes={{ item: classes.item }} py={2}>
            <TestCaseRunHistoryView title={
              fetchedTestSuitRun?.testCaseRuns?.find(
                (testCaseRun: TestCaseRun) => testCaseRun.id == selectedTestCaseRun?.id
              )?.testCase?.name ?? "Test case name"} />
          </Grid>
        </Grid>
      )}
    </>
  );
};

const TestSuiteRunsListView: React.FC<{
  testSuiteRuns: TestSuiteRun[];
  setSelectedTestSuiteRun: (testSuiteRun?: TestSuiteRun) => void
  selectedTestSuiteRun: TestSuiteRun | undefined;
  testSuiteId: string;
  handleRun: (id: string) => void;
}> = ({
  testSuiteRuns, selectedTestSuiteRun, setSelectedTestSuiteRun, testSuiteId, handleRun
}) => {
    const classes = useStyles();
    const getStatusElement = (testCaseRuns?: TestCaseRun[]) => {
      if (!testCaseRuns) return <></>
      const failCount = testCaseRuns.filter(x => x.status === 'FAIL').length;
      const passCount = testCaseRuns.filter(x => x.status === 'PASS').length;
      const inProgressCount = testCaseRuns.filter(x => (x.status === 'STARTED' || x.status === 'ADDED_TO_QUEUE')).length;
      return <Box display={"flex"} alignItems="center" gap={1}>
        {inProgressCount !== 0 && <Typography
          variant="subtitle1"
          className={getClassName(classes, 'PENDING')}
          overflow="hidden"
          textOverflow="ellipsis"
          maxWidth="300px"
        >
          IN PROGRESS: {inProgressCount}
        </Typography>}
        {passCount !== 0 && <Typography
          variant="subtitle1"
          className={getClassName(classes, 'PASS')}
          overflow="hidden"
          textOverflow="ellipsis"
          maxWidth="300px"
        >
          PASS: {passCount}
        </Typography>}
        {failCount !== 0 && <Typography
          variant="subtitle1"
          className={getClassName(classes, 'FAIL')}
          overflow="hidden"
          textOverflow="ellipsis"
          maxWidth="300px"
        >
          FAIL: {failCount}
        </Typography>}
      </Box>
    }
    return (
      <>
        <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
          <Box flexGrow={1}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                <Tooltip title={"Trigger New Run"}>
                  <IconButton
                    sx={{ padding: 0.5, opacity: 0.6 }}
                    onClick={() => {
                      handleRun(testSuiteId);
                    }}
                    data-testid="edit-testSuite"
                  >
                    <img
                      src={PlayIcon}
                      alt="close"
                      height="20"
                      width="20"
                    />
                  </IconButton>
                </Tooltip>
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Test Suite Runs: {testSuiteRuns.length}
                </Typography>
              </Box>
              {/* <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Click a Test Suit Run to view in detail
              </Typography> */}
            </Box>
          </Box>
        </Box>
        <Box className={classes.listContainer}>
          <Box className={classes.body}>
            <TableContainer sx={{ maxHeight: "100%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "50%" }} align="left">
                      <Typography variant="h5" color="primary">
                        Triggered on
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: "50%" }} align="left">
                      <Typography variant="h5" color="primary">
                        Status
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testSuiteRuns.map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => {
                        setSelectedTestSuiteRun(row);
                      }} className={selectedTestSuiteRun?.id == row.id ? classes.active : ''}>
                        <TableCell style={{ width: "50%" }} align="left">
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxWidth="300px"
                          >
                            {moment(row.createdAt).format(constants.dateDisplayFormat)}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ width: "50%" }} align="left">
                          <Typography
                            variant="subtitle1"
                            className={getClassName(classes, row.status)}
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxWidth="300px"
                          >
                            {getStatusElement(row.testCaseRuns)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </>
    );
  };

export const TestCaseRunsListView: React.FC<{
  testCaseRuns: TestCaseRun[];
  setSelectedTestCaseRun: (testCaseRun?: TestCaseRun) => void
  selectedTestCaseRun: TestCaseRun | undefined;
  testCaseId?: string;
  handleRun?: (id: string) => void;
}> = ({
  testCaseRuns, selectedTestCaseRun, setSelectedTestCaseRun, testCaseId, handleRun
}) => {
    const classes = useStyles();
    return (
      <>
        <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
          <Box flexGrow={1}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                {(handleRun && testCaseId) && <Tooltip title={"Trigger New Run"}>
                  <IconButton
                    sx={{ padding: 0.5, opacity: 0.6 }}
                    onClick={() => {
                      handleRun(testCaseId);
                    }}
                    data-testid="edit-testcase"
                  >
                    <img
                      src={PlayIcon}
                      alt="close"
                      height="20"
                      width="20"
                    />
                  </IconButton>
                </Tooltip>}
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Test Case Runs: {testCaseRuns.length}
                </Typography>
              </Box>
              {/* <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Click a Run history to view in detail
              </Typography> */}
            </Box>
          </Box>
        </Box>
        <Box className={classes.listContainer}>
          <Box className={classes.body}>
            <TableContainer sx={{ maxHeight: "100%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "20%" }} align="left">
                      <Typography variant="h5" color="primary">
                        Test Case Name
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: "30%" }} align="left">
                      <Typography variant="h5" color="primary">
                        Triggered on
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: "20%" }} align="left">
                      <Typography variant="h5" color="primary">
                        Status
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: "30%" }} align="left">
                      <Typography variant="h5" color="primary">
                        Error message
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testCaseRuns.map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => {
                        setSelectedTestCaseRun(row);
                      }} className={selectedTestCaseRun?.id == row.id ? classes.active : ''}>
                        <TableCell style={{ width: "20%" }} align="left">
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxWidth="300px"
                          >
                            {row.testCase?.name}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ width: "30%" }} align="left">
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxWidth="300px"
                          >
                            {moment(row.createdAt).format(constants.dateDisplayFormat)}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ width: "20%" }} align="left">
                          <Typography
                            variant="subtitle1"
                            className={getClassName(classes, row.status)}
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxWidth="300px"
                          >
                            {row.status}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ width: "30%" }} align="left">
                          {row.errorMessage && <Tooltip title={row.errorMessage}>
                            <Typography
                              variant="subtitle1"
                              color="error"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              maxWidth="300px"
                            >
                              {row.errorMessage}
                            </Typography>
                          </Tooltip>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </>
    );
  };

export default TestSuiteRunContainer;
