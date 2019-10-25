import React, {useState, useEffect} from "react";
import AuthForm from "../components/AuthForm";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Snackbar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { MySnackbarContentWrapper } from "../components/Snackbar";

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
    const { user, authError, setAuthError } = useAuth();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setAuthError(null);//clear auth error
        setOpen(false);
    };

    useEffect(() => {
        if (authError && !open) {
            handleOpen();
        }
    });

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <img
                    className={classes.authPicture}
                    src="authPicture.png"
                    alt="two dogs"
                />
                <div className={classes.authContainer}>
                    <div className={classes.authButton}>
                        <Link to={mapRoutes[name]}>
                            <Button variant="outlined">
                                {name === "signup" ? "Log In" : "Sign Up"}
                                {/* show login button on sign up page and sign up button on log in page for switching */}
                            </Button>
                        </Link>
                    </div>
                    <AuthForm name={name} displayName={displayName} />
                </div>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={open}
                onClose={handleClose}
                autoHideDuration = {5000}
            >
                <MySnackbarContentWrapper
                    variant="error"
                    className={classes.margin}
                    onClose = {handleClose}
                    message={(authError && authError.data && authError.data.errorMsg) || ''}
                />
            </Snackbar>
        </div>
    );
}
