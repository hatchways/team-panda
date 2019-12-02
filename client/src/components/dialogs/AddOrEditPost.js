import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Typography, makeStyles } from "@material-ui/core";
import PrimaryButton from "../PrimaryButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ImageDropZone from "../ImageDropZone";
import { createPost, updatePost } from "../../utils/postService";

const useStyles = makeStyles(theme => ({
    buttonGroup: { margin: 8 },
    imageZone: {
        width: "100%",
        backgroundColor: "#eee",
        height: "300px",
        lineHeight: "300px",
        textAlign: "center",
        backgroundBlendMode: "darken"
    },
    uploadButton: {
        borderRadius: "2px",
        backgroundColor: "white"
    }
}));

export default function AddOrEditPost({
    pet,
    post,
    update,
    onCreatePost,
    onUpdatePost
}) {
    const [open, setOpen] = React.useState(false);
    const [caption, setCaption] = useState(post.caption || "");
    const [image, setImage] = useState(post.image || null);
    const [likes, setLikes] = useState(post.likes || 0);
    const [content, setContent] = useState(post.content || "");
    const createOrUpdateLabel = update ? "Update Post" : "Add Post";

    const classes = useStyles();
    const setPostForm = {
        caption: setCaption,
        image: setImage,
        // likes: setLikes,
        content: setContent
    };

    const getImage = img => {
        setPostForm["image"](img);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = property => event => {
        setPostForm[property](event.target.value);
    };

    const handleSubmit = () => {
        let postInfo = {
            caption,
            image,
            likes,
            content
        };
        if (update) {
            updatePost(pet.ownerId, pet.id, { id: post.id, ...postInfo }).then(
                updatedPost => {
                    onUpdatePost(updatedPost);
                }
            );
        } else {
            createPost(pet.ownerId, pet.id, postInfo).then(newPost => {
                onCreatePost(newPost);
            });
        }
        handleClose();
    };
    let customImageZoneArea = imgs => (
        <>
            <div
                className={classes.imageZone}
                style={
                    imgs.length > 0
                        ? {
                              background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imgs[0].preview}) no-repeat center/100%`
                          }
                        : {}
                }
            >
                {!update && (
                    <Button
                        variant="outlined"
                        className={classes.uploadButton}
                        size="large"
                    >
                        <Typography>Upload Photo</Typography>
                    </Button>
                )}
            </div>
        </>
    );

    useEffect(() => {
        for (let key of Object.keys(setPostForm)) {
            setPostForm[key](post[key]);
        }
    }, [post]);

    return (
        <div>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                className={classes.buttonGroup}
            >
                {createOrUpdateLabel}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{createOrUpdateLabel}</DialogTitle>
                {!update && (
                    <ImageDropZone
                        returnImgToParent={getImage}
                        customImageZoneArea={customImageZoneArea}
                    />
                )}
                {update && customImageZoneArea([{ preview: post.image }])}
                <DialogContent>
                    <TextField
                        id="caption"
                        label="Post caption"
                        value={caption}
                        onChange={handleChange("caption")}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        autoFocus
                        required
                    ></TextField>
                    <TextField
                        id="content"
                        label="Content"
                        value={content}
                        onChange={handleChange("content")}
                        variant="outlined"
                        multiline
                        rows="4"
                        fullWidth
                        margin="dense"
                        required
                    ></TextField>
                    {/* <ImageDropZone returnImgToParent={getImage} /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <PrimaryButton onClick={handleSubmit}>
                        <Typography variant="button">
                            {createOrUpdateLabel}
                        </Typography>
                    </PrimaryButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
