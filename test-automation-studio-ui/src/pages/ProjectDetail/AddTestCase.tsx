import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Box, Tooltip, TextField, IconButton, Grid, Accordion, AccordionDetails, AccordionSummary, InputLabel, FormControlLabel, Checkbox } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import AddIconWhite from "../../assets/images/add-icon-white.svg";
import { actions } from "../../slices/projects";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { Flow, FlowActionSequence, Input, TestCase, TestCaseFlowSequence } from "../../declarations/interface";
import { createTestCase, updateTestCase } from "../../slices/project";
import { RootState } from "../../store/rootReducer";
import AppCard from "../../components/cards/AppCard";
import DeleteIcon from "../../assets/images/delete-icon.svg";
import { reorder } from "../../util/UtilService";
import { DEFAULT_TEST_CASE } from "./TestCaseContainer";
import { getTestCaseById } from "../../slices/testCase";
import AppSelect from "../../components/AppSelect";
import AddInput from "./AddInput";

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
      borderLeft: `0.5px solid ${theme.palette.primary40.main}`,
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

const AddTestCase: React.FC<{
  testCase?: TestCase;
  projectId: string;
  onModalClose: () => void;
}> = ({ testCase, projectId, onModalClose }) => {
  const classes = useStyles();
  const [data, setData] = useState<TestCase | undefined>();
  const [selectedFlowSequence, setSelectedFlowSequence] = useState<TestCaseFlowSequence[] | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [nameError, setNameError] = useState<
    NameErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add Test Case");
  const { testCase: fetchedTestCase } = useSelector((state: RootState) => state.testCase);
  const { project } = useSelector((state: RootState) => state.project);

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_TEST_CASE, projectId: projectId });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    onModalClose();
    dispatch(actions.clearStatus());
    setSelectedFlowSequence(undefined);
    setData(undefined);
  };
  const handleSubmit = () => {
    handleFieldChange({ target: { value: data?.name } }, "name")
    setSubmitted(true);
  };
  const submitData = () => {
    const updatedSequences: TestCaseFlowSequence[] = [];
    const newSequences: TestCaseFlowSequence[] = [];
    selectedFlowSequence?.filter((sequence: TestCaseFlowSequence) => !sequence.isRemoved).map((sequence: TestCaseFlowSequence, index) => {
      if (sequence.id) {
        updatedSequences.push({ ...sequence, order: index })
      } else {
        newSequences.push({ ...sequence, order: index })
      }
    })
    const removedSequences = selectedFlowSequence?.filter((sequence: TestCaseFlowSequence) => sequence.isRemoved)
    const sequencePayload = {
      updatedSequences, newSequences, removedSequences
    }
    setSubmitted(false);
    handleModalClose();
    if (data?.id.length) {
      dispatch(updateTestCase({ testCase: data, sequences: sequencePayload }));
    } else {
      dispatch(createTestCase({ testCase: data, sequences: newSequences }));
    }
  };
  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any,
    field: keyof Flow
  ) => {
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

  const addNewFlow = (flow: Flow) => {
    const newSequence: TestCaseFlowSequence = {
      flowId: flow.id,
      order: selectedFlowSequence?.length ?? 0,
      flow: {
        ...flow,
        ...(flow.flowActionSequences && {
          flowActionSequences: flow.flowActionSequences.map((sequence: FlowActionSequence) => {
            return {
              ...sequence,
              testCaseFlowSequenceActionInput: {
                defaultInput: true,
                skip: false,
                flowActionSequenceId: sequence.id ?? "",
                inputId: (sequence.action.inputs) ? sequence.action.inputs.find((input: Input) => input.isDefault)?.id ?? "" : "",
                testCaseFlowSequenceId: ""
              }
            }
          })
        })
      },
      testCaseId: fetchedTestCase?.id ?? "",
    }
    setSelectedFlowSequence((prev: TestCaseFlowSequence[] | undefined) => {
      if (prev)
        return [...prev, newSequence];
      return [newSequence];
    })
  }

  const restoreTestCaseFlowSequence = (restoreIndex: number) => {
    setSelectedFlowSequence((prev: TestCaseFlowSequence[] | undefined) => {
      return prev?.map((sequence: TestCaseFlowSequence, index) => {
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

  const removeTestCaseFlowSequence = (removeIndex: number) => {
    setSelectedFlowSequence((prev: TestCaseFlowSequence[] | undefined) => {
      const updatedSequences = prev?.map((sequence: TestCaseFlowSequence, index) => {
        if (removeIndex === index) {
          return {
            ...sequence,
            isRemoved: true
          }
        }
        return sequence;
      })
      return updatedSequences?.filter((sequence: TestCaseFlowSequence, index) => {
        if (!sequence.id && index === removeIndex) {
          return false;
        } else {
          return true;
        }
      })
    })
  }

  const reorderTestCaseFlowSequences = (reorderedTestCaseFlowSequences: TestCaseFlowSequence[]) => {
    setSelectedFlowSequence(reorderedTestCaseFlowSequences);
  }

  useEffect(() => {
    if (data) {
      setModalOpen(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.id.length) {
      setTitle("Update Test Case");
    } else {
      setTitle("Add Test Case");
    }
  }, [modalOpen, data]);

  useEffect(() => {
    if (nameError) return
    if (submitted) submitData();
  }, [submitted]);

  useEffect(() => {
    if (testCase) {
      setData(fetchedTestCase)
      setSelectedFlowSequence(fetchedTestCase?.testCaseFlowSequences)
    }
  }, [fetchedTestCase]);

  useEffect(() => {
    if (testCase) dispatch(getTestCaseById(testCase.id))
  }, [testCase]);

  return (
    <Box>
      <Tooltip title={"Create a new Test Case"}>
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
                  label="Test Case Name"
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
              <Box display={"flex"} gap={2} alignItems={"center"} justifyContent={"center"}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  fullWidth
                  aria-label="save"
                  disabled={!!nameError}
                >
                  <Typography variant="h5" sx={{ textTransform: "capitalize", margin: 1 }}>
                    Save
                  </Typography>
                </Button>
              </Box>
            </Box>
            <Box mt={2}>
              <Grid
                container
                classes={{ container: classes.gridContainer }}
              >
                <Grid item xs={4} classes={{ item: classes.gridItem }} py={2}>
                  <AvailableFlowsView
                    flows={project?.flows}
                    addFlow={addNewFlow} />
                </Grid>
                <Grid item xs={4} classes={{ item: classes.gridItem }} py={2}>
                  <SelectedFlowsView
                    testCaseFlowSequences={selectedFlowSequence}
                    removeTestCaseFlowSequence={removeTestCaseFlowSequence}
                    reorderTestCaseFlowSequences={reorderTestCaseFlowSequences}
                    restoreTestCaseFlowSequence={restoreTestCaseFlowSequence} />
                </Grid>
                <Grid item xs={4} classes={{ item: classes.gridItem }} py={2}>
                  <SequenceInputForm
                    selectedFlowSequence={selectedFlowSequence} setSelectedFlowSequence={setSelectedFlowSequence} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </AppModal>
    </Box>
  );
};

const SequenceInputForm: React.FC<{
  selectedFlowSequence?: TestCaseFlowSequence[];
  setSelectedFlowSequence: React.Dispatch<React.SetStateAction<TestCaseFlowSequence[] | undefined>>;
}> = ({ selectedFlowSequence, setSelectedFlowSequence }) => {
  const classes = useStyles();
  const setActionInput = (event: any, flowActionSequence: FlowActionSequence, testCaseFlowSequence: TestCaseFlowSequence, updateType?: string) => {
    const newValue = (updateType === "default" || updateType === "skip") ? event.target.checked : event.target.value;
    setSelectedFlowSequence((prevTestCaseFlowSequences: TestCaseFlowSequence[] | undefined) => {
      let prev = JSON.parse(JSON.stringify(prevTestCaseFlowSequences))
      prev = prev?.map((prevTestCaseFlowSequence: TestCaseFlowSequence) => {
        if (prevTestCaseFlowSequence.id === testCaseFlowSequence.id) {
          prevTestCaseFlowSequence.flow.flowActionSequences = prevTestCaseFlowSequence.flow.flowActionSequences?.map((prevFlowActionSequence: FlowActionSequence) => {
            if (prevFlowActionSequence.id === flowActionSequence.id) {
              return {
                ...prevFlowActionSequence,
                ...(prevFlowActionSequence.testCaseFlowSequenceActionInput && {
                  testCaseFlowSequenceActionInput: {
                    ...prevFlowActionSequence.testCaseFlowSequenceActionInput,
                    ...(updateType === "default" && { defaultInput: newValue }),
                    ...(updateType === "skip" && { skip: newValue }),
                    // ...((updateType === "default" && !prevFlowActionSequence.testCaseFlowSequenceActionInput.inputId) && {inputId: getDefaultInputIdFromActionInputs}),
                    ...(updateType === "input" && { inputId: newValue }),
                  }
                })
              }
            }
            return prevFlowActionSequence;
          })
        }
        return prevTestCaseFlowSequence;
      })
      return prev;
    })
  }
  const getInputOptions = (inputs: Input[]) => {
    return inputs.map((input) => ({
      label: input.name, value: input.id
    }))
  }
  const getSelectedInput = (inputs: Input[], inputId?: string) => {
    return inputs.find((input) => input.id === inputId)?.id ?? ""
  }
  return (
    <>
      <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
        <Box flexGrow={1}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            {selectedFlowSequence && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Provide inputs for the actions
              </Typography>
            </Box>}
            {!selectedFlowSequence && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
              No flow added in this test case
            </Typography>}
          </Box>
        </Box>
      </Box>
      <Box className={classes.listContainer} pt={2}>
        <Box className={classes.body} px={3}>
          {selectedFlowSequence && selectedFlowSequence.map((row, index) => (
            <Box key={index}>
              {!row.isRemoved && <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Box width={"100%"} sx={{
                  opacity: row.isRemoved ? 0.5 : 1
                }}>
                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} my={2}>
                    <Typography variant="h5">
                      {row.flow.name}
                    </Typography>
                  </Box>
                  {row.flow.flowActionSequences && row.flow.flowActionSequences.map((flowActionSequence: FlowActionSequence, index) => (<Box key={index}>
                    <AppCard id={`${index}`}>
                      <Box>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} m={2} position="relative">
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxWidth="300px"
                          >
                            {flowActionSequence.action.name}
                          </Typography>
                        </Box>
                        <Box display={"flex"} alignItems={""} justifyContent={"space-between"}>
                          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <Checkbox checked={flowActionSequence.testCaseFlowSequenceActionInput?.skip} onChange={(event) => {
                              setActionInput(event, flowActionSequence, row, "skip");
                            }} />
                            <InputLabel sx={{ marginTop: 0.25 }}>
                              Skip this action
                            </InputLabel>
                          </Box>
                          {!flowActionSequence.testCaseFlowSequenceActionInput?.skip && <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <Checkbox checked={flowActionSequence.testCaseFlowSequenceActionInput?.defaultInput} onChange={(event) => {
                              setActionInput(event, flowActionSequence, row, "default");
                            }} />
                            <InputLabel sx={{ marginTop: 0.25 }}>
                              Use default input
                            </InputLabel>
                          </Box>}
                          {!flowActionSequence.testCaseFlowSequenceActionInput?.skip && <Box>
                            <AppSelect
                              id={`action-input-dropdown`}
                              value={getSelectedInput(flowActionSequence.action.inputs ?? [], flowActionSequence.testCaseFlowSequenceActionInput?.inputId)}
                              onChange={(event) => {
                                setActionInput(event, flowActionSequence, row, "input");
                              }} options={getInputOptions(flowActionSequence.action.inputs ?? [])} label="Select Action Input" />
                          </Box>}
                          {/* <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <AddInput
                              actionId={flowActionSequence.action.id}
                              onModalClose={() => { console.log("Add/edit input modal closed") }}
                            />
                            <InputLabel sx={{ marginTop: 0.25 }}>
                              Add new input
                            </InputLabel>
                          </Box> */}
                        </Box>
                      </Box>
                    </AppCard>
                    {row.flow.flowActionSequences && row.flow.flowActionSequences.length - 1 > index &&
                      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                        <Box className={classes.vertLine} />
                      </Box>}
                  </Box>))}
                </Box>
              </Box>}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

const SelectedFlowsView: React.FC<{
  testCaseFlowSequences?: TestCaseFlowSequence[];
  removeTestCaseFlowSequence: (index: number) => void;
  reorderTestCaseFlowSequences: (reorderedTestCaseFlowSequences: TestCaseFlowSequence[]) => void;
  restoreTestCaseFlowSequence: (index: number) => void;
}> = ({ testCaseFlowSequences, removeTestCaseFlowSequence, reorderTestCaseFlowSequences, restoreTestCaseFlowSequence }) => {
  const classes = useStyles();
  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    if (testCaseFlowSequences) {
      const reorderedTestCaseFlowSequences = reorder(
        [...testCaseFlowSequences],
        source.index,
        destination.index
      );
      reorderTestCaseFlowSequences(reorderedTestCaseFlowSequences);
    }
  };
  return (
    <>
      <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
        <Box flexGrow={1}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            {testCaseFlowSequences && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Selected: {testCaseFlowSequences.filter((x) => !x.isRemoved)?.length ?? 0}
              </Typography>
            </Box>}
            {!testCaseFlowSequences && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
              Add Flows to this Test Case
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
                  {testCaseFlowSequences && testCaseFlowSequences.map((row, index) => (
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
                                  <Box display={"flex"} alignItems={"center"} justifyContent={"center"} m={5} position="relative">
                                    <Typography
                                      variant="subtitle1"
                                      color="primary"
                                      overflow="hidden"
                                      textOverflow="ellipsis"
                                      maxWidth="300px"
                                    >
                                      {row.flow.name}
                                    </Typography>
                                    {!row.id && <Typography
                                      variant="h6"
                                      color="secondary"
                                      position="absolute"
                                      right={"-40px"}
                                      top={"-40px"}
                                    >
                                      New
                                    </Typography>}
                                  </Box>
                                </AppCard>
                                {testCaseFlowSequences && testCaseFlowSequences.length - 1 > index &&
                                  <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                    <Box className={classes.vertLine} />
                                  </Box>}
                              </Box>
                              {!row.isRemoved && <Box ml={"auto"}>
                                <Tooltip title={"Remove"}>
                                  <IconButton
                                    sx={{ padding: 0.5 }}
                                    onClick={() => {
                                      removeTestCaseFlowSequence(index);
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
                                      restoreTestCaseFlowSequence(index);
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

const AvailableFlowsView: React.FC<{
  flows?: Flow[];
  addFlow: (flow: Flow) => void;
}> = ({ flows, addFlow }) => {
  const classes = useStyles();
  const handleAdd = (flow: Flow) => {
    addFlow(flow)
  }
  return (
    <>
      <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
        <Box flexGrow={1}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"start"} gap={2}>
              {flows && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Available flows: {flows?.length ?? 0}
                </Typography>
              </Box>}
              {!flows && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                No flow found, please add some flows in this project
              </Typography>}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.listContainer} pt={2}>
        <Box className={classes.body} px={5}>
          {flows && flows.map((row, index) => (
            <Box mx={5} key={index}>
              <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Box width={"100%"}>
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
                  {flows && flows.length - 1 > index && <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
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
                      data-testid="add-flow-sequence"
                    >
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
export default AddTestCase;
