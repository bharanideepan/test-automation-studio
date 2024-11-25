import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PageService from "../services/pageService";
import SelectorService from "../services/selectorService";
import {
  Page,
  Selector
} from "../declarations/interface";

export const getPagesByProjectId: any = createAsyncThunk(
  "pages/getPagesByProjectId",
  async (projectId: string) => {
    return PageService.getPagesByProjectId(projectId);
  }
);

export const createPage: any = createAsyncThunk(
  "pages/createPage",
  async (page: Page) => {
    return PageService.createPage(page);
  }
);

export const updatePage: any = createAsyncThunk(
  "pages/updatePage",
  async (page: Page) => {
    return PageService.updatePage(page);
  }
);

export const createSelector: any = createAsyncThunk(
  "pages/createSelector",
  async (payload: { selector: Selector, projectId?: string }) => {
    if (payload.selector.pageId !== "NEW") {
      const newSelector = await SelectorService.createSelector(payload.selector);
      return { newSelector };
    }
    if (payload.selector.pageId === "NEW" && payload.selector.pageName && payload.projectId) {
      const newPage: any = await PageService.createPage({ name: payload.selector.pageName, projectId: payload.projectId, id: "" })
      const newSelector: any = await SelectorService.createSelector({ ...payload.selector, pageId: newPage.id, id: "" });
      return { newSelector, newPage }
    }
  }
);

export const updateSelector: any = createAsyncThunk(
  "pages/updateSelector",
  async (selector: Selector) => {
    return SelectorService.updateSelector(selector);
  }
);

const DEFAULT: {
  pages?: Page[];
  newSelector?: Selector;
  status: {
    type: "SUCCESS" | "FAILURE" | "ERROR";
    message: string;
  } | null;
} = {
  status: null,
};

const slice = createSlice({
  name: "pages",
  initialState: DEFAULT,
  reducers: {
    clearStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPagesByProjectId.fulfilled, (state, action) => {
      state.pages = action.payload.data;
    })
    builder.addCase(getPagesByProjectId.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while fetching pages",
      };
    })
    builder.addCase(createPage.fulfilled, (state, action) => {
      if (state.pages) {
        state.pages = [...state.pages, action.payload];
      } else {
        state.pages = [action.payload];
      }
    })
    builder.addCase(createPage.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating Page",
      };
    })
    builder.addCase(updatePage.fulfilled, (state, action) => {
      state.pages = state.pages?.map((page) => {
        if (page.id == action.payload.id) {
          return action.payload
        } else {
          return page
        }
      })
    })
    builder.addCase(updatePage.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating page",
      };
    })
    builder.addCase(createSelector.fulfilled, (state, action) => {
      const { newPage, newSelector } = action.payload;
      state.newSelector = newSelector;
      if (newPage) {
        if (state.pages) {
          state.pages = [...state.pages, {
            ...newPage, selectors: [newSelector]
          }];
        } else {
          state.pages = [{
            ...newPage, selectors: [newSelector]
          }];
        }
      } else {
        if (state.pages) {
          state.pages = state.pages?.map((page) => {
            if (page.id == newSelector.pageId) {
              if (page.selectors) {
                page.selectors = [...page.selectors, newSelector];
              } else {
                page.selectors = [newSelector];
              }
              return page;
            } else {
              return page;
            }
          })
        }
      }
      state.status = {
        type: "SUCCESS",
        message: "Selector created successfully",
      };
    })
    builder.addCase(createSelector.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while creating Selector",
      };
    })
    builder.addCase(updateSelector.fulfilled, (state, action) => {
      if (state.pages) {
        state.pages = state.pages?.map((page) => {
          if (page.id == action.payload.pageId) {
            page.selectors = page.selectors?.map((selector) => {
              if (selector.id == action.payload.id) {
                return action.payload;
              } else {
                return selector
              }
            })
            return page;
          } else {
            return page;
          }
        })
      }
    })
    builder.addCase(updateSelector.rejected, (state) => {
      state.status = {
        type: "FAILURE",
        message: "Error while updating Selector",
      };
    })
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export default slice;
