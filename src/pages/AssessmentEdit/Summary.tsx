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
        render={(props) => {
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
    return attendances?.map((item) => item.name).join(", ");
  }, [assessmentDetail, value]);
  const handleOk = useCallback(() => {
    const { attendance_ids } = formMethods.getValues();
    if (!attendance_ids?.length) return Promise.reject(dispatch(actWarning("You must choose at least one student.")));
    toggle();
    if (onChange) return onChange(attendance_ids || []);
  }, [dispatch, formMethods, onChange]);
  return (
    <Box className={css.editBox}>
      <TextField fullWidth disabled value={attendanceString || ""} className={clsx(css.fieldset, css.nowarp)} label="Attendance" />
      <Button
        className={css.editButton}
        color="primary"
        variant="contained"
        onClick={toggle}
        disabled={assessmentDetail.status === "complete"}
      >
        Edit
      </Button>
      <Dialog open={open} onClose={toggle}>
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent dividers>
          <AttendanceInput assessmentDetail={assessmentDetail} formMethods={formMethods} defaultValue={value}></AttendanceInput>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggle} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            Ok
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
    formMethods: { control },
  } = props;
  const { breakpoints } = useTheme();
  const css = useStyles();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const { attendance_ids: default_attendance_ids } = useMemo(() => ModelAssessment.toRequest(assessmentDetail), [assessmentDetail]);
  return (
    <>
      <Paper elevation={sm ? 0 : 3}>
        <Box className={css.classSummaryHeader} boxShadow={3}>
          <Typography variant="h6">Class Summary</Typography>
        </Box>
        <Box px={5} py={5}>
          <TextField
            fullWidth
            disabled
            name="title"
            value={assessmentDetail.title || ""}
            className={css.fieldset}
            label="Assessment Title"
          />
          <Controller
            as={PopupInput}
            name="attendance_ids"
            defaultValue={default_attendance_ids}
            assessmentDetail={assessmentDetail}
            control={control}
          />
          <TextField
            fullWidth
            disabled
            name="subject.name"
            value={assessmentDetail.subject?.name || ""}
            className={css.fieldset}
            label="Subject"
          />
          <TextField
            fullWidth
            disabled
            name="teacher.name"
            value={assessmentDetail.teachers?.map((v) => v.name)}
            className={css.fieldset}
            label="Teacher"
          />
          <TextField
            fullWidth
            disabled
            name="classEndTime"
            value={formattedTime(assessmentDetail.class_end_time)}
            className={css.fieldset}
            label="Class End Time"
          />
          <Box className={css.editBox}>
            <TextField
              fullWidth
              disabled
              name="classLength"
              value={assessmentDetail.class_length || ""}
              className={css.fieldset}
              label="Class Length"
            />
            <Typography className={css.minutes}>Minutes</Typography>
          </Box>
          <TextField
            fullWidth
            disabled
            name="numberofActivities"
            value={assessmentDetail.number_of_activities || ""}
            className={css.fieldset}
            label="Number of Activities"
          />
          <TextField
            fullWidth
            disabled
            name="numberofLearningOutcomes"
            value={assessmentDetail.number_of_outcomes || ""}
            className={css.fieldset}
            label="Number of Learning Outcomes"
          />
          <TextField
            fullWidth
            disabled
            name="completeTime"
            value={formattedTime(assessmentDetail.complete_time) || ""}
            className={css.fieldset}
            label="Assessment Complete Time"
          />
        </Box>
      </Paper>
    </>
  );
}
