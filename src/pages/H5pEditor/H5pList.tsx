import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Check } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { ContentFileType, ContentTypeList } from "../../api/type";
import H5pAudio from "../../assets/icons/h5p_audio.svg";
import H5pPdf from "../../assets/icons/h5p_file.svg";
import H5pPicture from "../../assets/icons/h5p_picture.svg";
import H5pVideo from "../../assets/icons/h5p_video.svg";
import { d } from "../../locale/LocaleManager";
import { h5plibId2Name } from "../../models/ModelH5pSchema";
import { MockData } from "./types/index";
const useStyles = makeStyles(({ palette }) => ({
  listItem: {
    borderBottom: "1px solid #ececec",
    position: "relative",
    "& p,h3": {
      margin: "10px 0",
    },
    paddingLeft: 0,
  },
  itemButton: {
    position: "absolute",
    top: "50%",
    right: "20px",
    transform: "translateY(-50%)",
    zIndex: 100,
  },
  imgBox: {
    // marginRight: "20px",
    height: "70px",
    "& img": {
      height: "100%",
    },
    padding: "0 10px",
    minWidth: "50px",
  },
  listContainer: {
    // maxHeight: '660px',
    // overflow: "auto"
  },
  disableBackground: {
    opacity: 0.3,
    cursor: "not-allowed",
  },
}));
export const assetsData: MockData[] = [
  {
    title: "Image",
    id: ContentFileType.image,
    icon: H5pPicture,
    summary: "this is image uploader",
    license: {
      id: "",
      attributes: {
        canHoldLiable: false,
        distributable: true,
        modifiable: true,
        mustIncludeCopyright: true,
        mustIncludeLicense: true,
        sublicensable: true,
        useCommercially: true,
      },
    },
    description: "this is image uploader",
    owner: "Fake Owner",
    example: "",
    screenshots: [],
    categories: [],
    coreApiVersionNeeded: {
      major: 0,
      minor: 0,
    },
    createdAt: "2016-08-28T08:58:39+0000",
    isRecommended: true,
    keywords: [],
    tutorial: "",
    updatedAt: "",
    version: {
      major: 0,
      minor: 0,
      patch: 0,
    },
    popularity: 0,
  },
  {
    title: "Audio",
    id: ContentFileType.audio,
    icon: H5pAudio,
    summary: "this is audio uploader",
    license: {
      id: "",
      attributes: {
        canHoldLiable: false,
        distributable: true,
        modifiable: true,
        mustIncludeCopyright: true,
        mustIncludeLicense: true,
        sublicensable: true,
        useCommercially: true,
      },
    },
    description: "this is audio uploader",
    owner: "Fake Owner",
    example: "",
    screenshots: [],
    categories: [],
    coreApiVersionNeeded: {
      major: 0,
      minor: 0,
    },
    createdAt: "2015-08-28T08:58:39+0000",
    isRecommended: true,
    keywords: [],
    tutorial: "",
    updatedAt: "",
    version: {
      major: 0,
      minor: 0,
      patch: 0,
    },
    popularity: 0,
  },
  {
    title: "Video",
    id: ContentFileType.video,
    icon: H5pVideo,
    summary: "this is video uploader",
    license: {
      id: "",
      attributes: {
        canHoldLiable: false,
        distributable: true,
        modifiable: true,
        mustIncludeCopyright: true,
        mustIncludeLicense: true,
        sublicensable: true,
        useCommercially: true,
      },
    },
    description: "this is video uploader",
    owner: "Fake Owner",
    example: "",
    screenshots: [],
    categories: [],
    coreApiVersionNeeded: {
      major: 0,
      minor: 0,
    },
    createdAt: "2014-08-28T08:58:39+0000",
    isRecommended: true,
    keywords: [],
    tutorial: "",
    updatedAt: "",
    version: {
      major: 0,
      minor: 0,
      patch: 0,
    },
    popularity: 0,
  },
  {
    title: "Pdf",
    id: ContentFileType.pdf,
    icon: H5pPdf,
    summary: "this is pdf uploader",
    license: {
      id: "",
      attributes: {
        canHoldLiable: false,
        distributable: true,
        modifiable: true,
        mustIncludeCopyright: true,
        mustIncludeLicense: true,
        sublicensable: true,
        useCommercially: true,
      },
    },
    description: "this is pdf uploader",
    owner: "Fake Owner",
    example: "",
    screenshots: [],
    categories: [],
    coreApiVersionNeeded: {
      major: 0,
      minor: 0,
    },
    createdAt: "2014-08-28T08:58:39+0000",
    isRecommended: true,
    keywords: [],
    tutorial: "",
    updatedAt: "",
    version: {
      major: 0,
      minor: 0,
      patch: 0,
    },
    popularity: 0,
  },
  {
    title: "Document",
    id: ContentFileType.doc,
    icon: H5pPdf,
    summary: "this is document uploader",
    license: {
      id: "",
      attributes: {
        canHoldLiable: false,
        distributable: true,
        modifiable: true,
        mustIncludeCopyright: true,
        mustIncludeLicense: true,
        sublicensable: true,
        useCommercially: true,
      },
    },
    description: "this is document uploader",
    owner: "Fake Owner",
    example: "",
    screenshots: [],
    categories: [],
    coreApiVersionNeeded: {
      major: 0,
      minor: 0,
    },
    createdAt: "2014-08-28T08:58:39+0000",
    isRecommended: true,
    keywords: [],
    tutorial: "",
    updatedAt: "",
    version: {
      major: 0,
      minor: 0,
      patch: 0,
    },
    popularity: 0,
  }, // {
  //   title: "Document",
  //   id: ContentFileType.doc,
  //   icon: H5pFile,
  //   summary: "this is document uploader",
  //   license: {},
  //   description: "this is document uploader",
  //   owner: "Fake Owner",
  //   example: "",
  //   screenshots: [],
  // },
];
interface H5pListProps {
  libraryId?: string;
  assetLibraryId?: ContentFileType | string;
  contentTypeList: (ContentTypeList[0] | MockData)[];
  onChange: (value: string) => any;
  onChangeAssetLibraryId?: (value: ContentFileType) => any;
  expand: boolean;
  onExpand: (value: boolean) => any;
  setShow: (value: string) => any;
  setH5pId: (value: string | ContentFileType) => void;
  setMockData: (value: ContentTypeList[0] | MockData) => void;
}
export default function H5pList(props: H5pListProps) {
  const {
    contentTypeList,
    onChange,
    expand,
    onExpand,
    setShow,
    setH5pId,
    libraryId,
    assetLibraryId,
    onChangeAssetLibraryId,
    setMockData,
  } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const [open, setOpen] = React.useState<boolean>(false);
  const [tempItem, setTempItem] = React.useState<string | ContentFileType>();

  const handleClick = (item: ContentTypeList[0] | MockData) => {
    if (!item.updatedAt) {
      handleClickAsset(item);
      return;
    }

    if (libraryId || assetLibraryId) {
      setTempItem(h5plibId2Name(`${item.id}-${item.version.major}.${item.version.minor}`));
      setOpen(true);
      return;
    }

    onChange(h5plibId2Name(`${item.id}-${item.version.major}.${item.version.minor}`));
    onExpand(!expand);
  };

  const handleClickAsset = (item: ContentTypeList[0] | MockData) => {
    if (libraryId || assetLibraryId) {
      setTempItem(item.id);
      setOpen(true);
      return;
    }

    setTempItem(item.id);
    onChangeAssetLibraryId && onChangeAssetLibraryId(item.id as ContentFileType);
    onExpand(!expand);
  };

  const getDetails = (e: React.KeyboardEvent | React.MouseEvent, item: ContentTypeList[0] | MockData) => {
    e.stopPropagation();

    if (typeof item.id === "number") {
      getMockDetails(item);
      return;
    }

    setShow("info");
    setH5pId(item.id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    if (!tempItem) return;

    if (typeof tempItem === "string") {
      onChange(tempItem);
    } else {
      onChangeAssetLibraryId && onChangeAssetLibraryId(tempItem);
    }

    onExpand(!expand);
  };

  const getMockDetails = (item: ContentTypeList[0] | MockData) => {
    setH5pId("");
    setMockData(item);
    setShow("info");
  };

  return (
    <div className={css.listContainer}>
      <List component="nav" aria-label="secondary mailbox folders">
        {contentTypeList &&
          contentTypeList
            .filter(
              (item) =>
                item.id === "H5P.Flashcards" ||
                item.id === "H5P.ImageSequencing" ||
                item.id === "H5P.MemoryGame" ||
                item.id === "H5P.ImagePair" ||
                item.id === ContentFileType.image ||
                item.id === ContentFileType.video ||
                item.id === ContentFileType.audio || // item.id === ContentFileType.pdf ||
                item.id === ContentFileType.pdf
            )
            .map((item) => {
              return (
                <ListItem key={item.id} button className={css.listItem} onClick={() => handleClick(item)}>
                  <Box
                    className={css.imgBox}
                    style={{
                      height: sm ? "50px" : "70px",
                    }}
                  >
                    <img src={item.icon} alt="aaa" />
                  </Box>
                  <Box
                    style={{
                      width: sm ? "40%" : "80%",
                    }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </Box>
                  <Box
                    className={css.itemButton}
                    style={{
                      right: sm ? "20px" : "50px",
                    }}
                  >
                    <Button variant="contained" color="primary" onClick={(e) => getDetails(e, item)}>
                      {d("Detail").t("h5p_label_detail")}
                    </Button>
                  </Box>
                </ListItem>
              );
            })}
        {contentTypeList &&
          contentTypeList
            .filter(
              (item) =>
                item.id !== "H5P.Flashcards" &&
                item.id !== "H5P.ImageSequencing" &&
                item.id !== "H5P.MemoryGame" &&
                item.id !== "H5P.ImagePair" &&
                item.id !== ContentFileType.image &&
                item.id !== ContentFileType.video &&
                item.id !== ContentFileType.audio
            )
            .map((item) => {
              return (
                <ListItem key={item.id} className={clsx(css.listItem, css.disableBackground)}>
                  <Box
                    className={css.imgBox}
                    style={{
                      height: sm ? "50px" : "70px",
                    }}
                  >
                    <img src={item.icon} alt="aaa" />
                  </Box>
                  <Box
                    style={{
                      width: sm ? "40%" : "80%",
                    }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </Box>
                  <Box
                    className={css.itemButton}
                    style={{
                      right: sm ? "20px" : "50px",
                    }}
                  >
                    <Button variant="contained" color="primary" onClick={(e) => getDetails(e, item)}>
                      {d("Detail").t("h5p_label_detail")}
                    </Button>
                  </Box>
                </ListItem>
              );
            })}
      </List>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{d("Change Content Type?").t("h5p_label_change_content_type")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {d("By doing this you will lose all work done with the current content type. Are you sure you wish to change content type?").t(
              "h5p_label_dialog_content"
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {d("Cancel").t("h5p_label_cancel")}
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary" startIcon={<Check />}>
            {d("Confirm").t("h5p_label_confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
