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
import React, { useCallback } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { AssessmentState } from "../../reducers/assessment";

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
    wrap: "nowrap",
    overflow: "none",
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

export interface AttendenceInputProps {
  attendances: AssessmentState["attendances"];
  formMethods: UseFormMethods<AssessmentState>;
  selectedAttendence: AssessmentState["attendances"];
}
export const AttendanceInput = (props: AttendenceInputProps) => {
  const {
    attendances,
    formMethods: { control, getValues },
    selectedAttendence,
  } = props;
  const handleCheck = (item: { id?: string; name?: string }) => {
    const { attendances } = getValues();
    const newattendences = attendances?.includes(item)
      ? attendances?.filter((attendances) => attendances !== item)
      : [...(attendances ?? []), item];
    return newattendences;
  };
  return (
    <Box>
      {attendances &&
        attendances.map((item) => (
          <FormControlLabel
            control={
              <Controller
                name="attendences"
                defaultValue={selectedAttendence}
                render={({ onChange: onCheckChange }) => {
                  return (
                    <Checkbox
                      defaultChecked={selectedAttendence && selectedAttendence.includes(item)}
                      onChange={() => onCheckChange(handleCheck(item))}
                      color="primary"
                    />
                  );
                }}
                control={control}
              />
            }
            key={item.id}
            label={item.name}
          />
        ))}
    </Box>
  );
};
interface SummaryProps {
  formMethods: UseFormMethods<AssessmentState>;
  assessmentDetail: AssessmentState;
  selectedAttendence: AssessmentState["attendances"];
  onOk: Function;
}
export function Summary(props: SummaryProps) {
  const {
    assessmentDetail: { attendances },
    assessmentDetail,
    onOk,
    formMethods,
    selectedAttendence,
  } = props;
  const {
    formMethods: { reset },
  } = props;
  const { breakpoints } = useTheme();
  const css = useStyles();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const [open, setOpen] = React.useState(false);
  const handleCancel = useCallback(() => {
    reset();
    setOpen(false);
  }, [reset]);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleOk = useCallback(() => {
    onOk();
    setOpen(false);
  }, [onOk]);

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
            defaultValue={assessmentDetail.title}
            className={css.fieldset}
            label="Assessment Title"
          />
          <Box className={css.editBox}>
            <TextField
              fullWidth
              disabled
              name="attendence"
              defaultValue={selectedAttendence && selectedAttendence.map((v) => v.name)}
              className={clsx(css.fieldset, css.nowarp)}
              label="Attendence"
            />
            <Button className={css.editButton} color="primary" variant="contained" onClick={handleOpen}>
              Edit
            </Button>
          </Box>
          <TextField
            fullWidth
            disabled
            name="subject"
            defaultValue={assessmentDetail.subject && assessmentDetail.subject.name}
            className={css.fieldset}
            label="Subject"
          />
          <TextField
            fullWidth
            disabled
            name="teacher"
            defaultValue={assessmentDetail.teacher && assessmentDetail.teacher.name}
            className={css.fieldset}
            label="Teacher"
          />
          <TextField
            fullWidth
            disabled
            name="classEndTime"
            defaultValue={formattedTime(assessmentDetail.class_end_time)}
            className={css.fieldset}
            label="Class End Time"
          />
          <Box className={css.editBox}>
            <TextField
              fullWidth
              disabled
              name="classLength"
              defaultValue={assessmentDetail.class_length}
              className={css.fieldset}
              label="Class Length"
            />
            <Typography className={css.minutes}>Minutes</Typography>
          </Box>
          <TextField
            fullWidth
            disabled
            name="numberofActivities"
            defaultValue={assessmentDetail.number_of_activities}
            className={css.fieldset}
            label="Number of Activities"
          />
          <TextField
            fullWidth
            disabled
            name="numberofLearningOutcomes"
            defaultValue={assessmentDetail.number_of_outcomes}
            className={css.fieldset}
            label="Number of Learning Outcomes"
          />
          <TextField
            fullWidth
            disabled
            name="completeTime"
            defaultValue={formattedTime(assessmentDetail.complete_time)}
            className={css.fieldset}
            label="Assessment Complete Time"
          />
        </Box>
      </Paper>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent dividers>
          <AttendanceInput attendances={attendances} formMethods={formMethods} selectedAttendence={selectedAttendence}></AttendanceInput>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
