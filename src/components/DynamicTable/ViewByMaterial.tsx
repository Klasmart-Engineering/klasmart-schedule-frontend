import { Box, Collapse, makeStyles } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import React from "react";
import { EntityAssessmentDetailContentOutcome, EntityUpdateAssessmentH5PStudent } from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
import { EditScore } from "./EditScore";
import { BasicTableProps } from "./types";
import { PLField, PLTableHeader } from "../PLTable";
import { AchievedTooltips } from "./AchievedTooltips";
import ViewByMaterialActions from "./ViewByMaterialActions";

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
  emptyBox: {
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    "& img": {
      marginTop: "15%",
    },
  },
  scoreEditBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  outcomesBox: {
    maxWidth: "260px",
    "& li": {
      textAlign: "left",
      marginTop: "10px",
      wordBreak: "break-all",
    },
  },
});

export function ViewByMaterial(props: BasicTableProps) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(true);

  const {
    handleElasticLayerControl,
    index,
    editable,
    isComplete,
    dimension2Item,
    studentViewItemsSet,
    changeAssessmentTableDetail,
    formValue,
    formMethods,
  } = props;

  /** 表头数据 **/
  const LearningOutcomesHeader: PLField[] = [
    { align: "center", width: 150, value: "Learning_Outcomes", text: d("Learning Outcomes").t("library_label_learning_outcomes") },
    { align: "center", width: 120, value: "Assumed", text: d("Assumed").t("assess_label_assumed") },
    {
      align: "center",
      value: "Assessing_Actions",
      text: (
        <div className="flex_align_center flex_justify_center">
          <span>{d("Assessing Actions").t("assess_option_assessing_actions")}</span>
          <AchievedTooltips />
        </div>
      ),
    },
  ];
  const MaterialDefaultHeader: PLField[] = [
    { align: "center", value: "Learning_Outcomes", text: "Student Name" },
    { align: "center", value: "Answer", text: d("Answer").t("assess_detail_answer") },
    { align: "center", value: "Score_FullMarks", text: d("Score / Full Marks").t("assess_detail_score_full_marks") },
    { align: "center", value: "Percentage", text: d("Percentage").t("assess_detail_percentage") },
  ];

  const handleChangeScore = (score?: number, indexSub?: number, student_id?: string) => {
    const studentIndex = (studentViewItemsSet && studentViewItemsSet.findIndex((v) => v.student_id === student_id)) ?? 0;
    const goalStu = studentViewItemsSet && studentViewItemsSet.filter((v) => v.student_id === student_id);
    const lesson_materials =
      goalStu &&
      goalStu[0].lesson_materials?.map((materials, idx) => {
        return idx === index ? { ...materials, achieved_score: score, student_id: student_id } : materials;
      });
    const result = Object.values({
      ...studentViewItemsSet,
      [studentIndex]: { ...(studentViewItemsSet && studentViewItemsSet[studentIndex]), lesson_materials: lesson_materials },
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

  return (
    <TableContainer style={{ marginBottom: "20px", display: dimension2Item?.is_hide ? "none" : "block" }}>
      <Box
        className={classes.tableBar}
        onClick={() => {
          setChecked(!checked);
        }}
      >
        <div style={{ color: checked ? "black" : "#666666" }}>
          <Tooltip title={dimension2Item?.lesson_material_name as string} placement="top-start">
            <span>{`${dimension2Item?.number}. ${textEllipsis(dimension2Item?.lesson_material_name)}`}</span>
          </Tooltip>
          <span style={{ padding: "0 18px 0 18px", color: "gray" }}>
            {dimension2Item?.lesson_material_type ? `(${dimension2Item?.lesson_material_type})` : ""}
          </span>
        </div>
        {checked ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </Box>
      <Collapse in={checked}>
        {!dimension2Item?.outcomes ? (
          ""
        ) : (
          <div style={{ marginTop: 27 }}>
            <Table className={classes.table} aria-label="simple table">
              <PLTableHeader fields={LearningOutcomesHeader} style={{ backgroundColor: "#F7F7F2", height: 35 }} />
              <TableBody>
                {dimension2Item?.outcomes?.map((outcome: EntityAssessmentDetailContentOutcome, index) => (
                  <TableRow key={outcome.outcome_id}>
                    <TableCell align="center">{outcome.outcome_name}</TableCell>
                    <TableCell align="center">{outcome.assumed ? d("Yes").t("assess_label_yes") : ""}</TableCell>
                    <TableCell align="center">
                      <ViewByMaterialActions
                        studentViewItemsSet={studentViewItemsSet}
                        dimension2Item={dimension2Item}
                        outcome={outcome}
                        formValue={formValue}
                        formMethods={formMethods}
                        disabled={!editable || !!dimension2Item.parent_id}
                        changeAssessmentTableDetail={changeAssessmentTableDetail}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <Table className={classes.table} aria-label="simple table">
            <PLTableHeader fields={MaterialDefaultHeader} style={{ backgroundColor: "#F7F2F3", height: 35 }} />
            <TableBody>
              {dimension2Item?.student?.map((row: any, index) => (
                <TableRow key={row.student_id}>
                  <TableCell align="center">{row.student_name}</TableCell>
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
                      index={index}
                      editable={editable}
                      isSubjectiveActivity={subjectiveActivity(row.lesson_material_type)}
                      attempted={row.attempted}
                      is_h5p={row.is_h5p}
                      student_id={row.student_id}
                      not_applicable_scoring={row.not_applicable_scoring}
                      has_sub_items={row.has_sub_items}
                      isComplete={isComplete}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {row.has_sub_items
                      ? "100%"
                      : row?.max_score! === 0
                      ? ""
                      : Math.ceil((row?.achieved_score! / row?.max_score!) * 100) + "%"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Collapse>
    </TableContainer>
  );
}
