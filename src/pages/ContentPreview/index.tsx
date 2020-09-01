// import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Content } from "../../api/api";
import { Thumbnail } from "../../components/Thumbnail";
import { RootState } from "../../reducers";
import {
  approveContent,
  AsyncTrunkReturned,
  deleteContent,
  getContentDetailById,
  lockContent,
  publishContent,
  rejectContent,
} from "../../reducers/content";
import { Detail } from "./Detail";
const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: "100%",
    display: "flex",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  left: {
    width: "434px",
    height: "100%",
    padding: "12px",
    boxSizing: "border-box",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  closeIconCon: {
    textAlign: "right",
  },
  text: {
    fontSize: "24px",
    fontWeight: 700,
    marginRight: "10px",
    [theme.breakpoints.down("lg")]: {
      fontSize: "20px",
    },
  },
  nameCon: {
    display: "flex",
    alignItems: "center",
  },
  img: {
    margin: "10px 0 20px 0",
    minHeight: "196px",
  },
  tab: {
    width: "calc(100% + 24px)",
    backgroundColor: "#f0f0f0",
    marginLeft: "-12px",
    fontSize: "18px",
  },
  textFiled: {
    height: "112px",
    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  right: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));
interface DialogProps {
  open: boolean;
  title: string;
  showReason: boolean;
  showError: boolean;
  handleCloseDialog: () => void;
  handleDialogEvent: () => void;
  onSetReason: (reason: string) => void;
}
export function ActionDialog(props: DialogProps) {
  const { open, title, showReason, showError, handleCloseDialog, handleDialogEvent, onSetReason } = props;
  const setReason = (event: any) => {
    console.log(event.target.value);
    onSetReason(event.target.value);
  };
  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      {showReason ? (
        <DialogContent>
          <DialogContentText>Please specify the reason of rejection.</DialogContentText>
          <TextField variant="standard" autoFocus={true} fullWidth label="Reason" error={showError} onChange={setReason} />
        </DialogContent>
      ) : (
        ""
      )}
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary" autoFocus>
          CANCEL
        </Button>
        <Button onClick={handleDialogEvent} color="primary">
          CONFIRM
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ContentPreview(props: Content) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  let id = query.get("id") || "";
  const css = useStyles();
  const [value, setValue] = React.useState(0);
  const { contentPreview } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [titleDialog, setTitleDialog] = React.useState<string>("");
  const [actionType, setActionType] = React.useState<string>("");
  const [showReason, setShowReason] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [reason, setReason] = React.useState<string>();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleDispatch = useCallback(
    async (type: string) => {
      switch (type) {
        case "delete":
          setOpenDialog(false);
          await dispatch(deleteContent(id));
          break;
        case "approve":
          setOpenDialog(false);
          await dispatch(approveContent(id));
          break;
        case "reject":
          if (!reason) {
            setError(true);
            return;
          }
          setError(false);
          await dispatch(rejectContent({ id: id, reason: reason }));
          break;
        case "publish":
          await dispatch(publishContent(id));
          break;
      }
      history.go(-1);
    },
    [dispatch, history, id, reason]
  );
  const handleDialogEvent = () => {
    handleDispatch(actionType);
  };
  const handleAction = async (type: string) => {
    if (type === "edit") {
      const lesson = contentPreview.content_type_name === "Material" ? "material" : "plan";
      const rightSide = contentPreview.content_type_name === "Material" ? "contentH5p" : "planComposeGraphic";
      if (contentPreview.publish_status === "published") {
        const { payload } = ((await dispatch(lockContent(id))) as unknown) as PayloadAction<AsyncTrunkReturned<typeof lockContent>>;
        if (payload.id) {
          history.push(`/library/content-edit/lesson/${lesson}/tab/details/rightside/${rightSide}?id=${payload.id}`);
        }
      } else {
        history.push(`/library/content-edit/lesson/${lesson}/tab/details/rightside/${rightSide}?id=${id}`);
      }
    } else {
      setTitleDialog(`Are you sure you want to ${type} this content?`);
      if (type !== "reject") {
        setActionType(type);
        setOpenDialog(true);
      } else {
        setShowReason(true);
        setActionType(type);
        setOpenDialog(true);
      }
    }
  };
  const onSetReason = (reason: string) => {
    setReason(reason);
  };
  const handleClose = () => {
    history.go(-1);
  };
  useEffect(() => {
    dispatch(getContentDetailById(id));
  }, [dispatch, id]);
  return (
    <Box className={css.container}>
      <ActionDialog
        open={openDialog}
        title={titleDialog}
        showReason={showReason}
        showError={error}
        handleCloseDialog={handleCloseDialog}
        handleDialogEvent={handleDialogEvent}
        onSetReason={onSetReason}
      ></ActionDialog>
      <Box className={css.left}>
        <Box className={css.closeIconCon}>
          <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
        </Box>
        <Typography className={css.text}>Title</Typography>
        <Box className={css.nameCon}>
          <Typography className={css.text}>{contentPreview.name}</Typography>
          <Chip size="small" color="primary" label={contentPreview.content_type_name} />
        </Box>
        <Thumbnail className={css.img} type={contentPreview.content_type} id={contentPreview?.thumbnail} />
        <Tabs
          className={css.tab}
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Details" />
          <Tab label="Assessments" />
        </Tabs>
        <Detail contentPreview={contentPreview} handleAction={handleAction} />
      </Box>
      <Box className={css.right}>right</Box>
    </Box>
  );
}
ContentPreview.routeBasePath = "/library/content-preview";
