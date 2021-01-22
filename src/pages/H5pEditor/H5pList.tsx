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
import React from "react";
import { ContentTypeList } from "../../api/type";
import { reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles(() => ({
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
}));

interface H5pListProps {
  libraryId?: string;
  contentTypeList: ContentTypeList;
  onChange: (value: string) => any;
  expand: boolean;
  onExpand: (value: boolean) => any;
  setShow: (value: string) => any;
  setH5pId: (value: string) => void;
}

export default function H5pList(props: H5pListProps) {
  const { contentTypeList, onChange, expand, onExpand, setShow, setH5pId, libraryId } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const [open, setOpen] = React.useState<boolean>(false);
  const [tempItem, setTempItem] = React.useState<any>({});

  const handleClick = (item: any) => {
    if (libraryId) {
      setTempItem(item);
      setOpen(true);
      return;
    }
    onChange(`${item.id}-${item.version.major}.${item.version.minor}`);
    onExpand(!expand);
  };

  const getDetails = (e: React.KeyboardEvent | React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShow("info");
    setH5pId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    onChange(`${tempItem.id}-${tempItem.version.major}.${tempItem.version.minor}`);
    onExpand(!expand);
  };

  const mockData = [
    {
      title: "Image",
      icon: "https://h5p.org/sites/default/files/icon_7.svg",
      summary: "this is image uploader",
    },
    {
      title: "Audio",
      icon: "https://h5p.org/sites/default/files/icon_7.svg",
      summary: "this is audio uploader",
    },
    {
      title: "Video",
      icon: "https://h5p.org/sites/default/files/icon_7.svg",
      summary: "this is video uploader",
    },
    {
      title: "Document",
      icon: "https://h5p.org/sites/default/files/icon_7.svg",
      summary: "this is document uploader",
    },
  ];

  const getMockDetails = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.stopPropagation();
    setShow("info");
    setH5pId("");
  };

  return (
    <div className={css.listContainer}>
      <List component="nav" aria-label="secondary mailbox folders">
        {mockData.map((item) => {
          return (
            <ListItem key={item.title} button className={css.listItem}>
              <Box className={css.imgBox} style={{ height: sm ? "50px" : "70px" }}>
                <img src={item.icon} alt="aaa" />
              </Box>
              <Box style={{ width: sm ? "40%" : "80%" }}>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </Box>
              <Box className={css.itemButton} style={{ right: sm ? "20px" : "50px" }}>
                <Button variant="contained" color="primary" onClick={getMockDetails}>
                  {reportMiss("Detail", "h5p_detail")}
                </Button>
              </Box>
            </ListItem>
          );
        })}
        {contentTypeList &&
          contentTypeList.map((item) => {
            return (
              <ListItem key={item.id} button className={css.listItem} onClick={() => handleClick(item)}>
                <Box className={css.imgBox} style={{ height: sm ? "50px" : "70px" }}>
                  <img src={item.icon} alt="aaa" />
                </Box>
                <Box style={{ width: sm ? "40%" : "80%" }}>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </Box>
                <Box className={css.itemButton} style={{ right: sm ? "20px" : "50px" }}>
                  <Button variant="contained" color="primary" onClick={(e) => getDetails(e, item.id)}>
                    {reportMiss("Detail", "h5p_detail")}
                  </Button>
                </Box>
              </ListItem>
            );
          })}
      </List>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{reportMiss("Change content type?", "h5p_change_content_type")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {reportMiss(
              "By doing this you will lose all work done with the current content type. Are you sure you wish to change content type?",
              "h5p_dialog_content"
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {reportMiss("cancelLabel", "h5p_cancel")}
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary" startIcon={<Check />}>
            {reportMiss("confirmLabel", "h5p_confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
