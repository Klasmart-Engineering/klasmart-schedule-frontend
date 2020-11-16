import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import React, { Fragment, useCallback, useMemo, useReducer } from "react";
import { Controller, useForm, UseFormMethods } from "react-hook-form";
import { useDispatch } from "react-redux";
import { GetAssessmentResult, UpdateAssessmentRequestData, UpdateAssessmentRequestDatAattendanceIds } from "../../api/type";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { PermissionOr, PermissionType } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment, UpdateAssessmentRequestDataOmitAction } from "../../models/ModelAssessment";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { IAssessmentState } from "../../reducers/assessments";
import { actWarning } from "../../reducers/notify";
const useStyles = makeStyles(({ palette }) => ({
  classSummaryHeader: {
    height: 64,
    width: "100%",
    backgroundColor: palette.primary.main,
    color: palette.common.white,
    paddingLeft: 24,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
  },
  fieldset: {
    "&:not(:first-child)": {
      marginTop: 30,
    },
  },
  nowarp: {
    whiteSpace: "nowrap",
    overflow: "none",
    textOverflow: "ellipsis",
  },
  editBox: {
    width: "100%",
    marginTop: 30,
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 14,
  },
  minutes: {
    position: "absolute",
    top: 15,
    right: 16,
    color: "rgba(0,0,0,.38)",
  },
}));

export interface AttendanceInputProps {
  defaultValue: PopupInputProps["value"];
  assessmentDetail: GetAssessmentResult;
  formMethods: UseFormMethods<UpdateAssessmentRequestDataOmitAction>;
}
export const AttendanceInput = (props: AttendanceInputProps) => {
  const {
    defaultValue,
    assessmentDetail,
    formMethods: { control, errors },
  } = props;
  return (
    <Box>
      <Controller
        name="attendance_ids"
        control={control}
        defaultValue={defaultValue}
        rules={{ required: true }}
        error={errors.attendance_ids}
        render={(props: any) => {
          return (
            <CheckboxGroup
              {...props}
              render={(selectedContentGroupContext) => (
                <Fragment>
                  {assessmentDetail.attendances &&
                    assessmentDetail.attendances.map((item) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            value={item.id}
                            checked={selectedContentGroupContext.hashValue[item.id as string] || false}
                            onChange={selectedContentGroupContext.registerChange}
                          />
                        }
                        label={item.name}
                        key={item.id}
                      />
                    ))}
                </Fragment>
              )}
            />
          );
        }}
      />
    </Box>
  );
};
interface PopupInputProps {
  assessmentDetail: SummaryProps["assessmentDetail"];
  setValue: UseFormMethods["setValue"];

