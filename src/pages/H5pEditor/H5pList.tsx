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
import { useHistory } from "react-router-dom";
import { ContentTypeList } from "../../api/type";
import { reportMiss } from "../../locale/LocaleManager";
import { H5PSchema } from "../../models/ModelH5pSchema";

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
  },
}));

interface H5pListProps {
  contentTypeList: ContentTypeList;
  onChange: (value: string) => any;
  setContentType: (value: string) => any;
  schema: H5PSchema;
}

export default function H5pList(props: H5pListProps) {
  const { contentTypeList, onChange, setContentType, schema } = props;
  const css = useStyles();
  const history = useHistory();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const [open, setOpen] = React.useState<boolean>(false);
  const [tempItem, setTempItem] = React.useState<any>({});

  const handleClick = (item: any) => {
    // console.log(item);
    if (schema) {
      setTempItem(item);
      setOpen(true);
      return;
    }
    setContentType(item.title);
    onChange(`${item.id}-${item.version.major}.${item.version.minor}`);
    history.push("/h5peditor/show/details");
  };

  const getDetails = (e: React.KeyboardEvent | React.MouseEvent, id: string) => {
    e.stopPropagation();
    history.push(`/h5pEditor/show/info?h5p_id=${id}`);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    setContentType(tempItem.title);
    onChange(`${tempItem.id}-${tempItem.version.major}.${tempItem.version.minor}`);
    history.push("/h5peditor/show/details");
  };

  return (
    <div>
      <List component="nav" aria-label="secondary mailbox folders">
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
        <DialogTitle id="alert-dialog-title">{"Change content type?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            By doing this you will lose all work done with the current content type. Are you sure you wish to change content type?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            cancelLabel
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary" startIcon={<Check />}>
            confirmLabel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
