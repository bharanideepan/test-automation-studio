import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import testSuiteService from "../services/testSuiteService";
import {
  testSuite,
} from "../declarations/interface";

export const gettestSuiteById: any = createAsyncThunk(
  "testSuite/gettestSuiteById",
  async (id: string) => {
    return testSuiteService.gettestSuiteById(id);
  }
);
const DEFAULT: {
  testSuite?: testSuite;
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "testSuite",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
    addtestSuiteRun(state, action) {
      state.testSuite?.testSuiteRuns?.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(gettestSuiteById.fulfilled, (state, action) => {
      state.testSuite = action.payload;
    })
    builder.addCase(gettestSuiteById.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching testSuite details",
      };
    })
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
