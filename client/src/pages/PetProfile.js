import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../utils/AuthProvider";
import samplePet, { placeholderPosts } from "../utils/placeholderPetProfile";
import PostCard from "../components/PostCard";
import PrimaryButton from "../components/PrimaryButton";
import { getPetWithPosts } from "../utils/petService";
import EditPetDialog from "../components/dialogs/AddOrEditPet";
import AddEditPostDialog from "../components/dialogs/AddOrEditPost";
import _ from "lodash";

import {
    Paper,
    Avatar,
    Typography,
    Grid,
    Box,
    Button
} from "@material-ui/core";
const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up("sm")]: {
            direction: "column"
        }
    },
    profilePaper: {
        minHeight: "calc(100vh - 64px)",
        display: "flex"
    },
    profilePic: {
        height: 100,
        width: 100,
        marginTop: 50
    },
    buttonGroup: { margin: 8 },
    color: { background: theme.gradient },
    profileInfo: {
        margin: "0 auto",
        width: "50%",
        display: "flex",
        justifyContent: "center"
    }
}));

export default function PetProfile({ match }) {
    const classes = useStyles();
    const { user } = useAuth();
    const [pet, setPet] = useState({});
    const [posts, setPosts] = useState([]);

    const onCreatePost = newPost => {
        setPosts([newPost, ...posts]);
    };

    useEffect(() => {
        getPetWithPosts(match.params.ownerId, match.params.petId).then(
            petWithPosts => {
                setPet(petWithPosts || samplePet);
                setPosts(petWithPosts.post || placeholderPosts);
            }
        );
    }, []);
    return (
        <div>
            <Grid container className={classes.root}>
                <Grid item xs={12} md={3}>
                    <Paper className={classes.profilePaper} elevation={5}>
                        <Grid
                            container
                            alignItems="center"
                            direction="column"
                            spacing={8}
                        >
                            <Grid item>
                                <Avatar
                                    src={pet.profilePic}
                                    className={classes.profilePic}
                                />
                                <Typography
                                    variant="h6"
                                    className={classes.profileInfo}
                                >
                                    <Box fontWeight="fontWeightBold">
                                        {pet.name}
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                >
                                    <Box fontWeight="fontWeightBold">
                                        {pet.location}
                                    </Box>
                                </Typography>
                            </Grid>
                            <Grid container justify="center" direction="column">
                                <Grid container justify="center">
                                    <Button
                                        variant="outlined"
                                        className={`${classes.buttonGroup} ${classes.color}`}
                                    >
                                        <Typography variant="button">
                                            Follow Me
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        className={classes.buttonGroup}
                                        href={`/users/${pet.ownerId}`}
                                    >
                                        My Owner
                                    </Button>
                                </Grid>
                                <Grid container justify="center">
                                    <AddEditPostDialog
                                        classes={classes}
                                        pet={pet}
                                        onCreatePost={onCreatePost}
                                        post={{}}
                                    ></AddEditPostDialog>
                                    <EditPetDialog
                                        pet={pet}
                                        userId={1}
                                        classes={classes}
                                        update
                                        setPet={setPet}
                                    ></EditPetDialog>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1">
                                    <Box fontWeight="fontWeightBold">Tags:</Box>
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                direction="column"
                                alignItems="center"
                            >
                                <Typography variant="subtitle1" component="div">
                                    <Box fontWeight="fontWeightBold">
                                        About:
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="div"
                                >
                                    <Box padding={10} paddingTop={0}>
                                        {pet.about}
                                    </Box>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item md={9}>
                    <Grid container alignContent="space-around">
                        {posts.map(post => {
                            return (
                                <Grid item md={6} xs={12} key={post.id}>
                                    <PostCard post={post}></PostCard>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
