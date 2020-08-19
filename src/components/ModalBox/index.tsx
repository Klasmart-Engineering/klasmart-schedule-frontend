import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles } from "@material-ui/core";
import { EditOutlined, DeleteOutlined } from "@material-ui/icons";

const useStyles = makeStyles({
  dialogContainer: {
    "& .MuiPaper-root": {
      width: "25%",
      padding: "30px 0 20px 40px",
      position: "relative",
    },
  },
  lastButton: {
    margin: "0 20px !important",
  },
  bottomPart: {
    marginTop: "30px",
  },
  scheduleTime: {
    color: "#000",
    marginTop: "20px",
  },
  iconPart: {
    position: "absolute",
    top: "15px",
    right: "25px",
  },
  firstIcon: {
    color: "#0e78d5",
    cursor: "pointer",
  },
  lastIcon: {
    color: "red",
    marginLeft: "25px",
    cursor: "pointer",
  },
});

// 删除课程（事件）
function DeleteEvent(props: AlertDialogProps) {
  const classes = useStyles();
  const { openStatus, handleClose } = props;
  return (
    <>
      <Dialog
        open={openStatus}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialogContainer}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this event?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("cancel")} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleClose("deleteEvent")} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// 丢弃已修改内容
function DiscardChange(props: AlertDialogProps) {
  const classes = useStyles();
  const { openStatus, handleClose } = props;
  return (
    <>
      <Dialog
        open={openStatus}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialogContainer}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Discard unsave changes?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("cancel")} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleClose("discardChanges")} color="primary" autoFocus>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// 确认重复排课
function EditRecurring(props: AlertDialogProps) {
  const classes = useStyles();
  const { openStatus, handleClose } = props;
  const [value, setValue] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+(event.target as HTMLInputElement).value);
  };
  return (
    <>
      <Dialog
        open={openStatus}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialogContainer}
      >
        <DialogTitle id="alert-dialog-title">{"Edit recurring event"}</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
              <FormControlLabel value={1} control={<Radio />} label="This event" />
              <FormControlLabel value={2} control={<Radio />} label="This and following events" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("cancel")} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleClose("discardChanges")} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// 预览详情
function ClickSchedule(props: AlertDialogProps) {
  const classes = useStyles();
  const { openStatus, handleClose, handleClickOpen } = props;

  const handleDeleteClick = () => {
    handleClickOpen("deleteEvent");
  };

  return (
    <>
      <Dialog
        open={openStatus}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialogContainer}
      >
        <DialogTitle id="alert-dialog-title">{"Upgrade Server Hardware"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Thursday, Aug 13, 2020</DialogContentText>
          <DialogContentText id="alert-dialog-description" className={classes.scheduleTime}>
            12:00PM - 13:00PM
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.bottomPart}>
          <Button onClick={() => handleClose("cancel")} color="primary" variant="contained">
            Preview in Live
          </Button>
          <Button
            onClick={() => handleClose("discardChanges")}
            color="primary"
            variant="contained"
            autoFocus
            className={classes.lastButton}
          >
            Go Live
          </Button>
        </DialogActions>
        <div className={classes.iconPart}>
          <EditOutlined className={classes.firstIcon} />
          <DeleteOutlined className={classes.lastIcon} onClick={handleDeleteClick} />
        </div>
      </Dialog>
    </>
  );
}

interface AlertDialogProps {
  openStatus: boolean;
  handleClose: (type: string) => any;
  modalType: string;
  handleClickOpen: (text: string) => any;
}
export default function AlertDialog(props: AlertDialogProps) {
  const { openStatus, handleClose, modalType, handleClickOpen } = props;
  console.log(modalType);
  return (
    <div>
      {modalType === "deleteEvent" && (
        <DeleteEvent openStatus={openStatus} handleClose={handleClose} modalType={modalType} handleClickOpen={handleClickOpen} />
      )}
      {modalType === "dsicardChanges" && (
        <DiscardChange openStatus={openStatus} handleClose={handleClose} modalType={modalType} handleClickOpen={handleClickOpen} />
      )}
      {modalType === "editRecurring" && (
        <EditRecurring openStatus={openStatus} handleClose={handleClose} modalType={modalType} handleClickOpen={handleClickOpen} />
      )}
      {modalType === "clickSchedule" && (
        <ClickSchedule openStatus={openStatus} handleClose={handleClose} modalType={modalType} handleClickOpen={handleClickOpen} />
      )}
    </div>
  );
}
