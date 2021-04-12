import { Box, makeStyles, Paper, TextField, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { IAssessmentState } from "../../reducers/assessments";
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

interface SummaryProps {
  detail: IAssessmentState["homefunDetail"];
  feedbacks: IAssessmentState["homefunFeedbacks"];
}
export function Summary(props: SummaryProps) {
  const { detail, feedbacks } = props;
  const { breakpoints } = useTheme();
  const css = useStyles();
  const sm = useMediaQuery(breakpoints.down("sm"));
  return (
    <>
      <Paper elevation={sm ? 0 : 3}>
        <Box className={css.classSummaryHeader} boxShadow={3}>
          <Typography variant="h6">{d("Study-Home Fun Summary").t("assess_detail_study_homefun_summary")}</Typography>
        </Box>
        <Box px={5} py={5}>
          <TextField
            fullWidth
            disabled
            name="title"
            value={detail.title || ""}
            className={css.fieldset}
            label={d("Assessment Title").t("assess_column_title")}
          />
          <TextField
            fullWidth
            disabled
            name="teacher_names"
            value={detail.teacher_names}
            className={css.fieldset}
            label={d("Teacher").t("assess_column_teacher")}
          />
          <TextField
            fullWidth
            disabled
            name="student_name"
            value={detail.student_name ?? ""}
            className={css.fieldset}
            label={d("Student").t("assess_detail_student")}
          />
          <TextField
            fullWidth
            disabled
            name="due_at"
            value={formattedTime(detail.due_at).slice(0, 10) || "N/A"}
            className={css.fieldset}
            label={d("Due Date").t("assess_column_due_date")}
          />
          <TextField
            fullWidth
            disabled
            name="create_at"
            value={formattedTime(feedbacks[0]?.create_at) || ""}
            className={css.fieldset}
            label={d("Submit Time").t("assess_column_submit_time")}
          />
          <TextField
            fullWidth
            disabled
            name="complete_at"
            value={formattedTime(detail.complete_at) || ""}
            className={css.fieldset}
            label={d("Assessment Complete Time").t("assess_detail_assessment_complete_time")}
          />
        </Box>
      </Paper>
    </>
  );
}
