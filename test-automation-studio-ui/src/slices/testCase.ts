import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TestCaseService from "../services/testCaseService";
import {
  TestCase,
} from "../declarations/interface";

export const getTestCaseById: any = createAsyncThunk(
  "testCase/getTestCaseById",
  async (id: string) => {
    return TestCaseService.getTestCaseById(id);
  }
);
const DEFAULT: {
  testCase?: TestCase;
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "testCase",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
    addTestCaseRun(state, action) {
      state.testCase?.testCaseRuns?.unshift(action.payload)
    },
    addNewInput(state, action) {
      if (state.testCase) {
        if (state.testCase.testCaseFlowSequences) {
          state.testCase.testCaseFlowSequences = state.testCase.testCaseFlowSequences.map((testCaseFlowSequence) => {
            if (testCaseFlowSequence.flow.flowActionSequences) {
              testCaseFlowSequence.flow.flowActionSequences = testCaseFlowSequence.flow.flowActionSequences.map((flowActionSequence) => {
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
            return testCaseFlowSequence;
          })
        }
        // state.flows.map((flow) => {
        //   if (flow.flowActionSequences) {
        //     flow.flowActionSequences = flow.flowActionSequences?.map((flowActionSequence) => {
        //       if (flowActionSequence.action.id === action.payload.actionId) {
        //         if (flowActionSequence.action.inputs) {
        //           flowActionSequence.action.inputs = [...flowActionSequence.action.inputs, action.payload]
        //         } else {
        //           flowActionSequence.action.inputs = [action.payload]
        //         }
        //       }
        //       return flowActionSequence;
        //     })
        //   }
        // })
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getTestCaseById.fulfilled, (state, action) => {
      state.testCase = action.payload;
    })
    builder.addCase(getTestCaseById.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching testCase details",
      };
    })
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
