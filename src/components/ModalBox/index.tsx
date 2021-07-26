import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    "& .MuiPaper-root": {
      padding: "30px 40px 20px 40px",
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        padding: "20px 0px 20px 10px",
      },
    },
  },
  dialogContainer1: {
    "& .MuiDialog-paperWidthSm": {
      maxWidth: "800px",
    },
  },
  header: {
    paddingTop: "40px",
  },
  center: {
    padding: "20px 30px 20px 30px !important",
  },
  content: {
    padding: "0 !important",
  },
}));

interface AlertDialogProps {
  title?: string;
  text?: string;
  radios?: Array<any>;
  buttons: Array<any>;
  openStatus: boolean;
  handleClose: (text: string) => any;
  handleChange: (value: number) => any;
  radioValue?: number;
  customizeTemplate?: any;
  enableCustomization?: boolean;
  showScheduleInfo?: boolean;
}

interface dateProps {
  modalDate: AlertDialogProps;
}

export default function AlertDialog(props: dateProps) {
  const classes = useStyles();
  const {
    openStatus,
    handleClose,
    customizeTemplate,
    handleChange,
    radioValue,
    title,
    text,
    radios,
    buttons,
    enableCustomization,
    showScheduleInfo,
  } = props.modalDate;
  return (
    <div>
      <Dialog
        open={openStatus}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={showScheduleInfo ? classes.dialogContainer1 : classes.dialogContainer}
      >
        {!enableCustomization ? (
          <>
            {title && (
              <DialogTitle className={classes.header} id="alert-dialog-title">
                {title}
              </DialogTitle>
            )}
            <DialogContent className={classes.center}>
              {radios ? (
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={radioValue}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => handleChange(event.target.value as number)}
                  >
                    {radios.map((item: any, index: number) => (
                      <FormControlLabel key={index} value={item.value} control={<Radio />} label={item.label} />
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : (
                <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
              )}
            </DialogContent>
            <DialogActions>
              {buttons.map((item: any, index: number) => (
                <Button key={index} onClick={() => item.event("cancel")} color="primary">
                  {item.label}
                </Button>
              ))}
            </DialogActions>
          </>
        ) : (
          <DialogContent className={classes.content}>{customizeTemplate}</DialogContent>
        )}
      </Dialog>
    </div>
  );
}
