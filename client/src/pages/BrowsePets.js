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
    Divider
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { getPets } from "../utils/petService";
import { useHistory, Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "center",
        paddingTop: "30px"
    },
    container: {
        width: "60vw",
        minHeight: "calc(100vh - 64px)",
        [theme.breakpoints.down("md")]: {
            width: "100%"
        },
        padding: 50
    },
    searchContainer: {
        width: "100%"
    },
    searchForm: {
        display: "flex",
        alignItems: "center"
    },
    search: {
        flex: 8
    },
    searchButton: {
        flex: 2
    },
    petsGrid: {},
    petItem: {},
    resultsContainer: {
        paddingTop: 20
    },
    cardSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 20,
    },
    tags:{
        textAlign: "center",
        padding: 20,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    petProfilePic: {
        height: 70,
        width: 70
    },
    avatarSection:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 20,
    },
    tagItem: {
        padding: 5
    }
}));

export default function BrowsePets() {
    const classes = useStyles();
    const [pets, setPets] = useState([]);
    const [searchText, setSearchText] = useState("");

    const fetchPets = async event => {
        event.preventDefault();
        console.log("searching");
        const res = await getPets(searchText);
        setPets(res.data);
    };

    const handleSearchChange = event => {
        setSearchText(event.target.value);
    };

    const getAge = (dateOfBirth) => {
        const dateObj = new Date(dateOfBirth);
        const yearOfBirth = dateObj.getFullYear();
        const now = new Date();
        return Math.floor(now.getFullYear() - yearOfBirth);
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.container} square elevation={5}>
                <div className={classes.searchContainer}>
                    <form onSubmit={fetchPets} className={classes.searchForm}>
                        <TextField
                            className={classes.search}
                            placeholder="Search"
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                        <IconButton
                            type="submit"
                            className={classes.searchButton}
                        >
                            <SearchIcon />
                            Search
                        </IconButton>
                    </form>
                </div>
                <div className={classes.resultsContainer}>
                    <Grid container spacing={5} className={classes.petsGrid}>
                        {pets &&
                            pets.map(pet => (
                                <Grid item lg={4} sm={6} xs={12}>
                                    <Card
                                        square
                                        raised
                                        className={classes.petItem}
                                    >
                                        <div className ={classes.avatarSection}>
                                            <Avatar
                                                className={classes.petProfilePic}
                                                alt={pet.name}
                                                src={pet.profilePic}
                                            />
                                            <Link
                                            style={{ textDecoration: "none" }}
                                            to={`/users/${pet.ownerId}/pets/${pet.id}`}
                                        >
                                            <Typography variant="subtitle2">
                                                {pet.name}
                                            </Typography>
                                            <Typography variant="caption">
                                                {pet.location}
                                            </Typography>
                                        </Link>
                                        </div>
                                        <Divider />
                                        {pet.tags && (
                                            <div className = {classes.tags}>
                                                {pet.tags.map(tag => {
                                                    return <div className ={classes.tagItem}>
                                                        <Chip variant="outlined" label={tag} />
                                                    </div>;
                                                })}
                                            </div>
                                        )}
                                        {pet.tags && <Divider />}
                                        <Typography variant="caption" className = {classes.cardSection}>
                                            {getAge(pet.dateOfBirth)} YEARS OLD
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>
                </div>
            </Paper>
        </div>
    );
}
