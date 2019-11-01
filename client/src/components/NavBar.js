import React, { Fragment } from "react";

import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { useAuth } from "../utils/AuthProvider";
import { makeStyles } from "@material-ui/styles";
import PrimaryButton from "./PrimaryButton";
import LinkButton from "./LinkButton";

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1
    },
    root: {
        backgroundColor: "#2e363c"
    },
    title: {
        flexGrow: 1
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex",
        }
    }
}));

export default function(props) {
    const { user } = useAuth();
    const classes = useStyles();

    const renderLoggedOutButtons = () => (
        <Fragment>
            <Button
                size="medium"
                type="button"
                variant="text"
                component={LinkButton}
                to="/signup"
            >
                <Typography variant="button">Sign Up</Typography>
            </Button>
            <PrimaryButton
                size="medium"
                type="button"
                variant="contained"
                component={LinkButton}
                to="/login"
            >
                <Typography variant="button">Log In</Typography>
            </PrimaryButton>
        </Fragment>
    );

    const renderLoggedInButtons = () => (
        <Fragment>
            <Button
                size="medium"
                type="button"
                variant="text"
                component={LinkButton}
                to="/feed"
            >
                <Typography variant="button">Feed</Typography>
            </Button>
            <PrimaryButton
                size="medium"
                type="button"
                variant="contained"
                component={LinkButton}
                to="/mypets"
            >
                <Typography variant="button">My Pets</Typography>
            </PrimaryButton>
        </Fragment>
    )

    return (
        <AppBar position="static" className={classes.root}>
            <Toolbar>
                <Typography variant="h5">PET WORLD</Typography>
                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>
                    {user ? renderLoggedInButtons() : renderLoggedOutButtons()}
                </div>
            </Toolbar>
        </AppBar>
    );
}
