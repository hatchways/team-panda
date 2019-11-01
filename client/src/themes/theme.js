import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
    typography: {
        fontFamily: "century-gothic, sans-serif",
        button: {
            fontWeight: "bold",
            textTransform: "none",
            color: "#ffffff"
        },
        h5: {
            fontWeight: "500"
        }
    },
    overrides: {
        MuiButton: {
            root: {
                borderRadius: "100px"
            }
        }
    },
    primary: "#2e363c",
    secondary: "#2e363c",
    error: "#d8000c",
    bgcolor: "#2e363c",
    gradient: "linear-gradient(to right, #FF9400, #FF3963)"
});
