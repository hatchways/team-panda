import React from "react";
import AuthForm from "../components/AuthForm";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Hidden } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        height: "calc(100vh - 64px)",
        overflow: "hidden"
    },

    authPictureContainer: {
        display: "flex",
        justifyContent: "flex-start",
        height: "100%",
    },
    authPicture:{
        background: "url(auth-picture.png)",
        height: "100%",
        width: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center"
    },
    container:{
        height: "100%"
    },
    authForm:{
        paddingLeft: 50
    }
}));

export default function AuthPage({ name, displayName }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container className = {classes.container} >
                <Hidden xsDown>
                    <Grid md={5} className = {classes.container
                    }>
                        <Grid item className = {classes.authPictureContainer}>
                            <div className = {classes.authPicture}/>
                        </Grid>
                    </Grid>
                </Hidden>
                <Grid item xs = {12} md={7} className = {classes.authForm}>
                    <AuthForm formName={name} displayName={displayName}
                    />
                </Grid>
            </Grid>
        </div>
    );
}
