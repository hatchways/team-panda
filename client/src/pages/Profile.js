import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../utils/AuthProvider";
import { getUsersPets } from "../utils/petService";
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
import AddPetsButton from "../components/dialogs/AddOrEditPet";
import EditProfileButton from "../components/dialogs/UpdateProfile";
import placeholderProfile from "../utils/placeholderProfile";
import jwt from "jsonwebtoken";

const INVALID_PROFILE = "Error: ";


const useStyles = makeStyles(theme => ({
    invalidProfile:{
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "calc(100vh - 64px)",
    },
    root: {
        display: "flex",
        justifyContent: "center",
    },
    container: {
        width: "60vw",
        minHeight: "calc(100vh - 64px)",
        [theme.breakpoints.down("md")]: {
            width: "100%"
        },
        paddingBottom: "10vh"
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

export default function Profile({ match }) {
    const classes = useStyles();
    const { user, getUserProfile, authError } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [pets, setPets] = useState([]);
    useEffect(() => {
        getUserProfile(match.params.userId);
        getUsersPets(match.params.userId).then(petList => {
            setPets(petList);
        });
    }, []);

    const onCreatePet = newPet => {
        setPets([newPet, ...pets]);
    };

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleMessageClick = () => {
        //todo
    };

    const userIdMatchAuthUser = () => {
        const authUser = jwt.decode(localStorage.getItem("access_token"));
        const isMatch = authUser.id == match.params.userId;
        return isMatch;
    };

    const profileBg = user && user["profileBg"]
        ? user["profileBg"]
        : placeholderProfile.profileBg;

    if (authError || !user) {
        return (
            <div className={classes.root}>
                <Paper className={classes.invalidProfile} square elevation={5}>
                    <Typography variant="h3">
                     {INVALID_PROFILE} {authError}
                    </Typography>
                </Paper>
            </div>
        );
    }
    return (
        <div className={classes.root}>
            <Paper className={classes.container} square elevation={5}>
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
                            user["profilePic"] || placeholderProfile.profilePic
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
                            {user.introduction || placeholderProfile.headline}
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
                        {userIdMatchAuthUser() ? (
                            <EditProfileButton classes={classes} />
                        ) : (
                            ""
                        )}
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
                    <Grid container>
                        <Grid container item xs={12} md={5} justify="center">
                            <Card
                                square
                                raised
                                className={classes.userPanelCard}
                            >
                                <CardHeader
                                    title="Owner Since"
                                    subheader={
                                        user.createdAt ||
                                        placeholderProfile.joinDate
                                    }
                                />
                                <Divider />
                                <CardHeader
                                    title="Location"
                                    subheader={
                                        user.location ||
                                        placeholderProfile.location
                                    }
                                />
                                <Divider />
                                <CardHeader
                                    title="Number of Pets"
                                    subheader={placeholderProfile.pets.length}
                                />
                            </Card>
                        </Grid>
                        <Grid container item xs={12} md={7}>
                            <div className={classes.overview}>
                                <Typography variant="h4">Overview</Typography>
                                <Typography variant="body1">
                                    {user.overview ||
                                        placeholderProfile.overview}
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <div className={classes.petsPanel}>
                        {userIdMatchAuthUser() ? (
                            <AddPetsButton
                                userId={user.id}
                                classes={classes}
                                pet={{}}
                                onCreatePet={onCreatePet}
                            />
                        ) : (
                            ""
                        )}
                        <div className={classes.petList}>
                            {pets.map((pet, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={classes.petListItem}
                                    >
                                        <Avatar
                                            className={classes.petProfilePic}
                                            alt="pet-profile-pic"
                                            src={pet.profilePic}
                                        />
                                        <Link
                                            underline="none"
                                            href={`/users/${pet.ownerId}/pets/${pet.id}`}
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
