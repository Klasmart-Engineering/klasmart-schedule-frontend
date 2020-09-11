import { createStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination } from "@material-ui/lab";
import React from "react";
import { ListAssessmentResultItem } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
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
  })
);

interface AssessmentProps {
  assessment: ListAssessmentResultItem;
  onClickAssessment: AssessmentTableProps["onClickAssessment"];
}
function AssessmentRow(props: AssessmentProps) {
  const { assessment, onClickAssessment } = props;
  return (
    <TableRow onClick={(e) => onClickAssessment(assessment.id)}>
      <TableCell align="center">{assessment.title}</TableCell>
      <TableCell align="center">{assessment.subject?.name}</TableCell>
      <TableCell align="center">{assessment.program?.name}</TableCell>
      <TableCell align="center">{assessment.status}</TableCell>
      <TableCell align="center">{assessment.teachers?.map((v) => v.name)}</TableCell>
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
  const { list, total, amountPerPage = 16, queryCondition, onChangePage, onClickAssessment } = props;
  const handleChangePage = (event: object, page: number) => onChangePage(page);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517} overflowX={"scroll"}>
      <TableContainer>
        <Table>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Subject</TableCell>
              <TableCell align="center">Program</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Teacher</TableCell>
              <TableCell align="center">Class End Time</TableCell>
              <TableCell align="center">Complete Time</TableCell>
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
