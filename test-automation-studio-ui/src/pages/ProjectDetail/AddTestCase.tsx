import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Box, Tooltip, IconButton, Grid, InputLabel, Checkbox } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { Assertion, Flow, FlowActionSequence, Input, TestCase, TestCaseFlowSequence } from "../../declarations/interface";
import { createTestCase, updateTestCase } from "../../slices/testCases";
import { actions as flowsActions } from "../../slices/flows";
import { RootState } from "../../store/rootReducer";
import AppCard from "../../components/cards/AppCard";
import DeleteIcon from "../../assets/images/delete-icon.svg";
import { reorder } from "../../util/UtilService";
import { actions, getTestCaseById } from "../../slices/testCase";
import AppSelect from "../../components/AppSelect";
import AddInput from "./AddInput";
import { BOOLEAN_ACITON_TYPES, DEFAULT_ASSERTION, DEFAULT_TEST_CASE, GET_ASSERTION_OPTIONS_FORMATTED, OPERATOR_TYPES } from "../../util/constants";
import AddFlow from "./AddFlow";

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
  const [selectedFlowSequences, setselectedFlowSequences] = useState<TestCaseFlowSequence[] | undefined>();
  const [assertions, setAssertions] = useState<Assertion[] | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [skipActionInfo, setSkipActionInfo] = useState<{ id: string; skip: boolean } | undefined>(undefined);

  const [nameError, setNameError] = useState<
    NameErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add Test Case");
  const { testCase: fetchedTestCase } = useSelector((state: RootState) => state.testCase);
  const { flows } = useSelector((state: RootState) => state.flows);
  const { newInput } = useSelector((state: RootState) => state.actions);

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_TEST_CASE, projectId: projectId });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    setStep(0);
    onModalClose();
    dispatch(actions.clearStatus());
    setselectedFlowSequences(undefined);
    setAssertions(undefined);
    setData(undefined);
  };
  const handleSubmit = () => {
    handleFieldChange({ target: { value: data?.name } }, "name")
    setSubmitted(true);
  };
  const submitData = () => {
    const updatedSequences: TestCaseFlowSequence[] = [];
    const newSequences: TestCaseFlowSequence[] = [];
    selectedFlowSequences?.filter((sequence: TestCaseFlowSequence) => !sequence.isRemoved).map((sequence: TestCaseFlowSequence, index) => {
      if (sequence.id) {
        updatedSequences.push({ ...sequence, order: index })
      } else {
        newSequences.push({ ...sequence, order: index })
      }
    })
    const removedSequences = selectedFlowSequences?.filter((sequence: TestCaseFlowSequence) => sequence.isRemoved)
    const sequencePayload = {
      updatedSequences, newSequences, removedSequences
    }
    setSubmitted(false);
    handleModalClose();
    if (data?.id.length) {
      dispatch(updateTestCase({ testCase: data, sequences: sequencePayload, assertions: assertions ?? [] }));
    } else {
      dispatch(createTestCase({ testCase: data, sequences: newSequences, assertions: assertions ?? [] }));
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

  const addNewFlow = (flow: Flow) => {
    const newSequence: TestCaseFlowSequence = {
      testCaseFlowSequenceTempId: `${new Date().getTime()}`,
      flowId: flow.id,
      order: selectedFlowSequences?.length ?? 0,
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
    setselectedFlowSequences((prev: TestCaseFlowSequence[] | undefined) => {
      if (prev)
        return [...prev, newSequence];
      return [newSequence];
    })
  }

  const restoreTestCaseFlowSequence = (restoreIndex: number) => {
    removeAssertion(restoreIndex, false)
    setselectedFlowSequences((prev: TestCaseFlowSequence[] | undefined) => {
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

  const removeAssertion = (removeIndex: number, remove: boolean) => {
    const removedSequence = selectedFlowSequences && selectedFlowSequences[removeIndex];
    if (removedSequence) {
      const options = GET_ASSERTION_OPTIONS_FORMATTED([removedSequence], false)
        .map((option) => option.value).flat();
      setAssertions((prev: Assertion[] | undefined) => {
        if (prev) {
          return prev.map((prevAssertion: Assertion) => {
            if (prevAssertion.source) {
              if (options.includes(prevAssertion.source)) {
                return {
                  ...prevAssertion,
                  isRemoved: remove
                }
              }
            }
            if (prevAssertion.target) {
              if (options.includes(prevAssertion.target)) {
                return {
                  ...prevAssertion,
                  isRemoved: remove
                }
              }
            }
            return prevAssertion;
          }).filter((prevAssertion: Assertion) => {
            if (prevAssertion.isRemoved && (prevAssertion.source?.includes("Temp") || prevAssertion.target?.includes("Temp"))) {
              return false;
            }
            return true;
          })
        }
        return prev;
      })
    }
  }

  const removeTestCaseFlowSequence = (removeIndex: number) => {
    removeAssertion(removeIndex, true)
    setselectedFlowSequences((prev: TestCaseFlowSequence[] | undefined) => {
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
    setselectedFlowSequences(reorderedTestCaseFlowSequences);
  }

  const getSelectedFlowSequences = () => {
    let prev = JSON.parse(JSON.stringify(fetchedTestCase?.testCaseFlowSequences))
    prev = prev?.map((prevTestCaseFlowSequence: TestCaseFlowSequence) => {
      prevTestCaseFlowSequence.flow.flowActionSequences = prevTestCaseFlowSequence.flow.flowActionSequences?.map((prevFlowActionSequence: FlowActionSequence) => {
        if (!prevFlowActionSequence.testCaseFlowSequenceActionInput) {
          prevFlowActionSequence.testCaseFlowSequenceActionInput = {
            defaultInput: true,
            skip: false,
            flowActionSequenceId: prevFlowActionSequence.id ?? "",
            inputId: (prevFlowActionSequence.action.inputs) ? prevFlowActionSequence.action.inputs.find((input: Input) => input.isDefault)?.id ?? "" : "",
            testCaseFlowSequenceId: prevTestCaseFlowSequence.id ?? ""
          }
        }
        return prevFlowActionSequence
      })
      return prevTestCaseFlowSequence;
    })
    return prev;
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
    if (newInput) {
      dispatch(flowsActions.addNewInput(newInput))
      dispatch(actions.addNewInput(newInput))
    }
  }, [newInput]);

  useEffect(() => {
    if (testCase) {
      setData(fetchedTestCase)
      setselectedFlowSequences(getSelectedFlowSequences())
      const loadedAssertions = fetchedTestCase?.assertions?.map((assertion: Assertion) => {
        const options = GET_ASSERTION_OPTIONS_FORMATTED(getSelectedFlowSequences());
        let option = options.find((option) => option.value === assertion.source);
        if (!option) {
          return {
            ...assertion,
            isRemoved: true,
            unRestorable: true
          }
        }
        if (assertion.useCustomTargetValue) return assertion;
        option = options.find((option) => option.value === assertion.target);
        if (option) {
          return assertion;
        } else {
          return {
            ...assertion,
            isRemoved: true,
            unRestorable: true
          }
        }
      })
      setAssertions(loadedAssertions)
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
                {step === 0 && <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleModalClose}
                  fullWidth
                  aria-label="back"
                >
                  <Typography variant="h5" sx={{ textTransform: "capitalize", margin: 1 }}>
                    Cancel
                  </Typography>
                </Button>}
                {step === 0 && <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => { setStep(1) }}
                  fullWidth
                  aria-label="cancel"
                  disabled={!!nameError}
                >
                  <Typography variant="h5" sx={{ textTransform: "capitalize", margin: 1 }}>
                    Next
                  </Typography>
                </Button>}
                {step === 1 && <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => { setStep(0) }}
                  fullWidth
                  aria-label="back"
                >
                  <Typography variant="h5" sx={{ textTransform: "capitalize", margin: 1 }}>
                    Back
                  </Typography>
                </Button>}
                {step === 1 && <Button
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
                </Button>}
              </Box>
            </Box>
            <Box mt={2}>
              <Grid
                container
                classes={{ container: classes.gridContainer }}
              >
                {step === 0 && <Grid item xs={4} classes={{ item: classes.gridItem }} py={2}>
                  <AvailableFlowsView
                    flows={flows}
                    addFlow={addNewFlow} projectId={projectId} />
                </Grid>}
                <Grid item xs={4} classes={{ item: classes.gridItem }} py={2}>
                  <SelectedFlowsView
                    testCaseFlowSequences={selectedFlowSequences}
                    removeTestCaseFlowSequence={removeTestCaseFlowSequence}
                    reorderTestCaseFlowSequences={reorderTestCaseFlowSequences}
                    restoreTestCaseFlowSequence={restoreTestCaseFlowSequence} />
                </Grid>
                <Grid item xs={4} classes={{ item: classes.gridItem }} py={2}>
                  <SequenceInputForm
                    selectedFlowSequences={selectedFlowSequences} setselectedFlowSequences={setselectedFlowSequences} setSkipActionInfo={setSkipActionInfo} />
                </Grid>
                {step === 1 && <Grid item xs={4} classes={{ item: classes.gridItem }} py={2}>
                  <Assertions assertions={assertions} setAssertions={setAssertions} selectedFlowSequences={selectedFlowSequences} fetchedTestCase={fetchedTestCase} skipActionInfo={skipActionInfo} />
                </Grid>}
              </Grid>
            </Box>
          </Box>
        )}
      </AppModal>
    </Box>
  );
};

const Assertions: React.FC<{
  assertions?: Assertion[];
  setAssertions: React.Dispatch<React.SetStateAction<Assertion[] | undefined>>;
  selectedFlowSequences: TestCaseFlowSequence[] | undefined;
  fetchedTestCase?: TestCase;
  skipActionInfo?: { id: string; skip: boolean };
}> = ({ assertions, setAssertions, selectedFlowSequences, fetchedTestCase, skipActionInfo }) => {
  const classes = useStyles();

  const restoreAssertion = (restoreIndex: number) => {
    setAssertions((prev: Assertion[] | undefined) => {
      return prev?.map((assertion: Assertion, index) => {
        if (restoreIndex === index) {
          return {
            ...assertion,
            isRemoved: false
          }
        }
        return assertion;
      })
    })
  }

  const removeAssertion = (removeIndex: number) => {
    setAssertions((prev: Assertion[] | undefined) => {
      const updatedSequences = prev?.map((assertion: Assertion, index) => {
        if (removeIndex === index) {
          return {
            ...assertion,
            isRemoved: true
          }
        }
        return assertion;
      })
      return updatedSequences?.filter((assertion: Assertion, index) => {
        if (!assertion.id && index === removeIndex) {
          return false;
        } else {
          return true;
        }
      })
    })
  }

  const addNewAssertion = () => {
    setAssertions((prev) => {
      if (prev) return [...prev, {
        ...DEFAULT_ASSERTION,
        ...(fetchedTestCase && fetchedTestCase.id && { testCaseId: fetchedTestCase.id })
      }];
      return [{
        ...DEFAULT_ASSERTION,
        ...(fetchedTestCase && fetchedTestCase.id && { testCaseId: fetchedTestCase.id })
      }];
    })
  }

  const setAssertInput = (event: any,
    index: number,
    field: 'skip' | 'source' | 'target' | 'operator'
      | 'useCustomTargetValue' | 'customTargetValue' | 'errorMessage') => {
    const value = (field === "skip" || field === "useCustomTargetValue") ? event.target.checked : event.target.value;
    setAssertions((prev: Assertion[] | undefined) => {
      return prev?.map((prevAssertion: Assertion, prevIndex: number) => {
        if (prevIndex === index) {
          if (field === 'useCustomTargetValue') {
            return {
              ...prevAssertion,
              [field]: value,
              target: undefined
            }
          }
          return {
            ...prevAssertion,
            [field]: value
          }
        }
        return prevAssertion
      })
    })
  }

  const getOptions = (excludeValue?: string, forSource?: boolean) => {
    const options = GET_ASSERTION_OPTIONS_FORMATTED(selectedFlowSequences, true, forSource).filter((x) => x.value !== excludeValue) ?? []
    return options
  }

  const customInputOption = (row: Assertion, index: number, sourceId?: string) => {
    const options = getOptions();
    const optionType = options.find((option) => option.value === sourceId)?.type;
    if (optionType && BOOLEAN_ACITON_TYPES.includes(optionType)) {
      return <AppSelect
        id={`action-input-dropdown`}
        value={row.customTargetValue ?? ""}
        onChange={(event) => {
          setAssertInput(event, index, "customTargetValue");
        }} options={[{ label: 'True', value: 'TRUE' }, { label: 'False', value: 'FALSE' }]} label="Target" disabled={row.isRemoved} />
    }
    return <AppTextbox
      label="Target"
      placeholder="Enter Custom target value"
      value={row.customTargetValue}
      onChange={(event) => {
        setAssertInput(event, index, "customTargetValue");
      }}
      classes={{ root: classes.input }} disabled={row.isRemoved}
    />
  }

  useEffect(() => {
    if (skipActionInfo) {
      const { id, skip } = skipActionInfo
      assertions?.map((assertion, index) => {
        if (assertion.source === id || assertion.target === id) {
          setAssertInput({ target: { checked: skip } }, index, 'skip')
        }
      })
    }
  }, [skipActionInfo])

  return (
    <>
      <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
        <Box flexGrow={1}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"start"} gap={1}>
            <Tooltip title={"Add new action for this project"}>
              <IconButton
                sx={{ padding: 0.5 }}
                onClick={addNewAssertion}
                data-testid="add-new-assertion"
              >
                <img src={AddIcon} alt="close" />
              </IconButton>
            </Tooltip>
            {assertions && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                <b>Assertions:</b> {assertions.length}
              </Typography>
            </Box>}
            {!assertions &&
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Create a new Assertion
              </Typography>}
          </Box>
        </Box>
      </Box>
      <Box className={classes.listContainer} pt={2}>
        <Box className={classes.body} px={3}>
          {assertions && assertions.map((row, index) => (
            <Box key={index} mb={2} sx={{
              opacity: row.isRemoved ? 0.5 : 1
            }}>
              <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Box width={"100%"}>
                  <AppCard id={`${index}`}>
                    <Box>
                      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} position="relative">
                        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} position="relative">
                          <Tooltip title={"Skip this assertion"}>
                            <Checkbox checked={row.skip} onChange={(event) => {
                              setAssertInput(event, index, "skip");
                            }} disabled={row.isRemoved} />
                          </Tooltip>
                          <Typography variant="subtitle1">Skip this assert</Typography>
                        </Box>
                        {!row.skip && <Box display={"flex"} alignItems={"center"} justifyContent={"center"} position="relative">
                          <Tooltip title={"Use Custom target value"}>
                            <Checkbox checked={row.useCustomTargetValue} onChange={(event) => {
                              setAssertInput(event, index, "useCustomTargetValue");
                            }} disabled={row.isRemoved} />
                          </Tooltip>
                          <Typography variant="subtitle1">Use Custom target value</Typography>
                        </Box>}
                      </Box>
                      {!row.skip &&
                        <Box mt={2}>
                          <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <AppSelect
                              id={`action-input-dropdown`}
                              value={row.source ?? ""}
                              onChange={(event) => {
                                setAssertInput(event, index, "source");
                              }} options={getOptions(row.target, true)} label="Source" disabled={row.isRemoved} />
                            <AppSelect
                              id={`action-input-dropdown`}
                              value={row.operator ?? ""}
                              onChange={(event) => {
                                setAssertInput(event, index, "operator");
                              }} options={OPERATOR_TYPES} label="Operator" disabled={row.isRemoved} />
                            {!row.useCustomTargetValue && <AppSelect
                              id={`action-input-dropdown`}
                              value={row.target ?? ""}
                              onChange={(event) => {
                                setAssertInput(event, index, "target");
                              }} options={getOptions(row.source)} label="Target" disabled={row.isRemoved} />}
                            {row.useCustomTargetValue && customInputOption(row, index, row.source)}
                          </Box>
                        </Box>
                      }
                      {!row.skip &&
                        <Box mt={2}>
                          <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={1}>
                            <AppTextbox
                              label="Error Message"
                              placeholder="Enter Error Message"
                              value={row.errorMessage}
                              onChange={(event) => {
                                setAssertInput(event, index, "errorMessage");
                              }}
                              classes={{ root: classes.input }} disabled={row.isRemoved}
                            />
                          </Box>
                        </Box>}
                    </Box>
                    {row.unRestorable && <Typography mt={2} variant="subtitle2" color="error">Action mapped with this assertion is no longer included in the flow. Updating this Test Case will remove this Assertion</Typography>}
                  </AppCard>
                </Box>
                {!row.isRemoved && <Box ml={"auto"}>
                  <Tooltip title={"Remove"}>
                    <IconButton
                      sx={{ padding: 0.5 }}
                      onClick={() => {
                        removeAssertion(index);
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
                        restoreAssertion(index);
                      }}
                      data-testid="restore-removed-sequence"
                    >
                      <img src={AddIcon} alt="close" height="24" width="24" />
                    </IconButton>
                  </Tooltip>
                </Box>}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

const SequenceInputForm: React.FC<{
  selectedFlowSequences?: TestCaseFlowSequence[];
  setselectedFlowSequences: React.Dispatch<React.SetStateAction<TestCaseFlowSequence[] | undefined>>;
  setSkipActionInfo: React.Dispatch<React.SetStateAction<{ id: string; skip: boolean } | undefined>>;
}> = ({ selectedFlowSequences, setselectedFlowSequences, setSkipActionInfo }) => {
  const classes = useStyles();
  const setActionInput = (event: any, flowActionSequence: FlowActionSequence, testCaseFlowSequence: TestCaseFlowSequence, updateType?: string) => {
    const newValue = (updateType === "default" || updateType === "skip") ? event.target.checked : event.target.value;
    if (updateType === "skip") {
      let tempId = `flowActionSequenceId:${flowActionSequence.id}`;
      if (testCaseFlowSequence.testCaseFlowSequenceTempId) {
        tempId = `testCaseFlowSequenceTempId:${testCaseFlowSequence.testCaseFlowSequenceTempId}::${tempId}`;
      } else {
        tempId = `testCaseFlowSequenceId:${testCaseFlowSequence.id}::${tempId}`;
      }
      setSkipActionInfo({ id: tempId, skip: newValue })
    }
    setselectedFlowSequences((prevTestCaseFlowSequences: TestCaseFlowSequence[] | undefined) => {
      let prev = JSON.parse(JSON.stringify(prevTestCaseFlowSequences))
      prev = prev?.map((prevTestCaseFlowSequence: TestCaseFlowSequence) => {
        if (prevTestCaseFlowSequence.id === testCaseFlowSequence.id) {
          prevTestCaseFlowSequence.flow.flowActionSequences = prevTestCaseFlowSequence.flow.flowActionSequences?.map((prevFlowActionSequence: FlowActionSequence) => {
            if (prevFlowActionSequence.id === flowActionSequence.id) {
              if (!prevFlowActionSequence.testCaseFlowSequenceActionInput) {
                prevFlowActionSequence.testCaseFlowSequenceActionInput = {
                  testCaseFlowSequenceId: testCaseFlowSequence.id ?? "",
                  flowActionSequenceId: flowActionSequence.id ?? "",
                  inputId: "",
                  defaultInput: true,
                  skip: false
                }
              }
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
            {selectedFlowSequences && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Provide inputs for the actions
              </Typography>
            </Box>}
            {!selectedFlowSequences && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
              No flow added in this Test Case
            </Typography>}
          </Box>
        </Box>
      </Box>
      <Box className={classes.listContainer} pt={2}>
        <Box className={classes.body} px={3}>
          {selectedFlowSequences && selectedFlowSequences.map((row, index) => (
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
                          <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
                            <Typography
                              variant="subtitle1"
                              color="primary"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              maxWidth="300px"
                            >
                              {flowActionSequence.action.name}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="primary"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              maxWidth="300px"
                              mt={2}
                            >
                              {flowActionSequence.action.selector?.xpath}
                            </Typography>
                          </Box>
                        </Box>
                        <Grid container>
                          <Grid item xs={3} >
                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                              <Checkbox checked={flowActionSequence.testCaseFlowSequenceActionInput?.skip} onChange={(event) => {
                                setActionInput(event, flowActionSequence, row, "skip");
                              }} />
                              <InputLabel sx={{ marginTop: 0.25 }}>
                                Skip this action
                              </InputLabel>
                            </Box>
                          </Grid>
                          {!flowActionSequence.testCaseFlowSequenceActionInput?.skip && <Grid item xs={4} >
                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                              <Checkbox checked={flowActionSequence.testCaseFlowSequenceActionInput?.defaultInput} onChange={(event) => {
                                setActionInput(event, flowActionSequence, row, "default");
                              }} />
                              <InputLabel sx={{ marginTop: 0.25 }}>
                                Use default input
                              </InputLabel>
                            </Box>
                          </Grid>}
                          {!flowActionSequence.testCaseFlowSequenceActionInput?.skip && <Grid item xs={4} >
                            <Box minWidth={"25px"}>
                              <AppSelect
                                id={`action-input-dropdown`}
                                value={getSelectedInput(flowActionSequence.action.inputs ?? [], flowActionSequence.testCaseFlowSequenceActionInput?.inputId)}
                                onChange={(event) => {
                                  setActionInput(event, flowActionSequence, row, "input");
                                }} options={getInputOptions(flowActionSequence.action.inputs ?? [])} label="Select Action Input" />
                            </Box>
                          </Grid>}
                          <Grid item xs={1}>
                            <Box display={"flex"} alignItems={"center"} justifyItems={"center"} flexDirection={"column"}>
                              <AddInput action={flowActionSequence.action} onModalClose={() => { console.log("Input model closed") }} />
                            </Box>
                          </Grid>
                        </Grid>
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
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [removeIndex, setRemoveIndex] = useState<number | undefined>()

  const handleRemove = (index: number) => {
    setRemoveIndex(index)
    setRemoveModalOpen(true);
  }

  const handleRemoveModalClose = () => {
    setRemoveIndex(undefined)
    setRemoveModalOpen(false);
  };

  const confirmRemove = () => {
    if (removeIndex !== undefined)
      removeTestCaseFlowSequence(removeIndex)
    handleRemoveModalClose()
  };

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
                                      handleRemove(index);
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
      <RemoveSequenceModal removeModalOpen={removeModalOpen} handleRemoveModalClose={handleRemoveModalClose} confirmRemove={confirmRemove} />
    </>
  );
};

const RemoveSequenceModal: React.FC<{
  removeModalOpen: boolean
  handleRemoveModalClose: () => void
  confirmRemove: () => void
}> = ({
  removeModalOpen, handleRemoveModalClose, confirmRemove
}) => {
    return <AppModal
      open={removeModalOpen}
      onClose={handleRemoveModalClose}
      header={
        <Typography
          variant="h5"
          color="primaryHighlight.main"
          sx={{ fontWeight: 600 }}
        >
          REMOVE FLOW
        </Typography>
      }
    >
      <Box mb={0.5}>
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: 400, textAlign: "center" }}
        >
          Are you sure that you want to remove this sequence? This will remove all assertions mapped to this flow actions.
        </Typography>
        <Box display="flex" flexDirection="column" gap="8px" mt={2.75}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              padding: 1.5,
            }}
            onClick={handleRemoveModalClose}
          >
            <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
              Cancel
            </Typography>
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              padding: 1.5,
            }}
            onClick={confirmRemove}
            aria-label="Confirm delete"
          >
            <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
              Remove
            </Typography>
          </Button>
        </Box>
      </Box>
    </AppModal>
  }

const AvailableFlowsView: React.FC<{
  flows?: Flow[];
  addFlow: (flow: Flow) => void;
  projectId?: string;
}> = ({ flows, addFlow, projectId }) => {
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
              {projectId && <AddFlow
                projectId={projectId}
                onModalClose={() => { console.log("Add/edit action modal closed") }}
              />}
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
