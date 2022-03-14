import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { ModelAssessment } from "@models/ModelAssessment";
import { cloneDeep } from "lodash";
import React, { ChangeEvent, Fragment, useMemo, useState } from "react";
import { AchievedTooltips } from "../../components/DynamicTable";
import { PLField, PLTableHeader } from "../../components/PLTable";
import { d } from "../../locale/LocaleManager";
import { DetailAssessmentResult, DetailAssessmentResultStudent } from "../ListAssessment/types";
import { EditScore } from "./EditScore";
import { Dimension } from "./MultiSelect";
import { ResourceView, showAudioRecorder, useResourceView } from "./ResourceView";
import {
  FileTypes,
  MaterialViewItemResultOutcomeProps,
  MaterialViewItemStudentProps,
  OutcomeStatus,
  StudentParticipate,
  StudentViewItemsProps,
  SubDimensionOptions
} from "./type";
const useStyles = makeStyles({
  tableBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    cursor: "pointer",
    backgroundColor: "#F2F5F7",
    height: 48,
    marginTop: 20,
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
  table: {
    minWidth: 650,
    marginTop: 20,
  },
  assessActionline: {
    borderLeft: "1px solid #ebebeb",
  },
  disabled: {
    "& $partially_checked": {
      backgroundColor: "#ababab",
      boxShadow: "0 0 2px #ababab",
    },
  },
});

