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
  Button,
  Grid,
  Card,
  Link
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TreeView as MuiTreeView, TreeItem } from "@mui/x-tree-view";
import { makeStyles } from "@mui/styles";
import { TestCase, TestCaseFlowSequence, TestCaseRun, } from "../../declarations/interface";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { executeRun, getTestCaseRunById } from "../../slices/testCaseRun";
import constants, { ACTION_TYPES } from "../../util/constants";
import moment from "moment";
import ExpandIcon from "../../assets/images/right-arrow.svg";
import CollapseIcon from "../../assets/images/down-arrow.svg";
import ProjectIcon from "../../assets/images/project-icon.svg";
import RecordingIcon from "../../assets/images/recordings-icon.svg";
import PlayIcon from "../../assets/images/play-icon.png";
// import { socket } from "../../services/util";
import { actions } from "../../slices/testCase";

const useTreeItemStyles = makeStyles((theme) => ({
  label: {
    padding: `${theme.spacing(2)} 0px`,
  },
  iconContainer: {
    marginRight: "0 !important",
  },
  content: {
    color: theme.palette.primary.main,
  },
  selected: {
    color: theme.palette.primaryHighlight.main,
    backgroundColor: `transparent !important`,
  },
}));

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

const TestCaseRunContainer: React.FC<{
  list: TestCaseRun[];
  testCaseId: string;
}> = ({ list, testCaseId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [selectedTestCaseRun, setSelectedTestCaseRun] = useState<TestCaseRun | undefined>(undefined);
  const { addedTestCaseRun } = useSelector((state: RootState) => state.testCaseRun);
  const [updates, setUpdates] = useState<any>([]);
  const handleRun = (id: string) => {
    dispatch(executeRun(id))
  }
  useEffect(() => {
    if (selectedTestCaseRun) dispatch(getTestCaseRunById(selectedTestCaseRun?.id))
  }, [selectedTestCaseRun]);

  useEffect(() => {
    if (selectedTestCaseRun) dispatch(getTestCaseRunById(selectedTestCaseRun?.id))
  }, [list]);

  useEffect(() => {
    if (list) {
      if (list.length !== count) {
        setSelectedTestCaseRun(list[0])
      }
      setCount(list.length)
    }
  }, [list])

  useEffect(() => {
    if (addedTestCaseRun) {
      dispatch(actions.addTestCaseRun(addedTestCaseRun))
    }
  }, [addedTestCaseRun])

  // useEffect(() => {
  //   const event = `testCaseRunUpdates`;
  //   socket.on('connection', () => {
  //     console.log('Connected to server');
  //   });
  //   socket.on('test-case-run-updates', (update) => {
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
            <AddTestCase
              projectId={projectId}
              onModalClose={() => { console.log("Add/edit Test Case modal closed") }}
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
          <Grid item xs={6} classes={{ item: classes.item }} py={2}>
            <TestCaseRunsListView testCaseId={testCaseId} testCaseRuns={list} selectedTestCaseRun={list.find((testCaseRun: TestCaseRun) => testCaseRun.id == selectedTestCaseRun?.id)} setSelectedTestCaseRun={setSelectedTestCaseRun} handleRun={handleRun} />
          </Grid>
          <Grid item xs={6} classes={{ item: classes.item }} py={2}>
            <TestCaseRunHistoryView />
          </Grid>
        </Grid>
      )}
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
              {(handleRun && testCaseId) && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                <Tooltip title={"Trigger New Run"}>
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
                </Tooltip>
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Test Case Runs: {testCaseRuns.length}
                </Typography>
              </Box>}
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Click a Run history to view in detail
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className={classes.listContainer}>
          <Box className={classes.body}>
            <TableContainer sx={{ maxHeight: "100%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "30%" }} align="left">
                      <Typography variant="h5" color="primary">
                        Triggered on
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: "30%" }} align="left">
                      <Typography variant="h5" color="primary">
                        Status
                      </Typography>
                    </TableCell>
                    <TableCell style={{ width: "40%" }} align="left">
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
                        <TableCell style={{ width: "30%" }} align="left">
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
                        <TableCell style={{ width: "40%" }} align="left">
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

const Item: React.FC<{
  icon?: string;
  name: string;
  id: string;
  status: string;
}> = ({ icon, name, id, status }) => {
  const classes = useStyles();
  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
      <Box display={"flex"} alignItems={"center"} gap={2}>
        {/* {icon && <img src={icon} alt="icon" width="20" height="20" />} */}
        <Typography className="name" variant="h6">
          {name}
        </Typography>
      </Box>
      <Typography className={getClassName(classes, status)} variant="subtitle1">
        {status}
      </Typography>
    </Box>
  );
};

