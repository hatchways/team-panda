import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    color: {
        background: theme.gradient
    }
}));

export default function({ size, variant, type, children, ...props }) {
    const classes = useStyles();
    return (
        <Button
            variant={variant || "contained"}
            size={size || "medium"}
            type={type || "button"}
            className={classes.color + " " + props.className}
            {...props}
        >
            {children}
        </Button>
    );
}
