import React, { useState, useEffect } from "react";

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Menu,
    IconButton,
    MenuItem,
    Badge
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { makeStyles } from "@material-ui/styles";
import PrimaryButton from "./PrimaryButton";
import LinkButton from "./LinkButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import PetsIcon from "@material-ui/icons/Pets";
import io from "socket.io-client";

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1
    },
    root: {
        backgroundColor: "#2e363c",
        [theme.breakpoints.up("lg")]: {
            paddingLeft: "20vw",
            paddingRight: "20vw"
        }
    },
    title: {
        flexGrow: 1
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "flex"
        }
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    }
}));

export default function NavBar(props) {
    const { authUser, getAuthUser, socket, setSocket } = useAuth();
    const classes = useStyles();
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        getAuthUser();
    }, []);

    const createSocket = () => {
        if (!socket) {
            let token = localStorage.getItem("access_token");
            let newSocket = io("http://localhost:3001", {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            token
                        }
                    }
                }
            });
            newSocket.on("it works", function(data) {
                console.log(data);
            });
            setSocket(newSocket);
        }
    };

    const renderLoggedOutButtons = () => (
        <div>
            <Button
                size="medium"
                type="button"
                variant="text"
                component={LinkButton}
                to="/signup"
            >
                <Typography variant="button">Sign Up</Typography>
            </Button>
            <PrimaryButton
                size="medium"
                type="button"
                variant="contained"
                component={LinkButton}
                to="/login"
            >
                <Typography variant="button">Log In</Typography>
            </PrimaryButton>
        </div>
    );

    const renderLoggedInButtons = () => (
        <div>
            <Button
                size="medium"
                type="button"
                variant="text"
                component={LinkButton}
                to="/messages"
                startIcon={<MailIcon htmlColor="white"/>}
            >
                <Typography variant="button">Messages</Typography>
            </Button>
            <Button
                size="medium"
                type="button"
                variant="text"
                component={LinkButton}
                to="/pets"
                startIcon={<PetsIcon htmlColor="white"/>}
            >
                <Typography variant="button">Browse Pets</Typography>
            </Button>
            <PrimaryButton
                size="medium"
                type="button"
                variant="contained"
                component={LinkButton}
                to={`/users/${authUser.id}`}
            >
                <Typography variant="button">My Profile</Typography>
            </PrimaryButton>
        </div>
    );

    const renderLoggedOutMobileButtons = () => (
        <div>
            <MenuItem component={Link} to="/signup">
                <p>Sign Up</p>
            </MenuItem>
            <MenuItem component={Link} to="/login">
                <p>Log In</p>
            </MenuItem>
        </div>
    );

    const renderLoggedInMobileButtons = () => (
        <div>
            <MenuItem component={Link} to="/messages">
                <IconButton color="inherit">
                    {/* TODO: update notification number */}
                    <Badge badgeContent={4} color="secondary">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem component={Link} to="/pets">
                <IconButton color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <PetsIcon />
                    </Badge>
                </IconButton>
                <p>Browse Pets</p>
            </MenuItem>
            <MenuItem component={Link} to={`/users/${authUser.id}`}>
                <IconButton color="inherit">
                    <AccountCircle />
                </IconButton>
                <p>My Profile</p>
            </MenuItem>
        </div>
    );

    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {authUser
                ? renderLoggedInMobileButtons()
                : renderLoggedOutMobileButtons()}
        </Menu>
    );

    return (
        <AppBar position="sticky" className={classes.root}>
            {authUser && createSocket()}
            <Toolbar>
                <Typography variant="h5">PET WORLD</Typography>
                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>
                    {authUser
                        ? renderLoggedInButtons()
                        : renderLoggedOutButtons()}
                </div>
                <div className={classes.sectionMobile}>
                    <IconButton onClick={handleMobileMenuOpen} color="inherit">
                        <MoreIcon />
                    </IconButton>
                </div>
            </Toolbar>
            {renderMobileMenu}
        </AppBar>
    );
}
