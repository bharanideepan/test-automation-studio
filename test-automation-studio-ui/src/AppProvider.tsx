import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { createTheme } from "./theme";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import store from "./store";

const theme = createTheme({
  responsiveFontSizes: true,
  theme: "LIGHT",
});
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "";

const AppProvider: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <SnackbarProvider>
              <Router>{children}</Router>
          </SnackbarProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default AppProvider;
