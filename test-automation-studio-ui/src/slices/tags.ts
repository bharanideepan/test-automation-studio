import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import TagService from "../services/tagService";
import {
  Tag,
} from "../declarations/interface";

export const getByProjectId: any = createAsyncThunk(
  "tags/getByProjectId",
  async (projectId: string) => {
    return TagService.getByProjectId(projectId);
  }
);

export const createTag: any = createAsyncThunk(
  "tags/createTag",
  async (tag: Tag) => {
    return await TagService.createTag(tag);
  }
);
export const updateTag: any = createAsyncThunk(
  "tags/updateTag",
  async (tag: Tag) => {
    return await TagService.updateTag(tag);
  }
);

const DEFAULT: {
  tags?: Tag[];
  newTag?: Tag;
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "tags",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getByProjectId.fulfilled, (state, action) => {
      state.tags = action.payload.data;
    })
    builder.addCase(getByProjectId.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching tags details",
      };
    })
    builder.addCase(createTag.fulfilled, (state, action) => {
      const tag = action.payload;
      state.newTag = tag;
      if (state.tags) {
        state.tags = [...state.tags, tag];
      }
      state.status = {
        type: "SUCCESS",
        message: "Tag created successfully",
      };
    })
    builder.addCase(createTag.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating tag",
      };
    })
    builder.addCase(updateTag.fulfilled, (state, action) => {
      state.tags = state.tags?.map((tag) => {
        if (tag.id == action.payload.id) {
          return action.payload
        } else {
          return tag
        }
      })
      state.status = {
        type: "SUCCESS",
        message: "Tag updated successfully",
      };
    })
    builder.addCase(updateTag.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating tag",
      };
    })
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
