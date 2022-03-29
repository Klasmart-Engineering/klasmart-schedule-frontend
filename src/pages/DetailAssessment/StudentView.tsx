import { AssessmentTypeValues } from "@components/AssessmentType";
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
  TableRow,
  Tooltip
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { DetailAssessmentResult } from "@pages/ListAssessment/types";
import { cloneDeep } from "lodash";
import React, { ChangeEvent, Fragment, useMemo, useState } from "react";
import { PLField, PLTableHeader } from "../../components/PLTable";
import { d } from "../../locale/LocaleManager";
import { EditScore } from "./EditScore";
import { Dimension } from "./MultiSelect";
import { ResourceView, showAudioRecorder, useResourceView } from "./ResourceView";
import { FileTypes, OutcomeStatus, StudentParticipate, StudentViewItemsProps, SubDimensionOptions } from "./type";
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
  table: {
    minWidth: 650,
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

const stopPropagation =
  <T extends React.MouseEvent, R = void>(handler?: (arg: T) => R) =>
  (e: T) => {
    e.stopPropagation();
    if (handler) return handler(e);
  };

export interface StudentViewProps {
  dimension: Dimension;
  subDimension: SubDimensionOptions[];
  editable: boolean;
  onChangeComputedStudentViewItems: (studentViewItems?: StudentViewItemsProps[]) => void;
  studentViewItems?: StudentViewItemsProps[];
  roomId?: string;
  assessment_type?: AssessmentTypeValues;
  is_anyone_attempted?: DetailAssessmentResult["is_anyone_attempted"];
}
export function StudentView(props: StudentViewProps) {
  const css = useStyles();
  const { studentViewItems, editable, subDimension, roomId, assessment_type, is_anyone_attempted, onChangeComputedStudentViewItems } = props;
  const isReview = assessment_type === AssessmentTypeValues.review;
  const { resourceViewActive, openResourceView, closeResourceView } = useResourceView();
  const [resourceType, setResourceType] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [studentId, setStudentId] = useState<string | undefined>("");
  const [room, setRoom] = useState<string | undefined>("");
  const [h5pId, setH5pId] = useState<string | undefined>("");
  const [userId, setUserId] = useState<string | undefined>("");
  const [h5pSubId, setH5pSubId] = useState<string | undefined>("");
  const subDimensionIds = useMemo(() => {
    return subDimension.length ? subDimension.map((item) => item.id) : [];
  }, [subDimension]);
  const initCheckArr = useMemo(() => {
    return subDimension.map((item) => true) || [];
  }, [subDimension]);
  const [checkedArr, setCheckedArr] = useState<boolean[]>(initCheckArr);
  const isSelectAll = subDimension.findIndex((item) => item.id === "all") >= 0 ? true : false;
  const StudentHeader = () => {
    let headers: PLField[] = [
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
      { align: "center", style: { backgroundColor: "#fff", minWidth: 150 }, value: "answer", text: d("Answer").t("assess_detail_answer") },
      {
        align: "center",
        style: { backgroundColor: "#fff", minWidth: 100 },
        value: "score",
        text: d("Score / Full Marks").t("assess_detail_score_full_marks"),
      },
      // {
      //   align: "center",
      //   style: { backgroundColor: "#fff", maxWidth: 400 },
      //   value: "LO",
      //   text: d("Learning Outcomes").t("library_label_learning_outcomes"),
      // },
    ];
    if (isReview) {
      headers.push({
        align: "center",
        style: { backgroundColor: "#fff", maxWidth: 400 },
        value: "percentage",
        text: d("Percentage").t("assess_detail_percentage"),
      });
    } else {
      headers.push({
        align: "center",
        style: { backgroundColor: "#fff", maxWidth: 400 },
        value: "LO",
        text: d("Learning Outcomes").t("library_label_learning_outcomes"),
      });
    }
    return headers;
  };

  const handleChangeLoStatus = (event: ChangeEvent<HTMLInputElement>, sId?: string, rId?: string, oId?: string) => {
    const _studentViewItems = studentViewItems?.map((sItem) => {
      if (sItem.student_id === sId) {
        return {
          ...sItem,
          results: sItem.results?.map((rItem) => {
            if (rItem.content_id === rId || rItem.parent_id === rId) {
              return {
                ...rItem,
                outcomes: rItem.outcomes?.map((oItem) => {
                  if (oItem.outcome_id === oId) {
                    return {
                      ...oItem,
                      status: event.target.checked ? OutcomeStatus.Achieved : OutcomeStatus.Unknown,
                    };
                  } else {
                    return { ...oItem };
                  }
                }),
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
  const handleClickView = (answer: string) => {
    openResourceView();
    setResourceType("Essay");
    setAnswer(answer);
  };
  const handleClickAudioRecorder = (roomId?: string, h5pId?: string, h5pSubId?: string, userId?: string, content_subtype?: string) => {
    openResourceView();
    setResourceType(content_subtype as string);
    setRoom(roomId);
    setH5pId(h5pId);
    setUserId(userId);
    setH5pSubId(h5pSubId);
  };
  const handleChangeScore = (score?: number, studentId?: string, contentId?: string) => {
    const _studentViewItems = studentViewItems?.map((sItem) => {
      if (sItem.student_id === studentId) {
        return {
          ...sItem,
          results: sItem.results?.map((rItem) => {
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
  const handleClickViewStudentComment = (comment: string) => {
    openResourceView();
    setResourceType("ViewComment");
    setComment(comment);
  };
  const handleOpenAddStudentComment = (comment: string, sId?: string) => {
    openResourceView();
    setResourceType("EditComment");
    setComment(comment);
    setStudentId(sId);
  };
  const handleChangeComment = (studentId?: string, comment?: string) => {
    const _studentViewItems = studentViewItems?.map((item) => {
      if (item.student_id === studentId) {
        return {
          ...item,
          reviewer_comment: comment,
        };
      } else {
        return { ...item };
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
      <TableContainer style={{ marginBottom: "20px" }}>
        {studentViewItems
          ?.filter((student) => student.status === StudentParticipate.Participate)
          .map(
            (sitem, index) =>
              (isSelectAll ? true : subDimensionIds.indexOf(sitem.student_id!) >= 0) && (
                <Fragment key={sitem.student_id}>
                  <Box className={css.tableBar} onClick={(e) => toggleCheck(index)}>
                    <div style={{ color: checkedArr[index] ? "black" : "#666666" }}>
                      <AccountCircleIcon />
                      <span style={{ padding: "0 18px 0 18px" }}>{sitem.student_name ? sitem.student_name : "unknow"}</span>
                      {editable && is_anyone_attempted && (
                        <span
                          onClick={stopPropagation((e) => handleOpenAddStudentComment(sitem.reviewer_comment ?? "", sitem.student_id))}
                          style={{
                            display: (checkedArr.length ? checkedArr[index] : initCheckArr[index]) ? "block" : "none",
                            color: "rgb(0, 108, 207)",
                          }}
                        >
                          {d("Click to add comments").t("assess_detail_click_to_add_comments")}
                        </span>
                      )}
                      {!editable && sitem?.reviewer_comment && (
                        <span
                          onClick={stopPropagation((e) => handleClickViewStudentComment(sitem.reviewer_comment ?? ""))}
                          style={{
                            display: (checkedArr.length ? checkedArr[index] : initCheckArr[index]) ? "block" : "none",
                            color: "rgb(0, 108, 207)",
                          }}
                        >
                          {d("Click to view comments").t("assess_detail_click_to_view_comments")}
                        </span>
                      )}
                    </div>
                    {checkedArr[index] ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </Box>
                  <Collapse in={checkedArr[index] === undefined ? true : checkedArr[index]}>
                    <TableContainer style={{ maxHeight: 800 }}>
                      <Table className={css.table} aria-label="simple table" stickyHeader>
                        <PLTableHeader fields={StudentHeader()} style={{ height: 35 }} />
                        <TableBody>
                          {sitem.results?.map(
                            (ritem) =>
                              (ritem.content_type === "LessonMaterial" || ritem.content_type === "Unknown") && (
                                <TableRow key={ritem.content_id}>
                                  <TableCell align="center" style={{ width: "50px" }}>
                                    {ritem.number}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Tooltip title={(ritem.content_name as string) ?? ""} placement="top-start">
                                      <span>{textEllipsis(ritem.content_name)}</span>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell align="center">
                                    {ritem.content_subtype}
                                    {/* todo 加字段 */}
                                  </TableCell>
                                  <TableCell align="center">
                                    {ritem.attempted && ritem.content_subtype === "Essay" && (
                                      <span
                                        style={{ color: "#006CCF", cursor: "pointer" }}
                                        onClick={(e) => handleClickView(ritem.answer ?? "")}
                                      >
                                        {d("Click to View").t("assess_detail_click_to_view")}
                                      </span>
                                    )}
                                    {ritem.file_type !== FileTypes.HasChildContainer &&
                                      ritem.attempted &&
                                      showAudioRecorder(ritem.content_subtype) && (
                                        <span
                                          style={{ color: "#006CCF", cursor: "pointer" }}
                                          onClick={(e) =>
                                            handleClickAudioRecorder(
                                              roomId,
                                              ritem.h5p_id,
                                              ritem.h5p_sub_id,
                                              sitem.student_id,
                                              ritem.content_subtype
                                            )
                                          }
                                        >
                                          {d("Click to View").t("assess_detail_click_to_view")}
                                        </span>
                                      )}
                                  </TableCell>
                                  <TableCell align="center">
                                    <EditScore
                                      fileType={ritem.file_type}
                                      score={ritem.score}
                                      editable={editable}
                                      maxScore={ritem.max_score}
                                      attempted={ritem.attempted}
                                      studentId={sitem.student_id}
                                      contentId={ritem.content_id}
                                      isSubjectiveActivity={true}
                                      subType={ritem.content_subtype}
                                      onChangeScore={handleChangeScore}
                                    />
                                  </TableCell>
                                  {!isReview && (
                                    <TableCell align="center">
                                      <div className={css.student_lo}>
                                        {ritem.outcomes?.map((outcome) => (
                                          <FormControlLabel
                                            key={outcome.outcome_id}
                                            label={outcome.outcome_name}
                                            disabled={ritem.parent_id ? true : !editable || outcome.status === OutcomeStatus.NotCovered}
                                            control={
                                              <Checkbox
                                                value={outcome.outcome_id}
                                                color="primary"
                                                checked={outcome.status === OutcomeStatus.Achieved}
                                                onChange={(e) =>
                                                  handleChangeLoStatus(e, sitem.student_id, ritem.content_id, outcome.outcome_id)
                                                }
                                              />
                                            }
                                          />
                                        ))}
                                      </div>
                                    </TableCell>
                                  )}
                                  {isReview && (
                                    <TableCell align="center">
                                      {ritem.attempted
                                        ? ritem.parent_id === "" && ritem.file_type === FileTypes.HasChildContainer
                                          ? "100%"
                                          : ritem?.max_score! === 0
                                          ? ""
                                          : Math.ceil((ritem?.score! / ritem?.max_score!) * 100) + "%"
                                        : ""}
                                    </TableCell>
                                  )}
                                </TableRow>
                              )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Collapse>
                </Fragment>
              )
          )}
      </TableContainer>
      <ResourceView
        open={resourceViewActive}
        resourceType={resourceType}
        answer={answer}
        comment={comment}
        studentId={studentId}
        onChangeComment={handleChangeComment}
        onClose={closeResourceView}
        roomId={room}
        userId={userId}
        h5pId={h5pId}
        h5pSubId={h5pSubId}
      />
    </>
  );
}
