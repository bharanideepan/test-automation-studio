import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FlowService from "../services/flowService";
import FlowActionSequenceService from "../services/flowActionSequenceService";
import {
  Flow,
  FlowActionSequence,
} from "../declarations/interface";

export const getByProjectId: any = createAsyncThunk(
  "flows/getProjectById",
  async (projectId: string) => {
    return FlowService.getByProjectId(projectId);
  }
);

export const createFlow: any = createAsyncThunk(
  "flows/createFlow",
  async (payload: { flow: Flow, flowActionSequences: FlowActionSequence[] }) => {
    const createdFlow: any = await FlowService.createFlow(payload.flow);
    await FlowActionSequenceService.createSequences(payload.flowActionSequences.map(
      (map: FlowActionSequence) => ({ ...map, flowId: createdFlow.id }))
    );
    return await FlowService.getFlowById(createdFlow.id);
  }
);
export const updateFlow: any = createAsyncThunk(
  "flows/updateFlow",
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


const DEFAULT: {
  flows?: Flow[];
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "flows",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
    addNewInput(state, action) {
      if (state.flows) {
        state.flows.map((flow) => {
          if (flow.flowActionSequences) {
            flow.flowActionSequences = flow.flowActionSequences?.map((flowActionSequence) => {
              if (flowActionSequence.action.id === action.payload.actionId) {
                if (flowActionSequence.action.inputs) {
                  flowActionSequence.action.inputs = [...flowActionSequence.action.inputs, action.payload]
                } else {
                  flowActionSequence.action.inputs = [action.payload]
                }
              }
              return flowActionSequence;
            })
          }
        })
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getByProjectId.fulfilled, (state, action) => {
      state.flows = action.payload.data;
    })
    builder.addCase(getByProjectId.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching flows by project id",
      };
    })
    builder.addCase(createFlow.fulfilled, (state, action) => {
      const flowData = action.payload;
      if (state.flows) {
        state.flows = [...state.flows, flowData];
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
      if (state.flows) {
        state.flows = state.flows.map(
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
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
