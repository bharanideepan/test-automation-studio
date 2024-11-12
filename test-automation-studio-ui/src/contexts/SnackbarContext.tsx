import React, { createContext, useReducer } from "react";

import AppSnackbar from "../components/AppSnackbar";

interface notifyPayload {
  onClose: () => void;
  type: "SUCCESS" | "FAILURE" | "ERROR";
  message: string;
  autoHideDuration?: number;
}

interface SnackbarState extends notifyPayload {
  open: boolean;
}

const initialState: SnackbarState = {
  open: false,
  onClose: () => {
    console.log("Default snackbar close");
  },
  type: "SUCCESS",
  message: "",
};

const reducer = (state: SnackbarState, action: any): SnackbarState => {
  switch (action.type) {
    case "NOTIFY": {
      return {
        ...action.payload,
        open: true,
      };
    }
    case "HIDE": {
      return {
        ...state,
        open: false,
      };
    }
    default: {
      return { ...state };
    }
  }
};

const SnackbarContext = createContext({
  ...initialState,
  notify: (state: notifyPayload) => {
    console.log(state);
  },
  hideNotification: () => {
    console.log("Hiding notification");
  },
});

export const SnackbarProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const notify = (state: notifyPayload) => {
    dispatch({
      type: "NOTIFY",
      payload: state,
    });
  };

  const hideNotification = () => {
    dispatch({
      type: "HIDE",
    });
  };

  return (
    <SnackbarContext.Provider
      value={{
        ...state,
        notify,
        hideNotification,
      }}
    >
      {children}
      <AppSnackbar
        open={state.open}
        message={state.message}
        onClose={state.onClose}
        type={state.type}
        autoHideDuration={state.autoHideDuration}
      />
    </SnackbarContext.Provider>
  );
};

export default SnackbarContext;
