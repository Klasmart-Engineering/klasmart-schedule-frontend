import { Box, Hidden, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import clsx from "clsx";
import React, { useState } from "react";
import { EntityContentInfoWithDetails, EntityScheduleDetailsView } from "../../api/api.auto";
import { apiResourcePathById } from "../../api/extra";
import { ContentFileType, ContentType, H5pSub } from "../../api/type";
import noH5pUrl from "../../assets/icons/noh5p.svg";
import { Thumbnail } from "../../components/Thumbnail";
import AssetAudio from "../../components/UIAssetPreview/AssetPreview/AssetAudio";
import AssetFile from "../../components/UIAssetPreview/AssetPreview/AssetFile";
import AssetImg from "../../components/UIAssetPreview/AssetPreview/AssetImg";
import AssetVideo from "../../components/UIAssetPreview/AssetPreview/AssetVideo";
import { d } from "../../locale/LocaleManager";
import { isDataSourceNewH5p } from "../../models/ModelH5pSchema";
import ContentH5p from "../ContentEdit/ContentH5p";
import { H5pPlayer } from "../ContentEdit/H5pPlayer";
import { fileFormat } from "../ContentEdit/MediaAssetsEdit";
import { PreviewBaseProps } from "./type";

const createContainedColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: palette.common.white,
  backgroundColor: paletteColor.main,
  "&:hover": {
    backgroundColor: paletteColor.dark,
  },
});
const useStyles = makeStyles(({ palette, breakpoints }) => ({
  btn: {
    marginLeft: "10px",
    cursor: "pointer",
  },
  whiteIconBtn: {
    color: "#000",
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
    "&:disabled": {
      backgroundColor: "#e0e0e0",
    },
  },
  rejectBtn: createContainedColor(palette.error, palette),
  previewContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "relative",
    height: "100%",
    minHeight: "calc(100vh - 60px)",
    // [breakpoints.up("md")]: {
    //   minHeight: 'calc(100vh - 60px)',
    // },
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  contentBtnCon: {
    width: "100%",
    minHeight: "calc(100% - 200px)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
  },
  h5pCon: {
    width: "80%",
    height: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btnCon: {
    width: "100%",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    position: "relative",
  },
  viewBtn: {
    width: 204,
    height: 68,
    borderRadius: 34,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#d32f2f",
    color: "#fff",
    cursor: "pointer",
    position: "absolute",
    left: "calc(90% - 204px)",
  },
  viewMbBtn: {
    width: 100,
    height: 40,
    borderRadius: 20,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#d32f2f",
    color: "#fff",
    position: "absolute",
    left: "calc(90% - 100px)",
  },
  iconBtn: {
    width: 48,
    height: 48,
  },
  optionCon: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    flexDirection: "column",
    fontSize: 16,
  },
  iconCon: {
    width: 180,
    [breakpoints.down("sm")]: {
      width: 120,
    },
    display: "flex",
    justifyContent: "space-between",
  },

  mapCon: {
    width: "100%",
    display: "flex",
    height: 200,
    background: "rgba(0,0,0,0.32)",
    overflowY: "hidden",
    overflowX: "scroll",
  },
  barContainer: {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
  },
  mapItem: {
    flexShrink: 0,
    width: 195,
    marginLeft: 20,
    marginRight: 20,
    cursor: "pointer",
  },
  cardImg: {
    position: "absolute",
    top: 0,
    left: 0,
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: "4px",
  },
  emptyImg: {
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: "4px",
    position: "absolute",
    top: "calc(50% - 12px)",
    left: "calc(50% - 12px)",
  },
  mapText: {
    width: "100%",
    height: "42px",
    fontSize: "14px",
    color: "#ffffff",
    wordWrap: "break-word",
    wordBreak: "normal",
    overflow: "hidden",
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    marginTop: 10,
  },
  active: {
    border: "4px solid #fff",
    borderRadius: "8px",
    marginTop: -15,
    position: "relative",
    marginBottom: 10,
    width: "102%",
  },
  arrow: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: "calc(50% - 3px)",
    width: 0,
    height: 0,
    borderTop: "6px solid #fff",
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
  },
  thumbnailCon: {
    width: "100%",
    paddingTop: "56.25%",
    position: "relative",
  },
  planViewBtn: {
    marginTop: -92,
  },
  planBViewBtn: {
    marginTop: -58,
  },
  emptyComponent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  noH5p: {
    marginTop: 200,
    marginBottom: 40,
    width: 130,
    height: 133,
  },
  emptyDesc: {
    marginBottom: "auto",
    color: "#fff",
  },
}));

