import { Box, IconButton, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import React, { useCallback, useMemo } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { apiIsEnableNewH5p } from "../../api/extra";
import { ContentFileType, ContentInputSourceType } from "../../api/type";
import { SingleUploader } from "../../components/SingleUploader";
import { AssetPreview } from "../../components/UIAssetPreview/AssetPreview";
import { d } from "../../locale/LocaleManager";
import { ProgressWithText } from "./Details";
import { DragItem, mapDropSegmentPropsReturn } from "./PlanComposeGraphic";

const useStyles = makeStyles(({ palette }) => ({
  uploadTool: {
    border: "2px dotted gray",
    height: "calc(100% - 50px)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    paddingTop: 20,
    boxSizing: "border-box",
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
    fontWeight: 500,
  },
  assetPreviewBox: {
    marginBottom: "5%",
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    right: 14,
    top: -11,
    color: palette.text.primary,
  },
}));

const useUploadBoxStyles = makeStyles(({ shadows }) => ({
  uploadBox: (props: AssetEditProps) => ({
    height: props.isAsset ? "calc(100% - 36px)" : "calc(100% - 116px)",
    padding: "6px 20px 30px 20px",
    boxShadow: shadows[3],
  }),
}));

export const fileFormat = {
  video: [".avi", ".mov", ".mp4"],
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
  document: [".ppt", ".pptx"],
  audio: [".mp3", ".wav"],
  pdf: [".pdf"],
};

const mapDropContainerProps = (monitor: DropTargetMonitor): mapDropSegmentPropsReturn => ({
  canDrop: monitor.canDrop(),
});
interface AssetEditProps {
  isAsset?: boolean;
  contentDetail: EntityContentInfoWithDetails;
  permission?: boolean;
  assetLibraryId?: ContentFileType;
  value?: string;
  onChange: (value?: string) => any;
  onChangeInputSource?: (value: ContentInputSourceType) => any;
}
function AssetEdit(props: AssetEditProps) {
  const css = useStyles();
  const uploadCss = useUploadBoxStyles(props);
  const { isAsset, contentDetail, permission, value: dataSource, onChange, onChangeInputSource, assetLibraryId } = props;
  const isPreview = !!dataSource;
  const setFile = useMemo(
    () => (item: DragItem) => {
      const source = JSON.parse(item.data.data).source;
      onChange(source);
      onChangeInputSource && onChangeInputSource(ContentInputSourceType.fromAssets);
    },
    [onChange, onChangeInputSource]
  );
  const dropType = apiIsEnableNewH5p() ? `LIBRARY_ITEM_FILE_TYPE_${assetLibraryId}` : "LIBRARY_ITEM";
  const [{ canDrop: canDropfile }] = useDrop<DragItem, unknown, mapDropSegmentPropsReturn>({
    accept: dropType,
    collect: mapDropContainerProps,
  });
  const [, fileRef] = useDrop<DragItem, unknown, mapDropSegmentPropsReturn>({
    accept: dropType,
    drop: setFile,
  });
  const handleChangeFileType = useCallback(() => {
    onChangeInputSource && onChangeInputSource(ContentInputSourceType.fromFile);
  }, [onChangeInputSource]);

  const previewHeader = (
    <Box position="relative">
      {isPreview ? (
        <>
          <p className={css.title}>{d("Preview").t("library_label_preview")}</p>
          {!isAsset && (
            <IconButton aria-label="close" className={css.closeButton} onClick={() => onChange("")}>
              <CloseIcon />
            </IconButton>
          )}
        </>
      ) : (
        <p className={css.title}>{isAsset ? d("Upload").t("library_label_upload") : d("Select a File").t("library_label_select_a_file")}</p>
      )}
    </Box>
  );
  const accept = (): string => {
    if (assetLibraryId === ContentFileType.image) {
      return fileFormat.image.join();
    }
    if (assetLibraryId === ContentFileType.audio) {
      return fileFormat.audio.join();
    }
    if (assetLibraryId === ContentFileType.doc) {
      return fileFormat.document.join();
    }
    if (assetLibraryId === ContentFileType.pdf) {
      return fileFormat.pdf.join();
    }
    if (assetLibraryId === ContentFileType.video) {
      return fileFormat.video.join();
    } else return `image/*,audio/*,video/*,${fileFormat.document.join()}, ${fileFormat.pdf.join()}`;
  };
  return (
    <div ref={fileRef} className={uploadCss.uploadBox}>
      {previewHeader}
      <div className={clsx(css.uploadTool, { [css.canDropFile]: canDropfile })}>
        <div className={css.uploadBtn}>
          <SingleUploader
            partition="assets"
            onChangeFile={handleChangeFileType}
            accept={accept()}
            value={dataSource}
            onChange={onChange}
            render={({ item, btnRef, value, isUploading }) => (
              <>
                {(JSON.stringify(value) === "{}" || !value) && !isUploading && !isAsset && (
                  <>
                    <p>{d("Drag from Assets Library").t("library_msg_drag_asset")}</p>
                    <p>or</p>
                  </>
                )}
                {!(JSON.stringify(value) === "{}" || !value) && <AssetPreview className={css.assetPreviewBox} resourceId={value} />}
                {(isAsset ? !isUploading && !contentDetail.id : !isUploading) && (
                  <Button variant="contained" color="primary" ref={btnRef} disabled={permission}>
                    {d("Upload from Device").t("library_label_upload_from_device")}
                  </Button>
                )}
                {isUploading && <ProgressWithText value={item?.completed} />}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function AssetPreviewOverlay() {
  return null;
}

interface MediaAssetsEditProps extends AssetEditProps {
  readonly: boolean;
  overlay: boolean;
  permission?: boolean;
}

export default class MediaAssetsEdit extends React.PureComponent<MediaAssetsEditProps> {
  public render() {
    const { readonly, overlay, contentDetail, ...assetEditProps } = this.props;
    if (overlay) return <AssetPreviewOverlay />;
    if (readonly) return <AssetPreview resourceId={JSON.parse(contentDetail.data || "{}")} />;
    return <AssetEdit contentDetail={contentDetail} {...assetEditProps} />;
  }
}
