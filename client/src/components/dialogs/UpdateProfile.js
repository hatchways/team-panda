import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";
import PrimaryButton from "../PrimaryButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { updateProfile } from "../../utils/userProfileService";
import { useAuth } from "../../utils/AuthProvider";
import ImageDropZone from "../ImageDropZone";

export default function UpdateProfileDialog(props) {
    const [open, setOpen] = React.useState(false);
    const { user, setUser } = useAuth();
    const [location, setLocation] = React.useState(user.location);
    const [introduction, setIntroduction] = React.useState(user.introduction);
    const [overview, setOverview] = React.useState(user.overview);
    const [profilePic, setProfilePic] = React.useState(null);
    const [profileBg, setProfileBg] = React.useState(null);

    const getProfilePic = img => {
        setProfileForm["profilePic"](img);
    };

    const getProfileBg = img => {
        setProfileForm["profileBg"](img);
    };

    const setProfileForm = {
        location: setLocation,
        introduction: setIntroduction,
        overview: setOverview,
        profilePic: setProfilePic,
        profileBg: setProfileBg
    };

    useEffect(() => {
        for (let key of Object.keys(setProfileForm)) {
            setProfileForm[key](user[key]);
        }
    }, [user]);

    const classes = props.classes;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = property => event => {
        setProfileForm[property](event.target.value);
    };

    const handleSubmit = async () => {
        let updatedProfile = await updateProfile(user.id, {
            overview,
            introduction,
            location,
            profilePic,
            profileBg
        });
        setUser({ ...user, ...updatedProfile });
        handleClose();
    };

    return (
        <div>
            <Button
                onClick={handleClickOpen}
                type="button"
                variant="contained"
                color="secondary"
                size="medium"
                style={{ marginLeft: "50" }}
                className={props.classes.editButton}
            >
                <Typography color="textPrimary" variant="button">
                    Edit
                </Typography>
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="edit-profile-dialog-title">
                    Edit Your Profile
                </DialogTitle>
                <DialogContent>
                    <TextField
                        id="location"
                        label="Your location"
                        value={location}
                        onChange={handleChange("location")}
                        className={classes.textField}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        autoFocus
                        required
                    ></TextField>
                    <TextField
                        id="introduction"
                        label="Your intro"
                        value={introduction}
                        className={classes.textField}
                        onChange={handleChange("introduction")}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows="4"
                        margin="dense"
                        required
                    ></TextField>
                    <TextField
                        id="overview"
                        label="Your overview"
                        value={overview}
                        className={classes.textField}
                        onChange={handleChange("overview")}
                        variant="outlined"
                        multiline
                        rows="4"
                        fullWidth
                        margin="dense"
                        required
                    ></TextField>
                    <ImageDropZone returnImgToParent={getProfilePic} />
                    <ImageDropZone returnImgToParent={getProfileBg} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        type="button"
                        variant="contained"
                        color="secondary"
                        size="medium"
                        onClick={handleSubmit}
                    >
                        <Typography color="textPrimary" variant="button">
                            Update Profile
                        </Typography>
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
