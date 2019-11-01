import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../utils/AuthProvider";

const useStyles = makeStyles(theme => ({
    root: {},
    container: {},
    summary: {},
    profilePic: {}
}));

export default function Profile() {
    const classes = useStyles();
    const { user, getUserProfile } = useAuth();
    useEffect(() => {
        getUserProfile(user.id);
    }, [user]);

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={classes.summary}>
                    <img className={classes.profilePic} alt="profile-pic" />
                    <h1>{user && user.location}</h1>
                </div>
            </div>
        </div>
    );
}