const TestCaseRunHistoryView: React.FC = () => {
  const classes = useStyles();
  const treeViewClasses = useTreeItemStyles();
  const { testCase } = useSelector((state: RootState) => state.testCase);
  const { testCaseRun } = useSelector((state: RootState) => state.testCaseRun);
  return (
    <>
      <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
        <Box flexGrow={1}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            <Box>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                {testCase?.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.listContainer} pt={2}>
        <Box className={classes.body} px={2}>
          <MuiTreeView
            aria-label="multi-select"
            defaultCollapseIcon={
              <img src={CollapseIcon} alt="icon" height="10" width="10" />
            }
            defaultExpandIcon={
              <img src={ExpandIcon} alt="icon" height="10" width="10" />
            }
            multiSelect
          >
            {testCaseRun && testCaseRun.testCaseFlowSequenceHistories?.map((testCaseFlowSequenceHistory) => (
              <TreeItem
                classes={treeViewClasses}
                nodeId={`${testCaseFlowSequenceHistory.id}`}
                label={
                  <Item
                    name={testCaseFlowSequenceHistory.flowName ?? "Flow Name"}
                    id={testCaseFlowSequenceHistory.id ?? `${new Date()}`}
                    icon={ProjectIcon}
                    status={testCaseFlowSequenceHistory.status}
                  />
                }
                key={testCaseFlowSequenceHistory.id}
                onClick={() => {
                  console.log("Clicked tree item")
                }}
              >
                {testCaseFlowSequenceHistory.flowActionSequenceHistories && testCaseFlowSequenceHistory.flowActionSequenceHistories.length > 0 && (
                  testCaseFlowSequenceHistory.flowActionSequenceHistories.map((flowActionSequenceHistory) =>
                    <TreeItem
                      classes={treeViewClasses}
                      nodeId={`${testCaseFlowSequenceHistory.id}-${flowActionSequenceHistory.id}`}
                      label={
                        <Item
                          name={flowActionSequenceHistory.actionName}
                          id={`${testCaseFlowSequenceHistory.id}-${flowActionSequenceHistory.id}`}
                          icon={RecordingIcon}
                          status={flowActionSequenceHistory.status}
                        />
                      }
                      key={`${testCaseFlowSequenceHistory.id}-${flowActionSequenceHistory.id}`}
                      onClick={() => {
                        console.log("Clicked tree item")
                      }}
                    >
                      <TreeItem
                        classes={treeViewClasses}
                        nodeId={`${testCaseFlowSequenceHistory.id}-${flowActionSequenceHistory.id}-${flowActionSequenceHistory.actionName}`}
                        label={
                          <TableContainer sx={{ maxHeight: "100%" }}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableBody>
                                <TableRow>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      Action Name:
                                    </Typography>
                                  </TableCell>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      {flowActionSequenceHistory.actionName}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      Action Type:
                                    </Typography>
                                  </TableCell>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      {ACTION_TYPES.find((x) => x.value == flowActionSequenceHistory.actionType)?.label}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                {flowActionSequenceHistory.actionXpath && <TableRow>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      Action Xpath:
                                    </Typography>
                                  </TableCell>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      {flowActionSequenceHistory.actionXpath}
                                    </Typography>
                                  </TableCell>
                                </TableRow>}
                                {flowActionSequenceHistory.inputValue && <TableRow>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      Input Value:
                                    </Typography>
                                  </TableCell>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      {flowActionSequenceHistory.inputValue}
                                    </Typography>
                                  </TableCell>
                                </TableRow>}
                                {flowActionSequenceHistory.errorMessage && <TableRow>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      Error Message:
                                    </Typography>
                                  </TableCell>
                                  <TableCell style={{ width: "20%" }} align="left">
                                    <Tooltip title={flowActionSequenceHistory.errorMessage}>
                                      <Typography variant="subtitle1" color="error">
                                        {flowActionSequenceHistory.errorMessage}
                                      </Typography>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>}
                                {flowActionSequenceHistory.assertionMessage && <TableRow>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      Assertion Message:
                                    </Typography>
                                  </TableCell>
                                  <TableCell style={{ width: "20%" }} align="left">
                                    <Tooltip title={flowActionSequenceHistory.assertionMessage}>
                                      <Typography variant="subtitle1" className={classes.PASS}>
                                        {flowActionSequenceHistory.assertionMessage}
                                      </Typography>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>}
                                <TableRow>
                                  <TableCell style={{ width: "50%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      Time:
                                    </Typography>
                                  </TableCell>
                                  <TableCell style={{ width: "10%" }} align="left">
                                    <Typography variant="subtitle1" color="primary">
                                      {moment(flowActionSequenceHistory.updatedAt).format(constants.dateDisplayFormat)}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        }
                        key={`${testCaseFlowSequenceHistory.id}-${flowActionSequenceHistory.id}-${flowActionSequenceHistory.actionName}`}
                        onClick={() => {
                          console.log("Clicked tree item")
                        }}
                      >
                      </TreeItem>
                    </TreeItem>)
                )}
              </TreeItem>
            ))}
          </MuiTreeView>
        </Box>
      </Box>
    </>
  );
};
export default TestCaseRunContainer;
