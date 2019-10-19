import React from "react";
import AuthForm from "../components/AuthForm";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        display: 'flex'
    },
    authButton: {
        width: '50vw',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    authPicture: {
        height: '70vh'
    },
    authContainer:{
        padding: '10px 50px 10px 10px'
    }
}));

export default function AuthPage({ name, displayName }) {
    const classes = useStyles();
    const mapRoutes = {
        signup: "/login",
        login: "/signup"
    };

    return (
        <div className = {classes.root}>
            <div className={classes.container}>
                <img className = {classes.authPicture} src="authPicture.png" alt="two dogs" />
                <div className={classes.authContainer}>
                    <div className={classes.authButton}>
                        <Link to={mapRoutes[name]}>
                            <Button variant = 'outlined'>
                                {name === "signup" ? "Log In" : "Sign Up"}
                                {/* show login button on sign up page and sign up button on log in page for switching */}
                            </Button>
                        </Link>
                    </div>
                    <AuthForm name={name} displayName = {displayName}/>
                </div>
            </div>
        </div>
    );
}
