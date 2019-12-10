import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import PrimaryButton from "../PrimaryButton";
import { useAuth } from "../../utils/AuthProvider";
import SendIcon from "@material-ui/icons/Send";

export default function SendMessageDialog() {
    const [open, setOpen] = useState(false);
    const [messageToSend, setMessageToSend] = useState("");
    const { user, sendMessage, startNewConversation, newConversation, authUser } = useAuth();

    const handleClickOpen = () => {
        setOpen(true);
        if (user){
            startNewConversation(user.id);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSend = () => {
        handleClose();
        sendMessage(newConversation.id, messageToSend)
    }

    const handleChange = (e) => {
        setMessageToSend(e.target.value);
    }

    return (
        <div>
            <PrimaryButton
                variant="contained"
                onClick={handleClickOpen}
                size="large"
                type="button"
            >
                <Typography variant="button">Message</Typography>
            </PrimaryButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {`Send a message to ${user && user.name}`}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        type="text"
                        fullWidth
                        multiline
                        rows = "4"
                        value = {messageToSend}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="text" type="button">
                        Cancel
                    </Button>
                    <Button
                        disabled = {!newConversation}
                        variant="text"
                        type="button"
                        onClick={handleSend}
                        startIcon={<SendIcon />}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
