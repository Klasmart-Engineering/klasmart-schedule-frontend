import { DownloadButton } from "@components/DownloadButton";
import { PLField, PLTableHeader } from "@components/PLTable";
import { d } from "@locale/LocaleManager";
import { Box, Checkbox, Collapse, FormControl, FormControlLabel, FormGroup, IconButton, makeStyles, Radio, RadioGroup, RadioGroupProps, SvgIcon, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import { GetApp, SvgIconComponent } from "@material-ui/icons";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
// import FactCheckOutlinedIcon from '@material-ui/icons/FactCheckOutlined';
import { formattedTime } from "@models/ModelContentDetailForm";
import { DetailAssessmentResultAssignment, DetailAssessmentResultFeedback } from "@pages/ListAssessment/types";
import { actAsyncConfirm } from "@reducers/confirm";
import { AppDispatch } from "@reducers/index";
import { unwrapResult } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { createElement, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { ReactComponent as GetFeedbackIcon } from "../../assets/icons/homefun_getfeedback.svg";
import { ReactComponent as NotSubmitted } from "../../assets/icons/homefun_notsubmitted.svg";
import { ReactComponent as Submitted } from "../../assets/icons/homefun_submitted.svg";
import { Dimension } from "./MultiSelect";
import { DrawingFeedback, ResourceView, useDrawingFeedback, useResourceView } from "./ResourceView";
import { OutcomeBaseProps, OutcomeStatus, ResourceViewTypeValues, StudenmtViewItemResultProps, StudentParticipate, StudentViewItemsProps, SubDimensionOptions } from "./type";
const useStyles = makeStyles({
  tableBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    cursor: "pointer",
    backgroundColor: "#F2F5F7",
    height: 48,
    "& div": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      "& a": {
        fontSize: "14px",
        color: "#006CCF",
      },
    },
    marginBottom: 20,
  },
  tableContainer: {
    marginTop: 5,
    maxHeight: 830,
    marginBottom: 20,
  },
  table: {
    minWidth: 900,
    fontSize: "14px !important",
  },
  tableCellLine: {
    wordBreak: "break-all",
    "&:not(:last-child)": {
      // borderRight: "1px solid #ebebeb",
    },
  },
  assignmentTableContainer: {
    paddingBottom: 40,
  },
  assignmentTable: {
    // marginTop: 32,
  },
  assignmentTableHeader: {
    backgroundColor: "#f2f5f7",
  },
  assignmentTableHeaderItem: {
    height: 80 - 32,
    color: "#666666",
    fontSize: 15,
    fontFamily: "Helvetica, Helvetica-Bold",
    fontWeight: 700,
  },
  assignmentTableBodyItem: {
    borderRight: "1px solid rgba(224, 224, 224, 1)",
    "&:last-child": {
      borderRight: "none",
    },
  },
  assignmentDownloadRow: {
    padding: "11px 24px 10px 20px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: 16,
    fontFamily: "Helvetica",
  },
  scoreInput: {
    marginTop: 30,
    marginBottom: 30,
    width: "100%",
    display: "flex",
    justifyContent: "space-around"
  },
  scoreInputLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  scoreInputTitle: {
    marginTop: 6,
    fontSize: 18,
  },
  scoreIcon: {
    fontSize: 30,
  },
  scoreInputFormControlLabel: {
    // marginRight: 72 - 20,
  },
  comment: {
    marginTop: 32,
    marginBottom: 120,
    borderRadius: 7,
  },
  commentInput: {
    minHeight: 200,
  },
  actionWords: {
    color: "#006CCF", cursor: "pointer"
  },
  disableClick: {
    color: "#999aaa",
    pointerEvents: "none",
    cursor: "default",
  },
  title: {
    height: 56,
    lineHeight: "56px",
    width: "100%",
    background: "#F3F3F3",
    textAlign: "center",
    borderBottom: "1px solid #CCCCCC"
  },
  imgSelect: {
    marginTop: 30,
    marginBottom: 30,
    width: "100%",
    display: "flex",
  },
  imgLable: {
    display: "flex",
    alignItems: "center",
  },
  svgicon: {
    marginRight: "5px",
  }
});
export interface HomefunProps {
  editable: boolean;
  dimension: Dimension;
  subDimension: SubDimensionOptions[];
  students?: StudentViewItemsProps[];
  attachment_id?: string;
  onChangeHomefunStudent: (students?: HomefunProps["students"]) => void;
  onSaveDrawFeedback: (studentId?: string, assignment_id?: string, imgObj?: any) => void;
}
export function Homefun(props: HomefunProps) {
  const css = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const { editable, students, subDimension, attachment_id, onChangeHomefunStudent, onSaveDrawFeedback } = props;
  const { resourceViewActive, resourceViewShowIndex, openResourceView, closeResourceView } = useResourceView();
  const { drawingFeedbackActive, openDrawingFeedback, closeDrawingFeedback } = useDrawingFeedback()
  const [studentId, setStudentId] = useState<string | undefined>();
  const [score, setScore] = useState<StudenmtViewItemResultProps["assess_score"]>();
  const [comment, setComment] = useState<string | undefined>();
  const [resourceType, setResoutceType] = useState<ResourceViewTypeValues>(ResourceViewTypeValues.selectImg);
  const [assignments, setAssignments] = useState<DetailAssessmentResultFeedback["assignments"]>();
  const [assignment, setAssignment] = useState<DetailAssessmentResultAssignment>();
  const [hasSaved, setHasSaved] = useState<boolean>(true);
  const subDimensionIds = useMemo(() => {
    return subDimension.length ? subDimension.map((item) => item.id) : [];
  }, [subDimension]);
  const initCheckArr = useMemo(() => {
    return subDimension.map((item) => true) || [];
  }, [subDimension]);
  const [checkedArr, setCheckedArr] = useState<boolean[]>(initCheckArr);
  const isSelectAll = subDimension.findIndex((item) => item.id === "all") >= 0 ? true : false;
  const toggleCheck = (index: number) => {
    const arr = cloneDeep(checkedArr);
    arr[index] = !checkedArr[index];
    setCheckedArr([...arr]);
  };
  const handleOpenEditScore = (sId?: string, score?: StudenmtViewItemResultProps["assess_score"]) => {
    openResourceView();
    setResoutceType(ResourceViewTypeValues.editScore);
    setStudentId(sId);
    setScore(score)
  }
  const handleChangeScore = (studentId?: string, score?: StudenmtViewItemResultProps["assess_score"]) => {
    const newStudents = cloneDeep(students);
    newStudents?.forEach(sItem => {
      if(sItem.student_id === studentId) {
        if(sItem.results) {
          sItem.results[0].assess_score = score;
        }
      }
    });
    onChangeHomefunStudent(newStudents)
  }
  const handleOpenWringFeedback = (sId?: string, comment?: string) => {
    openResourceView();
    setResoutceType(ResourceViewTypeValues.editComment);
    setStudentId(sId);
    setComment(comment);
  }
  const handleChangeComment = (studentId?: string, comment?: string) => {
    const newStudents = cloneDeep(students);
    newStudents?.forEach(sItem => {
      if(sItem.student_id === studentId) {
        sItem.reviewer_comment = comment
      }
    });
    onChangeHomefunStudent(newStudents)
  }
  const handleUpdateOutcomeStatus = (value: OutcomeStatus, outcome_id?: string, student_id?: string) => {
    const newStudents = cloneDeep(students);
    newStudents?.forEach(sItem => {
      if(sItem.student_id === student_id) {
        if(sItem.results) {
          sItem.results[0]?.outcomes?.forEach(oItem => {
            if(oItem.outcome_id === outcome_id) {
              oItem.status = value;
            }
          })
        }
      }
    });
    onChangeHomefunStudent(newStudents);
  }
  const handleOpenSelectImg = (sId?: string, assignments?: DetailAssessmentResultFeedback["assignments"]) => {
    openResourceView();
    setResoutceType(ResourceViewTypeValues.selectImg);
    setStudentId(sId);
    setAssignments(assignments);
  }
  const handleOpenSelectImageFromDrawing = async (sId?: string, hasTraces?: boolean) => {
    if(hasTraces) {
      // setHasSaved(false);
      const content = d("Discard unsaved changes?").t("assess_msg_discard");
      const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content, cancelText: d("Cancel").t("assess_button_cancel"), confirmText: d("Discard").t("assess_button_discard") })));
      if (!isConfirmed) return Promise.reject();
    }
      closeDrawingFeedback();
      openResourceView();
      setResoutceType(ResourceViewTypeValues.selectImg);
      setStudentId(sId);
      setAssignments(assignments);
  }
  const handleOpenDrawingFeedback = (sId?: string, assignment?: DetailAssessmentResultAssignment) => {
    openDrawingFeedback();
    // setResoutceType(ResourceViewTypeValues.drawFeedback);
    setStudentId(sId);
    setAssignment(assignment);
  }
  const handleSaveDrawFeedback = (sId?: string, imgObj?: any) => {
    setHasSaved(true);
    onSaveDrawFeedback( sId, assignment?.id, imgObj);
  }
  return (
    <>
    {students?.filter(item => item.status === StudentParticipate.Participate).map((sItem, index) => (
      (isSelectAll ? true : subDimensionIds.indexOf(sItem.student_id!) >= 0) && (
      <TableContainer style={{ marginBottom: "20px" }} key={sItem.student_id}>
        <Box className={css.tableBar} onClick={(e) => toggleCheck(index)} >
          <div>
            {(sItem.results && sItem.results.length && sItem.results[0].student_feed_backs && sItem.results[0].student_feed_backs.length)
             ? <SvgIcon component={Submitted} />
             : <SvgIcon component={NotSubmitted} />
            }
            <span style={{ padding: "0 18px 0 18px" }}>{sItem.student_name}</span>
          </div>
          {checkedArr[index] ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </Box>
        <Collapse in={checkedArr[index] === undefined ? true : checkedArr[index]}>
          <Outcomes 
            editable={editable}
            outcomes={sItem.results && sItem.results[0]?.outcomes} 
            studentId={sItem.student_id}
            onUpdateOutcomeStatus={handleUpdateOutcomeStatus}
          />
          <AssessmentTable 
            editable={editable}
            title={""}
            feedbacks={sItem.results && sItem?.results[0]?.student_feed_backs?.slice(0, 1)}  
            studentName={sItem.student_name}
            studentReviewerComment={sItem.reviewer_comment} 
            assess_score={sItem.results && sItem?.results[0]?.assess_score}
            studentId={sItem.student_id}
            onOpenEditScore={handleOpenEditScore}
            onOpenWritingFeedback={handleOpenWringFeedback}
            onOpenSelectImg={handleOpenSelectImg}
          />
          <AssessmentTable 
            editable={editable}
            title={d("Submission History").t("assess_submission_history")}
            feedbacks={sItem.results && sItem.results[0]?.student_feed_backs && sItem.results[0]?.student_feed_backs.slice(1)}  
            studentName={sItem.student_name} 
            assess_score={sItem.results && sItem.results[0]?.assess_score}
          />
        </Collapse>
    </TableContainer>
    )))}
    <ResourceView
      key={resourceType+resourceViewShowIndex}
      open={resourceViewActive} 
      resourceType={resourceType} 
      studentId={studentId} 
      score={score} 
      comment={comment}
      assignments={assignments}
      hasSaved={hasSaved}
      onChangeScore={handleChangeScore}
      onClose={closeResourceView}
      onChangeComment={handleChangeComment}
      onOpenDrawFeedback={handleOpenDrawingFeedback}
    />
    <DrawingFeedback 
      open={drawingFeedbackActive}
      studentId={studentId} 
      attachment={assignment}
      attachmentId={attachment_id}
      onClose={closeDrawingFeedback}
      onOpenSelectImage={handleOpenSelectImageFromDrawing}
      onSaveDrawFeedback={handleSaveDrawFeedback}
    />
    </>
  )
}    

