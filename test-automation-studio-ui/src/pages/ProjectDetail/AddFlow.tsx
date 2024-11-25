import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Box, Tooltip, IconButton, Grid } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { createFlow, updateFlow, actions as flowsActions } from "../../slices/flows";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { Action, Flow, FlowActionSequence } from "../../declarations/interface";
import { RootState } from "../../store/rootReducer";
import { getFlowById } from "../../slices/flow";
import AppCard from "../../components/cards/AppCard";
import DeleteIcon from "../../assets/images/delete-icon.svg";
import { reorder } from "../../util/UtilService";
import AddAction from "./AddAction";
import { DEFAULT_FLOW } from "../../util/constants";

const useStyles = makeStyles((theme) => ({
  body: {
    // borderTop: `0.5px solid ${theme.palette.primary40.main}`,
  },
  input: {
    "& input": {
      height: "38px !important",
    },
  },
  listContainer: {
    height: "65vh",
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
  },
  gridContainer: {
    height: "100%",
  },
  gridItem: {
    height: "100%",
    "&:first-child": {
      borderRight: `0.5px solid ${theme.palette.primary40.main}`,
    },
    "&:last-child": {
      // borderLeft: `0.5px solid ${theme.palette.primary40.main}`,
      // background: theme.palette.background.previewBg,
    },
  },
}));
const MAX_LIMIT = 250;
type NameErrorKey = "REQUIRED" | "MAX_LIMIT";

type NameError = {
  [key in NameErrorKey]?: string;
};

type ErrorMsg = {
  name: NameError;
};

const errorMsg: ErrorMsg = {
  name: {
    REQUIRED: "This field is required",
    MAX_LIMIT: `Maximum limit is ${MAX_LIMIT} characters`,
  },
};

