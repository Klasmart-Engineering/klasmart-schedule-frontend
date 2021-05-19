import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Collapse } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import Input from "@material-ui/core/Input";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CheckIcon from "@material-ui/icons/Check";
import { ElasticLayerControl } from "./types";
import { EntityH5PAssessmentStudentViewItem } from "../../api/api.auto";
import { Controller, UseFormMethods } from "react-hook-form";
import { UpdateAssessmentRequestDataOmitAction, UpdateStudyAssessmentDataOmitAction } from "../../models/ModelAssessment";
import { actWarning } from "../../reducers/notify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../reducers";
import { d } from "../../locale/LocaleManager";

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
  borderIconStyle: {
    fontSize: "13px",
    marginLeft: "8px",
    cursor: "pointer",
    color: "#006CCF",
  },
  checkIconStyle: {
    fontSize: "15px",
    marginLeft: "10px",
    cursor: "pointer",
    color: "#006CCF",
  },
});

interface BasicTableProps extends tableProps {
  studentViewItem: EntityH5PAssessmentStudentViewItem;
  index: number;
}

interface EditScoreProps {
  score?: number;
  handleChangeScore: (score?: number, indexSub?: number) => void;
  index: number;
  editable: boolean;
  isSubjectiveActivity: boolean;
  maxScore?: number;
  attempted?: boolean;
  isComplete?: boolean;
}