export interface OutcomeProps {
  editable: boolean;
  outcomes?: OutcomeBaseProps[];
  studentId?: string;
  onUpdateOutcomeStatus: (value: OutcomeStatus, outcome_id?: string, student_id?: string) => void;
}
export function Outcomes(props: OutcomeProps) {
  const css = useStyles();
  const { editable, outcomes, studentId, onUpdateOutcomeStatus } = props;
  const outcomesHeader: PLField[] = [
    {
      align: "center",
      style: { backgroundColor: "#F3F3F3" },
      width: 250,
      value: "name",
      text: d("Learning Outcomes").t("library_label_learning_outcomes"),
    },
    { align: "center", style: { backgroundColor: "#F3F3F3" }, width: 100, value: "assumed", text: d("Assumed").t("assess_label_assumed") },
    {
      align: "center",
      style: { backgroundColor: "#F3F3F3" },
      value: "actions",
      text: d("Assessing Actions").t("assess_option_assessing_actions")
    },
  ];
  const rows = outcomes?.map((oItem) => (
    <TableRow key={oItem.outcome_id}>
      <TableCell align="center">{oItem.outcome_name}</TableCell>
      <TableCell align="center">{oItem.assumed ? d("Yes").t("assess_label_yes") : ""}</TableCell>
      <TableCell align="center">
      <FormControl component="fieldset">
        <FormGroup aria-label="position" row>
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                onChange={(e) => {
                  onUpdateOutcomeStatus(e.target.value as OutcomeStatus, oItem.outcome_id, studentId);
                }}
                value={OutcomeStatus.Achieved}
                checked={oItem.status === OutcomeStatus.Achieved}
                color="primary"
                disabled={!editable}
              />
            }
            label={d("Achieved").t("report_label_achieved")}
          />
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                onChange={(e) => {
                  onUpdateOutcomeStatus(e.target.value as OutcomeStatus, oItem.outcome_id, studentId);
                }}
                value={OutcomeStatus.NotAchieved}
                checked={oItem.status === OutcomeStatus.NotAchieved}
                color="primary"
                disabled={!editable}
              />
            }
            label={d("Not Achieved").t("report_label_not_achieved")}
          />
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                onChange={(e) => {
                  onUpdateOutcomeStatus(e.target.value as OutcomeStatus, oItem.outcome_id, studentId);
                }}
                value={OutcomeStatus.NotCovered}
                checked={oItem.status === OutcomeStatus.NotCovered}
                color="primary"
                disabled={!editable}
              />
            }
            label={d("Not Covered").t("assess_option_not_attempted")}
          />
        </FormGroup>
      </FormControl>
      </TableCell>
    </TableRow>
  ))
  return (
    <TableContainer className={css.tableContainer}>
      <Table className={css.table} stickyHeader>
        <PLTableHeader fields={outcomesHeader} style={{ height: 40 }} />
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export interface AssessmentProps {
  editable: boolean;
  title: string;
  feedbacks?: StudenmtViewItemResultProps["student_feed_backs"];
  studentName?: string;
  assess_score?: StudenmtViewItemResultProps["assess_score"];
  studentId?: string;
  studentReviewerComment?: string;
  onOpenEditScore?: (id?: string, score?: AssessmentProps["assess_score"]) => void;
  onOpenWritingFeedback?: (id?: string, comment?: string) => void;
  onOpenSelectImg?: (id?: string, assignments?: DetailAssessmentResultFeedback["assignments"]) => void
}
export function AssessmentTable(props: AssessmentProps) {
  const { editable, feedbacks, title, studentName, assess_score, studentId, studentReviewerComment, onOpenEditScore, onOpenWritingFeedback, onOpenSelectImg } = props;
  
  const css = useStyles();
  const mapScore = (score: number | undefined) => {
    if (!score) return "";
    if (score === 1) return `1-${d("Poor").t("assess_score_poor")}`;
    if (score === 2) return `2-${d("Fair").t("assess_score_fair")}`;
    if (score === 3) return `3-${d("Average").t("assess_score_average")}`;
    if (score === 4) return `4-${d("Good").t("assess_score_good")}`;
    if (score === 5) return `5-${d("Excellent").t("assess_score_excellent")}`;
  };
  const assessmentHeader: PLField[] = [
    {
      align: "center",
      style: { backgroundColor: "#F3F3F3" },
      width: "30%",
      value: "name",
      text: d("Assignment Uploaded").t("assess_assignment_uploaded"),
    },
    {
      align: "center",
      style: { backgroundColor: "#F3F3F3" },
      width: "20%",
      value: "comment",
      text: d("Comment").t("assess_comment"),
    },
    {
      align: "center",
      style: { backgroundColor: "#F3F3F3" },
      width: "15%",
      value: "submittime",
      text: d("Submit Time").t("assess_column_submit_time"),
    },
    {
      align: "center",
      style: { backgroundColor: "#F3F3F3" },
      width: "20%",
      value: "assessment",
      text: "Assessment",
    },
    {
      align: "center",
      style: { backgroundColor: "#F3F3F3" },
      width: "15%",
      value: "feedback",
      text: "Feedback",
    },
    
  ];
  const tableBodyRows = feedbacks?.map(({ id, comment, create_at, assignments }) => (
    <TableRow key={id}>
      <TableCell align="center" className={css.assignmentTableBodyItem}>
        {assignments?.map((assignment) => (
          <AssignmentDownloadRow
            downloadName={`HFS_${studentName}_${assignment.attachment_name}`}
            name={assignment.attachment_name}
            resourceId={assignment.attachment_id}
            key={assignment.attachment_id}
          />
        ))}
      </TableCell>
      <TableCell align="center" className={css.assignmentTableBodyItem}>
        <Typography align="justify" variant="body1">
          {comment}
        </Typography>
      </TableCell>
      <TableCell align="center" className={css.assignmentTableBodyItem}>
        {formattedTime(create_at)}
      </TableCell>
      {!title && 
        <>
          <TableCell align="center" className={css.assignmentTableBodyItem}>
            {mapScore(assess_score)}
            <span className={editable ? css.actionWords : css.disableClick} onClick={e => onOpenEditScore && onOpenEditScore(studentId, assess_score)}>({"Click to edit"})</span>
          </TableCell>
          <TableCell align="center" className={css.assignmentTableBodyItem}>
            <p className={editable ? css.actionWords : css.disableClick} onClick={e => onOpenWritingFeedback && onOpenWritingFeedback(studentId, studentReviewerComment)}>{"Writing Feedback"}</p>
            <p className={editable ? css.actionWords : css.disableClick} onClick={e => onOpenSelectImg && onOpenSelectImg(studentId, assignments)}>{"Drawing Feedback"}</p>
          </TableCell>
        </>
      }
    </TableRow>
  ));
  return (
    <div className={css.assignmentTableContainer}>
      {title && <Typography className={css.title}>{title}</Typography>}
      <Table className={css.assignmentTable}>
        <PLTableHeader fields={title ? assessmentHeader.slice(0,3) : assessmentHeader} style={{ height: 40 }} />
        <TableBody>{tableBodyRows}</TableBody>
      </Table>
    </div>
  );
}

interface AssignmentDownloadRowProps {
  name?: string;
  downloadName?: string;
  resourceId?: string;
}
function AssignmentDownloadRow(props: AssignmentDownloadRowProps) {
  const { name, downloadName, resourceId } = props;
  const css = useStyles();
  return (
    <div className={css.assignmentDownloadRow}>
      <span>{name}</span>
      <DownloadButton resourceId={resourceId} fileName={downloadName}>
        <IconButton size="small">
          <GetApp fontSize="inherit" />
        </IconButton>
      </DownloadButton>
    </div>
  );
}

export interface ScoreInputProps {
  optionIcons: SvgIconComponent[];
  optionColors: string[];
  optionNames: string[];
  optionValues: number[];
  value?: number;
  onChange?: RadioGroupProps["onChange"];
  disabled?: boolean;
}
export function ScoreInput(props: ScoreInputProps) {
  const css = useStyles();
  const { optionColors, optionNames, optionIcons, optionValues, value, onChange, disabled } = props;
  const radioList = optionNames.map((name, index) => (
    <FormControlLabel
      key={optionValues[index]}
      className={css.scoreInputFormControlLabel}
      value={optionValues[index]}
      label={
        <div className={css.scoreInputLabel}>
          {createElement(optionIcons[index], { className: css.scoreIcon, style: { color: optionColors[index] } })}
          <div className={css.scoreInputTitle}>{optionNames[index]}</div>
        </div>
      }
      labelPlacement="top"
      control={<Radio color="primary" disabled={disabled} />}
    />
  ));
  return (
    <FormControl component="fieldset" className={css.scoreInput}>
      <RadioGroup row value={value} onChange={onChange}>
        {radioList}
      </RadioGroup>
    </FormControl>
  );
}
function isImageType(name: string | undefined) {
  if(!name) return false;
  const index = name.lastIndexOf(".");
  const ext = name.substr(index + 1);
  const types = ["jpg", "jpeg", "png", "gif", "bmp"];
  return types.indexOf(ext.toLowerCase()) > -1;
}
export interface ImgSelectProps {
  assignments: DetailAssessmentResultFeedback["assignments"];
  value?: string;
  onChange?: RadioGroupProps["onChange"]
}
export function ImgSelect(props: ImgSelectProps) {
  const css = useStyles();
  const { assignments, value, onChange } = props;
  const radioList = assignments
    ?.filter(item => isImageType(item.attachment_name))
    .map((assessment) => (
       <FormControlLabel 
          key={assessment.attachment_id}
          value={assessment.attachment_id}
          label={
            <div className={css.imgLable}>
              {assessment.review_attachment_id && <SvgIcon className={css.svgicon} component={GetFeedbackIcon}/>}
              {assessment.attachment_name}
            </div>
          }
          labelPlacement="end"
          control={<Radio color="primary" />}
       />                 
    ))

  return (
    <FormControl component="fieldset" className={css.imgSelect}>
      <RadioGroup value={value} onChange={onChange}>
        {radioList}
      </RadioGroup>
    </FormControl>
  )
}