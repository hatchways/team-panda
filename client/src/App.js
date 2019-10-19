import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";

import "./App.css";
import AuthProvider from "./utils/AuthProvider";
import AuthPage from "./pages/AuthPage";

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <AuthProvider>
                <BrowserRouter>
                    <Route path="/" component={LandingPage} />
                    <Route
                        path="/login"
                        component={<AuthPage name="login" />}
                    />
                    <Route
                        path="/signup"
                        component={<AuthPage name="signup" />}
                    />
                </BrowserRouter>
            </AuthProvider>
        </MuiThemeProvider>
    );
}

export default App;
