import { Box, Collapse, makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import React from "react";
import { useDispatch } from "react-redux";
import { EntityAssessmentDetailContent, EntityAssessmentStudentViewH5PItem, EntityUpdateAssessmentH5PStudent } from "../../api/api.auto";
import noDataIconUrl from "../../assets/icons/any_time_no_data.png";
import { d } from "../../locale/LocaleManager";
import { AppDispatch } from "../../reducers";
import { actWarning } from "../../reducers/notify";
import { dynamicTableName, ElasticLayerControl } from "../../types/assessmentTypes";
import ResourcesView from "./ResourcesView";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#F2F5F7 !important",
    },
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
    },
  },
});

interface BasicTableProps extends tableProps {
  handleElasticLayerControl: (elasticLayerControlData: ElasticLayerControl) => void;
  studentViewItem: EntityAssessmentStudentViewH5PItemExtend;
  index: number;
  dimension2Item?: {
    achieved_score?: number | undefined;
    answer?: string | undefined;
    attempted?: boolean | undefined;
    is_h5p?: boolean | undefined;
    lesson_material_id?: string | undefined;
    lesson_material_name?: string | undefined;
    lesson_material_type?: string | undefined;
    max_score?: number | undefined;
    outcome_names?: string[];
    student: never[];
    is_hide?: boolean;
    number?: string;
    sub_h5p_id?: string;
    h5p_id?: string;
  };
  studentViewItemsSet?: EntityAssessmentStudentViewH5PItem[];
}

interface EditScoreProps {
  score?: number;
  handleChangeScore: (score?: number, indexSub?: number, student_id?: string) => void;
  index: number;
  editable?: boolean;
  isSubjectiveActivity: boolean;
  maxScore?: number;
  attempted?: boolean;
  isComplete?: boolean;
  is_h5p?: boolean;
  student_id?: string;
  not_applicable_scoring?: boolean;
  has_sub_items?: boolean;
}

function EditScore(props: EditScoreProps) {
  const {
    score,
    handleChangeScore,
    index,
    editable,
    isSubjectiveActivity,
    maxScore,
    attempted,
    isComplete,
    is_h5p,
    student_id,
    not_applicable_scoring,
    has_sub_items,
  } = props;
  const [scoreNum, setScoreNum] = React.useState<number | string | undefined>(score);
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  return (
    <div className={classes.scoreEditBox}>
      {has_sub_items ? (
        "Attempted"
      ) : attempted ? (
        <>
          {editable && !isComplete && isSubjectiveActivity ? (
            <>
              <TextField
                style={{ width: "59px", transform: "scale(0.8)" }}
                value={scoreNum}
                id="standard-size-small"
                size="small"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = (e.target.value as unknown) as number;
                  if (value! > maxScore!) {
                    dispatch(actWarning(d("The score you entered cannot exceed the maximum score.").t("assess_msg_exceed_maximum")));
                  } else if (Number(value) + "" !== NaN + "") {
                    const computerValue = String(value).replace(/^(.*\..{1}).*$/, "$1");
                    handleChangeScore(Number(computerValue), index, student_id);
                    setScoreNum(computerValue);
                  }
                }}
              />{" "}
              / {maxScore}
            </>
          ) : (
            <>
              {scoreNum} / {maxScore}
            </>
          )}
        </>
      ) : is_h5p && not_applicable_scoring ? (
        d("Not Applicable").t("assessment_not_applicable")
      ) : (
        ""
      )}
    </div>
  );
}