export interface MaterialViewProps {
  studentViewItems?: StudentViewItemsProps[];
  dimension: Dimension;
  subDimension: SubDimensionOptions[];
  contents: DetailAssessmentResult["contents"];
  students: DetailAssessmentResult["students"];
  editable: boolean;
  roomId?: string;
  onChangeMaterialAllAchieved: (checked: boolean, content_id?: string, outcome_id?: string) => void;
  onChangeMaterialNoneAchieved: (checked: boolean, content_id?: string, outcome_id?: string) => void;
  onChangeMatarialStudentStatus: (checked: boolean, student_id?: string, content_id?: string, outcome_id?: string) => void;
  onChangeComputedStudentViewItems: (studentViewItems?: StudentViewItemsProps[]) => void;
}
export function MaterialView(props: MaterialViewProps) {
  const css = useStyles();
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
    { align: "center", width: "25%", value: "Learning_Outcomes", text: d("Student Name").t("assessment_student_name") },
    { align: "center", width: "25%", value: "Answer", text: d("Answer").t("assess_detail_answer") },
    { align: "center", width: "25%", value: "Score_FullMarks", text: d("Score / Full Marks").t("assess_detail_score_full_marks") },
    { align: "center", width: "25%", value: "Percentage", text: d("Percentage").t("assess_detail_percentage") },
  ];
  const [resourceType, setResourceType] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [room, setRoom] = useState<string | undefined>("");
  const [h5pId, setH5pId] = useState<string | undefined>("");
  const [userId, setUserId] = useState<string | undefined>("");
  const { resourceViewActive, openResourceView, closeResourceView } = useResourceView();
  const {
    studentViewItems,
    contents,
    students,
    editable,
    subDimension,
    roomId,
    onChangeMaterialAllAchieved,
    onChangeMaterialNoneAchieved,
    onChangeMatarialStudentStatus,
    onChangeComputedStudentViewItems,
  } = props;
  const subDimensionIds = useMemo(() => {
    return subDimension.map((item) => item.id);
  }, [subDimension]);
  const isSelectAll = subDimension.findIndex((item) => item.id === "all") >= 0 ? true : false;
  const attendanceList = useMemo(() => {
    return students?.filter((student: DetailAssessmentResultStudent) => student.status === "Participate");
  }, [students]);
  const materialViewItems = useMemo(() => {
    return ModelAssessment.getMaterialViewItems(contents, students, studentViewItems);
  }, [contents, studentViewItems, students]);
  const initCheckArr = useMemo(() => {
    return materialViewItems.map((item) => true);
  }, [materialViewItems]);
  const [checkedArr, setCheckedArr] = useState<boolean[]>(initCheckArr);
  const handleChangeAllAchieved = (event: ChangeEvent<HTMLInputElement>, content_id?: string, outcome_id?: string) => {
    onChangeMaterialAllAchieved(event.target.checked, content_id, outcome_id);
  };
  const handleChangeNoneAchieved = (event: ChangeEvent<HTMLInputElement>, content_id?: string, outcome_id?: string) => {
    onChangeMaterialNoneAchieved(event.target.checked, content_id, outcome_id);
  };
  const handleChangeStudentStauts = (
    event: ChangeEvent<HTMLInputElement>,
    student_id?: string,
    content_id?: string,
    outcome_id?: string
  ) => {
    onChangeMatarialStudentStatus(event.target.checked, student_id, content_id, outcome_id);
  };
  const handleClickView = (answer: string) => {
    openResourceView();
    setResourceType("Essay");
    setAnswer(answer);
  };
  const handleClickAudioRecorder = (roomId?: string, h5pId?: string, userId?: string) => {
    openResourceView();
    setResourceType("AudioRecorder");
    setRoom(roomId);
    setH5pId(h5pId);
    setUserId(userId);
  };
  const handleChangeScore = (score?: number, studentId?: string, contentId?: string) => {
    const _studentViewItems = studentViewItems?.map((sItem) => {
      if (sItem.student_id === studentId) {
        return {
          ...sItem,
          result: sItem.result?.map((rItem) => {
            if (rItem.content_id === contentId) {
              return {
                ...rItem,
                score,
              };
            } else {
              return { ...rItem };
            }
          }),
        };
      } else {
        return { ...sItem };
      }
    });
    onChangeComputedStudentViewItems(_studentViewItems);
  };
  const toggleCheck = (index: number) => {
    const arr = cloneDeep(checkedArr);
    arr[index] = !checkedArr[index];
    setCheckedArr([...arr]);
  };
  return (
    <>
      {materialViewItems &&
        materialViewItems.map(
          (item, index) =>
            (isSelectAll ? true : subDimensionIds.indexOf(item.content_id!) >= 0 || subDimensionIds.indexOf(item.parent_id!) >= 0) && (
              <Fragment key={item.content_id}>
                <TableContainer style={{ marginBottom: "20px" }}>
                  <Box className={css.tableBar} onClick={(e) => toggleCheck(index)}>
                    <div style={{ color: checkedArr[index] ? "black" : "#666666" }}>
                      <span>{`${item.number}.${item.content_name}`}</span>
                      <span style={{ padding: "0 18px 0 18px", color: "gray" }}>
                        {item.content_subtype ? `(${item.content_subtype})` : ""}
                      </span>
                    </div>
                    {checkedArr[index] ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </Box>
                  <Collapse in={checkedArr[index]}>
                    <>
                      {item.outcomes && item.outcomes.length
                        ? !item.parent_id && (
                            <Table className={css.table}>
                              <PLTableHeader fields={LearningOutcomesHeader} style={{ backgroundColor: "#F7F7F2", height: 35 }} />
                              <TableBody>
                                {item.outcomes.map((outcome: MaterialViewItemResultOutcomeProps) => (
                                  <TableRow key={outcome.outcome_id}>
                                    <TableCell align="center">{outcome.outcome_name}</TableCell>
                                    <TableCell align="center">{outcome.assumed ? d("Yes").t("assess_label_yes") : ""}</TableCell>
                                    <TableCell align="center">
                                      <Box display="flex" alignItems="center" p={2} pb={0}>
                                        <Box width={180} fontSize={14} style={{ flex: "none", textAlign: "left" }}>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                checked={
                                                  outcome.status === OutcomeStatus.NotCovered
                                                    ? false
                                                    : outcome.attendance_ids && outcome.attendance_ids?.length === attendanceList?.length
                                                }
                                                onChange={(e) => handleChangeAllAchieved(e, item.content_id, outcome.outcome_id)}
                                                name="award"
                                                color="primary"
                                              />
                                            }
                                            label={d("All Achieved").t("assess_option_all_achieved")}
                                            disabled={item.parent_id ? true : !editable}
                                          />
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                checked={outcome.status === OutcomeStatus.NotAchieved}
                                                color="primary"
                                                onChange={(e) => handleChangeNoneAchieved(e, item.content_id, outcome.outcome_id)}
                                              />
                                            }
                                            label={d("None Achieved").t("assess_option_none_achieved")}
                                            disabled={item.parent_id ? true : !editable}
                                          />
                                        </Box>
                                        <Box px={3} className={css.assessActionline}>
                                          {attendanceList?.map((student: DetailAssessmentResultStudent) => (
                                            <FormControlLabel
                                              key={student.student_id}
                                              control={
                                                <Checkbox
                                                  onChange={(e) =>
                                                    handleChangeStudentStauts(e, student.student_id, item.content_id, outcome.outcome_id)
                                                  }
                                                  color="primary"
                                                  checked={
                                                    outcome.attendance_ids && outcome.attendance_ids?.indexOf(student.student_id!) >= 0
                                                  }
                                                />
                                              }
                                              label={student.student_name}
                                              disabled={item.parent_id ? true : !editable}
                                              className={!editable ? css.disabled : ""}
                                            />
                                          ))}
                                        </Box>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )
                        : ""}
                      <div style={{ marginTop: 24 }}>
                        <Table className={css.table}>
                          <PLTableHeader fields={MaterialDefaultHeader} style={{ backgroundColor: "#F7F2F3", height: 35 }} />
                          <TableBody>
                            {item.students?.filter(student => student.status === StudentParticipate.Participate)?.map((sItem: MaterialViewItemStudentProps) => (
                              <TableRow key={sItem.student_id}>
                                <TableCell align="center">{sItem.student_name ? sItem.student_name : "unknow"}</TableCell>
                                <TableCell align="center">
                                  {item.content_subtype === "Essay" && (
                                    <span
                                      style={{ color: "#006CCF", cursor: "pointer" }}
                                      onClick={(e) => handleClickView(sItem.answer ?? "")}
                                    >
                                      {d("Click to View").t("assess_detail_click_to_view")}
                                    </span>
                                  )}
                                  {showAudioRecorder(item.content_subtype) && (
                                    <span
                                      style={{ color: "#006CCF", cursor: "pointer" }}
                                      onClick={(e) => handleClickAudioRecorder(roomId, item.h5p_id, sItem.student_id)}
                                    >
                                      {d("Click to View").t("assess_detail_click_to_view")}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <EditScore
                                    fileType={item.file_type}
                                    score={sItem.score}
                                    editable={editable}
                                    maxScore={item.max_score}
                                    attempted={sItem.attempted}
                                    studentId={sItem.student_id}
                                    contentId={item.content_id}
                                    isSubjectiveActivity={true}
                                    subType={item.content_subtype}
                                    onChangeScore={handleChangeScore}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  {sItem.attempted
                                    ? item.parent_id === "" && item.file_type === FileTypes.HasChildContainer
                                      ? "100%"
                                      : item?.max_score! === 0
                                      ? ""
                                      : Math.ceil((sItem?.score! / item?.max_score!) * 100) + "%"
                                    : ""}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  </Collapse>
                </TableContainer>
              </Fragment>
            )
        )}
      <ResourceView
        open={resourceViewActive}
        resourceType={resourceType}
        answer={answer}
        onClose={closeResourceView}
        roomId={room}
        userId={userId}
        h5pId={h5pId}
      />
    </>
  );
}
