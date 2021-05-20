import { createStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination } from "@material-ui/lab";
import React from "react";
import { ListStudyAssessmentItem } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { StudyAssessmentQueryCondition } from "./types";

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
    tableCell: {
      textAlign: "center",
      maxWidth: 200,
      wordWrap: "break-word",
      wordBreak: "normal",
    },
  })
);

// const mapStatus = (status: string | undefined) => {
//   if (status === AssessmentStatus.complete) return d("Complete").t("assess_filter_complete");
//   if (status === AssessmentStatus.in_progress) return d("Incomplete").t("assess_filter_in_progress");
// };

interface AssessmentProps {
  assessment: ListStudyAssessmentItem;
  onClickAssessment: AssessmentTableProps["onClickAssessment"];
}
function AssessmentRow(props: AssessmentProps) {
  const css = useStyles();
  const { assessment, onClickAssessment } = props;
  return (
    <TableRow onClick={(e) => onClickAssessment(assessment.id)}>
      <TableCell className={css.tableCell} align="center">
        {assessment.title}
      </TableCell>
      <TableCell className={css.tableCell} align="center">
        {assessment.teacher_names?.join(",")}
      </TableCell>
      <TableCell className={css.tableCell} align="center">
        {assessment.class_name}
      </TableCell>
      <TableCell className={css.tableCell} align="center">
        {formattedTime(assessment.due_at)}
      </TableCell>
      <TableCell className={css.tableCell} align="center">
        {assessment.complete_rate}
      </TableCell>
      <TableCell className={css.tableCell} align="center">
        {assessment.remaining_time}
      </TableCell>
      <TableCell className={css.tableCell} align="center">
        {formattedTime(assessment.complete_at)}
      </TableCell>
    </TableRow>
  );
}

export interface AssessmentTableProps {
  total: number;
  amountPerPage?: number;
  list: ListStudyAssessmentItem[];
  queryCondition: StudyAssessmentQueryCondition;
  onChangePage: (page: number) => void;
  onClickAssessment: (id: ListStudyAssessmentItem["id"]) => any;
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
              <TableCell className={css.tableCell} align="center">
                {"Studt Title"}
              </TableCell>
              <TableCell className={css.tableCell} align="center">
                {d("Teacher Name").t("schedule_label_teacher_name")}
              </TableCell>
              <TableCell className={css.tableCell} align="center">
                {d("Class Name").t("assess_detail_class_name")}
              </TableCell>
              <TableCell className={css.tableCell} align="center">
                {d("Due Date").t("assess_column_due_date")}
              </TableCell>
              <TableCell className={css.tableCell} align="center">
                {d("Completion Rate").t("assess_list_completion_rate")}
              </TableCell>
              <TableCell className={css.tableCell} align="center">
                {d("Assessment Remaining").t("assess_list_assessment_remaining")}
              </TableCell>
              <TableCell className={css.tableCell} align="center">
                {d("Complete Time").t("assess_column_complete_time")}
              </TableCell>
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
