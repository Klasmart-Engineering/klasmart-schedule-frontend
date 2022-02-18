import { Box, makeStyles, Paper, TextField, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { useMemo } from "react";
import { UseFormMethods } from "react-hook-form";
import { AssessmentTypeValues } from "../../components/AssessmentType";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { DetailAssessmentResult } from "../ListAssessment/types";
import { MaterialEdit } from "./MaterialEdit";
import { StudentEdit } from "./StudentEdit";
import { UpdateAssessmentDataOmitAction } from "./type";
const useStyles = makeStyles(({ palette, spacing }) => ({
  classSummaryHeader: {
    height: 64,
    width: "100%",
    backgroundColor: palette.primary.main,
    color: palette.common.white,
    paddingLeft: 24,
    paddingRight: 24,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldset: {
    "& .MuiInputBase-input": {
      color: "rgba(0,0,0,1)",
    },
    "&:not(:first-child)": {
      marginTop: 30,
    },
  },
  roomId: {
    padding: "7px 18px",
    background: "rgba(255,255,255,0.21)",
    borderRadius: "18px",
    fontSize: 16,
  },
  editBox: {
    width: "100%",
    marginTop: 30,
    position: "relative",
  },
  minutes: {
    position: "absolute",
    top: 15,
    right: 16,
    color: "rgba(0,0,0,.38)",
  },
}));
export interface DetailFormProps {
  editable: boolean;
  assessmentDetail: DetailAssessmentResult;
  students: DetailAssessmentResult["students"];
  contents: DetailAssessmentResult["contents"];
  assessmentType: AssessmentTypeValues;
  formMethods: UseFormMethods<UpdateAssessmentDataOmitAction>;
  onChangeStudent: (students: DetailFormProps["students"]) => void;
  onChangeContents: (contents: DetailFormProps["contents"]) => void;
  completeRate: string;
}
export function DetailForm(props: DetailFormProps) {
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const { assessmentDetail, students, contents, assessmentType, formMethods, editable, completeRate, onChangeStudent, onChangeContents } =
    props;
  const isClassAndLive = assessmentType === AssessmentTypeValues.class || assessmentType === AssessmentTypeValues.live;
  const isStudy = assessmentType === AssessmentTypeValues.study;
  const teacherList = useMemo(() => {
    const list = assessmentDetail.teachers?.map((v) => v.name);
    const length = list && list.length ? list.length : "";
    return `${list?.join(",")} (${length})`;
  }, [assessmentDetail.teachers]);
  const lessonPlan = assessmentDetail.contents
    ? assessmentDetail.contents.find((item) => item.content_type === "LessonPlan")?.content_name
    : "";
  return (
    <>
      <Paper elevation={sm ? 0 : 3}>
        <Box className={css.classSummaryHeader} boxShadow={3}>
          <Typography variant="h6">
            {isStudy ? d("Study Summary").t("assess_study_summary") : d("Class Summary").t("assess_class_summary")}
          </Typography>
          <div className={css.roomId}>
            {d("Room ID").t("assess_detail_room_id")}:{assessmentDetail.room_id}
          </div>
        </Box>
        <Box px={5} py={5}>
          <TextField
            fullWidth
            disabled
            value={assessmentDetail.title || d("N/A").t("assess_column_n_a")}
            className={css.fieldset}
            label={d("Study Title").t("assess_list_study_title")}
            multiline
            maxRows={3}
          />
          <TextField
            fullWidth
            disabled
            value={assessmentDetail?.class?.name || d("N/A").t("assess_column_n_a")}
            className={css.fieldset}
            label={d("Class Name").t("assess_detail_class_name")}
          />
          {isClassAndLive && (
            <>
              <TextField
                fullWidth
                disabled
                name="title"
                value={assessmentDetail.schedule_title ?? ""}
                className={css.fieldset}
                label={d("Lesson Name").t("assess_detail_lesson_name")}
              />
              <TextField
                fullWidth
                disabled
                name="classEndTime"
                value={formattedTime(assessmentDetail.class_end_at)}
                className={css.fieldset}
                label={d("Date of Class").t("assess_detail_date_of_class")}
              />
              <TextField
                fullWidth
                disabled
                multiline
                name="teacher.name"
                value={teacherList}
                className={css.fieldset}
                label={d("Teacher List").t("assess_detail_teacher_list")}
              />
            </>
          )}
          {isStudy && (
            <TextField
              fullWidth
              disabled
              multiline
              name="teacher.name"
              value={teacherList}
              className={css.fieldset}
              label={d("Teacher List").t("assess_detail_teacher_list")}
            />
          )}
          <StudentEdit students={students} editable={editable} onChangeStudent={onChangeStudent} />
          {isClassAndLive && (
            <Box className={css.editBox}>
              <TextField
                fullWidth
                disabled
                name="classLength"
                value={(assessmentDetail.class_length && Math.ceil(assessmentDetail.class_length / 60)) || 0}
                className={css.fieldset}
                label={d("Class Length").t("assess_detail_class_length")}
              />
              <Typography className={css.minutes}>{d("Minutes").t("assess_detail_minutes")}</Typography>
            </Box>
          )}
          {assessmentDetail.contents && assessmentDetail.contents.length && (
            <>
              <TextField
                fullWidth
                disabled
                value={lessonPlan}
                className={css.fieldset}
                label={d("Lesson Plan").t("library_label_lesson_plan")}
              />
              {/* lesson material input */}
              <MaterialEdit
                assessmentDetail={assessmentDetail}
                editable={editable}
                formMethods={formMethods}
                contents={contents}
                onChangeContents={onChangeContents}
              />
              {isClassAndLive && (
                <TextField
                  fullWidth
                  disabled
                  value={assessmentDetail.outcomes?.length ?? 0}
                  className={css.fieldset}
                  label={d("Number of Learning Outcomes").t("assess_detail_number_lo")}
                />
              )}
            </>
          )}
          {isClassAndLive && (
            <>
              <TextField
                fullWidth
                disabled
                name="program.name"
                value={assessmentDetail.program?.name || ""}
                className={css.fieldset}
                label={d("Program").t("assess_label_program")}
              />
              <TextField
                fullWidth
                disabled
                name="subjects"
                value={assessmentDetail.subjects?.map((v) => v.name).join(", ") || ""}
                className={css.fieldset}
                label={d("Subject").t("library_label_subject")}
              />
            </>
          )}
          {isStudy && (
            <>
              <TextField
                fullWidth
                disabled
                name="due_at"
                value={formattedTime(0) || d("N/A").t("assess_column_n_a")}
                className={css.fieldset}
                label={d("Due Date").t("assess_column_due_date")}
              />
              <TextField
                fullWidth
                disabled
                value={completeRate}
                className={css.fieldset}
                label={d("Completion Rate").t("assess_list_completion_rate")}
              />
              <Box className={css.editBox}>
                <TextField
                  fullWidth
                  disabled
                  name="remaining_time"
                  value={assessmentDetail?.remaining_time ? Math.ceil(assessmentDetail?.remaining_time / 60 / 60 / 24) : 0}
                  className={css.fieldset}
                  label={d("Assessment Remaining").t("assess_list_assessment_remaining")}
                />
                <Typography className={css.minutes}>{d("Day(s)").t("assess_list_remaining_days")}</Typography>
              </Box>
            </>
          )}
          <TextField
            fullWidth
            disabled
            name="complete_time"
            value={formattedTime(assessmentDetail.complete_at) || 0}
            className={css.fieldset}
            label={d("Assessment Complete Time").t("assess_detail_assessment_complete_time")}
          />
        </Box>
      </Paper>
    </>
  );
}
