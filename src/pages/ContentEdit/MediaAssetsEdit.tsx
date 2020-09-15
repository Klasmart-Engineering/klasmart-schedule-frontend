import { Box, CircularProgress, CircularProgressProps, makeStyles, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { ContentDetailForm } from "../../models/ModelContentDetailForm";
import { Content } from "../../api/api";
import { SingleUploader } from "../../components/SingleUploader";
import { apiResourcePathById } from "../../api/extra";
import AssetImg from "./AssetPreview/AssetImg";
import AssetVideo from "./AssetPreview/AssetVideo";
import AssetAudio from "./AssetPreview/AssetAudio";
import AssetFile from "./AssetPreview/AssetFile";

const useStyles = makeStyles((theme) => ({
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
    width: "100%",
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
  thumbnailImg: {
    width: 260,
    height: 132,
  },
  thumbnailProgressText: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  assetPreviewBox: {
    marginBottom: "5%",
  },
}));

interface PreviewProps {
  fileType: string;
  resourceId: string | undefined;
}

function AssetPreview(props: PreviewProps) {
  const css = useStyles();
  const { fileType, resourceId } = props;
  const source = typeof resourceId === "object" ? resourceId["source"] : resourceId;
  const path = apiResourcePathById(source);
  const getSuffix = (source: string | undefined) => {
    if (JSON.stringify(source) === "{}" || !source) return;
    return source.substring(source.lastIndexOf(".") + 1, source.length);
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center" className={css.assetPreviewBox}>
      {fileType === "image" && <AssetImg src={path} />}
      {fileType === "video" && <AssetVideo src={path} />}
      {fileType === "audio" && <AssetAudio src={path} />}
      {fileType === "document" && <AssetFile src={path} />}
      <Typography variant="body1" style={{ marginTop: "12px" }}>
        Content type: {getSuffix(source)}
      </Typography>
    </Box>
  );
}

interface FileTypeProps {
  fileFormat: any;
  fileType: string;
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

function ProgressWithText(props: CircularProgressProps) {
  const css = useStyles();
  return (
    <Box position="relative" display="inline-flex" alignItems="center">
      <CircularProgress className={css.thumbnailImg} variant="static" {...props} />
      <Box className={css.thumbnailProgressText}>
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(props.value || 0)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

interface AssetEditProps {
  fileType: string;
  formMethods: UseFormMethods<ContentDetailForm>;
  contentDetail: Content;
}

function AssetEdit(props: AssetEditProps) {
  const css = useStyles();
  const { fileType, formMethods, contentDetail } = props;
  const fileFormat: any = {
    video: [".avi", ".mov", ".mp4"],
    image: [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
    document: [".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".pdf"],
    audio: [".mp3", ".wav"],
  };
  return (
    <Box className={css.uploadBox} boxShadow={3}>
      <p className={css.title}>Upload a file</p>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" className={css.uploadTool}>
        <div className={css.uploadBtn}>
          <Controller
            name="data"
            control={formMethods.control}
            defaultValue={JSON.parse(contentDetail.data || "{}")}
            render={(props) => (
              <SingleUploader
                partition="assets"
                {...props}
                render={({ uploady, item, btnRef, value, isUploading }) => (
                  <>
                    {(JSON.stringify(value) === "{}" || !value) && !isUploading && <FileText fileFormat={fileFormat} fileType={fileType} />}
                    {!(JSON.stringify(value) === "{}" || !value) && <AssetPreview fileType={fileType} resourceId={value} />}
                    {!isUploading && !contentDetail.id && (
                      <Button variant="contained" color="primary" ref={btnRef}>
                        Upload Files
                      </Button>
                    )}
                    {isUploading && <ProgressWithText value={item?.completed} />}
                  </>
                )}
              />
            )}
          />
        </div>
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

export default class MediaAssetsEdit extends React.PureComponent<MediaAssetsEditProps> {
  public render() {
    const { readonly, overlay, fileType, formMethods, contentDetail } = this.props;
    if (overlay) return <AssetPreviewOverlay />;
    if (readonly) return <AssetPreview fileType={fileType} resourceId={JSON.parse(contentDetail.data || "{}")} />;
    return <AssetEdit fileType={fileType} formMethods={formMethods} contentDetail={contentDetail} />;
  }
}
