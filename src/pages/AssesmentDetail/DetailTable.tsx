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
import { UpdateStudyAssessmentDataOmitAction } from "../../models/ModelAssessment";

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
});

interface BasicTableProps extends tableProps {
  studentViewItem: EntityH5PAssessmentStudentViewItem;
  index: number;
}

function BasicTable(props: BasicTableProps) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [editScore, setEditScore] = React.useState(false);
  const {
    handleElasticLayerControl,
    studentViewItem,
    formMethods: { control, setValue, getValues },
    index,
  } = props;
  /*  const funSetValue = useMemo(
    () => (name: string, value: boolean | string[]) => {
      setValue(`outcome_attendances[${index}].${name}`, value);
    },
    [index, setValue]
  );*/

  const handleChangeComment = (commentText: string) => {
    const attendance_ids = getValues() as {
      student_ids: string[];
      outcome_attendances: { attendance_ids: EntityH5PAssessmentStudentViewItem }[];
    };
    setValue(`outcome_attendances[${index}].attendance_ids`, {
      ...attendance_ids.outcome_attendances[index].attendance_ids,
      comment: commentText,
    });
    handleElasticLayerControl({ link: "", openStatus: false, type: "" });
  };

  /*  const handleChangeSkip = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    funSetValue(name, e.target.checked);

    if (e.target.checked) {
      if (name === "skip") {
        funSetValue("none_achieved", false);
      }
      funSetValue("attendance_ids", []);
    }
  };*/
  return (
    <Controller
      name={`outcome_attendances[${index}].attendance_ids`}
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
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  handleElasticLayerControl({
                    link: "",
                    openStatus: true,
                    type: "AddComment",
                    contentText: studentViewItem.comment,
                    handleChangeComment: handleChangeComment,
                  });
                }}
                style={{ visibility: checked ? "visible" : "hidden" }}
              >
                Click to add a comment
              </p>
            </div>
            {checked && <ArrowDropUpIcon />}
            {!checked && <ArrowDropDownIcon />}
          </Box>
          <Collapse in={checked}>
            <Paper elevation={4}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell align="center">Lesson Material Name</TableCell>
                    <TableCell align="center">Lesson Material Type</TableCell>
                    <TableCell align="center">Answer</TableCell>
                    <TableCell align="center">Maximum Possible Score</TableCell>
                    <TableCell align="center">Achieved Score</TableCell>
                    <TableCell align="center">Percentage</TableCell>
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
                          style={{ color: "#006CCF", cursor: "pointer" }}
                          onClick={() => {
                            handleElasticLayerControl({ link: "", openStatus: true, type: "" });
                          }}
                        >
                          Click to view
                        </p>
                      </TableCell>
                      <TableCell align="center">{row.max_score}</TableCell>
                      <TableCell align="center">
                        {!editScore && (
                          <>
                            {row.achieved_score}{" "}
                            <BorderColorIcon
                              onClick={() => {
                                setEditScore(true);
                              }}
                              style={{ fontSize: "13px", marginLeft: "8px", cursor: "pointer", color: "#006CCF" }}
                            />
                          </>
                        )}
                        {editScore && (
                          <>
                            <Input value={row.achieved_score} style={{ width: "10%" }} />
                            <CheckIcon
                              onClick={() => {
                                setEditScore(false);
                              }}
                              style={{ fontSize: "15px", marginLeft: "10px", cursor: "pointer" }}
                            />
                          </>
                        )}
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
}

export function DetailTable(props: tableProps) {
  const { handleElasticLayerControl, studentViewItems, formMethods } = props;
  return (
    <>
      {studentViewItems?.map((item: EntityH5PAssessmentStudentViewItem, index: number) => {
        return (
          <BasicTable
            handleElasticLayerControl={handleElasticLayerControl}
            studentViewItem={item}
            formMethods={formMethods}
            index={index}
          />
        );
      })}
    </>
  );
}
