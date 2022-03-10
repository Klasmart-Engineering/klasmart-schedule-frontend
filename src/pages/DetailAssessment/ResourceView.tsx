import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { d } from "../../locale/LocaleManager";
const useStyles = makeStyles((theme) =>
  createStyles({
    closeBtn: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    title: {
      borderBottom: "1px solid #eeeeee",
    },
    detailView: {
      padding: "12px",
      lineHeight: "30px",
      maxHeight: "400px",
      minWidth: "400px",
      overflow: "auto",
      textAlign: "center",
      "&::-webkit-scrollbar": {
        width: "3px",
      },
      "&::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: "3px",
        backgroundColor: "rgb(220, 220, 220)",
        boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)",
      },
      "&::-webkit-scrollbar-thumb:window-inactive": {
        backgroundColor: "rgba(220,220,220,0.4)",
      },
    },
    okBtn: {
      marginLeft: "40px !important",
    },
  })
);

export interface ResourceViewProps {
  open: boolean;
  resourceType: string;
  onClose: () => void;
  answer?: string;
  comment?: string;
  onChangeComment?: (studentId?: string, comment?: string) => void;
  studentId?: string;
}
export function ResourceView(props: ResourceViewProps) {
  const css = useStyles();
  const { resourceType, open, answer, comment, studentId, onChangeComment, onClose } = props;
  const formMethods = useForm();
  const { control, getValues } = formMethods;
  const handleOk = () => {
    const comment = getValues()["comment"];
    onChangeComment && onChangeComment(studentId, comment);
    onClose();
  };
  return (
    <>
      <Dialog open={open}>
        <DialogTitle className={css.title}>
          {(resourceType === "Essay" || resourceType === "AudioRecorder") && d("Detailed Answer").t("assess_popup_detailed_answer")}
          {resourceType === "ViewComment" && d("View Comments").t("assess_popup_view_comments")}
          {resourceType === "EditComment" && d("Add Comments").t("assess_popup_add_comments")}
          <IconButton onClick={onClose} className={css.closeBtn}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {resourceType === "Essay" && <div className={css.detailView}>{answer}</div>}
          {resourceType === "ViewComment" && <div className={css.detailView}>{comment}</div>}
          {resourceType === "AudioRecorder" && <div className={css.detailView}></div>}
          {resourceType === "EditComment" && (
            <div className={css.detailView}>
              <Controller
                style={{ width: "100%" }}
                name={"comment"}
                as={TextField}
                control={control}
                defaultValue={comment}
                multiline
                minRows={8}
                maxRows={8}
                variant="outlined"
                placeholder={d("Leave a message to your student!").t("assess_popup_leave_msg")}
                inputProps={{ maxLength: 500 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BorderColorIcon style={{ fontSize: "15px", position: "absolute", top: "20px", left: "5px" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          )}
        </DialogContent>
        {resourceType === "EditComment" && (
          <DialogActions>
            <Button autoFocus onClick={onClose} color="primary" variant="outlined">
              {d("CANCEL").t("general_button_CANCEL")}
            </Button>
            <Button onClick={handleOk} color="primary" variant="contained" className={css.okBtn}>
              {d("OK").t("general_button_OK")}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}

export function useResourceView() {
  const [active, setActive] = useState(false);
  return useMemo(
    () => ({
      resourceViewActive: active,
      openResourceView: () => {
        setActive(true);
      },
      closeResourceView: () => setActive(false),
    }),
    [active]
  );
}
