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
import { Action, Flow, } from "../../declarations/interface";
import clsx from "clsx";
import AddFlow from "./AddFlow";
import { getFlowById } from "../../slices/flow";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import AppCard from "../../components/cards/AppCard";

export const DEFAULT_FLOW: Flow = {
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

const FlowContainer: React.FC<{
  list: Flow[];
  projectId: string;
}> = ({ list, projectId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedFlow, setSelectedFlow] = useState<Flow | undefined>(undefined);
  const { flow: fetchedFlow } = useSelector((state: RootState) => state.flow);

  useEffect(() => {
    if (selectedFlow) dispatch(getFlowById(selectedFlow?.id))
  }, [selectedFlow]);

  useEffect(() => {
    if (selectedFlow) dispatch(getFlowById(selectedFlow?.id))
  }, [list]);

  return (
    <>
      {list.length === 0 && (
        <Box className={clsx(classes.contentCenter, classes.body)}>
          <Box mr={2}>
            <AddFlow
              projectId={projectId}
              onModalClose={() => { console.log("Add flow modal closed") }}
            />
          </Box>
          <Typography variant="h5" color="primary">
            Add new flow
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
            <FlowsListView projectId={projectId} flows={list} selectedFlow={list.find((flow: Flow) => flow.id == selectedFlow?.id)} setSelectedFlow={setSelectedFlow} />
          </Grid>
          <Grid item xs={6} classes={{ item: classes.item }} py={2}>
            <ActionListView flowName={fetchedFlow?.name} actions={fetchedFlow?.actions} />
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
const ActionListView: React.FC<{ flowName?: string; actions?: Action[]; }> = ({ flowName, actions }) => {
  const classes = useStyles();
  return (
    <>
      <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
        <Box flexGrow={1}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            <Box>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Flow Name: {flowName}
              </Typography>
            </Box>
            {actions &&
              <Box display={"flex"} gap={2} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Actions: {actions?.length ?? 0}
                </Typography>
              </Box>}
            {!actions && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
              Edit the flow to add actions
            </Typography>}
          </Box>
        </Box>
      </Box>
      <Box className={classes.listContainer} pt={2}>
        <Box className={classes.body} px={5}>
          {actions && actions.map((row, index) => (
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
                    {row.name}
                  </Typography>
                </Box>
              </AppCard>
              {actions.length - 1 > index && <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
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
