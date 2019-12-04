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
import NotificationsIcon from "@material-ui/icons/Notifications";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";

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
    const { authUser, getAuthUser } = useAuth();
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
                to="/notifications"
            >
                <Typography variant="button">Notifications</Typography>
            </Button>
            <Button
                size="medium"
                type="button"
                variant="text"
                component={LinkButton}
                to="/feed"
            >
                <Typography variant="button">Feed</Typography>
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
            <MenuItem component={Link} to="/notifications">
                <IconButton color="inherit">
                    {/* TODO: update notification number */}
                    <Badge badgeContent={4} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem component={Link} to="/feed">
                <IconButton color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <DynamicFeedIcon />
                    </Badge>
                </IconButton>
                <p>Feed</p>
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
            <Toolbar>
                <Typography variant="h5">PET WORLD</Typography>
                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>
                    {authUser ? renderLoggedInButtons() : renderLoggedOutButtons()}
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
