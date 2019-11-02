import React from "react";
import AuthForm from "../components/AuthForm";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import LinkButton from "../components/LinkButton";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    container: {
        display: "flex"
    },
    authButton: {
        width: "50vw",
        display: "flex",
        justifyContent: "flex-end"
    },
    authPicture: {
        height: "70vh"
    },
    authContainer: {
        padding: "10px 50px 10px 10px"
    },
    margin: {
        margin: theme.spacing(1)
    }
}));

export default function AuthPage({ name, displayName }) {
    const classes = useStyles();
    const mapRoutes = {
        signup: "/login",
        login: "/signup"
    };

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <img
                    className={classes.authPicture}
                    src="auth-picture.png"
                    alt="two dogs"
                />
                <div className={classes.authContainer}>
                    <div className={classes.authButton}>
                        <Button
                            variant="outlined"
                            component={LinkButton}
                            to={mapRoutes[name]}
                        >
                            <Typography color="textPrimary" variant="button">
                                {name === "signup" ? "Log In" : "Sign Up"}
                            </Typography>
                            {/* show login button on sign up page and sign up button on log in page for switching */}
                        </Button>
                    </div>
                    <AuthForm formName={name} displayName={displayName} />
                </div>
            </div>
        </div>
    );
}
