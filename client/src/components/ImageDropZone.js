import React from "react";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";

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
    }
}));
export default function ImageDropZone(props) {
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
            props.returnImgToParent(files[0]);
        }
    });

    const preview = imgs.map((file, i) => (
        <div style={classes.previewContainerProps} key={i}>
            <img src={file.preview} style={classes.previewProps}></img>
        </div>
    ));

    React.useEffect(() => () => {
        imgs.forEach(img => URL.revokeObjectURL(img.preview), [imgs]);
    });

    return (
        <div>
            <div style={{ backgroundColor: "#eee" }}>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drop Profile Picture or click to upload.</p>
                </div>
            </div>
            <div>
                <aside>{preview}</aside>
            </div>
        </div>
    );
}
