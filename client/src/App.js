import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

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
                    <Switch>
                    <Route exact path="/" component={LandingPage} />
                      <Route
                          exact path="/login"
                      >
                        <AuthPage name="login" displayName = 'Log In'/>
                      </Route>
                      <Route
                          exact path="/signup"
                          >
                            <AuthPage name="signup" displayName = 'Sign Up'/>
                          </Route>
                    </Switch>
                </BrowserRouter>
            </AuthProvider>
        </MuiThemeProvider>
    );
}

export default App;
