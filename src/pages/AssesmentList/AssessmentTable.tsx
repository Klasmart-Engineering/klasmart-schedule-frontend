import { createStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import React from "react";
import { AssessmentStatus, ListAssessmentResultItem } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { AssessmentQueryCondition } from "./types";

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
      width: 115,
      minWidth: 104,
    },
    statusCon: {
      color: "#fff",
      borderRadius: "15px",
      height: 26,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    completeColor: {
      backgroundColor: "#1aa21e",
    },
    inCompleteColor: {
      backgroundColor: "#f1c621",
    },
  })
);

export const MapStatus = (status: string | undefined) => {
  const css = useStyles();
  if (status === AssessmentStatus.complete)
    return <div className={clsx(css.statusCon, css.completeColor)}>{d("Complete").t("assess_filter_complete")}</div>;
  if (status === AssessmentStatus.in_progress)
    return <div className={clsx(css.statusCon, css.inCompleteColor)}>{d("Incomplete").t("assess_filter_in_progress")}</div>;
};

interface AssessmentProps {
  assessment: ListAssessmentResultItem;
  onClickAssessment: AssessmentTableProps["onClickAssessment"];
}
function AssessmentRow(props: AssessmentProps) {
  const css = useStyles();
  const { assessment, onClickAssessment } = props;
  return (
    <TableRow onClick={(e) => onClickAssessment(assessment.id)}>
      <TableCell align="center">{assessment.title}</TableCell>
      <TableCell align="center">{assessment.lesson_plan?.name}</TableCell>
      <TableCell align="center">{assessment.subjects?.map((v) => v.name).join(", ")}</TableCell>
      <TableCell align="center">{assessment.program?.name}</TableCell>
      <TableCell align="center" className={css.tableCell}>
        {MapStatus(assessment.status)}
      </TableCell>
      <TableCell align="center">{assessment.teachers?.map((v) => v.name)?.join(" ,")}</TableCell>
      <TableCell align="center">{formattedTime(assessment.class_end_time)}</TableCell>
      <TableCell align="center">{formattedTime(assessment.complete_time)}</TableCell>
    </TableRow>
  );
}

export interface AssessmentTableProps {
  total: number;
  amountPerPage?: number;
  list: ListAssessmentResultItem[];
  queryCondition: AssessmentQueryCondition;
  onChangePage: (page: number) => void;
  onClickAssessment: (id: ListAssessmentResultItem["id"]) => any;
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
              <TableCell align="center">{d("Lesson Plan").t("library_label_lesson_plan")}</TableCell>
              <TableCell align="center">{d("Subject").t("assess_column_subject")}</TableCell>
              <TableCell align="center">{d("Program").t("assess_column_program")}</TableCell>
              <TableCell align="center" className={css.tableCell}>
                {d("Status").t("assess_filter_column_status")}
              </TableCell>
              <TableCell align="center">{d("Teacher").t("assess_column_teacher")}</TableCell>
              <TableCell align="center">{d("Class End Time").t("assess_column_class_end_time")}</TableCell>
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
