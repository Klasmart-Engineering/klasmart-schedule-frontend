import { Box, Checkbox, Collapse, FormControlLabel, makeStyles } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import React, { useEffect, useMemo, useState } from "react";
import {
  EntityAssessmentDetailContentOutcome,
  EntityAssessmentStudentViewH5PItem,
  EntityAssessmentStudentViewH5PLessonMaterial,
  EntityUpdateAssessmentH5PStudent,
} from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
import { EditScore } from "./EditScore";
import { BasicTableProps, formValueMethods } from "./types";
import { PLField, PLTableHeader } from "../PLTable";
import { cloneDeep } from "lodash";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
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
  },
  outcomesBox: {
    maxWidth: "260px",
    "& li": {
      textAlign: "left",
      marginTop: "10px",
      wordBreak: "break-all",
    },
  },
  student_lo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    wordBreak: "break-all",
    "& .MuiFormControlLabel-root": {
      display: "flex",
      alignItems: "flex-start",
      paddingTop: 9,
      "& .MuiIconButton-root": {
        paddingTop: 0,
      },
    },
  },
});

interface LO extends formValueMethods {
  rowData: EntityAssessmentStudentViewH5PLessonMaterial;
  studentViewItemsSet?: EntityAssessmentStudentViewH5PItem[];
  disabled?: boolean;
  studentIdx: number;
  materialIdx: number;
  studentId: string | undefined;
}

function LOChecklist({
  studentId,
  rowData,
  studentIdx,
  materialIdx,
  studentViewItemsSet,
  formMethods,
  formValue,
  changeAssessmentTableDetail,
  disabled,
}: LO) {
  const classes = useStyles();
  let { outcomes } = rowData;
  let [list, setList] = useState(cloneDeep(outcomes));

  /** 根据 outcome 得到（用户通过点击 not attempted 而得到的）禁用列表 **/
  const outcomeDisableList = useMemo(() => formValue.outcomes?.filter((o) => o.skip && o.outcome_id)?.map((o) => o.outcome_id) ?? [], [
    formValue.outcomes,
  ]);

  useEffect(() => {
    setList(cloneDeep(outcomes));
  }, [outcomes]);

  /** 修改并上传顶层数据 **/
  const emitData = () => {
    let lesson_materials: EntityAssessmentStudentViewH5PLessonMaterial[] | undefined = [];
    if (studentViewItemsSet) {
      lesson_materials = studentViewItemsSet[studentIdx].lesson_materials;
      if (lesson_materials) {
        lesson_materials[materialIdx] = { ...rowData, outcomes: list };
        /** 同时更改子活动的选项值 **/
        lesson_materials.forEach((lm) => {
          let nestedArr = lm.number?.split("-");
          if (lm.parent_id && nestedArr && nestedArr[0] === rowData.number) {
            lm.outcomes = list;
          }
        });
        lesson_materials = [...lesson_materials];
      }
    }
    const result = Object.values({
      ...studentViewItemsSet,
      [studentIdx]: { ...(studentViewItemsSet && studentViewItemsSet[studentIdx]), lesson_materials },
    }) as EntityUpdateAssessmentH5PStudent[];
    changeAssessmentTableDetail && changeAssessmentTableDetail(result);
  };

  const handleChangeList = (e: React.ChangeEvent<HTMLInputElement>, item: EntityAssessmentDetailContentOutcome) => {
    item.checked = !item.checked;
    if (item.checked) item.none_achieved = false;
    list && setList([...list]);

    emitData();
  };

  return (
    <div className={classes.student_lo}>
      {list?.map((item) => (
        <FormControlLabel
          key={`LO_${studentId}_${item.outcome_id}`}
          label={item.outcome_name}
          disabled={disabled || outcomeDisableList?.some((o) => o === item.outcome_id) || !!rowData.parent_id}
          control={<Checkbox value={item.outcome_id} color="primary" checked={item.checked} onChange={(e) => handleChangeList(e, item)} />}
        />
      ))}
    </div>
  );
}

