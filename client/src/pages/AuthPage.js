import React from "react";
import AuthForm from "../components/AuthForm";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {},
    container: {},
    authButton: {}
}));

export default function AuthPage({ name }) {
    const classes = useStyles();
    const mapRoutes = {
        signup: "/login",
        login: "/signup"
    };

    return (
        <div>
            <img src="../../public/authPicture" alt="two dogs" />
            <div className={classes.authButton}>
                <Link to={mapRoutes[name]}>
                    <Button>
                        {name === "signup" ? "Log In" : "Sign Up"}
                        {/* show login button on sign up page and sign up button on log in page for switching */}
                    </Button>
                </Link>
            </div>
            <AuthForm name={name} />
        </div>
    );
}
