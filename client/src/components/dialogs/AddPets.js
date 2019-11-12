import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import PrimaryButton from "../PrimaryButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createPet } from "../../utils/petService";
import { useDropzone } from "react-dropzone";

function PetImageDropZone(props) {
    const [imgs, setImgs] = React.useState([]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "image/*",
        multiple: false,
        onDrop: files => {
            setImgs(
                files.map(file =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                )
            );
            props.returnImgToParent(files[0]);
        }
    });

    const previewContainerProps = {
        width: "30%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto"
    };
    const previewProps = {
        width: "100%",
        height: "auto",
        display: "block"
    };
    const preview = imgs.map((file, i) => (
        <div style={previewContainerProps} key={i}>
            <img src={file.preview} style={previewProps}></img>
        </div>
    ));

    React.useEffect(() => () => {
        imgs.forEach(img => URL.revokeObjectURL(img.preview), [imgs]);
    });

    return (
        <div>
            <div style={{ backgroundColor: "#eee" }}>
                <div {...getRootProps()}>
                    <input
                        {...getInputProps()}
                        // style={{ height: "100px", width: "100%" }}
                    />
                    <p>Drop Profile Picture or click to upload.</p>
                </div>
            </div>
            <div>
                <aside>{preview}</aside>
            </div>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    root: {},
    container: {},
    textField: {},

    displayName: {},
    buttonColor: {
        background: theme.gradient
    }
}));

export default function AddPetsDialog(props) {
    const [open, setOpen] = React.useState(false);

    const [name, setName] = React.useState("");
    const [animal, setAnimal] = React.useState("");
    const [dateOfBirth, setDOB] = React.useState("");
    const [about, setAbout] = React.useState("");
    const [profilePic, setProfilePic] = React.useState(null);

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

    const classes = useStyles();
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
        createPet(props.userId, {
            name,
            dateOfBirth,
            about,
            animal,
            profilePic
        });
        handleClose();
    };

    return (
        <div>
            <PrimaryButton
                variant="contained"
                type="button"
                onClick={handleClickOpen}
            >
                <Typography variant="button">Add Pet</Typography>
            </PrimaryButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="add-pet-dialog-title">Add a Pet</DialogTitle>
                <DialogContent>
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
                    <PetImageDropZone returnImgToParent={getProfilePic} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <PrimaryButton
                        variant="contained"
                        type="button"
                        onClick={handleClickOpen}
                    >
                        <Typography variant="button">Add Pet</Typography>
                    </PrimaryButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
