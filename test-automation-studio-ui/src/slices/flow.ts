import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FlowService from "../services/flowService";
import {
  Flow,
} from "../declarations/interface";

export const getFlowById: any = createAsyncThunk(
  "flow/getFlowById",
  async (id: string) => {
    return FlowService.getFlowById(id);
  }
);
const DEFAULT: {
  flow?: Flow;
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "flow",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: {
    [getFlowById.fulfilled]: (state, action) => {
      state.flow = action.payload.data;
    },
    [getFlowById.rejected]: (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching flow details",
      };
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
