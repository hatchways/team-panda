import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    Hidden,
    Paper,
    TextField,
    Button,
    Typography,
    IconButton,
    Chip,
    Card,
    Avatar,
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemText,
    List
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { getPets } from "../utils/petService";
import { useHistory, Link } from "react-router-dom";
import sampleMessages from "../utils/sampleMessages";
import { Route, useParams } from "react-router-dom";
import LinkButton from "../components/LinkButton";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper
    },
    container: {},
    messagesMenuText: {
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap"
    },
    messagesMenu: {
        maxHeight: "calc(100vh - 64px)",
        overflow: "auto"
    },
    messagesMenuHeader: {
        textAlign: "center"
    },
    messagesMenuItem: {
        height: "10vh"
    },
    messagesListHeader:{
        height: "calc(10vh + 7px)",
        backgroundColor: "whitesmoke",
    },
    messagesListOverride:{
        marginLeft: 5,
        paddingTop: 0,
    },
    messageBubble:{
        padding: 10,
        borderRadius: 100,
        height: "100%"
    },
    messageBubbleText:{
        textOverflow: "clip",
        whiteSpace: "normal"
    }
}));

export default function Messages() {
    const classes = useStyles();

    const renderListItems = () => {
        return sampleMessages.map((msg, i) => (
            <Fragment>
                <ListItem
                    button
                    component = {LinkButton}
                    to = {`/messages/${i}`}
                    key={i}
                    alignItems="flex-start"
                    className={classes.messagesMenuItem}
                >
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="profile-pic.png" />
                    </ListItemAvatar>
                    <ListItemText
                        primary="Testing name"
                        secondary={
                            <Typography
                                component="p"
                                variant="caption"
                                className={classes.messagesMenuText}
                            >
                                - {msg.text}
                            </Typography>
                        }
                    />
                </ListItem>
                <Divider />
            </Fragment>
        ));
    };

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item lg={3} sm={4}>
                    <Paper
                        square
                        elevation={5}
                        className={classes.messagesMenu}
                    >
                        <List>
                            <ListItem
                                alignItems="center"
                                className={classes.messagesMenuItem}
                            >
                                <ListItemText
                                    primary="Inbox Messages"
                                    classes={{
                                        root: classes.messagesMenuHeader
                                    }}
                                />
                            </ListItem>
                            <Divider />
                            {renderListItems()}
                        </List>
                    </Paper>
                </Grid>
                <Grid item lg={9} sm={8} className = {classes.messagesMenu}>
                    <Route path="/messages/:convoId">
                        <MessagesList />
                    </Route>
                </Grid>
            </Grid>
        </div>
    );
}

export function MessagesList() {
    const classes = useStyles();
    const { convoId } = useParams();

    const renderMessages = () => {
        return sampleMessages.map((msg, i) => (
            <Fragment>
                <ListItem
                    key={i}
                    alignItems="center"
                    // className={classes.messagesMenuItem}
                >
                    <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="profile-pic.png" />
                    </ListItemAvatar>
                    <Chip size = "medium" classes = {{root: classes.messageBubble, label: classes.messageBubbleText}} label = {msg.text}/>
                </ListItem>
            </Fragment>
        ));
    }

    return (
        <List classes = {{root: classes.messagesListOverride}}>
            <ListItem alignItems="center" classes ={{root: classes.messagesListHeader}}>
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="profile-pic.png" />
                </ListItemAvatar>
                <ListItemText
                    primary={"From User's Name" + convoId}
                />
            </ListItem>
            <Divider />
            {renderMessages()}
        </List>
    );
}
