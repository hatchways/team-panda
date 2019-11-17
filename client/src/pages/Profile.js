import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../utils/AuthProvider";
import {
    Avatar,
    Tabs,
    Tab,
    Grid,
    Paper,
    Typography,
    Button,
    Card,
    Divider,
    CardHeader,
    Link
} from "@material-ui/core";
import TabPanel from "../components/TabPanel";
import PrimaryButton from "../components/PrimaryButton";
import AddPetsButton from "../components/dialogs/AddPets";
import placeholderProfile from "../utils/placeholderProfile";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "center"
    },
    container: {
        width: "80vw",
        minHeight: "calc(100vh - 64px)",
        [theme.breakpoints.down("md")]: {
            width: "100%"
        },
    },
    headline: {
        textAlign: "center",
        width: "40%"
    },
    headlineContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "30px 0"
    },
    profilePic: {
        position: "absolute",
        top: 200,
        right: "calc(50% - 75px)",
        width: 150,
        height: 150
    },
    profileBg: {
        width: "100%",
        height: 200,
        position: "relative"
    },
    name: {
        textAlign: "center",
        marginTop: 85
    },
    summaryButtons: {
        display: "flex",
        justifyContent: "center",
        margin: "30px 0"
    },
    editButton: {
        marginLeft: 50
    },
    userPanel: {
        display: "flex",
        padding: "20px 10px"
    },
    petsPanel: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around"
    },
    userPanelCardContainer: {
        flex: 4,
        display: "flex",
        justifyContent: "center"
    },
    userPanelCard: {
        width: 250,
        margin: 20,
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            textAlign: "center"
        }
    },
    overview: {
        margin: "20px 20px"
    },
    petProfilePic: {
        height: 70,
        width: 70
    },
    petList: {
        display: "flex",
        padding: "50px 5% 40px 10%",
        flexWrap: "wrap"
    },
    petListItem: {
        margin: 20,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    buttonVertMargin: {
        margin: "20px 20px",
        background: theme.gradient
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

    const handleAddPet = () => {};

    const profileBg = user["profile_bg"]
        ? user["profile_bg"]
        : placeholderProfile.profileBg;

    return (
        <div className={classes.root}>
            <Paper className={classes.container} square elevation = {5}>
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
                        src={
                            user["profile_pic"] || placeholderProfile.profilePic
                        }
                    />
                    <Typography variant="h2" className={classes.name}>
                        {user.name || placeholderProfile.name}
                    </Typography>
                    <div className={classes.headlineContainer}>
                        <Typography
                            variant="subtitle1"
                            className={classes.headline}
                        >
                            {user.overview || placeholderProfile.headline}
                        </Typography>
                    </div>
                    <div className={classes.summaryButtons}>
                        <PrimaryButton
                            onClick={handleMessageClick}
                            variant="contained"
                            size="large"
                            type="button"
                        >
                            <Typography variant="button">Message</Typography>
                        </PrimaryButton>
                        {/* TODO don't show edit button if not own profile */}
                        <Button
                            onClick={handleMessageClick}
                            type="button"
                            variant="outlined"
                            size="large"
                            className={classes.editButton}
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
                    variant="fullWidth"
                >
                    <Tab
                        label={`About ${user.name || placeholderProfile.name}`}
                    />
                    <Tab
                        label={`${user.name || placeholderProfile.name}'s Pets`}
                    />
                </Tabs>
                <TabPanel value={activeTab} index={0}>
                    <Grid container
                    >
                        <Grid container item xs = {12} md = {5}
                        justify = "center"
                        >
                            <Card className={classes.userPanelCard}>
                                <CardHeader
                                    title="Owner Since"
                                    subheader={placeholderProfile.joinDate}
                                />
                                <Divider />
                                <CardHeader
                                    title="Location"
                                    subheader={placeholderProfile.location}
                                />
                                <Divider />
                                <CardHeader
                                    title="Number of Pets"
                                    subheader={placeholderProfile.pets.length}
                                />
                            </Card>
                        </Grid>
                        <Grid container item xs = {12} md = {7}
                        >
                            <div className = {classes.overview}>
                                <Typography variant="h4">Overview</Typography>
                                <Typography variant="body1">
                                    {placeholderProfile.overview}
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <div className={classes.petsPanel}>
                        <PrimaryButton
                            onClick={handleAddPet}
                            variant="contained"
                            size="large"
                            type="button"
                            className={classes.buttonVertMargin}
                        >
                            <Typography variant="button">Add Pet</Typography>
                        </PrimaryButton>
                        <div className={classes.petList}>
                            {placeholderProfile.pets.map((pet, i)=> {
                                return (
                                    <div
                                        key = {i}
                                    className={classes.petListItem}>
                                        <Avatar
                                            className={classes.petProfilePic}
                                            alt="pet-profile-pic"
                                            src={pet.profilePic}
                                        />
                                        <Link

                                            >
                                            <Typography variant="subtitle2">
                                                {pet.name}
                                            </Typography>
                                            <Typography variant="caption">
                                                {placeholderProfile.location}
                                            </Typography>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </TabPanel>
            </Paper>
        </div>
    );
}
