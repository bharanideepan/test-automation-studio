import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TestCaseRunService from "../services/testCaseRunService";
import {
  TestCaseRun,
} from "../declarations/interface";

export const getTestCaseRunById: any = createAsyncThunk(
  "testCaseRun/getTestCaseRunById",
  async (id: string) => {
    return TestCaseRunService.getTestCaseRunById(id);
  }
);
export const executeRun: any = createAsyncThunk(
  "testCaseRun/executeRun",
  async (id: string) => {
    return TestCaseRunService.executeRun(id);
  }
)
const DEFAULT: {
  testCaseRun?: TestCaseRun;
  addedTestCaseRun?: TestCaseRun;
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "testCaseRun",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTestCaseRunById.fulfilled, (state, action) => {
      state.testCaseRun = action.payload;
    })
    builder.addCase(getTestCaseRunById.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching testCase run details",
      };
    })
    builder.addCase(executeRun.fulfilled, (state, action) => {
      state.addedTestCaseRun = action.payload;
      state.status = {
        type: "SUCCESS",
        message: "Run executed successfully",
      };
    })
    builder.addCase(executeRun.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while executing test case run",
      };
    })
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
