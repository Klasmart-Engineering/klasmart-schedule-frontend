import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@material-ui/core";
import React, { Fragment, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { d } from "../../locale/LocaleManager";
import { RootState } from "../../reducers";
import { actExitConfirm, ConfirmDialogType } from "../../reducers/confirm";
import { CheckboxGroup } from "../CheckboxGroup";

const INPUT_NAME = "CONFIRM_INPUT";
const REJECT_REASON = "REJECT_REASON";
const OTHER_REASON = "OTHER_REASON";
// 这些是翻译的 label
const REJECT_REASON_VALUES = () => [
  { label: d("Inappropriate Content").t("library_label_inappropriate_content"), value: "library_label_inappropriate_content" },
  { label: d("Quality of Lesson is Poor").t("library_label_quality_of_lesson"), value: "library_label_quality_of_lesson" },
  {
    label: d("No Permissions to Use Assets").t("library_label_no_permissions_use_assets"),
    value: "library_label_no_permissions_use_assets",
  },
  {
    label: d("Add/Remove Learning Outcomes").t("library_label_add_remove_learning_outcomes"),
    value: "library_label_add_remove_learning_outcomes",
  },
  // "library_label_inappropriate_content",
  // "library_label_quality_of_lesson",
  // "library_label_no_permissions_use_assets",
  // "library_label_add_remove_learning_outcomes",
];

export function ConfirmDialog() {
  const { open, title, content, type, label, confirmText, cancelText } = useSelector<RootState, RootState["confirm"]>(
    (state) => state.confirm
  );
  const dispatch = useDispatch();
  const { control, getValues, setError, errors, watch } = useForm();
  const values = watch();
  const disableConfirm =
    type === ConfirmDialogType.textField && !values[REJECT_REASON]?.length && !values[OTHER_REASON] && !values[INPUT_NAME];
  const handleCancel = useCallback(() => dispatch(actExitConfirm({ isConfirmed: false })), [dispatch]);
  const handleConfirm = useCallback(() => {
    if (type === ConfirmDialogType.text) return dispatch(actExitConfirm({ isConfirmed: true }));
    const values = getValues();
    if (values[OTHER_REASON] && !values[INPUT_NAME]) {
      return setError(INPUT_NAME, {
        type: "manual",
        message: d("Please specify the reason for rejection.").t("library_msg_reject_reason"),
      });
    }
    const reasonValue = [...values[REJECT_REASON]];
    const otherValue = values[INPUT_NAME] ? values[INPUT_NAME] : "";
    // const value = values[INPUT_NAME] ? [...values[REJECT_REASON], values[INPUT_NAME]] : values[REJECT_REASON];
    if (type === ConfirmDialogType.textField) dispatch(actExitConfirm({ isConfirmed: true, reasonValue, otherValue }));
  }, [dispatch, getValues, type, setError]);
  return (
    <Dialog open={open} maxWidth="xs" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" disableBackdropClick>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        {type === ConfirmDialogType.textField && (
          <>
            <Controller
              name={REJECT_REASON}
              control={control}
              defaultValue={[]}
              rules={{ required: true }}
              error={"Please Select"}
              render={(props) => (
                <CheckboxGroup
                  {...props}
                  render={(selectedContentGroupContext) => (
                    <Fragment>
                      {REJECT_REASON_VALUES().map((item) => (
                        <FormControlLabel
                          style={{ display: "block" }}
                          control={
                            <Checkbox
                              color="primary"
                              value={item.value}
                              checked={selectedContentGroupContext.hashValue[item.value] || false}
                              onChange={selectedContentGroupContext.registerChange}
                            />
                          }
                          label={item.label}
                          key={item.value}
                        />
                      ))}
                      <FormControlLabel
                        style={{ display: "block" }}
                        control={
                          <Controller
                            defaultValue={false}
                            name={OTHER_REASON}
                            control={control}
                            render={(props) => (
                              <Checkbox checked={props.value} onChange={(e) => props.onChange(e.target.checked)} color="primary" />
                            )}
                          />
                        }
                        label={d("Other").t("library_label_other")}
                      />
                    </Fragment>
                  )}
                />
              )}
            />
            <Controller
              name={INPUT_NAME}
              as={TextField}
              variant="standard"
              defaultValue={""}
              autoFocus={true}
              fullWidth
              label={label}
              placeholder={d("Reason").t("library_label_reason")}
              rules={{ required: true }}
              control={control}
              error={!!errors[INPUT_NAME]}
              helperText={errors[INPUT_NAME]?.message}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary" autoFocus>
          {cancelText || d("Cancel").t("library_label_cancel")}
        </Button>
        <Button onClick={handleConfirm} color="primary" disabled={disableConfirm}>
          {confirmText || d("OK").t("library_label_ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