function BasicTable(props: BasicTableProps) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);

  const {
    handleElasticLayerControl,
    studentViewItem,
    index,
    editable,
    isComplete,
    tableCellData,
    tableType,
    studentViewItemsSet,
    changeAssessmentTableDetail,
  } = props;

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

  const showCommentsElement = () => {
    return studentViewItem.lesson_materials?.some((lesson) => lesson.lesson_material_type !== "");
  };

  return (
    <TableContainer component={Paper} style={{ marginBottom: "20px", display: studentViewItem.is_hide ? "none" : "block" }}>
      <Box
        className={classes.tableBar}
        style={{ backgroundColor: checked ? "#F2F5F7" : "white" }}
        onClick={() => {
          setChecked(!checked);
        }}
      >
        <div style={{ color: checked ? "black" : "#666666" }}>
          <AccountCircleIcon />
          <span style={{ padding: "0 18px 0 18px" }}>{studentViewItem.student_name}</span>
          {editable && !isComplete && showCommentsElement() && (
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
          {isComplete && showCommentsElement() && studentViewItem.comment && (
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
        {checked && <ArrowDropUpIcon />}
        {!checked && <ArrowDropDownIcon />}
      </Box>
      <Collapse in={checked}>
        <Paper elevation={4}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                {tableCellData.map((cell, index) => (
                  <TableCell align="center" key={index}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {studentViewItem?.lesson_materials?.map((row, index) => (
                <TableRow key={`${row.sub_h5p_id ? row.sub_h5p_id : row.lesson_material_id}${index}`}>
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
                      index={index}
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
                    {tableType === "study" && (
                      <>
                        {row.has_sub_items
                          ? "100%"
                          : row?.max_score! === 0
                          ? ""
                          : Math.ceil((row?.achieved_score! / row?.max_score!) * 100) + "%"}
                      </>
                    )}
                    {tableType === "live" && (
                      <ul className={classes.outcomesBox}>{row?.outcome_names?.map((name) => name && <li key={name}>{name}</li>)}</ul>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Collapse>
    </TableContainer>
  );
}

function BasicTable2(props: BasicTableProps) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);

  const {
    handleElasticLayerControl,
    index,
    editable,
    isComplete,
    tableCellData,
    dimension2Item,
    studentViewItemsSet,
    changeAssessmentTableDetail,
  } = props;

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
    <TableContainer component={Paper} style={{ marginBottom: "20px", display: dimension2Item?.is_hide ? "none" : "block" }}>
      <Box
        className={classes.tableBar}
        style={{ backgroundColor: checked ? "#F2F5F7" : "white" }}
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
        {checked && <ArrowDropUpIcon />}
        {!checked && <ArrowDropDownIcon />}
      </Box>
      <Collapse in={checked}>
        <Paper elevation={4}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                {tableCellData.map((cell, index) => (
                  <TableCell align="center" key={index}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
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
                      isComplete={isComplete}
                    />
                  </TableCell>
                  {!index && (
                    <TableCell
                      align="center"
                      rowSpan={dimension2Item?.student.length}
                      style={{ borderLeft: "1px solid rgba(224, 224, 224, 1)", width: "260px" }}
                    >
                      <ul className={classes.outcomesBox} style={{ margin: "0 auto" }}>
                        {row?.outcome_names?.map((name: string) => name && <li>{name}</li>)}
                      </ul>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Collapse>
    </TableContainer>
  );
}

interface EntityAssessmentStudentViewH5PItemExtend extends EntityAssessmentStudentViewH5PItem {
  is_hide?: boolean;
}

interface tableProps {
  studentViewItems?: EntityAssessmentStudentViewH5PItemExtend[];
  editable?: boolean;
  isComplete: boolean;
  tableCellData: string[];
  name: dynamicTableName;
  tableType: "live" | "study";
  autocompleteLabel: number;
  lesson_materials: EntityAssessmentDetailContent[] | undefined;
  changeAssessmentTableDetail?: (value?: EntityUpdateAssessmentH5PStudent[]) => void;
}

export function DynamicTable(props: tableProps) {
  const {
    studentViewItems,
    editable,
    isComplete,
    tableCellData,
    name,
    tableType,
    autocompleteLabel,
    lesson_materials,
    changeAssessmentTableDetail,
  } = props;
  const [elasticLayerControlData, setElasticLayerControlData] = React.useState<ElasticLayerControl>({
    openStatus: false,
    type: "",
  });
  const handleElasticLayerControl = (elasticLayerControlData: ElasticLayerControl) => {
    setElasticLayerControlData(elasticLayerControlData);
  };
  const classes = useStyles();

  const getLessonMaterialsType = (id?: string, t?: string) => {
    let type = "";
    studentViewItems?.forEach((item) => {
      item.lesson_materials?.forEach((lesson, index) => {
        if (t === "p" && lesson.lesson_material_id === id && lesson.lesson_material_type) type = lesson.lesson_material_type as string;
        if (t === "c" && lesson.sub_h5p_id === id && lesson.lesson_material_type) type = lesson.lesson_material_type as string;
      });
    });
    return type;
  };

  const dimension2 = studentViewItems?.length
    ? studentViewItems[0].lesson_materials?.map((material) => {
        const id = material.sub_h5p_id ? material.sub_h5p_id : material.lesson_material_id;
        const type = material.sub_h5p_id ? "c" : "p";
        return { ...material, student: [], lesson_material_type: getLessonMaterialsType(id, type) };
      })
    : [];
  studentViewItems?.forEach((item) => {
    item.lesson_materials?.forEach((lesson, index) => {
      if (dimension2) {
        dimension2[index].student.push({ student_id: item.student_id, student_name: item.student_name, ...lesson } as never);
      }
    });
  });

  return (
    <>
      {autocompleteLabel === 1 &&
        studentViewItems?.map((item: EntityAssessmentStudentViewH5PItemExtend, index: number) => {
          return (
            <BasicTable
              key={item.student_id}
              handleElasticLayerControl={handleElasticLayerControl}
              studentViewItem={item}
              index={index}
              editable={editable}
              isComplete={isComplete}
              tableCellData={tableCellData}
              name={name}
              tableType={tableType}
              autocompleteLabel={autocompleteLabel}
              studentViewItemsSet={studentViewItems}
              lesson_materials={lesson_materials}
              changeAssessmentTableDetail={changeAssessmentTableDetail}
            />
          );
        })}
      {autocompleteLabel === 2 &&
        dimension2?.map((item, index: number) => {
          return (
            <BasicTable2
              key={item.sub_h5p_id ? item.sub_h5p_id : item.lesson_material_id}
              handleElasticLayerControl={handleElasticLayerControl}
              studentViewItem={[] as EntityAssessmentStudentViewH5PItem}
              index={index}
              editable={editable}
              isComplete={isComplete}
              tableCellData={tableCellData}
              name={name}
              tableType={tableType}
              autocompleteLabel={autocompleteLabel}
              studentViewItemsSet={studentViewItems}
              changeAssessmentTableDetail={changeAssessmentTableDetail}
              lesson_materials={lesson_materials}
              dimension2Item={item}
            />
          );
        })}
      {(!studentViewItems || !studentViewItems.length) && (
        <div className={classes.emptyBox}>
          <img alt="empty" src={noDataIconUrl} />
          <span style={{ marginTop: "10px" }}>{d("No achievement data is available.").t("report_msg_no_data")}</span>
        </div>
      )}
      <ResourcesView elasticLayerControlData={elasticLayerControlData} handleElasticLayerControl={handleElasticLayerControl} />
    </>
  );
}
