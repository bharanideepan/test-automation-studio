import React from "react";
import { useRoutes } from "react-router-dom";
import { usePromiseTracker } from "react-promise-tracker";

import GlobalStyles from "./components/GlobalStyles";
import AppLayout from "./layouts/AppLayout";
import ProjectDetail from "./pages/ProjectDetail";
import AppLoader from "./components/AppLoader";
import CreateTestCaseView from "./pages/CreateTestCaseView";

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
          path: "/project/:projectId/new-test-case",
          element: <CreateTestCaseView />,
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
