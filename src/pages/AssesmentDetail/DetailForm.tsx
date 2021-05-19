import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close, ExpandMore } from "@material-ui/icons";
import BorderColorOutlinedIcon from "@material-ui/icons/BorderColorOutlined";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import clsx from "clsx";
import React, { forwardRef, Fragment, useCallback, useMemo, useReducer, useState } from "react";
import { Controller, useForm, UseFormMethods } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AssessmentStatus, DetailStudyAssessment, UpdateStudyAssessmentStudentIds } from "../../api/type";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { PermissionOr, PermissionType } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment, UpdateStudyAssessmentDataOmitAction } from "../../models/ModelAssessment";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { actWarning } from "../../reducers/notify";
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
  materialEditBox: {
    "& .MuiOutlinedInput-multiline": {
      padding: "18.5px 14px 40px 14px",
    },
  },
  editAttendanceBox: {
    "& .MuiInputBase-input": {
      width: "calc(100% - 78px)",
    },
  },
  editButton: {
    position: "absolute",
    bottom: 10,
    right: 14,
    // color: "#0e78d5",
    background: "rgba(14,120,213,0.24)",
    // border: "1px solid #0e78d5",
    "&:hover": {
      background: "rgba(14,120,213,0.24)",
    },
  },
  minutes: {
    position: "absolute",
    top: 15,
    right: 16,
    color: "rgba(0,0,0,.38)",
  },
  roomId: {
    padding: "7px 18px",
    background: "rgba(255,255,255,0.21)",
    borderRadius: "18px",
    fontSize: 16,
  },
  expandCon: {
    fontSize: 16,
    marginBottom: -30,
    color: "#0e78d5",
  },
  subTitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  commentCon: {
    marginLeft: 10,
    width: "100%",
    "& .MuiInputBase-root": {
      height: "100%",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  checkBoxCon: {
    "& .MuiFormControlLabel-label": {
      fontSize: 18,
    },
    "& .MuiTypography-root": {
      wordBreak: "break-all",
    },
  },
  blockEle: {
    "& .MuiInputBase-root": {
      display: "block",
      minHeight: 120,
    },
  },
  materialTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: 700,
  },
  materialNameCon: {
    color: "#000",
    fontSize: 18,
    margin: "16px 0",
    wordBreak: "break-all",
  },
  mCoverIcon: {
    fontSize: 16,
    color: "#999999",
  },
  title: {
    "& .MuiTypography-root": {
      fontSize: "24px !important",
      fontWeight: 700,
    },
  },
  closeBtn: {
    color: "#000",
    position: "absolute",
    top: spacing(1),
    right: spacing(1),
  },
  okBtn: {
    marginLeft: "40px !important",
  },
}));

