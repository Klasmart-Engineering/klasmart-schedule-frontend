import { createStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination } from "@material-ui/lab";
import React from "react";
import { EntityListHomeFunStudiesResultItem } from "../../api/api.auto";
import { AssessmentStatus } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { HomeFunAssessmentQueryCondition } from "./types";

const useStyles = makeStyles((theme) =>
  createStyles({
    iconColor: {
      color: "#D32F2F",
      padding: "0 0 0 10px",
    },
    rePublishColor: {
      color: "#0E78D5",
      padding: "0 0 0 10px",
    },
    pagination: {
      marginBottom: 40,
    },
    paginationUl: {
      justifyContent: "center",
      marginTop: 30,
    },
    checkbox: {
      padding: 0,
      borderRadius: 5,
      backgroundColor: "white",
    },
    tableHead: {
      height: 80,
      backgroundColor: "#f2f5f7",
    },
  })
);

const mapStatus = (status: string | undefined) => {
  if (status === AssessmentStatus.complete) return "Complete";
  if (status === AssessmentStatus.in_progress) return "In Progress";
};

interface AssessmentProps {
  assessment: EntityListHomeFunStudiesResultItem;
  onClickAssessment: AssessmentTableProps["onClickAssessment"];
}
function AssessmentRow(props: AssessmentProps) {
  const { assessment, onClickAssessment } = props;
  return (
    <TableRow onClick={(e) => onClickAssessment(assessment.id)}>
      <TableCell align="center">{assessment.id}</TableCell>
      <TableCell align="center">{assessment.teacher_names?.join(" ,")}</TableCell>
      <TableCell align="center">{assessment.student_name}</TableCell>
      <TableCell align="center">{mapStatus(assessment.status)}</TableCell>
      <TableCell align="center">{formattedTime(assessment.due_at)}</TableCell>
      <TableCell align="center">{assessment.assess_score}</TableCell>
      <TableCell align="center">{formattedTime(assessment.complete_at)}</TableCell>
    </TableRow>
  );
}

export interface AssessmentTableProps {
  total: number;
  amountPerPage?: number;
  list: EntityListHomeFunStudiesResultItem[];
  queryCondition: HomeFunAssessmentQueryCondition;
  onChangePage: (page: number) => void;
  onClickAssessment: (id: EntityListHomeFunStudiesResultItem["id"]) => any;
}
export function AssessmentTable(props: AssessmentTableProps) {
  const css = useStyles();
  const { list, total, queryCondition, onChangePage, onClickAssessment } = props;
  const amountPerPage = props.amountPerPage ?? 20;
  const handleChangePage = (event: object, page: number) => onChangePage(page);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517} overflowX={"scroll"}>
      <TableContainer>
        <Table>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell align="center">{d("Assessment Title").t("assess_column_title")}</TableCell>
              <TableCell align="center">{d("Teacher").t("assess_column_teacher")}</TableCell>
              <TableCell align="center">{d("Student").t("schedule_time_conflict_student")}</TableCell>
              <TableCell align="center">{d("Status").t("assess_filter_column_status")}</TableCell>
              <TableCell align="center">{"Due Date"}</TableCell>
              <TableCell align="center">{"Submit Time"}</TableCell>
              <TableCell align="center">{"Assessment Score"}</TableCell>
              <TableCell align="center">{d("Complete Time").t("assess_column_complete_time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item, idx) => (
              <AssessmentRow key={item.id} assessment={item} {...{ queryCondition, onClickAssessment }} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        page={queryCondition.page}
        className={css.pagination}
        classes={{ ul: css.paginationUl }}
        onChange={handleChangePage}
        count={Math.ceil(total / amountPerPage)}
        color="primary"
      />
    </LayoutBox>
  );
}
