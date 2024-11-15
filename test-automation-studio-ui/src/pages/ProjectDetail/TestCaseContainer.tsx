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
  Card
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import EditIcon from "../../assets/images/edit-icon.svg";
import AddIcon from "../../assets/images/add-icon-white.svg";
import { TestCase, TestCaseFlowSequence, } from "../../declarations/interface";
import clsx from "clsx";
import { getTestCaseById } from "../../slices/testCase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import AppCard from "../../components/cards/AppCard";
import AddTestCase from "./AddTestCase";

export const DEFAULT_TEST_CASE: TestCase = {
  id: "",
  projectId: "",
  name: ""
};

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
  vertLine: {
    height: 20,
    border: `1px dashed ${theme.palette.primary35.main}`,
    width: 0,
  }
}));

const TestCaseContaier: React.FC<{
  list: TestCase[];
  projectId: string;
}> = ({ list, projectId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | undefined>(undefined);
  const { testCase: fetchedTestCase } = useSelector((state: RootState) => state.testCase);

  useEffect(() => {
    if (selectedTestCase) dispatch(getTestCaseById(selectedTestCase?.id))
  }, [selectedTestCase]);

  useEffect(() => {
    if (selectedTestCase) dispatch(getTestCaseById(selectedTestCase?.id))
  }, [list]);

  useEffect(() => {
    if(list) {
      if(list.length !== count) {
        setSelectedTestCase(list[list.length-1])
      }
      setCount(list.length)
    }
  }, [list])

  return (
    <>
      {list.length === 0 && (
        <Box className={clsx(classes.contentCenter, classes.body)}>
          <Box mr={1}>
            <AddTestCase
              projectId={projectId}
              onModalClose={() => { console.log("Add/edit test case modal closed") }}
            />
          </Box>
          <Typography variant="h5" color="primary">
            Add New Test Case
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
            <TestCasesListView projectId={projectId} testCases={list} selectedTestCase={list.find((testCase: TestCase) => testCase.id == selectedTestCase?.id)} setSelectedTestCase={setSelectedTestCase} />
          </Grid>
          <Grid item xs={6} classes={{ item: classes.item }} py={2}>
            <FlowListView testCaseName={fetchedTestCase?.name} testCaseFlowSequences={fetchedTestCase?.testCaseFlowSequences} />
          </Grid>
        </Grid>
      )}
    </>
  );
};

const TestCasesListView: React.FC<{
  testCases: TestCase[];
  setSelectedTestCase: (testCase?: TestCase) => void
  selectedTestCase: TestCase | undefined;
  projectId: string;
}> = ({
  testCases, selectedTestCase, setSelectedTestCase, projectId
}) => {
    const classes = useStyles();
    const [editTestCase, setEditTestCase] = useState<TestCase | undefined>(undefined);
    return (
      <>
        <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
          <Box flexGrow={1}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                <AddTestCase
                  testCase={editTestCase}
                  projectId={projectId}
                  onModalClose={() => { setEditTestCase(undefined) }}
                />
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Test Cases: {testCases.length}
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Click a test case to view its flows in order
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className={classes.listContainer}>
          <Box className={classes.body}>
            <TableContainer sx={{ maxHeight: "100%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableBody>
                  {testCases.map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => {
                        setSelectedTestCase(row);
                      }} className={selectedTestCase?.id == row.id ? classes.active : ''}>
                        <TableCell style={{ width: "90%" }} align="left">
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxWidth="300px"
                          >
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ width: "10%" }} align="left">
                          <Box
                            display={"flex"}
                            justifyContent={"start"}
                            alignItems={"center"}
                            gap={2}
                          >
                            <Tooltip title={"Edit"}>
                              <IconButton
                                sx={{ padding: 0.5 }}
                                onClick={() => {
                                  setEditTestCase(row);
                                }}
                                data-testid="edit-testcase"
                              >
                                <img
                                  src={EditIcon}
                                  alt="close"
                                  height="24"
                                  width="24"
                                />
                              </IconButton>
                            </Tooltip>
                          </Box>
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
const FlowListView: React.FC<{ testCaseName?: string; testCaseFlowSequences?: TestCaseFlowSequence[]; }> = ({ testCaseName, testCaseFlowSequences }) => {
  const classes = useStyles();
  return (
    <>
      <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
        <Box flexGrow={1}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            <Box>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                {testCaseName}
              </Typography>
            </Box>
            {testCaseFlowSequences &&
              <Box display={"flex"} gap={2} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Flows: {testCaseFlowSequences?.length ?? 0}
                </Typography>
              </Box>}
            {/* {!testCaseFlowSequences && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
              Edit the Test Case to add testCaseFlowSequences
            </Typography>} */}
          </Box>
        </Box>
      </Box>
      <Box className={classes.listContainer} pt={2}>
        <Box className={classes.body} px={5}>
          {testCaseFlowSequences && testCaseFlowSequences.map((row, index) => (
            <Box mx={5} key={index}>
              <AppCard id={`${index}`}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} m={5}>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    maxWidth="300px"
                  >
                    {row.flow.name}
                  </Typography>
                </Box>
              </AppCard>
              {testCaseFlowSequences.length - 1 > index && <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <Box className={classes.vertLine} />
              </Box>}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
export default TestCaseContaier;
