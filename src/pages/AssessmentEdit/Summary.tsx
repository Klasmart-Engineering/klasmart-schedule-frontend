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
import React, { Fragment, useCallback } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { CheckboxGroup } from "../../components/CheckboxGroup";
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
  attendances: AssessmentState["assessmentDetail"]["attendances"];
  formMethods: UseFormMethods<AssessmentState["assessmentDetail"]>;
  selectedAttendence: AssessmentState["assessmentDetail"]["attendances"];
}
export const AttendanceInput = (props: AttendenceInputProps) => {
  const {
    attendances,
    formMethods: { control },
  } = props;
  // const handleCheck = (item: { id?: string; name?: string }) => {
  //   const { attendances } = getValues();
  //   const newattendences = attendances?.includes(item)
  //     ? attendances?.filter((attendances) => attendances !== item)
  //     : [...(attendances ?? []), item];
  //   return newattendences;
  // };
  return (
    <Box>
      {/* {attendances &&
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
        ))} */}
      <Controller
        name="attendance"
        control={control}
        defaultValue={attendances?.map((v) => v.id)}
        render={(props) => (
          <CheckboxGroup
            {...props}
            render={(selectedContentGroupContext) => (
              <Fragment>
                {attendances &&
                  attendances.map((item) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          value={item.id}
                          checked={selectedContentGroupContext.hashValue[item.id as string]}
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
        )}
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
  const {
    assessmentDetail: { attendances },
    assessmentDetail,
    onOk,
    formMethods,
    selectedAttendence,
  } = props;
  const {
    formMethods: { reset, control },
  } = props;
  // console.log("subject=",assessmentDetail.subject ? assessmentDetail.subject.name : "1");

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
          <Controller
            as={TextField}
            control={control}
            fullWidth
            disabled
            name="title"
            defaultValue={assessmentDetail.title}
            className={css.fieldset}
            label="Assessment Title"
          />
          <Box className={css.editBox}>
            <Controller
              as={TextField}
              control={control}
              fullWidth
              disabled
              name="attendent"
              defaultValue={assessmentDetail.attendances && assessmentDetail.attendances.map((v) => v.name)}
              className={clsx(css.fieldset, css.nowarp)}
              label="Attendence"
            />
            <Button className={css.editButton} color="primary" variant="contained" onClick={handleOpen}>
              Edit
            </Button>
          </Box>
          <Controller
            as={TextField}
            control={control}
            fullWidth
            disabled
            name="subject.name"
            defaultValue={assessmentDetail.subject?.name}
            className={css.fieldset}
            label="Subject"
          />
          <Controller
            as={TextField}
            control={control}
            fullWidth
            disabled
            name="teacher.name"
            defaultValue={assessmentDetail?.teacher?.name}
            className={css.fieldset}
            label="Teacher"
          />
          <Controller
            as={TextField}
            control={control}
            fullWidth
            disabled
            name="classEndTime"
            defaultValue={formattedTime(assessmentDetail.class_end_time)}
            className={css.fieldset}
            label="Class End Time"
          />
          <Box className={css.editBox}>
            <Controller
              as={TextField}
              control={control}
              fullWidth
              disabled
              name="classLength"
              defaultValue={assessmentDetail.class_length}
              className={css.fieldset}
              label="Class Length"
            />
            <Typography className={css.minutes}>Minutes</Typography>
          </Box>
          <Controller
            as={TextField}
            control={control}
            fullWidth
            disabled
            name="numberofActivities"
            defaultValue={assessmentDetail.number_of_activities}
            className={css.fieldset}
            label="Number of Activities"
          />
          <Controller
            as={TextField}
            control={control}
            fullWidth
            disabled
            name="numberofLearningOutcomes"
            defaultValue={assessmentDetail.number_of_outcomes}
            className={css.fieldset}
            label="Number of Learning Outcomes"
          />
          <Controller
            as={TextField}
            control={control}
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
