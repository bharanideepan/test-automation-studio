import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TestCaseService from "../services/testCaseService";
import {
  Assertion,
  TestCase,
  TestCaseFlowSequence,
} from "../declarations/interface";

export const getByProjectId: any = createAsyncThunk(
  "testCases/getProjectById",
  async (id: string) => {
    return TestCaseService.getByProjectId(id);
  }
);

export const createTestCase: any = createAsyncThunk(
  "testCases/createTestCase",
  async (payload: { testCase: TestCase, sequences: TestCaseFlowSequence[], assertions: Assertion[] }) => {
    return await TestCaseService.createTestCaseData(payload);
  }
);

export const updateTestCase: any = createAsyncThunk(
  "testCases/updateTestCase",
  async (payload: {
    testCase: TestCase, sequences: {
      updatedSequences: TestCaseFlowSequence[], newSequences: TestCaseFlowSequence[], removedSequences: string[]
    }, assertions: Assertion[]
  }) => {
    return await TestCaseService.updateTestCaseData(payload);
  }
);

export const duplicateTestCase: any = createAsyncThunk(
  "testCases/duplicateTestCase",
  async (id: string) => {
    return TestCaseService.duplicateTestCase(id);
  }
)

const DEFAULT: {
  testCases?: TestCase[];
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "testCases",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getByProjectId.fulfilled, (state, action) => {
      state.testCases = action.payload.data;
    })
    builder.addCase(getByProjectId.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching testcases by project id",
      };
    })
    builder.addCase(createTestCase.fulfilled, (state, action) => {
      const testCaseData = action.payload.testCase;
      if (state.testCases) {
        state.testCases = [...state.testCases, testCaseData];
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
    builder.addCase(duplicateTestCase.fulfilled, (state, action) => {
      const testCaseData = action.payload.testCase;
      if (state.testCases) {
        state.testCases = [...state.testCases, testCaseData];
      }
      state.status = {
        type: "SUCCESS",
        message: "Test Case duplicated successfully",
      };
    })
    builder.addCase(duplicateTestCase.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while duplicating Test Case",
      };
    })
    builder.addCase(updateTestCase.fulfilled, (state, action) => {
      const updatedTestCase = action.payload.testCase;
      if (state.testCases) {
        state.testCases = state.testCases.map(
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
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
