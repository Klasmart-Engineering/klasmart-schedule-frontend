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
import React, { Fragment, useCallback, useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { GetAssessmentResult } from "../../api/type";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { ModelAssessment } from "../../models/ModelAssessment";
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
    // overflow: "none",
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
  assessmentDetail: GetAssessmentResult;
  formMethods: UseFormMethods<AssessmentState["assessmentDetail"]>;
}
export const AttendanceInput = (props: AttendenceInputProps) => {
  const {
    assessmentDetail,
    formMethods: { control },
  } = props;
  const { attendance_ids: defaultValue } = useMemo(() => ModelAssessment.toRequest(assessmentDetail), [assessmentDetail]);
  return (
    <Box>
      <Controller
        name="attendance_ids"
        control={control}
        defaultValue={defaultValue}
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
interface SummaryProps {
  formMethods: UseFormMethods<AssessmentState["assessmentDetail"]>;
  assessmentDetail: AssessmentState["assessmentDetail"];
  selectedAttendence: AssessmentState["assessmentDetail"]["attendances"];
  onOk: Function;
}
export function Summary(props: SummaryProps) {
  const { assessmentDetail, onOk, formMethods, selectedAttendence } = props;
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
  const attendanceString = useMemo(() => selectedAttendence?.map((item) => item.name).join(", "), [selectedAttendence]);
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
          <Box className={css.editBox}>
            <TextField fullWidth disabled value={attendanceString || ""} className={clsx(css.fieldset, css.nowarp)} label="Attendence" />
            <Button className={css.editButton} color="primary" variant="contained" onClick={handleOpen}>
              Edit
            </Button>
          </Box>
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
            value={assessmentDetail?.teacher?.name || ""}
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
      <Dialog open={true} onClose={handleCancel} style={{ display: open ? "block" : "none" }}>
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent dividers>
          <AttendanceInput assessmentDetail={assessmentDetail} formMethods={formMethods}></AttendanceInput>
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
