import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import testSuiteService from "../services/testSuiteService";
import {
  TestSuite,
} from "../declarations/interface";

export const getByProjectId: any = createAsyncThunk(
  "testSuites/getProjectById",
  async (id: string) => {
    return testSuiteService.getByProjectId(id);
  }
);

export const createTestSuite: any = createAsyncThunk(
  "testSuites/createTestSuite",
  async (payload: { testSuite: TestSuite, tags: string[] }) => {
    return await testSuiteService.createTestSuiteData(payload);
  }
);

export const updateTestSuite: any = createAsyncThunk(
  "testSuites/updateTestSuite",
  async (payload: {
    testSuite: TestSuite, tags: {
      deletedTags: (string | undefined)[] | undefined;
      newTags: {
        tagId: string;
        testSuiteId: string | undefined;
      }[] | undefined;
    }
  }) => {
    return await testSuiteService.updateTestSuiteData(payload);
  }
);

export const duplicateTestSuite: any = createAsyncThunk(
  "testSuites/duplicateTestSuite",
  async (id: string) => {
    return testSuiteService.duplicateTestSuite(id);
  }
)

const DEFAULT: {
  testSuites?: TestSuite[];
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "testSuites",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getByProjectId.fulfilled, (state, action) => {
      state.testSuites = action.payload.data;
    })
    builder.addCase(getByProjectId.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching Test Suits by project id",
      };
    })
    builder.addCase(createTestSuite.fulfilled, (state, action) => {
      const testSuiteData = action.payload.testSuite;
      if (state.testSuites) {
        state.testSuites = [...state.testSuites, testSuiteData];
      }
      state.status = {
        type: "SUCCESS",
        message: "Test Suite created successfully",
      };
    })
    builder.addCase(createTestSuite.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating Test Suite",
      };
    })
    builder.addCase(duplicateTestSuite.fulfilled, (state, action) => {
      const testSuiteData = action.payload.testSuite;
      if (state.testSuites) {
        state.testSuites = [...state.testSuites, testSuiteData];
      }
      state.status = {
        type: "SUCCESS",
        message: "Test Suite duplicated successfully",
      };
    })
    builder.addCase(duplicateTestSuite.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while duplicating Test Suite",
      };
    })
    builder.addCase(updateTestSuite.fulfilled, (state, action) => {
      const updatedtestSuite = action.payload.testSuite;
      if (state.testSuites) {
        state.testSuites = state.testSuites.map(
          (testSuite: TestSuite) => {
            if (testSuite.id === updatedtestSuite.id) {
              return updatedtestSuite;
            }
            return testSuite;
          }
        );
      }
      state.status = {
        type: "SUCCESS",
        message: "Test Suite updated successfully",
      };
    })
    builder.addCase(updateTestSuite.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating Test Suite",
      };
    })
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
