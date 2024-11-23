import { combineReducers } from "@reduxjs/toolkit";
import { reducer as projectsReducer } from "../slices/projects";
import { reducer as projectReducer } from "../slices/project";
import { reducer as flowReducer } from "../slices/flow";
import { reducer as testCaseReducer } from "../slices/testCase";
import { reducer as testCaseRunReducer } from "../slices/testCaseRun";

const rootReducer = combineReducers({
  projects: projectsReducer,
  project: projectReducer,
  flow: flowReducer,
  testCase: testCaseReducer,
  testCaseRun: testCaseRunReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
