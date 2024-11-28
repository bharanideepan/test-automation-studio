import React from "react";
import { useRoutes } from "react-router-dom";
import { usePromiseTracker } from "react-promise-tracker";

import GlobalStyles from "./components/GlobalStyles";
import AppLayout from "./layouts/AppLayout";
import ProjectDetail from "./pages/ProjectDetail";
import AppLoader from "./components/AppLoader";
import TestCaseDetail from "./pages/TestCaseDetail";
import TestSuiteDetail from "./pages/TestSuiteDetail";

const AppRouter = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/project/:projectId",
          element: <ProjectDetail />,
        },
        {
          path: "/test-case/:testCaseId",
          element: <TestCaseDetail />,
        },
        {
          path: "/test-suite/:testSuiteId",
          element: <TestSuiteDetail />,
        },
      ],
    }
  ]);
  return element;
};

const App = () => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    <>
      <GlobalStyles />
      <AppLoader show={promiseInProgress} type="CIRCULAR" />
      <AppRouter />
    </>
  );
};

export default App;
