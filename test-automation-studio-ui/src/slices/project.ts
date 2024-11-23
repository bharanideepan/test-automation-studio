import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProjectService from "../services/projectService";
import ActionService from "../services/actionService";
import InputService from "../services/inputService";
import FlowService from "../services/flowService";
import FlowActionSequenceService from "../services/flowActionSequenceService";
import TestCaseFlowSequenceService from "../services/testCaseFlowSequenceService";
import TestCaseService from "../services/testCaseService";
import {
  Action,
  Assertion,
  Flow,
  FlowActionSequence,
  Input,
  Project,
  TestCase,
  TestCaseFlowSequence,
} from "../declarations/interface";
import inputService from "../services/inputService";

export const getProjectById: any = createAsyncThunk(
  "project/getProjectById",
  async (id: string) => {
    return ProjectService.getProjectById(id);
  }
);

export const updateProjectName: any = createAsyncThunk(
  "project/updateProjectName",
  async ({ id, name }: { id: string; name: string }) => {
    return ProjectService.updateProjectName(id, name);
  }
);

export const createAction: any = createAsyncThunk(
  "project/createAction",
  async (action: Action) => {
    const createdAction: any = await ActionService.createAction(action);
    const createdInput = await inputService.createInput({
      actionId: createdAction.id,
      isDefault: true,
      name: "Input 01",
      id: "",
      value: ""
    })
    return { ...createdAction, inputs: [createdInput] };
  }
);
export const updateAction: any = createAsyncThunk(
  "project/updateAction",
  async (action: Action) => {
    return ActionService.updateAction(action);
  }
);
export const deleteAction: any = createAsyncThunk(
  "project/deleteAction",
  async (id: string) => {
    return ActionService.deleteAction(id);
  }
);

export const createInput: any = createAsyncThunk(
  "project/createInput",
  async (input: Input) => {
    return InputService.createInput(input);
  }
);
export const updateInput: any = createAsyncThunk(
  "project/updateInput",
  async (input: Input) => {
    return InputService.updateInput(input);
  }
);
export const setDefaultInput: any = createAsyncThunk(
  "project/setDefaultInput",
  async (input: Input) => {
    return InputService.setDefaultInput(input);
  }
);

export const createFlow: any = createAsyncThunk(
  "project/createFlow",
  async (payload: { flow: Flow, flowActionSequences: FlowActionSequence[] }) => {
    const createdFlow: any = await FlowService.createFlow(payload.flow);
    await FlowActionSequenceService.createSequences(payload.flowActionSequences.map(
      (map: FlowActionSequence) => ({ ...map, flowId: createdFlow.id }))
    );
    return await FlowService.getFlowById(createdFlow.id);
  }
);
export const updateFlow: any = createAsyncThunk(
  "project/updateFlow",
  async (payload: {
    flow: Flow, sequences: {
      updatedSequences: FlowActionSequence[], newSequences: FlowActionSequence[], removedSequences: string[]
    }
  }) => {
    await FlowActionSequenceService.updateSequences(payload.sequences);
    const updatedFlow: any = await FlowService.updateFlow(payload.flow);
    return await FlowService.getFlowById(updatedFlow.id);
  }
);

export const createTestCase: any = createAsyncThunk(
  "project/createTestCase",
  async (payload: { testCase: TestCase, sequences: TestCaseFlowSequence[], assertions: Assertion[] }) => {
    return await TestCaseService.createTestCaseData(payload);
  }
);

export const updateTestCase: any = createAsyncThunk(
  "project/updateTestCase",
  async (payload: {
    testCase: TestCase, sequences: {
      updatedSequences: TestCaseFlowSequence[], newSequences: TestCaseFlowSequence[], removedSequences: string[]
    }, assertions: Assertion[]
  }) => {
    return await TestCaseService.updateTestCaseData(payload);
  }
);

