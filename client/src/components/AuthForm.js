import React, { useState } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { useAuth } from "../utils/AuthProvider";
import PrimaryButton from "./PrimaryButton";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-start"
    },
    container: {
        height: 400,
        width: 350,
    },
    button:{
      marginTop: 10
    },
    buttonColor: {
        background: theme.gradient
    }
}));

const PWD_LENGTH_MSG = "Passwords have to be atleast 6 characters long";
const PWD_CONFIRM_MSG = "The passwords you have entered do not match";

const AuthForm = props => {
    const { formName, displayName } = props;
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwdValid, setPwdValid] = useState("");
    const [confirmPwdValid, setConfirmPwdValid] = useState("");

    const setAuthForm = {
        email: setEmail,
        password: setPassword,
        name: setName,
        confirmPassword: setConfirmPassword
    };

    const setValidation = {
        password: setPwdValid,
        confirmPassword: setConfirmPwdValid
    };

    const validatePasswords = (elName, value) => {
        if (formName === "signup") {
            if (
                (elName === "password" || elName === "confirmPassword") &&
                value.length < 6
            ) {
                setValidation[elName](PWD_LENGTH_MSG);
                return;
            } else if (elName in setValidation && value.length >= 6) {
                setValidation[elName]("");
            }
            if (elName in setValidation) {
                if (elName === "confirmPassword" && password !== value) {
                    setValidation[elName](PWD_CONFIRM_MSG);
                } else if (elName === "password" && confirmPassword !== value) {
                    setValidation[elName](PWD_CONFIRM_MSG);
                } else {
                    for (let vld in setValidation) {
                        setValidation[vld]("");
                    }
                }
            }
        }
    };

    const handleChange = elName => event => {
        validatePasswords(elName, event.target.value);
        setAuthForm[elName](event.target.value);
    };

    const { logIn, signUp } = useAuth();

    const handleSubmit = event => {
        event.preventDefault();
        switch (formName) {
            case "login":
                logIn({ email, password });
                break;
            case "signup":
                signUp({ email, name, password, confirmPassword });
                break;
            default:
                return;
        }
    };

    return (
        <div className={classes.root}>
            <h1 className={classes.displayName}>
                {formName === "signup" ? "Create an Account" : displayName}
            </h1>
            <form
                className={classes.container}
                onSubmit={handleSubmit}
                name={formName}
                autoComplete="off"
            >
                <div>
                    {formName === "signup" ? (
                        <TextField
                            id="name"
                            label="Name"
                            className={classes.textField}
                            margin="normal"
                            value={name}
                            onChange={handleChange("name")}
                            variant="outlined"
                            required
                            fullWidth
                        />
                    ) : (
                        ""
                    )}
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        className={classes.textField}
                        margin="normal"
                        value={email}
                        onChange={handleChange("email")}
                        required
                        variant="outlined"
                        fullWidth
                    />
                </div>
                <div>
                    <TextField
                        id="password"
                        label="Password"
                        className={classes.textField}
                        margin="normal"
                        type="password"
                        value={password}
                        onChange={handleChange("password")}
                        required
                        variant="outlined"
                        fullWidth
                        helperText={pwdValid}
                        error={pwdValid.length === 0 ? false : true}
                    />
                    {formName === "signup" ? (
                        <TextField
                            id="confirmPassword"
                            label="Repeat Password"
                            className={classes.textField}
                            margin="normal"
                            type="password"
                            value={confirmPassword}
                            onChange={handleChange("confirmPassword")}
                            required
                            variant="outlined"
                            fullWidth
                            helperText={confirmPwdValid}
                            error={confirmPwdValid.length === 0 ? false : true}
                        />
                    ) : (
                        ""
                    )}
                </div>
                <div className = {classes.button}>
                    <PrimaryButton
                        variant="contained"
                        size="large"
                        type="submit"
                    >
                        <Typography variant="button">
                            {formName === "signup" ? "Create" : displayName}
                        </Typography>
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default AuthForm;

/**
 * PROP TYPES
 */

AuthForm.propTypes = {
    formName: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired
};
