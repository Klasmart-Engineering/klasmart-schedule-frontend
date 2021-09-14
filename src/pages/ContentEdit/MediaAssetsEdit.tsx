import { useDroppable } from "@dnd-kit/core";
import { Box, IconButton, makeStyles, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import React, { useCallback } from "react";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { apiIsEnableNewH5p } from "../../api/extra";
import { ContentFileType, ContentInputSourceType } from "../../api/type";
import { SingleUploader } from "../../components/SingleUploader";
import { AssetPreview } from "../../components/UIAssetPreview/AssetPreview";
import { d } from "../../locale/LocaleManager";
import { ProgressWithText } from "./Details";
import { DragData } from "./PlanComposeGraphic";

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
  uploadInfo: {
    border: "1px dashed #979797",
    padding: "10px 20px",
    margin: "0 auto",
    width: "65%",
    marginTop: 20,
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
  video: [".avi", ".mp4"],
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
  document: [".ppt", ".pptx"],
  audio: [".mp3", ".wav"],
  pdf: [".pdf"],
};
interface AssetEditProps {
  isAsset?: boolean;
  contentDetail: EntityContentInfoWithDetails;
  disabled?: boolean;
  assetLibraryId?: ContentFileType;
  value?: string;
  onChange: (value?: string) => any;
  onChangeInputSource?: (value: ContentInputSourceType) => any;
}
function AssetEdit(props: AssetEditProps) {
  const css = useStyles();
  const uploadCss = useUploadBoxStyles(props);
  // const { lesson } = useParams<ContentEditRouteParams>();
  // const dispatch = useDispatch();
  const { isAsset, contentDetail, disabled, value: dataSource, onChange: onChangeValue, onChangeInputSource, assetLibraryId } = props;
  const isPreview = !!dataSource;
  const onChange = async (value?: string) => {
    // 韩国后端还没好 这个sprint不发  2021-09-15
    // if(value && lesson==="material" && fileFormat.pdf.indexOf(`.${getSuffix(value)}`) >= 0){
    //   dispatch(actSetLoading(true));
    //   apiValidatePDF(value).then(res => {
    //     dispatch(actSetLoading(false))
    //     if(!res.valid){
    //       const content = "The PDF file you uploaded cannot be displayed properly in live classes. Please upload a different file.";
    //       dispatch(actAsyncConfirm({ content, hideCancel:true}))
    //     }else{
    //       onChangeValue(value);
    //     }
    //   }).catch(() => {dispatch(actSetLoading(false)); onChangeValue("")})
    // }else {
    //   onChangeValue(value);
    // }
    onChangeValue(value);
  };
  const setFile = (data: DragData) => {
    const source = JSON.parse(data.item.data).source;
    onChange(source);
    onChangeInputSource && onChangeInputSource(ContentInputSourceType.fromAssets);
  };
  const dropType = apiIsEnableNewH5p() ? `LIBRARY_ITEM_FILE_TYPE_${assetLibraryId}` : "LIBRARY_ITEM";
  const { isOver, active, setNodeRef: fileRef } = useDroppable({ id: "MEDIA_ASSETS_EDIT_ID", data: { accept: [dropType], drop: setFile } });
  const canDropfile = isOver && active?.data.current?.type === dropType;
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
    } else
      return `${fileFormat.pdf.join()},${fileFormat.image.join()},${fileFormat.video.join()},${fileFormat.audio.join()},${fileFormat.document.join()},`;
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
                  <>
                    <Button variant="contained" color="primary" ref={btnRef} disabled={disabled}>
                      {d("Upload from Device").t("library_label_upload_from_device")}
                    </Button>
                    <div className={css.uploadInfo}>
                      <Typography style={{ color: "rgba(0,0,0,0.87)" }}>
                        {d("Supported format: PDF, JPG, JPEG, PNG, GIF, BMP, AVI, MP4, MP3, WAV").t("library_label_uploadInfo1")}
                      </Typography>
                      <Typography variant="body1" style={{ color: "#999999", fontSize: "14px" }}>
                        {d("(For Office documents, we suggest converting to PDF then upload, or using screen-sharing during class time)").t(
                          "library_label_uploadInfo2"
                        )}
                      </Typography>
                    </div>
                  </>
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
  disabled?: boolean;
}

export default class MediaAssetsEdit extends React.PureComponent<MediaAssetsEditProps> {
  public render() {
    const { readonly, overlay, contentDetail, ...assetEditProps } = this.props;
    if (overlay) return <AssetPreviewOverlay />;
    if (readonly) return <AssetPreview resourceId={JSON.parse(contentDetail.data || "{}")} />;
    return <AssetEdit contentDetail={contentDetail} {...assetEditProps} />;
  }
}
