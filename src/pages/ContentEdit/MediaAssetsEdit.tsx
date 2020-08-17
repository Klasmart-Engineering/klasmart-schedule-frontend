import { makeStyles, Typography, Box } from "@material-ui/core";
import { DropzoneDialog } from "material-ui-dropzone";

import React from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

interface Props extends MediaAssetsEditProps {
  topicList: [];
}

const mapStateToProps = (state: any) => {
  return {
    topicList: state.content.topicList,
  };
};

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
  assetsHeader: {
    fontSize: "20px",
    fontWeight: "bold",
    height: "64px",
    backgroundColor: "#F0F0F0",
    paddingLeft: "30px",
    lineHeight: "64px",
  },
}));

function AssetPreview() {
  const css = useStyles();
  return (
    <Box display="flex" flexDirection="column">
      <img className={css.assetImg} src="https://beta-hub.kidsloop.net/e23a62b86d44c7ae5eb7993dbb6f7d7d.png" alt="assetImg" />
      <Typography variant="body1">Content type: jpg</Typography>
    </Box>
  );
}

interface FileTypeProps {
  fileFormat: any;
  fileType: any;
}
function FileText(props: FileTypeProps) {
  const { fileType, fileFormat } = props;
  const format = fileFormat[fileType];
  return (
    <p style={{ color: "#666666" }}>
      Upload a {fileType} (
      {format.map((item: String, index: number) => {
        return `${item.substr(1)}${index + 1 < format.length ? "," : ""}`;
      })}
      ) here
    </p>
  );
}

interface AssetEditProps {
  asset?: any;
  topicList?: any;
}
function AssetEdit(props: AssetEditProps) {
  const css = useStyles();
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const { topicList } = props;
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
  const fileFormat = {
    video: [".avi", ".mov", ".mp4"],
    images: [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
    document: [".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".pdf"],
    audio: [".mp3", ".wav"],
  };
  return (
    <Box className={css.uploadBox} boxShadow={3}>
      <p className={css.title}>Select a file or drop it here</p>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" className={css.uploadTool}>
        <div className={css.uploadBtn}>
          <FileText fileFormat={fileFormat} fileType={topicList.fileType} />
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Upload Files
          </Button>
        </div>
        <DropzoneDialog
          open={open}
          onSave={handleSave}
          acceptedFiles={fileFormat.images}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={handleClose}
        />
      </Box>
    </Box>
  );
}

export function MediaAssetsEditHeader() {
  const css = useStyles();
  return <Box className={css.assetsHeader}>Asset Details</Box>;
}

function AssetPreviewOverlay() {
  return null;
}

interface MediaAssetsEditProps extends AssetEditProps {
  readonly: boolean;
  overlay: boolean;
}

class MediaAssetsEdit extends React.PureComponent<Props> {
  public render() {
    const { topicList, readonly, overlay, asset } = this.props;
    if (overlay) return <AssetPreviewOverlay />;
    if (readonly) return <AssetPreview />;
    return <AssetEdit asset={asset} topicList={topicList} />;
  }
}

export default connect(mapStateToProps)(MediaAssetsEdit);
