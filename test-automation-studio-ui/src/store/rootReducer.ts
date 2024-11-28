import { combineReducers } from "@reduxjs/toolkit";
import { reducer as projectsReducer } from "../slices/projects";
import { reducer as projectReducer } from "../slices/project";
import { reducer as flowReducer } from "../slices/flow";
import { reducer as testCaseReducer } from "../slices/testCase";
import { reducer as testCaseRunReducer } from "../slices/testCaseRun";
import { reducer as pagesReducer } from "../slices/pages";
import { reducer as flowsReducer } from "../slices/flows";
import { reducer as actionsReducer } from "../slices/actions";
import { reducer as testCasesReducer } from "../slices/testCases";
import { reducer as tagsReducer } from "../slices/tags";
import { reducer as testSuitesReducer } from "../slices/testSuites";
import { reducer as testSuiteReducer } from "../slices/testSuite";

const rootReducer = combineReducers({
  projects: projectsReducer,
  project: projectReducer,
  flow: flowReducer,
  testCase: testCaseReducer,
  testCaseRun: testCaseRunReducer,
  pages: pagesReducer,
  flows: flowsReducer,
  actions: actionsReducer,
  testCases: testCasesReducer,
  tags: tagsReducer,
  testSuites: testSuitesReducer,
  testSuite: testSuiteReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
