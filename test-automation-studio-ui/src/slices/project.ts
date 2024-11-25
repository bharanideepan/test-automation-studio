import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProjectService from "../services/projectService";
import {
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
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
