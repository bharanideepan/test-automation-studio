import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProjectService from "../services/projectService";
import ActionService from "../services/actionService";
import InputService from "../services/inputService";
import FlowService from "../services/flowService";
import FlowActionMappingService from "../services/flowActionMappingService";
import {
  Action,
  Flow,
  FlowActionMapping,
  Input,
  Project,
} from "../declarations/interface";

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
    return ActionService.createAction(action);
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
  async (action: Input) => {
    return InputService.createInput(action);
  }
);
export const updateInput: any = createAsyncThunk(
  "project/updateInput",
  async (action: Input) => {
    return InputService.updateInput(action);
  }
);

export const createFlow: any = createAsyncThunk(
  "project/createFlow",
  async (payload: {flow: Flow, mappings: FlowActionMapping[]}) => {
    const createdFlow = await FlowService.createFlow(payload.flow);
    await FlowActionMappingService.createFlowActionMappings(payload.mappings.map((map: FlowActionMapping) => ({...map, flowId: createdFlow.data.id})));
    return createdFlow
  }
);
export const updateFlow: any = createAsyncThunk(
  "project/updateFlow",
  async (payload: {flow: Flow, mappings:{
    updatedFlowActionMappings: FlowActionMapping[], newFlowActionMappings: FlowActionMapping[], removedFlowActionMappings: string[]
  }}) => {
    await FlowActionMappingService.updateFlowActionMappings(payload.mappings);
    return await FlowService.updateFlow(payload.flow);
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
  extraReducers: {
    [getProjectById.fulfilled]: (state, action) => {
      state.project = action.payload.data;
    },
    [getProjectById.rejected]: (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching project details",
      };
    },
    [updateProjectName.fulfilled]: (state) => {
      state.status = {
        type: "SUCCESS",
        message: "Project name updated successfully",
      };
    },
    [updateProjectName.rejected]: (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating project name",
      };
    },
    [createFlow.fulfilled]: (state, action) => {
      const flowData = action.payload.data;
      if (state.project) {
        state.project.flows = [...state.project.flows, flowData];
      }
      state.status = {
        type: "SUCCESS",
        message: "Flow created successfully",
      };
    },
    [createFlow.rejected]: (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating flow",
      };
    },
    [updateFlow.fulfilled]: (state, action) => {
      const updatedFlow = action.payload.data;
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
    },
    [updateFlow.rejected]: (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating action",
      };
    },
    [createAction.fulfilled]: (state, action) => {
      const actionData = action.payload.data;
      if (state.project) {
        state.project.actions = [...state.project.actions, actionData];
      }
      state.status = {
        type: "SUCCESS",
        message: "Action created successfully",
      };
    },
    [createAction.rejected]: (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating action",
      };
    },
    [updateAction.fulfilled]: (state, action) => {
      const updatedAction = action.payload.data;
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
    },
    [updateAction.rejected]: (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating action",
      };
    },
    [deleteAction.fulfilled]: (state, action) => {
      const { id } = action.payload.data;
      if (state.project) {
        state.project.actions = state.project.actions.filter(
          (action: Action) => action.id !== id
        );
      }
      state.status = {
        type: "SUCCESS",
        message: "Action deleted successfully",
      };
    },
    [deleteAction.rejected]: (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while deleting action",
      };
    },
    [createInput.fulfilled]: (state, action) => {
      const createdInput = action.payload.data;
      if (state.project) {
        state.project.actions = state.project.actions.map(
          (action: Action) => {
            if (action.id === createdInput.actionId) {
              action.inputs = [...action.inputs??[], createdInput]
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
    },
    [createInput.rejected]: (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating input",
      };
    },
    [updateInput.fulfilled]: (state, action) => {
      const updatedInput = action.payload.data;
      if (state.project) {
        state.project.actions = state.project.actions.map(
          (action: Action) => {
            if (action.id === updatedInput.actionId) {
              action.inputs = action.inputs?.map((input: Input) => {
                if(input.id === updatedInput.id) {
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
    },
    [updateInput.rejected]: (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating input",
      };
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
