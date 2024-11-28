import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import testSuiteService from "../services/testSuiteService";
import {
  testSuite,
} from "../declarations/interface";

export const getByProjectId: any = createAsyncThunk(
  "testSuites/getProjectById",
  async (id: string) => {
    return testSuiteService.getByProjectId(id);
  }
);

export const createtestSuite: any = createAsyncThunk(
  "testSuites/createtestSuite",
  async (payload: { testSuite: testSuite, tags: string[] }) => {
    return await testSuiteService.createtestSuiteData(payload);
  }
);

export const updatetestSuite: any = createAsyncThunk(
  "testSuites/updatetestSuite",
  async (payload: {
    testSuite: testSuite, tags: {
      deletedTags: (string | undefined)[] | undefined;
      newTags: {
        tagId: string;
        testSuiteId: string | undefined;
      }[] | undefined;
    }
  }) => {
    return await testSuiteService.updatetestSuiteData(payload);
  }
);

export const duplicatetestSuite: any = createAsyncThunk(
  "testSuites/duplicatetestSuite",
  async (id: string) => {
    return testSuiteService.duplicatetestSuite(id);
  }
)

const DEFAULT: {
  testSuites?: testSuite[];
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
    builder.addCase(createtestSuite.fulfilled, (state, action) => {
      const testSuiteData = action.payload.testSuite;
      if (state.testSuites) {
        state.testSuites = [...state.testSuites, testSuiteData];
      }
      state.status = {
        type: "SUCCESS",
        message: "Test Suite created successfully",
      };
    })
    builder.addCase(createtestSuite.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating Test Suite",
      };
    })
    builder.addCase(duplicatetestSuite.fulfilled, (state, action) => {
      const testSuiteData = action.payload.testSuite;
      if (state.testSuites) {
        state.testSuites = [...state.testSuites, testSuiteData];
      }
      state.status = {
        type: "SUCCESS",
        message: "Test Suite duplicated successfully",
      };
    })
    builder.addCase(duplicatetestSuite.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while duplicating Test Suite",
      };
    })
    builder.addCase(updatetestSuite.fulfilled, (state, action) => {
      const updatedtestSuite = action.payload.testSuite;
      if (state.testSuites) {
        state.testSuites = state.testSuites.map(
          (testSuite: testSuite) => {
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
    builder.addCase(updatetestSuite.rejected, (state) => {
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