// data.file_type === ContentType.image || data... === ContentType.

function EmptyContent() {
  const css = useStyles();
  return (
    <div className={css.emptyComponent}>
      <img className={css.noH5p} src={noH5pUrl} alt="deleted" />
      <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
        {d("The file has been deleted").t("library_msg_file_deleted")}
      </Typography>
    </div>
  );
}
interface H5pPreview extends PreviewBaseProps {
  h5pArray: any[];
  classType: EntityScheduleDetailsView["class_type"];
  content_type: EntityContentInfoWithDetails["content_type"];
}
export function H5pPreview(props: H5pPreview) {
  const css = useStyles();
  const [currIndex, setCurrIndex] = useState(0);
  const { h5pArray, onGoLive, classType, content_type } = props;
  let h5pItem = h5pArray[currIndex];
  const handlePrev = () => {
    if (currIndex > 0) {
      setCurrIndex(currIndex - 1);
      h5pItem = h5pArray[currIndex];
    }
  };
  const handleNext = () => {
    if (currIndex < h5pArray.length - 1) {
      setCurrIndex(currIndex + 1);
      h5pItem = h5pArray[currIndex];
    }
  };
  const getSuffix = (data: any) => {
    const source = data.source;
    if (
      data.file_type === ContentFileType.image ||
      data.file_type === ContentFileType.video ||
      data.file_type === ContentFileType.audio ||
      data.file_type === ContentFileType.doc
    ) {
      return source?.split(".").pop()?.toLowerCase();
    } else {
      return false;
    }
  };
  const handleClickItem = (index: number): void => {
    setCurrIndex(index);
    h5pItem = h5pArray[currIndex];
  };
  const parsedData: any = JSON.parse(h5pItem.data);
  const path = h5pItem ? (parsedData ? apiResourcePathById(parsedData.source) : "") : "";

  const isNewH5p = isDataSourceNewH5p(h5pItem.data, h5pItem.id);
  const isEmpty = !h5pItem || !parsedData || h5pItem.data === "{}";
  const showAssets = () => {
    if (fileFormat.image.indexOf(`.${getSuffix(parsedData)}`) >= 0) {
      return <AssetImg src={path} />;
    } else if (fileFormat.video.indexOf(`.${getSuffix(parsedData)}`) >= 0) {
      return <AssetVideo src={path} />;
    } else if (fileFormat.audio.indexOf(`.${getSuffix(parsedData)}`) >= 0) {
      return <AssetAudio src={path} />;
    } else if (fileFormat.document.indexOf(`.${getSuffix(parsedData)}`) >= 0 && <AssetFile src={path} />) {
      return <AssetFile src={path} />;
    }
  };
  // const isHideH5p = h5pItem && parsedData && !getSuffix(parsedData.source) && h5pItem.data === "{}";

  return (
    <Box className={css.previewContainer}>
      <Box className={css.contentBtnCon}>
        <Box className={css.h5pCon}>
          {isEmpty ? (
            <EmptyContent />
          ) : !getSuffix(parsedData) ? (
            isNewH5p ? (
              <H5pPlayer valueSource={parsedData.source} id={h5pItem.id} />
            ) : (
              <ContentH5p sub={H5pSub.view} valueSource={parsedData.source} />
            )
          ) : (
            showAssets()
          )}
        </Box>
        <Box className={css.btnCon}>
          {h5pArray.length > 1 && (
            <Box className={css.iconCon}>
              <Box className={css.optionCon}>
                <IconButton disabled={currIndex === 0} className={clsx(css.iconBtn, css.whiteIconBtn)} onClick={handlePrev}>
                  <ArrowBackIosOutlinedIcon />
                </IconButton>
                <Typography>{d("Previous").t("library_label_previous")}</Typography>
              </Box>
              <Box className={css.optionCon}>
                <IconButton
                  disabled={currIndex >= h5pArray.length - 1}
                  className={clsx(css.iconBtn, css.whiteIconBtn)}
                  onClick={handleNext}
                >
                  <ArrowForwardIosOutlinedIcon />
                </IconButton>
                <Typography>{d("Next").t("library_label_next")}</Typography>
              </Box>
            </Box>
          )}
          <Hidden only={["xs", "sm"]}>
            <Box className={clsx(css.viewBtn)} onClick={onGoLive}>
              {d("View in").t("library_label_view_in") !== "-" && (
                <Box style={{ fontSize: 18 }}>{d("View in").t("library_label_view_in")}</Box>
              )}
              {classType === "OnlineClass" && (
                <Typography style={{ fontSize: 24 }}>{d("KidsLoop Live").t("library_label_kidsloop_live")}</Typography>
              )}
              {classType === "OfflineClass" && (
                <Typography style={{ fontSize: 24 }}>{d("KidsLoop Class").t("schedule_preview_class")}</Typography>
              )}
              {classType === "Homework" && (
                <Typography style={{ fontSize: 24 }}>{d("KidsLoop Study").t("schedule_preview_study")}</Typography>
              )}
              {classType === "Task" && <Typography style={{ fontSize: 24 }}>{d("KidsLoop Live").t("schedule_preview_live")}</Typography>}
            </Box>
          </Hidden>
          <Hidden only={["md", "lg", "xl"]}>
            <Box className={clsx(css.viewMbBtn)} onClick={onGoLive}>
              {d("View in").t("library_label_view_in") && <Box style={{ fontSize: 12 }}>{d("View in").t("library_label_view_in")}</Box>}
              {classType === "OnlineClass" && (
                <Typography style={{ fontSize: 12 }}>{d("KidsLoop Live").t("library_label_kidsloop_live")}</Typography>
              )}
              {classType === "OfflineClass" && (
                <Typography style={{ fontSize: 12 }}>{d("KidsLoop Class").t("schedule_preview_class")}</Typography>
              )}
              {classType === "Homework" && (
                <Typography style={{ fontSize: 12 }}>{d("KidsLoop Study").t("schedule_preview_study")}</Typography>
              )}
              {classType === "Task" && <Typography style={{ fontSize: 12 }}>{d("KidsLoop Live").t("schedule_preview_live")}</Typography>}
            </Box>
          </Hidden>
        </Box>
      </Box>
      {h5pArray.length && content_type === ContentType.plan && (
        <div className={css.mapCon}>
          <div className={css.barContainer}>
            {h5pArray.map((material, index) => (
              <div key={index} className={css.mapItem}>
                <div onClick={() => handleClickItem(index)} className={clsx(css.thumbnailCon, { [css.active]: currIndex === index })}>
                  {material ? (
                    <Thumbnail
                      className={css.cardImg}
                      type={ContentType.material}
                      id={material.thumbnail}
                      onClick={() => handleClickItem(index)}
                    ></Thumbnail>
                  ) : (
                    <img className={css.emptyImg} src={noH5pUrl} alt="deleted" />
                  )}
                  {currIndex === index && <div className={css.arrow}></div>}
                </div>
                {material ? (
                  <Typography className={css.mapText}>
                    {material.name} ({material.suggest_time} min)
                  </Typography>
                ) : (
                  <Typography className={css.mapText}>{d("The file has been deleted").t("library_msg_file_deleted")}</Typography>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Box>
  );
}
