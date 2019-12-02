import React from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { Typography } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
    previewContainerProps: {
        width: "30%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto"
    },
    previewProps: {
        width: "100%",
        height: "auto",
        display: "block"
    },
    imageZone: {
        width: "200px",
        height: "200px",
        lineHeight: "200px",
        backgroundColor: "#eee",
        textAlign: "center"
    },
    boxZone: {
        textAlign: "center",
        width: "200px"
    }
}));
export default function ImageDropZone({
    displayText,
    returnImgToParent,
    customImageZoneArea
}) {
    const classes = useStyles();
    const [imgs, setImgs] = React.useState([]);
    const { getRootProps, getInputProps } = useDropzone({
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
            returnImgToParent(files[0]);
        }
    });
    let defaultZone = (
        <div
            className={classes.imageZone}
            style={
                imgs.length > 0
                    ? {
                          background: `url(${imgs[0].preview}) no-repeat center/auto 100%`
                      }
                    : {}
            }
        >
            {!imgs.length && (
                <AddIcon style={{ lineHeight: "1.5" }} fontSize="large" />
            )}
        </div>
    );

    const preview = imgs.map((file, i) => (
        <div className={classes.previewContainerProps} key={i}>
            <img src={file.preview} className={classes.previewProps}></img>
        </div>
    ));

    React.useEffect(() => () => {
        imgs.forEach(img => URL.revokeObjectURL(img.preview), [imgs]);
    });

    return (
        <div>
            <div>
                {displayText && (
                    <div className={classes.boxZone}>
                        <Typography>{displayText}</Typography>
                    </div>
                )}
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {(customImageZoneArea && customImageZoneArea(imgs)) ||
                        defaultZone}
                </div>
            </div>
        </div>
    );
}