const useExpand = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  return { collapse: { in: open }, expandMore: { open, onClick: toggle } };
};
interface ExpandBtnProps {
  open: boolean;
}
const ExpandBtn = styled(IconButton)((props: ExpandBtnProps) => ({
  color: "#0e78d5",
  transform: props.open ? "rotate(180deg)" : "none",
}));
export interface AttendanceInputProps {
  defaultValue: PopupInputProps["value"];
  assessmentDetail: DetailFormProps["assessmentDetail"];
  formMethods: UseFormMethods<UpdateStudyAssessmentDataOmitAction>;
}
export const AttendanceInput = (props: AttendanceInputProps) => {
  const css = useStyles();
  const {
    defaultValue,
    assessmentDetail,
    formMethods: { control, errors, watch },
  } = props;
  const student_ids = watch("student_ids") || defaultValue || [];
  return (
    <Box>
      <Typography className={css.subTitle}>
        {d("Students").t("assess_detail_students")}({student_ids.length})
      </Typography>
      <Controller
        name="student_ids"
        control={control}
        defaultValue={defaultValue}
        rules={{ required: true }}
        error={errors.student_ids}
        render={({ ref, ...props }) => {
          return (
            <CheckboxGroup
              {...props}
              render={(selectedContentGroupContext) => (
                <Fragment>
                  {assessmentDetail.students &&
                    assessmentDetail.students.map((item) => (
                      <FormControlLabel
                        ref={ref}
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
  assessmentDetail: DetailFormProps["assessmentDetail"];
  value?: UpdateStudyAssessmentStudentIds;
  onChange?: (value: PopupInputProps["value"]) => any;
  isMyAssessment: boolean;
  editable: boolean;
  studentIds: UpdateStudyAssessmentStudentIds;
}
const PopupInput = forwardRef<HTMLDivElement, PopupInputProps>((props, ref) => {
  const { value, onChange, assessmentDetail, isMyAssessment, editable, studentIds } = props;
  const css = useStyles();
  const dispatch = useDispatch();
  const formMethods = useForm<UpdateStudyAssessmentDataOmitAction>();
  const [open, toggle] = useReducer((open) => {
    formMethods.reset();
    return !open;
  }, false);
  const attendanceString = useMemo(() => {
    const { students } = ModelAssessment.toDetail(assessmentDetail, { attendance_ids: value || studentIds });
    return students && students[0] ? `${students?.map((item) => item.name).join(", ")} (${students.length})` : "";
  }, [assessmentDetail, studentIds, value]);
  const handleOk = useCallback(() => {
    const { student_ids } = formMethods.getValues();
    if (!student_ids?.length)
      return Promise.reject(dispatch(actWarning(d("You must choose at least one student.").t("assess_msg_ one_student"))));
    toggle();
    if (onChange) return onChange(student_ids || []);
  }, [dispatch, formMethods, onChange]);
  return (
    <Box className={css.editBox} {...{ ref }}>
      <TextField
        fullWidth
        disabled
        multiline
        rows={2}
        rowsMax={4}
        value={attendanceString || ""}
        className={clsx(css.fieldset, css.nowarp, css.editAttendanceBox)}
        label={d("Student List").t("assess_detail_student_list")}
      />
      <PermissionOr
        value={[PermissionType.edit_in_progress_assessment_439, PermissionType.edit_attendance_for_in_progress_assessment_438]}
        render={(value) =>
          isMyAssessment &&
          value && (
            <Button className={css.editButton} color="primary" variant="outlined" onClick={toggle} disabled={!editable}>
              {d("Edit").t("assess_button_edit")}
            </Button>
          )
        }
      />
      <Dialog open={open} onClose={toggle}>
        <DialogTitle className={css.title}>{d("Edit Student List").t("assess_detail_edit_student_list")}</DialogTitle>
        <DialogContent dividers style={{ borderBottom: "none" }}>
          <AttendanceInput
            assessmentDetail={assessmentDetail}
            defaultValue={value || studentIds}
            formMethods={formMethods}
          ></AttendanceInput>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggle} color="primary" variant="outlined">
            {d("CANCEL").t("general_button_CANCEL")}
          </Button>
          <Button onClick={handleOk} color="primary" variant="contained" className={css.okBtn}>
            {d("OK").t("general_button_OK")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
export interface MaterialInputProps {
  defaultValue?: DetailStudyAssessment["lesson_materials"];
  assessmentDetail: DetailFormProps["assessmentDetail"];
  formMethods: UseFormMethods<UpdateStudyAssessmentDataOmitAction>;
  editable: boolean;
}
export const MaterialInput = (props: MaterialInputProps) => {
  const css = useStyles();
  const {
    defaultValue,
    assessmentDetail,
    formMethods: { control, watch },
    editable,
  } = props;
  const selectedMaterials = useMemo(() => {
    const selectedM = watch("lesson_materials") || defaultValue || [];
    return selectedM.length ? selectedM.filter((item) => item.checked) : [];
  }, [defaultValue, watch]);
  return (
    <Box style={{ height: 390 }}>
      <Typography className={css.subTitle}>
        {d("Lesson Materials Covered").t("assess_detail_lesson_materials_covered")}:{" "}
        {`${selectedMaterials.length}/${assessmentDetail.lesson_materials?.length ?? 0}`}
      </Typography>
      {assessmentDetail.lesson_materials &&
        assessmentDetail.lesson_materials.length &&
        assessmentDetail.lesson_materials.map((item, index) => (
          <div key={item.id}>
            <Controller
              style={{ display: "none" }}
              name={`lesson_materials[${index}].id`}
              control={control}
              as={TextField}
              defaultValue={item.id}
            />
            <Controller
              name={`lesson_materials[${index}].checked`}
              defaultValue={defaultValue ? defaultValue[index].checked : item.checked}
              render={(props) => (
                <FormControlLabel
                  className={css.checkBoxCon}
                  control={
                    <Checkbox
                      checked={props.value}
                      disabled={!editable}
                      onChange={(e) => props.onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={item.name}
                />
              )}
              control={control}
            />
            <div>
              <Controller
                name={`lesson_materials[${index}].comment`}
                control={control}
                as={TextField}
                multiline
                className={css.commentCon}
                placeholder={d("Comment here").t("assess_detail_comment_here")}
                defaultValue={defaultValue ? defaultValue[index].comment : item.comment}
                disabled={!editable}
                inputProps={{ maxLength: 100 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {assessmentDetail.status === AssessmentStatus.complete ? (
                        <MessageOutlinedIcon className={css.mCoverIcon} />
                      ) : (
                        <BorderColorOutlinedIcon className={css.mCoverIcon} />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        ))}
    </Box>
  );
};
export interface MaterialProps {
  checked: boolean;
  comment: string;
}
interface PupupLessonMaterialProps {
  assessmentDetail: DetailFormProps["assessmentDetail"];
  isMyAssessment: boolean;
  value: DetailStudyAssessment["lesson_materials"];
  onChange?: (value: PupupLessonMaterialProps["value"]) => any;
  onChangeOA: (materials: DetailStudyAssessment["lesson_materials"]) => any;
  editable: boolean;
}
const PopupLessonMaterial = forwardRef<HTMLDivElement, PupupLessonMaterialProps>((props, ref) => {
  const { value, assessmentDetail, isMyAssessment, onChange, onChangeOA, editable } = props;
  const css = useStyles();
  const dispatch = useDispatch();
  const formMethods = useForm<UpdateStudyAssessmentDataOmitAction>();
  const [open, toggle] = useReducer((open) => {
    // formMethods.reset();
    return !open;
  }, false);
  const materialString = useMemo(() => {
    const materials = ModelAssessment.toMaterial(assessmentDetail.lesson_materials, value);
    return materials && materials[0] ? materials.filter((item) => item.checked).map((item) => item.name) : [];
  }, [assessmentDetail.lesson_materials, value]);
  const handleOk = useCallback(() => {
    const { lesson_materials } = formMethods.getValues();
    if (lesson_materials && lesson_materials.length) {
      const newValue = lesson_materials?.filter((item) => !item.checked);
      onChangeOA(lesson_materials);
      if (newValue.length === lesson_materials.length) {
        return Promise.reject(
          dispatch(actWarning(d("At least one lesson material needs to be selected as covered.").t("assess_msg_one_exposed")))
        );
      }
      toggle();
    }
    if (onChange) return onChange(lesson_materials || []);
  }, [dispatch, formMethods, onChange, onChangeOA]);
  return (
    <Box className={clsx(css.editBox, css.materialEditBox)} {...{ ref }}>
      <TextField
        fullWidth
        disabled
        multiline={true}
        className={clsx(css.fieldset, css.blockEle)}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <>
              {materialString && materialString.length ? (
                <>
                  <div className={css.materialTitle}>
                    {d("Lesson Materials Covered").t("assess_detail_lesson_materials_covered")}(
                    {`${materialString.length}/${assessmentDetail.lesson_materials?.length}`})
                  </div>
                  <div style={{ maxHeight: 180, minHeight: 90, overflow: "auto" }}>
                    {materialString.map((item, index) => (
                      <div className={css.materialNameCon} key={index}>
                        {item}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                d("N/A").t("assess_column_n_a")
              )}
            </>
          ),
        }}
      />
      <PermissionOr
        value={[PermissionType.edit_in_progress_assessment_439, PermissionType.edit_attendance_for_in_progress_assessment_438]}
        render={(value) =>
          isMyAssessment &&
          value && (
            <Button className={css.editButton} color="primary" variant="outlined" onClick={toggle}>
              {!editable ? d("View").t("assess_detail_button_view") : d("Edit").t("assess_button_edit")}
            </Button>
          )
        }
      />
      <Dialog maxWidth={"sm"} fullWidth={true} open={open} onClose={toggle}>
        <DialogTitle className={css.title}>
          {assessmentDetail.status === AssessmentStatus.complete
            ? d("View Lesson Materials Covered").t("assess_detail_view_covered")
            : d("Edit Lesson Materials Covered").t("assess_detail_edit_covered")}
          {!editable && (
            <IconButton onClick={toggle} className={css.closeBtn}>
              <Close />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers style={{ borderBottom: "none" }}>
          <MaterialInput assessmentDetail={assessmentDetail} formMethods={formMethods} defaultValue={value} editable={editable} />
        </DialogContent>
        {editable && (
          <DialogActions>
            <Button autoFocus onClick={toggle} color="primary" variant="outlined">
              {d("CANCEL").t("general_button_CANCEL")}
            </Button>
            <Button onClick={handleOk} color="primary" variant="contained" className={css.okBtn}>
              {d("OK").t("general_button_OK")}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
});

interface DetailFormProps {
  formMethods: UseFormMethods<UpdateStudyAssessmentDataOmitAction>;
  assessmentDetail: DetailStudyAssessment;
  isMyAssessment: boolean;
  editable: boolean;
}
export default function DetailForm(props: DetailFormProps) {
  const expand = useExpand();
  const { formMethods, assessmentDetail, isMyAssessment, editable } = props;
  // const formMethods = useForm();
  const { control, getValues } = formMethods;
  const { breakpoints } = useTheme();
  const css = useStyles();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const { student_ids } = useMemo(() => ModelAssessment.toGetStudentIds(assessmentDetail), [assessmentDetail]);
  console.log(student_ids);
  const m = getValues()["lesson_materials"];
  const materials = useMemo(() => ModelAssessment.toStudyAssessment(assessmentDetail, m), [assessmentDetail, m]);
  const teacherList = useMemo(() => {
    const list = assessmentDetail.teachers;
    const length = list && list.length ? list.length : d("N/A").t("assess_column_n_a");
    return `${list?.map((v) => v.name)?.join(",")} (${length})`;
  }, [assessmentDetail.teachers]);
  const handleClickOk = (materials: DetailStudyAssessment["lesson_materials"]) => {
    console.log(materials);
  };
  return (
    <>
      <Paper elevation={sm ? 0 : 3}>
        <Box className={css.classSummaryHeader} boxShadow={3}>
          <Typography variant="h6">{d("Class Summary").t("assess_class_summary")}</Typography>
          <div className={css.roomId}>
            {d("Room ID").t("assess_detail_room_id")}:{assessmentDetail.id}
          </div>
        </Box>
        <Box px={5} py={5}>
          <TextField fullWidth disabled name="title" value={assessmentDetail.title || ""} className={css.fieldset} label={"Study Title"} />
          <TextField
            fullWidth
            disabled
            name="class_name"
            value={assessmentDetail?.class_name || d("N/A").t("assess_column_n_a")}
            className={css.fieldset}
            label={d("Class Name").t("assess_detail_class_name")}
          />
          <TextField
            fullWidth
            disabled
            multiline
            name="teacher_name"
            value={teacherList}
            className={css.fieldset}
            label={d("Teacher List").t("assess_detail_teacher_list")}
          />
          <Controller
            as={PopupInput}
            name="student_ids"
            defaultValue={student_ids}
            assessmentDetail={assessmentDetail}
            control={control}
            isMyAssessment={isMyAssessment}
            editable={editable}
            studentIds={student_ids}
          />
          {assessmentDetail.lesson_plan && assessmentDetail.lesson_plan.id && (
            <>
              <TextField
                fullWidth
                disabled
                name="title"
                value={assessmentDetail.lesson_plan?.name || ""}
                className={css.fieldset}
                label={d("Lesson Plan").t("library_label_lesson_plan")}
              />
              <div className={css.expandCon}>
                {expand.expandMore.open ? d("See Less").t("assess_detail_see_less") : d("See More").t("assess_detail_see_more")}
                <ExpandBtn {...expand.expandMore}>
                  <ExpandMore fontSize="small"></ExpandMore>
                </ExpandBtn>
              </div>
              <Collapse {...expand.collapse} unmountOnExit>
                <Controller
                  as={PopupLessonMaterial}
                  name="lesson_materials"
                  defaultValue={materials}
                  value={materials}
                  assessmentDetail={assessmentDetail}
                  control={control}
                  isMyAssessment={isMyAssessment}
                  onChangeOA={handleClickOk}
                  editable={editable}
                />
              </Collapse>
            </>
          )}
          <TextField
            fullWidth
            disabled
            name="completeTime"
            value={formattedTime(assessmentDetail.due_at) || d("N/A").t("assess_column_n_a")}
            className={css.fieldset}
            label={d("Due Date").t("assess_column_due_date")}
          />
          <TextField
            fullWidth
            disabled
            name="completeTime"
            value={assessmentDetail?.complete_rate || 0}
            className={css.fieldset}
            label={"Completion Rate"}
          />
          <TextField
            fullWidth
            disabled
            name="completeTime"
            value={assessmentDetail?.remaining_time || 0}
            className={css.fieldset}
            label={"Assessment Remaining"}
          />
          <TextField
            fullWidth
            disabled
            name="completeTime"
            value={formattedTime(assessmentDetail.complete_at) || 0}
            className={css.fieldset}
            label={d("Assessment Complete Time").t("assess_detail_assessment_complete_time")}
          />
        </Box>
      </Paper>
    </>
  );
}
