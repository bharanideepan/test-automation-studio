import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProjectService from "../services/projectService";
import { Project } from "../declarations/interface";

export const getAllProjects: any = createAsyncThunk(
  "projects/getAllProjects",
  async () => {
    return ProjectService.getAllProjects();
  }
);

export const createProject: any = createAsyncThunk(
  "projects/createProject",
  async (name: string) => {
    return ProjectService.createProject(name);
  }
);

const DEFAULT: {
  list: Project[];
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
  pagination: {
    limit: number;
    skip: number;
    total: number;
  };
} = {
  list: [],
  status: null,
  pagination: {
    limit: 50,
    skip: 0,
    total: 0,
  },
};

const slice = createSlice({
  name: "projects",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProjects.fulfilled, (state, action) => {
      const { limit, skip, total, data } = action.payload;
      state.pagination = { limit, skip, total };
      state.list = data;
    })
    builder.addCase(getAllProjects.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching projects",
      };
    })
    builder.addCase(createProject.fulfilled, (state, action) => {
      const newProject = action.payload;
      state.list.push(newProject);
      state.status = {
        type: "SUCCESS",
        message: "Project created successfully",
      };
    })
    builder.addCase(createProject.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating new project",
      };
    })
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