function EditScore(props: EditScoreProps) {
  const { score, handleChangeScore, index, editable, isSubjectiveActivity, maxScore, attempted, isComplete } = props;
  const [editScore, setEditScore] = React.useState(false);
  const [scoreNum, setScoreNum] = React.useState(score);
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  return (
    <div style={{ width: "100px", margin: "0 auto" }}>
      {!editScore && (
        <>
          {attempted ? scoreNum : d("Not Attempted").t("assess_option_not_attempted")}{" "}
          {attempted && (
            <BorderColorIcon
              onClick={() => {
                setEditScore(true);
              }}
              className={classes.borderIconStyle}
              style={{ visibility: editable && !isComplete && isSubjectiveActivity ? "visible" : "hidden" }}
            />
          )}
        </>
      )}
      {editScore && (
        <>
          <Input
            value={scoreNum}
            style={{ width: "22%" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = (e.target.value as unknown) as number;
              if (Number(value) + "" !== NaN + "") setScoreNum(value);
            }}
          />
          <CheckIcon
            onClick={() => {
              if (scoreNum! < score!) {
                dispatch(actWarning("The new score cannot be lower than the old one."));
              } else if (scoreNum! > maxScore!) {
                dispatch(actWarning(d("The score you entered cannot exceed the maximum score.").t("assess_msg_exceed_maximum")));
              } else {
                handleChangeScore(scoreNum, index);
                setEditScore(false);
              }
            }}
            className={classes.checkIconStyle}
          />
        </>
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
    formMethods: { control, setValue, getValues },
    index,
    editable,
    isComplete,
  } = props;

  const handleChangeComment = (commentText: string) => {
    const attendance_ids = getValues() as {
      student_ids: string[];
      student_view_items: EntityH5PAssessmentStudentViewItem[];
    };
    setValue(`student_view_items[${index}]`, {
      ...attendance_ids.student_view_items[index],
      comment: commentText,
    });
    handleElasticLayerControl({ link: "", openStatus: false, type: "" });
  };

  const handleChangeScore = (score?: number, indexSub?: number) => {
    const attendance_ids = getValues() as {
      student_ids: string[];
      student_view_items: EntityH5PAssessmentStudentViewItem[];
    };
    const lesson_materials = attendance_ids.student_view_items[index].lesson_materials?.map((materials, idx) => {
      return idx === indexSub ? { ...materials, achieved_score: score } : materials;
    });
    setValue(`student_view_items[${index}]`, {
      ...attendance_ids.student_view_items[index],
      lesson_materials: lesson_materials,
    });
  };

  const subjectiveActivity = (type?: string) => {
    return ["essay"].includes(type ?? "");
  };

  return (
    <Controller
      name={`student_view_items[${index}]`}
      control={control}
      defaultValue={studentViewItem || []}
      render={({ ref, ...props }) => (
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
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
              {editable && !isComplete && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElasticLayerControl({
                      link: "",
                      openStatus: true,
                      type: "AddComment",
                      contentText: studentViewItem.comment,
                      handleChangeComment: handleChangeComment,
                      title: d("Add Comments").t("assess_popup_add_comments"),
                    });
                  }}
                  style={{ visibility: checked ? "visible" : "hidden", color: "rgb(0, 108, 207)" }}
                >
                  {d("Click to add comments").t("assess_detail_click_to_add_comments")}
                </span>
              )}
              {isComplete && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElasticLayerControl({
                      link: "",
                      openStatus: true,
                      type: "DetailView",
                      contentText: studentViewItem.comment,
                      title: d("View Comments").t("assess_popup_view_comments"),
                    });
                  }}
                  style={{ visibility: checked ? "visible" : "hidden", color: "rgb(0, 108, 207)" }}
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
                    <TableCell>{d("No").t("assess_detail_no")}.</TableCell>
                    <TableCell align="center">{d("Lesson Material Name").t("assess_detail_lesson_material_name")}</TableCell>
                    <TableCell align="center">{d("Lesson Material Type").t("assess_detail_lesson_material_type")}</TableCell>
                    <TableCell align="center">{d("Answer").t("assess_detail_answer")}</TableCell>
                    <TableCell align="center">{d("Maximum Possible Score").t("assess_detail_maximum_possible_score")}</TableCell>
                    <TableCell align="center">{d("Achieved Score").t("assess_detail_achieved_score")}</TableCell>
                    <TableCell align="center">{d("Percentage").t("assess_detail_percentage")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentViewItem?.lesson_materials?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{row.lesson_material_name}</TableCell>
                      <TableCell align="center">{row.lesson_material_type}</TableCell>
                      <TableCell align="center">
                        <p
                          style={{
                            color: "#006CCF",
                            cursor: "pointer",
                            visibility: subjectiveActivity(row.lesson_material_type) ? "visible" : "hidden",
                          }}
                          onClick={() => {
                            handleElasticLayerControl({
                              link: "",
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
                      <TableCell align="center">{row.max_score}</TableCell>
                      <TableCell align="center">
                        <EditScore
                          score={row.achieved_score}
                          maxScore={row.max_score}
                          handleChangeScore={handleChangeScore}
                          index={index}
                          editable={editable}
                          isSubjectiveActivity={subjectiveActivity(row.lesson_material_type)}
                          attempted={row.attempted}
                        />
                      </TableCell>
                      <TableCell align="center">{(row?.achieved_score! / row?.max_score!) * 100 + "%"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Collapse>
        </TableContainer>
      )}
    />
  );
}

interface tableProps {
  handleElasticLayerControl: (elasticLayerControlData: ElasticLayerControl) => void;
  studentViewItems?: EntityH5PAssessmentStudentViewItem[];
  formMethods: UseFormMethods<UpdateStudyAssessmentDataOmitAction>;
  formValue?: UpdateAssessmentRequestDataOmitAction;
  editable: boolean;
  isComplete: boolean;
}

export function DetailTable(props: tableProps) {
  const { handleElasticLayerControl, studentViewItems, formMethods, formValue, editable, isComplete } = props;
  return (
    <>
      {studentViewItems?.map((item: EntityH5PAssessmentStudentViewItem, index: number) => {
        return (
          <BasicTable
            key={item.student_id}
            handleElasticLayerControl={handleElasticLayerControl}
            studentViewItem={item}
            formMethods={formMethods}
            index={index}
            formValue={formValue}
            editable={editable}
            isComplete={isComplete}
          />
        );
      })}
    </>
  );
}
