import React from "react";
import AuthForm from "../components/AuthForm";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        padding: 20,
        background: "url(auth-picture.png) no-repeat left",
        height: "calc(100vh - 64px)"
    },
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
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

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <AuthForm formName={name} displayName={displayName} />
            </div>
        </div>
    );
}
