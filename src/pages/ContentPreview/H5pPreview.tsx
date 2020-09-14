import { Box, IconButton, makeStyles, Typography } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import clsx from "clsx";
import React, { Fragment, useState } from "react";
import { Content } from "../../api/api";
import noH5pUrl from "../../assets/icons/noh5p.svg";
import ContentH5p from "../ContentEdit/ContentH5p";

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
  whiteIconBtn: createContainedColor(palette.primary, palette),
  rejectBtn: createContainedColor(palette.error, palette),
  previewContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    position: "relative",
    overflow: "hidden",
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
  iconBtn: {
    width: 48,
    height: 48,
  },
  iconCon: {
    width: 200,
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
      <img className={css.noH5p} alt="comingsoon" src={noH5pUrl} />
      <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
        The file has been deleted
      </Typography>
    </Fragment>
  );
}
interface DataH5p {
  source?: string;
}
export interface PlanPreviewProps {
  contents: (Content | undefined)[];
  onGoLive: () => any;
}
export function PlanPreview(props: PlanPreviewProps) {
  const css = useStyles();
  const [currIndex, setCurrIndex] = useState(0);
  const { contents, onGoLive } = props;
  let currContent = contents[currIndex];
  let source = JSON.parse(currContent?.data || "{}");
  const handlePrev = () => {
    if (currIndex > 0) {
      setCurrIndex(currIndex - 1);
      currContent = contents[currIndex];
      source = JSON.parse(currContent?.data || "{}");
    }
  };
  const handleNext = () => {
    if (currIndex < contents.length - 1) {
      setCurrIndex(currIndex + 1);
      currContent = contents[currIndex];
      source = JSON.parse(currContent?.data || "{}");
    }
  };
  return (
    <Box className={css.previewContainer}>
      <Box className={css.h5pCon}>{JSON.stringify(source) === "{}" ? <EmptyContent /> : <ContentH5p value={source} />}</Box>
      <Box className={css.btnCon}>
        <Box className={css.iconCon}>
          <IconButton disabled={currIndex === 0} className={clsx(css.iconBtn, css.whiteIconBtn)} onClick={handlePrev}>
            <ArrowBackIosOutlinedIcon />
          </IconButton>
          <IconButton disabled={currIndex >= contents.length - 1} className={clsx(css.iconBtn, css.whiteIconBtn)} onClick={handleNext}>
            <ArrowForwardIosOutlinedIcon />
          </IconButton>
        </Box>
        <Box className={clsx(css.viewBtn)} onClick={onGoLive}>
          <Box>View in</Box>
          <Typography variant="h5">KidsLoop Live</Typography>
        </Box>
      </Box>
    </Box>
  );
}
export interface MaterialPreviewProps {
  h5pItem: DataH5p;
  onGoLive: () => any;
}
export function MaterialPreview(props: MaterialPreviewProps) {
  const css = useStyles();
  const { h5pItem, onGoLive } = props;
  return (
    <Box className={css.previewContainer}>
      <Box className={css.h5pCon}>{JSON.stringify(h5pItem) === "{}" ? <EmptyContent /> : <ContentH5p value={h5pItem} />}</Box>
      <Box className={css.btnCon}>
        <Box className={clsx(css.viewBtn)} onClick={onGoLive}>
          <Box>View in</Box>
          <Typography variant="h5">KidsLoop Live</Typography>
        </Box>
      </Box>
    </Box>
  );
}