const DEFAULT: {
  project?: Project;
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "project",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProjectById.fulfilled, (state, action) => {
      state.project = action.payload;
    })
    builder.addCase(getProjectById.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching project details",
      };
    })
    builder.addCase(updateProjectName.fulfilled, (state) => {
      state.status = {
        type: "SUCCESS",
        message: "Project name updated successfully",
      };
    })
    builder.addCase(updateProjectName.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating project name",
      };
    })
    builder.addCase(createTestCase.fulfilled, (state, action) => {
      const testCaseData = action.payload.testCase;
      if (state.project) {
        state.project.testCases = [...state.project.testCases, testCaseData];
      }
      state.status = {
        type: "SUCCESS",
        message: "Test Case created successfully",
      };
    })
    builder.addCase(createTestCase.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating Test Case",
      };
    })
    builder.addCase(updateTestCase.fulfilled, (state, action) => {
      const updatedTestCase = action.payload.testCase;
      if (state.project) {
        state.project.testCases = state.project.testCases.map(
          (testCase: TestCase) => {
            if (testCase.id === updatedTestCase.id) {
              return updatedTestCase;
            }
            return testCase;
          }
        );
      }
      state.status = {
        type: "SUCCESS",
        message: "Test Case updated successfully",
      };
    })
    builder.addCase(updateTestCase.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating Test Case",
      };
    })
    builder.addCase(createFlow.fulfilled, (state, action) => {
      const flowData = action.payload;
      if (state.project) {
        state.project.flows = [...state.project.flows, flowData];
      }
      state.status = {
        type: "SUCCESS",
        message: "Flow created successfully",
      };
    })
    builder.addCase(createFlow.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating flow",
      };
    })
    builder.addCase(updateFlow.fulfilled, (state, action) => {
      const updatedFlow = action.payload;
      if (state.project) {
        state.project.flows = state.project.flows.map(
          (flow: Flow) => {
            if (flow.id === updatedFlow.id) {
              return updatedFlow;
            }
            return flow;
          }
        );
      }
      state.status = {
        type: "SUCCESS",
        message: "Flow updated successfully",
      };
    })
    builder.addCase(updateFlow.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating Flow",
      };
    })
    builder.addCase(createAction.fulfilled, (state, action) => {
      const actionData = action.payload;
      if (state.project) {
        state.project.actions = [...state.project.actions, actionData];
      }
      state.status = {
        type: "SUCCESS",
        message: "Action created successfully",
      };
    })
    builder.addCase(createAction.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating action",
      };
    })
    builder.addCase(updateAction.fulfilled, (state, action) => {
      const updatedAction = action.payload;
      if (state.project) {
        state.project.actions = state.project.actions.map(
          (action: Action) => {
            if (action.id === updatedAction.id) {
              return updatedAction;
            }
            return action;
          }
        );
      }
      state.status = {
        type: "SUCCESS",
        message: "Action updated successfully",
      };
    })
    builder.addCase(updateAction.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating action",
      };
    })
    builder.addCase(deleteAction.fulfilled, (state, action) => {
      const { id } = action.payload;
      if (state.project) {
        state.project.actions = state.project.actions.filter(
          (action: Action) => action.id !== id
        );
      }
      state.status = {
        type: "SUCCESS",
        message: "Action deleted successfully",
      };
    })
    builder.addCase(deleteAction.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while deleting action",
      };
    })
    builder.addCase(createInput.fulfilled, (state, action) => {
      const createdInput = action.payload;
      if (state.project) {
        state.project.actions = state.project.actions.map(
          (action: Action) => {
            if (action.id === createdInput.actionId) {
              action.inputs = [...action.inputs ?? [], createdInput]
              return action;
            }
            return action;
          }
        );
      }
      state.status = {
        type: "SUCCESS",
        message: "Input created successfully",
      };
    })
    builder.addCase(createInput.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating input",
      };
    })
    builder.addCase(updateInput.fulfilled, (state, action) => {
      const updatedInput = action.payload;
      if (state.project) {
        state.project.actions = state.project.actions.map(
          (action: Action) => {
            if (action.id === updatedInput.actionId) {
              action.inputs = action.inputs?.map((input: Input) => {
                if (input.id === updatedInput.id) {
                  return updatedInput;
                }
                return input;
              })
              return action;
            }
            return action;
          }
        );
      }
      state.status = {
        type: "SUCCESS",
        message: "Input updated successfully",
      };
    })
    builder.addCase(updateInput.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating input",
      };
    })
    builder.addCase(setDefaultInput.fulfilled, (state, action) => {
      const payload = action.payload;
      if (state.project) {
        state.project.actions = state.project.actions.map(
          (action: Action) => {
            if (action.id === payload.actionId) {
              return {
                ...action, inputs: payload.inputs
              }
            }
            return action;
          }
        );
      }
      state.status = {
        type: "SUCCESS",
        message: "Default Input updated successfully",
      };
    })
    builder.addCase(setDefaultInput.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating default input",
      };
    })
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
