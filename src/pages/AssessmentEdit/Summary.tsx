import {
  Box,
  Button,
  ButtonProps,
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
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { AssessmentDetail } from ".";
import { formattedTime } from "../../models/ModelContentDetailForm";

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
      marginTop: 20,
    },
  },
  editBox: {
    width: "100%",
    marginTop: 20,
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
}));

interface SummaryProps {
  SummaryDetail: AssessmentDetail["summary"];
  attendenceList: AssessmentDetail["attendenceList"];
  onOk: ButtonProps["onClick"];
}
export function Summary(props: SummaryProps) {
  const { SummaryDetail, onOk, attendenceList } = props;
  const { breakpoints } = useTheme();
  const css = useStyles();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const { control } = useForm();
  const [open, setOpen] = React.useState(false);
  const handleCancel = () => {
    setOpen(false);
  };
  const fliterAttendence = attendenceList.map((item) => (
    <FormControlLabel
      key={item.id}
      control={
        <Checkbox
          // checked={state.checkedB}
          // onChange={handleChange}
          name={item.name}
          color="primary"
        />
      }
      label={item.name}
    />
  ));
  return (
    <>
      <Paper elevation={sm ? 0 : 3}>
        <Box className={css.classSummaryHeader} boxShadow={3}>
          <Typography variant="h6">Class Summary</Typography>
        </Box>
        <Box px={2} py={5}>
          <Controller
            as={TextField}
            fullWidth
            disabled
            control={control}
            name="title"
            defaultValue={SummaryDetail.title}
            className={css.fieldset}
            label="Assessment Title"
          />
          <Box className={css.editBox}>
            <Controller
              as={TextField}
              fullWidth
              disabled
              control={control}
              name="attendence"
              defaultValue={SummaryDetail.attendence}
              className={css.fieldset}
              label="Attendence"
            />
            <Button className={css.editButton} color="primary" variant="contained" onClick={() => setOpen(true)}>
              Edit
            </Button>
          </Box>
          <Controller
            as={TextField}
            fullWidth
            disabled
            control={control}
            name="subject"
            defaultValue={SummaryDetail.subject}
            className={css.fieldset}
            label="Subject"
          />
          <Controller
            as={TextField}
            fullWidth
            disabled
            control={control}
            name="teacher"
            defaultValue={SummaryDetail.teacher}
            className={css.fieldset}
            label="Teacher"
          />
          <Controller
            as={TextField}
            fullWidth
            disabled
            control={control}
            name="classEndTime"
            defaultValue={formattedTime(SummaryDetail.classEndTime)}
            className={css.fieldset}
            label="Class End Time"
          />
          <Controller
            as={TextField}
            fullWidth
            disabled
            control={control}
            name="classLength"
            defaultValue={SummaryDetail.classLength}
            className={css.fieldset}
            label="Class Length"
          />
          <Controller
            as={TextField}
            fullWidth
            disabled
            control={control}
            name="numberofActivities"
            defaultValue={SummaryDetail.numberofActivities}
            className={css.fieldset}
            label="Number of Activities"
          />
          <Controller
            as={TextField}
            fullWidth
            disabled
            control={control}
            name="numberofLearningOutcomes"
            defaultValue={SummaryDetail.numberofLearningOutcomes}
            className={css.fieldset}
            label="Number of Learning Outcomes"
          />
          <Controller
            as={TextField}
            fullWidth
            disabled
            control={control}
            name="completeTime"
            defaultValue={formattedTime(SummaryDetail.completeTime)}
            className={css.fieldset}
            label="Assessment Complete Time"
          />
        </Box>
      </Paper>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent dividers>{fliterAttendence}</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