export function ViewByStudents(props: BasicTableProps) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(true);

  const {
    handleElasticLayerControl,
    studentViewItem,
    index,
    editable,
    isComplete,
    formValue,
    formMethods,
    studentViewItemsSet,
    changeAssessmentTableDetail,
  } = props;

  const StudentHeader: PLField[] = [
    { align: "center", style: { backgroundColor: "#fff" }, value: "idx", text: `${d("No").t("assess_detail_no")}.` },
    {
      align: "center",
      style: { backgroundColor: "#fff" },
      value: "name",
      text: d("Lesson Material Name").t("assess_detail_lesson_material_name"),
    },
    {
      align: "center",
      style: { backgroundColor: "#fff" },
      value: "type",
      text: d("Lesson Material Type").t("assess_detail_lesson_material_type"),
    },
    { align: "center", style: { backgroundColor: "#fff" }, value: "answer", text: d("Answer").t("assess_detail_answer") },
    {
      align: "center",
      style: { backgroundColor: "#fff", minWidth: 100 },
      value: "score",
      text: d("Score / Full Marks").t("assess_detail_score_full_marks"),
    },
    {
      align: "center",
      style: { backgroundColor: "#fff", maxWidth: 400 },
      value: "LO",
      text: d("Learning Outcomes").t("library_label_learning_outcomes"),
    },
  ];

  const handleChangeComment = (commentText: string) => {
    const result = Object.values({
      ...studentViewItemsSet,
      [index]: { ...(studentViewItemsSet && studentViewItemsSet[index]), comment: commentText },
    }) as EntityUpdateAssessmentH5PStudent[];
    changeAssessmentTableDetail && changeAssessmentTableDetail(result);
    handleElasticLayerControl({ openStatus: false, type: "" });
  };

  const handleChangeScore = (score?: number, indexSub?: number) => {
    const lesson_materials =
      studentViewItemsSet &&
      studentViewItemsSet[index].lesson_materials?.map((materials, idx) => {
        return idx === indexSub ? { ...materials, achieved_score: score } : materials;
      });
    const result = Object.values({
      ...studentViewItemsSet,
      [index]: { ...(studentViewItemsSet && studentViewItemsSet[index]), lesson_materials: lesson_materials },
    }) as EntityUpdateAssessmentH5PStudent[];
    changeAssessmentTableDetail && changeAssessmentTableDetail(result);
  };

  const subjectiveActivity = (type?: string) => {
    return ["Essay"].includes(type ?? "");
  };

  const reBytesStr = (str: string, len: number) => {
    let bytesNum = 0;
    let afterCutting = "";
    for (let i = 0, lens = str.length; i < lens; i++) {
      bytesNum += str.charCodeAt(i) > 255 ? 2 : 1;
      if (bytesNum > len) break;
      afterCutting = str.substring(0, i + 1);
    }
    return bytesNum > len ? `${afterCutting} ....` : afterCutting;
  };

  const textEllipsis = (value?: string) => {
    const CharacterCount = 36;
    return value ? reBytesStr(value, CharacterCount) : "";
  };

  // const showCommentsElement = () => {
  //   return studentViewItem.lesson_materials?.some((lesson) => lesson.lesson_material_type !== "");
  // };

  return (
    <TableContainer style={{ marginBottom: "20px", display: studentViewItem.is_hide ? "none" : "block" }}>
      <Box
        className={classes.tableBar}
        onClick={() => {
          setChecked(!checked);
        }}
      >
        <div style={{ color: checked ? "black" : "#666666" }}>
          <AccountCircleIcon />
          <span style={{ padding: "0 18px 0 18px" }}>{studentViewItem.student_name}</span>
          {editable && !isComplete && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleElasticLayerControl({
                  openStatus: true,
                  type: "AddComment",
                  contentText: studentViewItem.comment,
                  handleChangeComment: handleChangeComment,
                  title: d("Add Comments").t("assess_popup_add_comments"),
                });
              }}
              style={{ display: checked ? "block" : "none", color: "rgb(0, 108, 207)" }}
            >
              {d("Click to add comments").t("assess_detail_click_to_add_comments")}
            </span>
          )}
          {isComplete && studentViewItem.comment && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleElasticLayerControl({
                  openStatus: true,
                  type: "DetailView",
                  contentText: studentViewItem.comment,
                  title: d("View Comments").t("assess_popup_view_comments"),
                });
              }}
              style={{ display: checked ? "block" : "none", color: "rgb(0, 108, 207)" }}
            >
              {d("Click to view comments").t("assess_detail_click_to_view_comments")}
            </span>
          )}
        </div>
        {checked ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </Box>
      <Collapse in={checked}>
        <TableContainer style={{ maxHeight: 800 }}>
          <Table className={classes.table} aria-label="simple table" stickyHeader>
            <PLTableHeader fields={StudentHeader} style={{ height: 35 }} />
            <TableBody>
              {studentViewItem?.lesson_materials?.map((row, idx) => (
                <TableRow key={`${row.sub_h5p_id ? row.sub_h5p_id : row.lesson_material_id}${idx}`}>
                  <TableCell component="th" scope="row" align="center" style={{ width: "50px" }}>
                    {row.number}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={row.lesson_material_name as string} placement="top-start">
                      <span>{textEllipsis(row.lesson_material_name)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">{row.lesson_material_type}</TableCell>
                  <TableCell align="center">
                    <p
                      style={{
                        color: "#006CCF",
                        cursor: "pointer",
                        display: subjectiveActivity(row.lesson_material_type) ? "block" : "none",
                      }}
                      onClick={() => {
                        handleElasticLayerControl({
                          openStatus: true,
                          type: "DetailView",
                          contentText: row.answer,
                          title: d("Detailed Answer").t("assess_popup_detailed_answer"),
                        });
                      }}
                    >
                      {d("Click to View").t("assess_detail_click_to_view")}
                    </p>
                  </TableCell>
                  <TableCell align="center">
                    <EditScore
                      score={row.achieved_score}
                      maxScore={row.max_score}
                      handleChangeScore={handleChangeScore}
                      index={idx}
                      editable={editable}
                      isSubjectiveActivity={subjectiveActivity(row.lesson_material_type)}
                      attempted={row.attempted}
                      is_h5p={row.is_h5p}
                      not_applicable_scoring={row.not_applicable_scoring}
                      has_sub_items={row.has_sub_items}
                      isComplete={isComplete}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <LOChecklist
                      rowData={row}
                      studentViewItemsSet={studentViewItemsSet}
                      disabled={!editable}
                      studentId={studentViewItem.student_id}
                      studentIdx={index}
                      materialIdx={idx}
                      formMethods={formMethods}
                      formValue={formValue}
                      changeAssessmentTableDetail={changeAssessmentTableDetail}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </TableContainer>
  );
}
