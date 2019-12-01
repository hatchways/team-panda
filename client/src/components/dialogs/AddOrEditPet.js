import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Typography, Grid } from "@material-ui/core";
import PrimaryButton from "../PrimaryButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createPet, updatePet } from "../../utils/petService";
import PetImageDropZone from "../ImageDropZone";

export default function AddOrEditPet({
    classes,
    userId,
    update,
    pet,
    onCreatePet,
    setPet
}) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(pet.name || "");
    const [animal, setAnimal] = React.useState(pet.animal || "");
    const [dateOfBirth, setDOB] = React.useState(pet.dateOfBirth || "");
    const [about, setAbout] = React.useState(pet.about || "");
    const [profilePic, setProfilePic] = React.useState(pet.profilePic || null);
    const createOrUpdateLabel = update ? "Update Pet" : "Create Pet";
    const getProfilePic = img => {
        setPetForm["profilePic"](img);
    };

    const setPetForm = {
        name: setName,
        animal: setAnimal,
        dateOfBirth: setDOB,
        about: setAbout,
        profilePic: setProfilePic
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = property => event => {
        setPetForm[property](event.target.value);
    };

    const handleSubmit = () => {
        let petInfo = {
            name,
            dateOfBirth,
            about,
            animal,
            profilePic
        };

        if (update) {
            updatePet(userId, pet.id, petInfo).then(updatedPet => {
                setPet(updatedPet);
            });
        } else {
            createPet(userId, petInfo).then(newPet => {
                onCreatePet(newPet);
            });
        }
        handleClose();
    };

    useEffect(() => {
        for (let key of Object.keys(setPetForm)) {
            setPetForm[key](pet[key]);
        }
    }, [pet]);
    return (
        <div>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                className={classes.buttonGroup}
            >
                {createOrUpdateLabel}
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogTitle id="add-pet-dialog-title">
                    {createOrUpdateLabel}
                </DialogTitle>
                <DialogContent>
                    <Grid container alignContent="center"
                                justify="center" alignItems="center">
                        <Grid item xs={6}>
                            <Grid
                                container
                                alignContent="center"
                                justify="center"
                            >
                                <Grid item>
                                    <PetImageDropZone
                                        returnImgToParent={getProfilePic}
                                        displayText= {"Profile Picture"}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="name"
                                label="Pet's Name"
                                value={name}
                                onChange={handleChange("name")}
                                className={classes.textField}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                autoFocus
                                required
                            ></TextField>
                            <TextField
                                id="animal"
                                label="Animal Type"
                                value={animal}
                                className={classes.textField}
                                onChange={handleChange("animal")}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                required
                            ></TextField>
                            <TextField
                                id="dateOfBirth"
                                type="date"
                                default="2019-12-09"
                                label="Date of Birth"
                                value={dateOfBirth}
                                className={classes.textField}
                                onChange={handleChange("dateOfBirth")}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                required
                                InputLabelProps={{
                                    shrink: true
                                }}
                            ></TextField>
                            <TextField
                                id="about"
                                label="Pet's About Me"
                                value={about}
                                className={classes.textField}
                                onChange={handleChange("about")}
                                variant="outlined"
                                multiline
                                rows="4"
                                fullWidth
                                margin="dense"
                                required
                            ></TextField>
                        </Grid>
                    </Grid>
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
