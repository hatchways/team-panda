import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Card,
    CardActionArea,
    CardActions,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Grid,
    Button
} from "@material-ui/core";
import UpdatePost from "./dialogs/AddOrEditPost";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { maxWidth } from "@material-ui/system";
const useStyles = makeStyles(theme => ({
    card: {
        margin: 30
    },
    media: {
        height: 250
    },
    iconColor: {
        color: "#FF9400"
    }
}));
export default function(props) {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={props.post.image}
                ></CardMedia>
            </CardActionArea>
            <CardContent>
                <Grid container alignItems="center">
                    <Typography component="div">
                        <Box fontWeight="fontWeightBold">
                            {props.post.caption}
                        </Box>
                    </Typography>
                    <div
                        style={{
                            marginLeft: "auto"
                        }}
                    >
                        {/* <UpdatePost
                            post={props.post}
                            pet={props.pet}
                            update
                            onUpdatePost={props.onUpdatePost}
                        ></UpdatePost> */}
                        <Button variant="outlined">
                            <FavoriteIcon className={classes.iconColor} />
                            <Typography>Like</Typography>
                        </Button>
                    </div>
                </Grid>
            </CardContent>
        </Card>
    );
}
