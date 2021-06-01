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
import {
  AssessmentStatus,
  GetAssessmentResult,
  UpdateAssessmentRequestData,
  UpdateAssessmentRequestDatAattendanceIds,
} from "../../api/type";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { PermissionOr, PermissionType } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment, UpdateAssessmentRequestDataOmitAction } from "../../models/ModelAssessment";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { IAssessmentState } from "../../reducers/assessments";
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
  assessmentDetail: GetAssessmentResult;
  formMethods: UseFormMethods<UpdateAssessmentRequestDataOmitAction>;
}
export const AttendanceInput = (props: AttendanceInputProps) => {
  const css = useStyles();
  const {
    defaultValue,
    assessmentDetail,
    formMethods: { control, errors, watch },
  } = props;
  const attendance_ids = watch("attendance_ids") || defaultValue || [];
  return (
    <Box>
      <Typography className={css.subTitle}>
        {d("Students").t("assess_detail_students")}({attendance_ids.length})
      </Typography>
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
                  {assessmentDetail.students &&
                    assessmentDetail.students.map((item) => (
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
  isMyAssessment?: boolean;
}
const PopupInput = forwardRef<HTMLDivElement, PopupInputProps>((props, ref) => {
  const { value, onChange, assessmentDetail, isMyAssessment } = props;
  const css = useStyles();
  const dispatch = useDispatch();
  const formMethods = useForm<UpdateAssessmentRequestData>();
  const [open, toggle] = useReducer((open) => {
    formMethods.reset();
    return !open;
  }, false);
  const attendanceString = useMemo(() => {
    const { students } = ModelAssessment.toDetail(assessmentDetail, { attendance_ids: value });
    return students && students[0] ? `${students?.map((item) => item.name).join(", ")} (${students.length})` : "";
  }, [assessmentDetail, value]);
  const handleOk = useCallback(() => {
    const { attendance_ids } = formMethods.getValues();
    if (!attendance_ids?.length)
      return Promise.reject(dispatch(actWarning(d("You must choose at least one student.").t("assess_msg_ one_student"))));
    toggle();
    if (onChange) return onChange(attendance_ids || []);
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
            <Button
              className={css.editButton}
              color="primary"
              variant="outlined"
              onClick={toggle}
              disabled={assessmentDetail.status === AssessmentStatus.complete}
            >
              {d("Edit").t("assess_button_edit")}
            </Button>
          )
        }
      />
      <Dialog open={open} onClose={toggle}>
        <DialogTitle className={css.title}>{d("Edit Student List").t("assess_detail_edit_student_list")}</DialogTitle>
        <DialogContent dividers style={{ borderBottom: "none" }}>
          <AttendanceInput assessmentDetail={assessmentDetail} formMethods={formMethods} defaultValue={value}></AttendanceInput>
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
  defaultValue?: GetAssessmentResult["lesson_materials"];
  assessmentDetail: GetAssessmentResult;
  formMethods: UseFormMethods<UpdateAssessmentRequestDataOmitAction>;
  isMyAssessment?: boolean;
}
export const MaterialInput = (props: MaterialInputProps) => {
  const css = useStyles();
  const {
    defaultValue,
    assessmentDetail,
    isMyAssessment,
    formMethods: { control, watch },
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
              name={`materials[${index}].id`}
              control={control}
              as={TextField}
              defaultValue={item.id}
            />
            <Controller
              style={{ display: "none" }}
              name={`materials[${index}].name`}
              control={control}
              as={TextField}
              defaultValue={item.name}
            />
            <Controller
              style={{ display: "none" }}
              name={`materials[${index}].outcome_ids`}
              control={control}
              as={TextField}
              defaultValue={item.outcome_ids || []}
            />
            <Controller
              name={`materials[${index}].checked`}
              defaultValue={defaultValue ? defaultValue[index].checked : item.checked}
              render={(props) => (
                <FormControlLabel
                  className={css.checkBoxCon}
                  control={
                    <Checkbox
                      checked={props.value}
                      disabled={assessmentDetail.status === AssessmentStatus.complete || !isMyAssessment}
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
                name={`materials[${index}].comment`}
                control={control}
                as={TextField}
                multiline
                className={css.commentCon}
                placeholder={d("Comment here").t("assess_detail_comment_here")}
                defaultValue={defaultValue ? defaultValue[index].comment : item.comment}
                disabled={assessmentDetail.status === AssessmentStatus.complete || !isMyAssessment}
                inputProps={{ maxLength: 100 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {assessmentDetail.status === AssessmentStatus.complete || !isMyAssessment ? (
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
  assessmentDetail: SummaryProps["assessmentDetail"];
  isMyAssessment?: boolean;
  value: GetAssessmentResult["lesson_materials"];
  onChange?: (value: PupupLessonMaterialProps["value"]) => any;
  onChangeOA: (materials: GetAssessmentResult["lesson_materials"]) => any;
}
const PopupLessonMaterial = forwardRef<HTMLDivElement, PupupLessonMaterialProps>((props, ref) => {
  const { value, assessmentDetail, isMyAssessment, onChange, onChangeOA } = props;
  const css = useStyles();
  const dispatch = useDispatch();
  const formMethods = useForm<UpdateAssessmentRequestData>();
  const [open, toggle] = useReducer((open) => {
    // formMethods.reset();
    return !open;
  }, false);
  const editable = assessmentDetail.status === AssessmentStatus.in_progress && isMyAssessment;
  const materialString = useMemo(() => {
    const materials = ModelAssessment.toMaterial(assessmentDetail.lesson_materials, value);
    return materials && materials[0] ? materials.filter((item) => item.checked).map((item) => item.name) : [];
  }, [assessmentDetail.lesson_materials, value]);

  const handleOk = useCallback(() => {
    const value = formMethods.getValues()["lesson_materials"];
    if (value && value.length) {
      const newValue = value?.filter((item) => !item.checked);
      onChangeOA(value);
      if (newValue.length === value.length) {
        return Promise.reject(
          dispatch(actWarning(d("At least one lesson material needs to be selected as covered.").t("assess_msg_one_exposed")))
        );
      }
      toggle();
    }
    if (onChange) return onChange(value || []);
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
                    {d("Lesson Materials Covered").t("assess_detail_lesson_materials_covered")} (
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
          value && (
            <Button className={css.editButton} color="primary" variant="outlined" onClick={toggle}>
              {assessmentDetail.status === AssessmentStatus.in_progress && isMyAssessment
                ? d("Edit").t("assess_button_edit")
                : d("View").t("assess_detail_button_view")}
            </Button>
          )
        }
      />
      <Dialog maxWidth={"sm"} fullWidth={true} open={open} onClose={toggle}>
        <DialogTitle className={css.title}>
          {!editable
            ? d("View Lesson Materials Covered").t("assess_detail_view_covered")
            : d("Edit Lesson Materials Covered").t("assess_detail_edit_covered")}
          {!editable && (
            <IconButton onClick={toggle} className={css.closeBtn}>
              <Close />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers style={{ borderBottom: "none" }}>
          <MaterialInput
            assessmentDetail={assessmentDetail}
            formMethods={formMethods}
            defaultValue={value}
            isMyAssessment={isMyAssessment}
          />
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

interface SummaryProps {
  formMethods: UseFormMethods<UpdateAssessmentRequestDataOmitAction>;
  assessmentDetail: IAssessmentState["assessmentDetail"];
  isMyAssessment?: boolean;
  outcomesList: IAssessmentState["assessmentDetail"]["outcomes"];
}
export function Summary(props: SummaryProps) {
  const expand = useExpand();
  const { assessmentDetail, isMyAssessment, outcomesList } = props;
  const { formMethods } = props;
  const { control, getValues, setValue } = formMethods;
  const { breakpoints } = useTheme();
  const css = useStyles();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const { attendance_ids } = useMemo(() => ModelAssessment.toRequest(assessmentDetail), [assessmentDetail]);
  const m = getValues()["lesson_materials"];
  const materials = useMemo(() => ModelAssessment.toMaterialRequest(assessmentDetail, m), [assessmentDetail, m]);
  const teacherList = useMemo(() => {
    const list = assessmentDetail.teachers?.map((v) => v.name);
    const length = list && list.length ? list.length : "";
    return `${list?.join(",")} (${length})`;
  }, [assessmentDetail.teachers]);
  const handleClickOk = (materials: GetAssessmentResult["lesson_materials"]) => {
    const filteredOutcomelist = ModelAssessment.filterOutcomeList(assessmentDetail, materials);
    setTimeout(() => {
      setValue("outcomes", filteredOutcomelist);
    }, 100);
  };
  return (
    <>
      <Paper elevation={sm ? 0 : 3}>
        <Box className={css.classSummaryHeader} boxShadow={3}>
          <Typography variant="h6">{d("Class Summary").t("assess_class_summary")}</Typography>
          <div className={css.roomId}>
            {d("Room ID").t("assess_detail_room_id")}:{assessmentDetail.room_id}
          </div>
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
            name="title"
            value={assessmentDetail.class?.name || d("N/A").t("assess_column_n_a")}
            className={css.fieldset}
            label={d("Class Name").t("assess_detail_class_name")}
          />
          <TextField
            fullWidth
            disabled
            name="title"
            value={assessmentDetail.title?.split("-").pop() || ""}
            className={css.fieldset}
            label={d("Lesson Name").t("assess_detail_lesson_name")}
          />
          <TextField
            fullWidth
            disabled
            name="classEndTime"
            value={formattedTime(assessmentDetail.class_end_time)}
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
          <Controller
            as={PopupInput}
            name="attendance_ids"
            defaultValue={attendance_ids}
            assessmentDetail={assessmentDetail}
            control={control}
            isMyAssessment={isMyAssessment}
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
                  name="materials"
                  defaultValue={materials}
                  value={materials}
                  assessmentDetail={assessmentDetail}
                  control={control}
                  isMyAssessment={isMyAssessment}
                  onChangeOA={handleClickOk}
                />
                <TextField
                  fullWidth
                  disabled
                  value={outcomesList?.length || 0}
                  className={css.fieldset}
                  label={d("Number of Learning Outcomes").t("assess_detail_number_lo")}
                />
              </Collapse>
            </>
          )}
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
          {/* <TextField
            fullWidth
            disabled
            name="numberofActivities"
            value={assessmentDetail.number_of_activities || 0}
            className={css.fieldset}
            label={d("Number of Activities").t("assess_detail_number_activity")}
          /> */}
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
