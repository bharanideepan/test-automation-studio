import {
  TableContainer,
  Table,
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
import EditIcon from "../../assets/images/edit-icon.svg";
import DuplicateIcon from "../../assets/images/duplicate.png";
import { Action, Flow, FlowActionSequence, } from "../../declarations/interface";
import clsx from "clsx";
import AddFlow from "./AddFlow";
import { getFlowById } from "../../slices/flow";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import AppCard from "../../components/cards/AppCard";
import { duplicateFlow } from "../../slices/flows";
import { useSearchParams } from "react-router-dom";

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

const FlowContainer: React.FC<{
  projectId: string;
  selectedFlowExternal?: Flow;
  setSelectedFlowExternal?: React.Dispatch<React.SetStateAction<Flow | undefined>>
  setSelectedActionExternal?: React.Dispatch<React.SetStateAction<Action | undefined>>
}> = ({ projectId, selectedFlowExternal, setSelectedFlowExternal, setSelectedActionExternal }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [selectedFlow, setSelectedFlow] = useState<Flow | undefined>(undefined);
  const { flow: fetchedFlow } = useSelector((state: RootState) => state.flow);
  const { flows: list } = useSelector((state: RootState) => state.flows);

  useEffect(() => {
    if (selectedFlow) {
      setSelectedFlowExternal && setSelectedFlowExternal(undefined)
      dispatch(getFlowById(selectedFlow?.id))
    }
  }, [selectedFlow]);

  useEffect(() => {
    if (selectedFlowExternal)
      setSelectedFlow(selectedFlowExternal)
  }, [selectedFlowExternal]);

  useEffect(() => {
    if (selectedFlow) dispatch(getFlowById(selectedFlow?.id))
  }, [list]);

  useEffect(() => {
    if (selectedFlowExternal) return
    if (list) {
      if (list.length !== count) {
        setSelectedFlow(list[list.length - 1])
      }
      setCount(list.length)
    }
  }, [list])

  return (
    <>
      {list?.length === 0 && (
        <Box className={clsx(classes.contentCenter, classes.body)}>
          <Box mr={1}>
            <AddFlow
              projectId={projectId}
              onModalClose={() => { console.log("Add/edit flow modal closed") }}
            />
          </Box>
          <Typography variant="h5" color="primary">
            Add New Flow
          </Typography>
        </Box>
      )}
      {list && list.length !== 0 && (
        <Grid
          container
          classes={{ container: classes.container }}
          sx={{
            height: "100%",
          }}
        >
          <Grid item xs={6} classes={{ item: classes.item }} py={2}>
            <FlowsListView projectId={projectId} flows={list} selectedFlow={list.find((flow: Flow) => flow.id == selectedFlow?.id)} setSelectedFlow={setSelectedFlow} />
          </Grid>
          <Grid item xs={6} classes={{ item: classes.item }} py={2}>
            <ActionListView flowName={fetchedFlow?.name} actionSequences={fetchedFlow?.flowActionSequences} setSelectedActionExternal={setSelectedActionExternal} />
          </Grid>
        </Grid>
      )}
    </>
  );
};

const FlowsListView: React.FC<{
  flows: Flow[];
  setSelectedFlow: (flow?: Flow) => void
  selectedFlow: Flow | undefined;
  projectId: string;
}> = ({
  flows, selectedFlow, setSelectedFlow, projectId
}) => {
    const classes = useStyles();
    const [editFlow, setEditFlow] = useState<Flow | undefined>(undefined);
    const dispatch = useDispatch();
    const handleDuplicate = (id: string) => {
      dispatch(duplicateFlow(id))
    }
    return (
      <>
        <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
          <Box flexGrow={1}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                <AddFlow
                  flow={editFlow}
                  projectId={projectId}
                  onModalClose={() => { setEditFlow(undefined) }}
                />
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Flows: {flows.length}
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Click a flow to view its actions in order
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className={classes.listContainer}>
          <Box className={classes.body}>
            <TableContainer sx={{ maxHeight: "100%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableBody>
                  {flows.map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => {
                        setSelectedFlow(row);
                      }} className={selectedFlow?.id == row.id ? classes.active : ''}>
                        <TableCell style={{ width: "90%" }} align="left">
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          // maxWidth="300px"
                          >
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ width: "5%" }} align="left">
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
                                  setEditFlow(row);
                                }}
                                data-testid="remove-added-replacement"
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
                        <TableCell style={{ width: "5%" }} align="left">
                          <Box
                            display={"flex"}
                            justifyContent={"start"}
                            alignItems={"center"}
                            gap={2}
                          >
                            <Tooltip title={"Clone"}>
                              <IconButton
                                sx={{ padding: 0.5, opacity: 0.6 }}
                                onClick={() => {
                                  handleDuplicate(row.id);
                                }}
                                data-testid="duplicate-testcase"
                              >
                                <img
                                  src={DuplicateIcon}
                                  alt="close"
                                  height="20"
                                  width="20"
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
const ActionListView: React.FC<{
  flowName?: string;
  actionSequences?: FlowActionSequence[];
  setSelectedActionExternal?: React.Dispatch<React.SetStateAction<Action | undefined>>
}> = ({ flowName, actionSequences, setSelectedActionExternal }) => {
  const classes = useStyles();
  const [_, setSearchParams] = useSearchParams();
  return (
    <>
      <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
        <Box flexGrow={1}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            <Box>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                {flowName}
              </Typography>
            </Box>
            {actionSequences &&
              <Box display={"flex"} gap={2} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Actions: {actionSequences?.length ?? 0}
                </Typography>
              </Box>}
            {!actionSequences && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
              Edit the flow to add actions
            </Typography>}
          </Box>
        </Box>
      </Box>
      <Box className={classes.listContainer} pt={2}>
        <Box className={classes.body} px={5}>
          {actionSequences && actionSequences.map((row, index) => (
            <Box mx={5} key={index}>
              <AppCard id={`${index}`} onClick={() => {
                setSearchParams({ tab: "ACTIONS" })
                setSelectedActionExternal && setSelectedActionExternal(row.action)
              }
              }>
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} m={3}>
                  <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      maxWidth="300px"
                    >
                      {row.action.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      maxWidth="300px"
                      mt={2}
                    >
                      {row.action.selector?.xpath}
                    </Typography>
                  </Box>
                </Box>
              </AppCard>
              {actionSequences.length - 1 > index && <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <Box className={classes.vertLine} />
              </Box>}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
export default FlowContainer;