const AddFlow: React.FC<{
  flow?: Flow;
  projectId: string;
  onModalClose: () => void;
}> = ({ flow, projectId, onModalClose }) => {
  const classes = useStyles();
  const [data, setData] = useState<Flow | undefined>();
  const [selectedFlowActionSequences, setSelectedFlowActionSequences] = useState<FlowActionSequence[] | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [nameError, setNameError] = useState<
    NameErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add Flow");
  const { flow: fetchedFlow } = useSelector((state: RootState) => state.flow);
  const { project } = useSelector((state: RootState) => state.project);
  const { actions } = useSelector((state: RootState) => state.actions);

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_FLOW, projectId: projectId });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    onModalClose();
    dispatch(flowsActions.clearStatus());
    setSelectedFlowActionSequences(undefined);
    setData(undefined);
  };
  const handleSubmit = () => {
    handleFieldChange({ target: { value: data?.name } }, "name")
    setSubmitted(true);
  };
  const submitData = () => {
    const updatedSequences: FlowActionSequence[] = [];
    const newSequences: FlowActionSequence[] = [];
    selectedFlowActionSequences?.filter((sequence: FlowActionSequence) => !sequence.isRemoved).map((sequence: FlowActionSequence, index) => {
      if (sequence.id) {
        updatedSequences.push({ ...sequence, order: index })
      } else {
        newSequences.push({ ...sequence, order: index })
      }
    })
    const removedSequences = selectedFlowActionSequences?.filter((sequence: FlowActionSequence) => sequence.isRemoved).map((sequence: FlowActionSequence) => sequence.id)
    const sequencePayload = {
      updatedSequences, newSequences, removedSequences
    }
    setSubmitted(false);
    handleModalClose();
    if (data?.id.length) {
      dispatch(updateFlow({ flow: data, sequences: sequencePayload }));
    } else {
      dispatch(createFlow({ flow: data, flowActionSequences: newSequences }));
    }
  };
  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any,
    field: keyof Flow
  ) => {
    setSubmitted(false);
    const value = event.target.value;
    if (field === "name") {
      validateName(value);
    }
    setData((prev) => {
      if (prev)
        return {
          ...prev,
          [field]: event.target.value,
        };
    });
  };

  const validateName = (name: string) => {
    if (name.length > 250) {
      setNameError("MAX_LIMIT");
    } else if (name.length === 0) {
      setNameError("REQUIRED");
    } else {
      setNameError(undefined);
    }
  };

  const addNewAction = (action: Action) => {
    const newSequence: FlowActionSequence = {
      actionId: action.id,
      flowId: fetchedFlow?.id,
      order: selectedFlowActionSequences?.length ?? 0,
      action: action
    }
    setSelectedFlowActionSequences((prev: FlowActionSequence[] | undefined) => {
      if (prev)
        return [...prev, newSequence];
      return [newSequence];
    })
  }

  const restoreFlowActionSequence = (restoreIndex: number) => {
    setSelectedFlowActionSequences((prev: FlowActionSequence[] | undefined) => {
      return prev?.map((sequence: FlowActionSequence, index) => {
        if (restoreIndex === index) {
          return {
            ...sequence,
            isRemoved: false
          }
        }
        return sequence;
      })
    })
  }

  const removeFlowActionSequence = (removeIndex: number) => {
    setSelectedFlowActionSequences((prev: FlowActionSequence[] | undefined) => {
      const updatedSequences = prev?.map((sequence: FlowActionSequence, index) => {
        if (removeIndex === index) {
          return {
            ...sequence,
            isRemoved: true
          }
        }
        return sequence;
      })
      return updatedSequences?.filter((sequence: FlowActionSequence, index) => {
        if (!sequence.id && index === removeIndex) {
          return false;
        } else {
          return true;
        }
      })
    })
  }

  const reorderFlowActionSequences = (reorderedFlowActionSequences: FlowActionSequence[]) => {
    setSelectedFlowActionSequences(reorderedFlowActionSequences);
  }

  useEffect(() => {
    if (data) {
      setModalOpen(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.id.length) {
      setTitle("Update Flow");
    } else {
      setTitle("Add Flow");
    }
  }, [modalOpen, data]);

  useEffect(() => {
    if (nameError) return
    if (submitted) submitData();
  }, [submitted]);

  useEffect(() => {
    if (flow) {
      setData(fetchedFlow)
      setSelectedFlowActionSequences(fetchedFlow?.flowActionSequences)
    }
  }, [fetchedFlow]);

  useEffect(() => {
    if (flow) dispatch(getFlowById(flow.id))
  }, [flow]);

  return (
    <Box>
      <Tooltip title={"Add new flow for this project"}>
        <IconButton
          sx={{ padding: 0.5 }}
          onClick={handleModalOpen}
          data-testid="add-another-replacement"
        >
          <img src={AddIcon} alt="close" />
        </IconButton>
      </Tooltip>
      <AppModal
        open={modalOpen}
        onClose={handleModalClose}
        fullScreen={true}
        header={
          <Typography
            variant="h5"
            color="primaryHighlight.main"
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
        }
      >
        {data && (
          <Box mb={0.5}>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
              <Box>
                <AppTextbox
                  label="Flow Name"
                  placeholder="Enter Name"
                  value={data.name}
                  onChange={(event) => {
                    handleFieldChange(event, "name");
                  }}
                  classes={{ root: classes.input }}
                  error={!!nameError}
                  helperText={
                    nameError ? errorMsg.name[nameError] : ""
                  }
                />
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  fullWidth
                  aria-label={title}
                  disabled={!!nameError}
                >
                  <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
                    Save Flow
                  </Typography>
                </Button>
              </Box>
            </Box>
            <Box mt={2}>
              <Grid
                container
                classes={{ container: classes.gridContainer }}
              >
                <Grid item xs={6} classes={{ item: classes.gridItem }} py={2}>
                  <AvailableActionsView
                    actions={actions}
                    addAction={addNewAction}
                    projectId={project?.id} />
                </Grid>
                <Grid item xs={6} classes={{ item: classes.gridItem }} py={2}>
                  <SelectedActionsView
                    flowActionSequences={selectedFlowActionSequences}
                    removeFlowActionSequence={removeFlowActionSequence}
                    reorderFlowActionSequences={reorderFlowActionSequences}
                    restoreFlowActionSequence={restoreFlowActionSequence} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </AppModal>
    </Box>
  );
};

const SelectedActionsView: React.FC<{
  flowActionSequences?: FlowActionSequence[];
  removeFlowActionSequence: (index: number) => void;
  reorderFlowActionSequences: (reorderedFlowActionSequences: FlowActionSequence[]) => void;
  restoreFlowActionSequence: (index: number) => void;
}> = ({ flowActionSequences, removeFlowActionSequence, reorderFlowActionSequences, restoreFlowActionSequence }) => {
  const classes = useStyles();
  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    if (flowActionSequences) {
      const reorderedFlowActionSequences = reorder(
        [...flowActionSequences],
        source.index,
        destination.index
      );
      reorderFlowActionSequences(reorderedFlowActionSequences);
    }
  };
  return (
    <>
      <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
        <Box flexGrow={1}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            {flowActionSequences && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Selected: {flowActionSequences.filter((x) => !x.isRemoved)?.length ?? 0}
              </Typography>
            </Box>}
            {!flowActionSequences && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
              Add actions to this flow
            </Typography>}
          </Box>
        </Box>
      </Box>
      <Box className={classes.listContainer} pt={2}>
        <Box className={classes.body} px={5}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {flowActionSequences && flowActionSequences.map((row, index) => (
                    <Draggable draggableId={`${index}`} index={index} key={index}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Box mx={5} key={index}>
                            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                              <Box width={"100%"} sx={{
                                opacity: row.isRemoved ? 0.5 : 1
                              }}>
                                <AppCard id={`${index}`}>
                                  <Box display={"flex"} alignItems={"center"} justifyContent={"center"} m={3} position="relative">
                                    {!row.id && <Typography
                                      variant="h6"
                                      color="secondary"
                                      position="absolute"
                                      right={"-24px"}
                                      top={"-24px"}
                                    >
                                      New
                                    </Typography>}
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
                                {flowActionSequences && flowActionSequences.length - 1 > index &&
                                  <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                    <Box className={classes.vertLine} />
                                  </Box>}
                              </Box>
                              {!row.isRemoved && <Box ml={"auto"}>
                                <Tooltip title={"Remove"}>
                                  <IconButton
                                    sx={{ padding: 0.5 }}
                                    onClick={() => {
                                      removeFlowActionSequence(index);
                                    }}
                                    data-testid="remove-added-sequence"
                                  >
                                    <img src={DeleteIcon} alt="close" height="24" width="24" />
                                  </IconButton>
                                </Tooltip>
                              </Box>}
                              {row.isRemoved && <Box ml={"auto"}>
                                <Tooltip title={"Restore"}>
                                  <IconButton
                                    sx={{ padding: 0.5 }}
                                    onClick={() => {
                                      restoreFlowActionSequence(index);
                                    }}
                                    data-testid="restore-removed-sequence"
                                  >
                                    <img src={AddIcon} alt="close" height="24" width="24" />
                                  </IconButton>
                                </Tooltip>
                              </Box>}
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Box>
    </>
  );
};

const AvailableActionsView: React.FC<{
  actions?: Action[];
  addAction: (action: Action) => void;
  projectId?: string;
}> = ({ actions, addAction, projectId }) => {
  const classes = useStyles();
  const handleAdd = (action: Action) => {
    addAction(action)
  }
  return (
    <>
      <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
        <Box flexGrow={1}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"start"} gap={2}>
              {projectId && <AddAction
                projectId={projectId}
                onModalClose={() => { console.log("Add/edit action modal closed") }}
              />}
              {actions && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Available actions: {actions?.length ?? 0}
                </Typography>
              </Box>}
              {!actions && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                No action found, please add some actions in this project
              </Typography>}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.listContainer} pt={2}>
        <Box className={classes.body} px={5}>
          {actions && actions.map((row, index) => (
            <Box mx={5} key={index}>
              <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Box width={"100%"}>
                  <AppCard id={`${index}`}>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} m={3}>
                      <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
                        <Typography
                          variant="subtitle1"
                          color="primary"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          maxWidth="300px"
                        >
                          {row.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="primary"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          maxWidth="300px"
                          mt={2}
                        >
                          {row.selector?.xpath}
                        </Typography>
                      </Box>
                    </Box>
                  </AppCard>
                  {actions && actions.length - 1 > index && <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <Box className={classes.vertLine} />
                  </Box>}
                </Box>
                <Box ml={"auto"}>
                  <Tooltip title={"Remove"}>
                    <IconButton
                      sx={{ padding: 0.5 }}
                      onClick={() => {
                        handleAdd(row);
                      }}
                      data-testid="remove-added-replacement"
                    >
                      {/* <img src={DeleteIcon} alt="close" height="24" width="24" /> */}
                      <img src={AddIcon} alt="close" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
export default AddFlow;
