import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../utils/AuthProvider";
import {
    Avatar,
    Tabs,
    Tab,
    Grid,
    Paper,
    ButtonGroup,
    Typography,
    Button
} from "@material-ui/core";
import TabPanel from "../components/TabPanel";
import PrimaryButton from "../components/PrimaryButton";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "center"
    },
    container: {
        width: "80vw",
        height: "calc(100vh - 64px)"
    },
    summary: {},
    profilePic: {
        position: "absolute",
        top: 330,
        right: "calc(50% - 75px)",
        width: 150,
        height: 150
    },
    profileBg: {
        width: "100%",
        height: 330,
        position: "relative"
    },
    name: {
        textAlign: "center",
        marginTop: 150
    },
    summaryButtons: {
        display: "flex",
        justifyContent: "center"
    },
    editButton:{
        marginLeft: 50
    }
}));

export default function Profile() {
    const classes = useStyles();
    const { user, getUserProfile } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        getUserProfile(user.id);
    }, []);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleMessageClick = () => {
        //todo
    };

    const handleEditClick = () => {};

    const profileBg = user["profile_bg"]
        ? user["profile_bg"]
        : "profile-background.png";

    return (
        <div className={classes.root}>
            <Paper className={classes.container}>
                <Grid className={classes.summary}>
                    <div
                        className={classes.profileBg}
                        alt="background-pic"
                        style={{
                            background: `url(${profileBg}) no-repeat center/120%`
                        }}
                    />

                    <Avatar
                        className={classes.profilePic}
                        alt="profile-pic"
                        src={user["profile_pic"] || "profile-pic.png"}
                    />
                    <Typography variant="h1" className={classes.name}>
                        {user && user.name}
                    </Typography>
                        <Typography
                            variant="subtitle1"
                            className={classes.subtitle}
                        >
                            {user && user.overview}
                        </Typography>
                    <div className = {classes.summaryButtons}>

                            <PrimaryButton
                                onClick={handleMessageClick}
                                variant="contained"
                                size="medium"
                                type="button"
                            >
                                <Typography variant="button">Message</Typography>
                            </PrimaryButton>
                            {/* TODO don't show edit button if not own profile */}
                            <Button
                                onClick={handleMessageClick}
                                type="button"
                                variant="contained"
                                color="secondary"
                                size="medium"
                                className = {classes.editButton}
                            >
                                <Typography color="textPrimary" variant="button">
                                    Edit
                                </Typography>
                            </Button>

                    </div>
                </Grid>
                <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    indicatorColor="primary"
                    centered
                >
                    <Tab label={`About ${user.name}`} />
                    <Tab label={`${user.name}'s Pets`} />
                </Tabs>
                <TabPanel value={activeTab} index={0}>
                    ABOUT CHRISTOPHER CONTENT
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    MY PETS STUFF
                </TabPanel>
            </Paper>
        </div>
    );
}
