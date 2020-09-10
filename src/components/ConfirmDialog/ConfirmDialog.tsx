import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { actExitConfirm, ConfirmDialogType } from "../../reducers/confirm";

const INPUT_NAME = "CONFIRM_INPUT";

export function ConfirmDialog() {
  const { open, title, content, type, label, confirmText, cancelText } = useSelector<RootState, RootState["confirm"]>(
    (state) => state.confirm
  );
  const dispatch = useDispatch();
  const { control, getValues } = useForm();
  const handleCancel = useCallback(() => dispatch(actExitConfirm({ isConfirmed: false })), [dispatch]);
  const handleConfirm = useCallback(() => {
    if (type === ConfirmDialogType.text) dispatch(actExitConfirm({ isConfirmed: true }));
    if (type === ConfirmDialogType.textField) dispatch(actExitConfirm({ isConfirmed: true, value: getValues()[INPUT_NAME] }));
  }, [dispatch, getValues, type]);
  return (
    <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" disableBackdropClick>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        {type === ConfirmDialogType.textField && (
          <Controller
            name={INPUT_NAME}
            as={TextField}
            variant="standard"
            defaultValue={""}
            autoFocus={true}
            fullWidth
            label={label}
            rules={{ required: true }}
            control={control}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary" autoFocus>
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} color="primary">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
