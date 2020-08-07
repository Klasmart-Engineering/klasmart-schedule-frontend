import { makeStyles, Typography, Box } from "@material-ui/core";
import { DropzoneDialog } from "material-ui-dropzone";

import React from "react";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  assetImg: {
    width: 775,
    Height: 248,
  },
  uploadBox: {
    height: "calc(100% - 36px)",
    padding: "6px 20px 30px 20px",
  },
  uploadTool: {
    border: "2px dotted gray",
    height: "calc(100% - 50px)",
  },
  uploadBtn: {
    textAlign: "center",
  },
  title: {
    color: "#000000",
    fontSize: "18px",
  },
}));

function AssetPreview() {
  const css = useStyles();
  return (
    <Box display="flex" flexDirection="column">
      <img
        className={css.assetImg}
        src="https://beta-hub.kidsloop.net/e23a62b86d44c7ae5eb7993dbb6f7d7d.png"
        alt="assetImg"
      />
      <Typography variant="body1">Content type: jpg</Typography>
    </Box>
  );
}
interface AssetEditProps {
  asset?: any;
}
function AssetEdit(props: AssetEditProps) {
  const css = useStyles();
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleSave = (files: any) => {
    setOpen(false);
    setFiles(files);
  };
  const fileType = {
    video: [".ogg", ".mp4", ".avi"],
    images: ["image/jpeg", "image/png", "image/bmp"],
    file: [".pdf"],
    audio: [".mp3"],
  };
  return (
    <Box className={css.uploadBox} boxShadow={3}>
      <p className={css.title}>Select a file or drop it here</p>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        className={css.uploadTool}
      >
        <div className={css.uploadBtn}>
          <p style={{ color: "#666666" }}>Drop a file here</p>
          <p style={{ color: "#666666" }}>OR</p>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Upload Files
          </Button>
        </div>
        <DropzoneDialog
          open={open}
          onSave={handleSave}
          acceptedFiles={fileType.images}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={handleClose}
        />
      </Box>
    </Box>
  );
}

function AssetPreviewOverlay() {
  return null;
}

interface MediaAssetsEditProps extends AssetEditProps {
  readonly: boolean;
  overlay: boolean;
}

export default function MediaAssetsEdit(props: MediaAssetsEditProps) {
  const { readonly, overlay, asset } = props;
  if (overlay) return <AssetPreviewOverlay />;
  if (readonly) return <AssetPreview />;
  return <AssetEdit asset={asset} />;
}
