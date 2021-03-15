import { Box, makeStyles, Paper, TextField, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { UseFormMethods } from "react-hook-form";
import { d } from "../../locale/LocaleManager";
import { UpdateAssessmentRequestDataOmitAction } from "../../models/ModelAssessment";
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
  formMethods: UseFormMethods<UpdateAssessmentRequestDataOmitAction>;
  assessmentDetail: IAssessmentState["assessmentDetail"];
  isMyAssessment?: boolean;
}
export function Summary(props: SummaryProps) {
  const { assessmentDetail } = props;
  const { breakpoints } = useTheme();
  const css = useStyles();
  const sm = useMediaQuery(breakpoints.down("sm"));
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
              value={assessmentDetail.class_length && Math.ceil(assessmentDetail.class_length / 60)}
              className={css.fieldset}
              label={d("Class Length").t("assess_detail_class_length")}
            />
            <Typography className={css.minutes}>{d("Minutes").t("assess_detail_minutes")}</Typography>
          </Box>
          <TextField
            fullWidth
            disabled
            name="numberofActivities"
            value={assessmentDetail.number_of_activities || 0}
            className={css.fieldset}
            label={d("Number of Activities").t("assess_detail_number_activity")}
          />
          <TextField
            fullWidth
            disabled
            name="numberofLearningOutcomes"
            value={assessmentDetail.number_of_outcomes || 0}
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