  value?: UpdateAssessmentRequestDatAattendanceIds;
  onChange?: (value: PopupInputProps["value"]) => any;
}
function PopupInput(props: PopupInputProps) {
  const { value, onChange, assessmentDetail } = props;
  const css = useStyles();
  const dispatch = useDispatch();
  const formMethods = useForm<UpdateAssessmentRequestData>();
  const [open, toggle] = useReducer((open) => {
    formMethods.reset();
    return !open;
  }, false);
  const attendanceString = useMemo(() => {
    const { attendances } = ModelAssessment.toDetail(assessmentDetail, { attendance_ids: value });
    return attendances && attendances[0] ? attendances?.map((item) => item.name).join(", ") : "";
  }, [assessmentDetail, value]);
  const handleOk = useCallback(() => {
    const { attendance_ids } = formMethods.getValues();
    if (!attendance_ids?.length)
      return Promise.reject(dispatch(actWarning(d("You must choose at least one student.").t("assess_msg_ one_student"))));
    toggle();
    // assessmentDetail?.outcome_attendance_maps?.map((item, index)=>{
    //   setValue(`${item}[${index}].attendance_ids`, attendance_ids||[])
    // })
    if (onChange) return onChange(attendance_ids || []);
  }, [dispatch, formMethods, onChange]);
  return (
    <Box className={css.editBox}>
      <TextField
        fullWidth
        disabled
        value={attendanceString || ""}
        className={clsx(css.fieldset, css.nowarp)}
        label={d("Attendance").t("assess_detail_attendance")}
      />
      <PermissionOr
        value={[PermissionType.edit_in_progress_assessment_439, PermissionType.edit_attendance_for_in_progress_assessment_438]}
        render={(value) =>
          value && (
            <Button
              className={css.editButton}
              color="primary"
              variant="contained"
              onClick={toggle}
              disabled={assessmentDetail.status === "complete"}
            >
              {d("Edit").t("assess_button_edit")}
            </Button>
          )
        }
      />
      <Dialog open={open} onClose={toggle}>
        <DialogTitle>{d("Edit Attendance").t("assess_popup_edit_attendance")}</DialogTitle>
        <DialogContent dividers>
          <AttendanceInput assessmentDetail={assessmentDetail} formMethods={formMethods} defaultValue={value}></AttendanceInput>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggle} color="primary">
            {d("Cancel").t("assess_label_cancel")}
          </Button>
          <Button onClick={handleOk} color="primary">
            {d("OK").t("assess_label_ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

interface SummaryProps {
  formMethods: UseFormMethods<UpdateAssessmentRequestDataOmitAction>;
  assessmentDetail: IAssessmentState["assessmentDetail"];
}
export function Summary(props: SummaryProps) {
  const { assessmentDetail } = props;
  const {
    formMethods: { control, setValue },
  } = props;
  const { breakpoints } = useTheme();
  const css = useStyles();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const { attendance_ids } = useMemo(() => ModelAssessment.toRequest(assessmentDetail), [assessmentDetail]);
  return (
    <>
      <Paper elevation={sm ? 0 : 3}>
        <Box className={css.classSummaryHeader} boxShadow={3}>
          <Typography variant="h6">{d("Class Summary").t("assess_class_summary")}</Typography>
        </Box>
        <Box px={5} py={5}>
          <TextField
            fullWidth
            disabled
            name="title"
            value={assessmentDetail.title || ""}
            className={css.fieldset}
            label={d("Assessment Title").t("assess_column_title")}
          />
          <Controller
            as={PopupInput}
            name="attendance_ids"
            defaultValue={attendance_ids}
            assessmentDetail={assessmentDetail}
            setValue={setValue}
            control={control}
          />
          <TextField
            fullWidth
            disabled
            name="subject.name"
            value={assessmentDetail.subject?.name || ""}
            className={css.fieldset}
            label={d("Subject").t("library_label_subject")}
          />
          <TextField
            fullWidth
            disabled
            name="teacher.name"
            value={assessmentDetail.teachers?.map((v) => v.name)}
            className={css.fieldset}
            label={d("Teacher").t("assess_column_teacher")}
          />
          <TextField
            fullWidth
            disabled
            name="classEndTime"
            value={formattedTime(assessmentDetail.class_end_time)}
            className={css.fieldset}
            label={d("Class End Time").t("assess_column_class_end_time")}
          />
          <Box className={css.editBox}>
            <TextField
              fullWidth
              disabled
              name="classLength"
              value={assessmentDetail.class_length || ""}
              className={css.fieldset}
              label={d("Class Length").t("assess_detail_class_length")}
            />
            <Typography className={css.minutes}>{d("Minutes").t("assess_detail_minutes")}</Typography>
          </Box>
          <TextField
            fullWidth
            disabled
            name="numberofActivities"
            value={assessmentDetail.number_of_activities || ""}
            className={css.fieldset}
            label={d("Number of Activities").t("assess_detail_number_activity")}
          />
          <TextField
            fullWidth
            disabled
            name="numberofLearningOutcomes"
            value={assessmentDetail.number_of_outcomes || ""}
            className={css.fieldset}
            label={d("Number of Learning Outcomes").t("assess_detail_number_lo")}
          />
          <TextField
            fullWidth
            disabled
            name="completeTime"
            value={formattedTime(assessmentDetail.complete_time) || ""}
            className={css.fieldset}
            label={d("Assessment Complete Time").t("assess_detail_assessment_complete_time")}
          />
        </Box>
      </Paper>
    </>
  );
}
