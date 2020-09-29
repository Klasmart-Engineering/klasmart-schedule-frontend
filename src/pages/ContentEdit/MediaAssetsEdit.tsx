import { Box, CircularProgress, CircularProgressProps, makeStyles, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import React, { useMemo } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { Controller, UseFormMethods } from "react-hook-form";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { apiResourcePathById } from "../../api/extra";
import { SingleUploader } from "../../components/SingleUploader";
import { d } from "../../locale/LocaleManager";
import { ContentDetailForm } from "../../models/ModelContentDetailForm";
import AssetAudio from "./AssetPreview/AssetAudio";
import AssetFile from "./AssetPreview/AssetFile";
import AssetImg from "./AssetPreview/AssetImg";
import AssetVideo from "./AssetPreview/AssetVideo";
import { DragItem, mapDropSegmentPropsReturn } from "./PlanComposeGraphic";

const useStyles = makeStyles(({ palette }) => ({
  uploadTool: {
    border: "2px dotted gray",
    height: "calc(100% - 50px)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  canDropFile: {
    borderStyle: "dashed",
    borderColor: palette.primary.main,
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

const useUploadBoxStyles = makeStyles({
  uploadBox: (props: AssetEditProps) => ({
    height: props.fileType ? "calc(100% - 36px)" : "calc(100% - 116px)",
    padding: "6px 20px 30px 20px",
  }),
});

const fileFormat: any = {
  video: [".avi", ".mov", ".mp4"],
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
  document: [".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".pdf"],
  audio: [".mp3", ".wav"],
};

interface PreviewProps {
  fileType?: string;
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
      {(fileType === "image" || fileFormat.image.indexOf(`.${getSuffix(source)}`) >= 0) && <AssetImg src={path} />}
      {(fileType === "video" || fileFormat.video.indexOf(`.${getSuffix(source)}`) >= 0) && <AssetVideo src={path} />}
      {(fileType === "audio" || fileFormat.audio.indexOf(`.${getSuffix(source)}`) >= 0) && <AssetAudio src={path} />}
      {(fileType === "document" || fileFormat.document.indexOf(`.${getSuffix(source)}`) >= 0) && <AssetFile src={path} />}
      <Typography variant="body1" style={{ marginTop: "12px" }}>
        {d("File Type").t("library_label_file_type")} : {getSuffix(source)}
      </Typography>
    </Box>
  );
}

interface FileTypeProps {
  fileFormat: any;
  fileType?: string;
}
function FileText(props: FileTypeProps) {
  const { fileType, fileFormat } = props;
  if (!fileType) {
    return (
      <>
        <p>Drag from Asset Library</p>
        <p>or</p>
      </>
    );
  } else {
    const format = fileFormat[fileType];
    const fillfileType = `${fileType}(
    ${format.map((item: String, index: number) => {
      return `${item.substr(1)}`;
    })}
    )`;
    return <p style={{ color: "#666666" }}>{d("Upload a {fillfileType} here").t("library_label_upload_a", { fillfileType })}</p>;
  }
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

const mapDropContainerProps = (monitor: DropTargetMonitor): mapDropSegmentPropsReturn => ({
  canDrop: monitor.canDrop(),
});
interface AssetEditProps {
  fileType?: string;
  formMethods: UseFormMethods<ContentDetailForm>;
  contentDetail: EntityContentInfoWithDetails;
}

function AssetEdit(props: AssetEditProps) {
  const css = useStyles();
  const uploadCss = useUploadBoxStyles(props);
  const { fileType, formMethods, contentDetail } = props;
  const { setValue } = formMethods;
  const setFile = useMemo(
    () => (item: DragItem) => {
      const source = JSON.parse(item.data.data).source;
      setValue("data.source", source, { shouldDirty: true });
    },
    [setValue]
  );
  const [{ canDrop: canDropfile }] = useDrop<DragItem, unknown, mapDropSegmentPropsReturn>({
    accept: "LIBRARY_ITEM",
    collect: mapDropContainerProps,
  });
  const [, fileRef] = useDrop<DragItem, unknown, mapDropSegmentPropsReturn>({
    accept: "LIBRARY_ITEM",
    drop: setFile,
  });
  return (
    <Box className={uploadCss.uploadBox} boxShadow={3}>
      <p className={css.title}>{fileType ? d("Upload").t("library_label_upload") : "Select a file"}</p>
      <div ref={fileRef} className={clsx(css.uploadTool, { [css.canDropFile]: canDropfile })}>
        <div className={css.uploadBtn}>
          <Controller
            name={fileType ? "data" : "data.source"}
            control={formMethods.control}
            defaultValue={JSON.parse(contentDetail.data || "{}")}
            render={(props) => (
              <SingleUploader
                partition="assets"
                accept={`${fileType}/*`}
                {...props}
                render={({ uploady, item, btnRef, value, isUploading }) => (
                  <>
                    {(JSON.stringify(value) === "{}" || !value) && !isUploading && <FileText fileFormat={fileFormat} fileType={fileType} />}
                    {!(JSON.stringify(value) === "{}" || !value) && <AssetPreview fileType={fileType} resourceId={value} />}
                    {fileType
                      ? !isUploading &&
                        !contentDetail.id && (
                          <Button variant="contained" color="primary" ref={btnRef}>
                            {d("Upload").t("library_label_upload")}
                          </Button>
                        )
                      : !isUploading && (
                          <Button variant="contained" color="primary" ref={btnRef}>
                            Upload from Device
                          </Button>
                        )}
                    {isUploading && <ProgressWithText value={item?.completed} />}
                  </>
                )}
              />
            )}
          />
        </div>
      </div>
    </Box>
  );
}

export function MediaAssetsEditHeader() {
  const css = useStyles();
  return <Box className={css.assetsHeader}>{d("Details").t("library_label_details")}</Box>;
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
