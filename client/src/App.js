import React, { useState, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";

import "./App.css";
import AuthProvider, { useAuth } from "./utils/AuthProvider";
import AuthPage from "./pages/AuthPage";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";

import { makeStyles } from "@material-ui/core/styles";
import { Snackbar } from "@material-ui/core";
import { MySnackbarContentWrapper } from "./components/Snackbar";

import jwt from "jsonwebtoken";

const useStyles = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1)
    }
}));

function App() {
    const { authError, setAuthError, user, getUserProfile } = useAuth();
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setAuthError(null); //clear auth error
        setOpen(false);
    };

    useEffect(() => {
        if (authError && !open) {
            handleOpen();
        }
    });
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            const decodedToken = jwt.decode(token);
            const userId = decodedToken.id;
            getUserProfile(userId);
        }
    }, []);

    return (
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <NavBar />
                {user ? <Redirect to="/mypets" /> : ""}
                <Switch>
                    {user ? (
                        <Route exact path="/mypets" component={Profile} />
                    ) : (
                        ""
                    )}
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/login">
                        <AuthPage name="login" displayName="Log In" />
                    </Route>
                    <Route exact path="/signup">
                        <AuthPage name="signup" displayName="Sign Up" />
                    </Route>
                </Switch>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    open={open}
                    onClose={handleClose}
                    autoHideDuration={5000}
                >
                    <MySnackbarContentWrapper
                        variant="error"
                        className={classes.margin}
                        onClose={handleClose}
                        message={
                            (authError &&
                                authError.data &&
                                authError.data.errorMsg) ||
                            ""
                        }
                    />
                </Snackbar>
            </BrowserRouter>
        </MuiThemeProvider>
    );
}

function AuthWrappedApp() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}
export default AuthWrappedApp;
