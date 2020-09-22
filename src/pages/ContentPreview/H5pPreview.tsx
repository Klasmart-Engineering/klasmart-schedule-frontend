import { Box, Hidden, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import clsx from "clsx";
import React, { Fragment, useState } from "react";
import noH5pUrl from "../../assets/icons/noh5p.svg";
import { d } from "../../locale/LocaleManager";
import ContentH5p from "../ContentEdit/ContentH5p";
import { DataH5p, PreviewBaseProps } from "./type";

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
    height: "100%",
    position: "relative",
    minHeight: "calc(100vh - 60px)",
    // [breakpoints.up("md")]: {
    //   minHeight: 'calc(100vh - 60px)',
    // },
  },
  h5pCon: {
    width: "90%",
    height: "80%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "Translate(-50%, -50%)",
    textAlign: "center",
    background: "grey",
  },
  btnCon: {
    width: "100%",
    height: "10%",
    position: "absolute",
    top: "90%",
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  viewBtn: {
    width: 244,
    height: 68,
    borderRadius: 34,
    position: "absolute",
    right: "5%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#d32f2f",
    color: "#fff",
    cursor: "pointer",
  },
  viewMbBtn: {
    width: 100,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    right: "5%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#d32f2f",
    color: "#fff",
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

function EmptyContent() {
  const css = useStyles();
  return (
    <Fragment>
      <img className={css.noH5p} src={noH5pUrl} alt="deleted" />
      <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
        {d("The file has been deleted").t("library_msg_file_deleted")}
      </Typography>
    </Fragment>
  );
}
interface H5pPreview extends PreviewBaseProps {
  h5pArray: DataH5p[];
}
export function H5pPreview(props: H5pPreview) {
  const css = useStyles();
  const [currIndex, setCurrIndex] = useState(0);
  const { h5pArray, onGoLive } = props;
  let h5pItem = h5pArray[currIndex];
  console.log(h5pArray);
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
  return (
    <Box className={css.previewContainer}>
      <Box className={css.h5pCon}>{JSON.stringify(h5pItem) === "{}" ? <EmptyContent /> : <ContentH5p value={h5pItem} />}</Box>
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
              <IconButton disabled={currIndex >= h5pArray.length - 1} className={clsx(css.iconBtn, css.whiteIconBtn)} onClick={handleNext}>
                <ArrowForwardIosOutlinedIcon />
              </IconButton>
              <Typography>{d("Next").t("library_label_next")}</Typography>
            </Box>
          </Box>
        )}
        <Hidden only={["xs", "sm"]}>
          <Box className={clsx(css.viewBtn)} onClick={onGoLive}>
            {d("View in").t("library_label_view_in") && <Box style={{ fontSize: 18 }}>{d("View in").t("library_label_view_in")}</Box>}
            <Typography style={{ fontSize: 24 }}>{d("KidsLoop Live").t("library_label_kidsloop_live")}</Typography>
          </Box>
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          <Box className={clsx(css.viewMbBtn)} onClick={onGoLive}>
            {d("View in").t("library_label_view_in") && <Box style={{ fontSize: 12 }}>{d("View in").t("library_label_view_in")}</Box>}
            <Typography style={{ fontSize: 12 }}>{d("KidsLoop Live").t("library_label_kidsloop_live")}</Typography>
          </Box>
        </Hidden>
      </Box>
    </Box>
  );
}
