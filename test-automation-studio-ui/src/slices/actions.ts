import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ActionService from "../services/actionService";
import InputService from "../services/inputService";
import {
  Action,
  Input,
} from "../declarations/interface";
import inputService from "../services/inputService";

export const getByProjectId: any = createAsyncThunk(
  "actions/getProjectById",
  async (id: string) => {
    return ActionService.getByProjectId(id);
  }
);

export const createAction: any = createAsyncThunk(
  "actions/createAction",
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
  "actions/updateAction",
  async (action: Action) => {
    return ActionService.updateAction(action);
  }
);
export const deleteAction: any = createAsyncThunk(
  "actions/deleteAction",
  async (id: string) => {
    return ActionService.deleteAction(id);
  }
);

export const createInput: any = createAsyncThunk(
  "actions/createInput",
  async (input: Input) => {
    return InputService.createInput(input);
  }
);
export const updateInput: any = createAsyncThunk(
  "actions/updateInput",
  async (input: Input) => {
    return InputService.updateInput(input);
  }
);
export const setDefaultInput: any = createAsyncThunk(
  "actions/setDefaultInput",
  async (input: Input) => {
    return InputService.setDefaultInput(input);
  }
);

const DEFAULT: {
  actions?: Action[];
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "actions",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getByProjectId.fulfilled, (state, action) => {
      state.actions = action.payload.data;
    })
    builder.addCase(getByProjectId.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching actions by project id",
      };
    })
    builder.addCase(createAction.fulfilled, (state, action) => {
      const actionData = action.payload;
      if (state.actions) {
        state.actions = [...state.actions, actionData];
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
      if (state.actions) {
        state.actions = state.actions.map(
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
      if (state.actions) {
        state.actions = state.actions.filter(
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
      if (state.actions) {
        state.actions = state.actions.map(
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
      if (state.actions) {
        state.actions = state.actions.map(
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
      if (state.actions) {
        state.actions = state.actions.map(
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
