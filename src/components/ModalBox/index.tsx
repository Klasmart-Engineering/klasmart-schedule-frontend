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
import { makeStyles } from "@material-ui/core";
import { EditOutlined, DeleteOutlined } from "@material-ui/icons";
import PreviewSchedule from "../../pages/Schedule/PreviewSchedule";
const useStyles = makeStyles({
  dialogContainer: {
    "& .MuiPaper-root": {
      width: "25%",
      padding: "30px 0 20px 40px",
      position: "relative",
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
});

interface AlertDialogProps {
  title?: string;
  text?: string;
  radios?: Array<any>;
  buttons: Array<any>;
  openStatus: boolean;
  handleClose: (text: string) => any;
  handleChange: (value: number) => any;
  radioValue?: number;
  template?: any;
}

interface dateProps {
  modalDate: AlertDialogProps;
}

export default function AlertDialog(props: dateProps) {
  const classes = useStyles();
  const { openStatus, handleClose, template, handleChange, radioValue, title, text, radios, buttons } = props.modalDate;
  console.log(template);
  return (
    <div>
      <Dialog
        open={openStatus}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialogContainer}
      >
        {!template ? (
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
          <DialogContent className={classes.content}>
            <PreviewSchedule />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
