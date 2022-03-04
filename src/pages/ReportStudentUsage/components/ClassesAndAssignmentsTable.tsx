import { Box, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import { InfoOutlined } from "@material-ui/icons";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { getTimeDots } from "@utilities/dateUtilities";
import moment from "moment";
import React from "react";
import { EntityClassesAssignmentsUnattendedStudentsView, EntityClassesAssignmentsView } from "../../../api/api.auto";
import ReportPagination from "../../../components/ReportPagination/ReportPagination";
import { d, t } from "../../../locale/LocaleManager";
import useTranslation from "../hooks/useTranslation";

const PAGESIZE = 10;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrow: {
      color: theme.palette.common.black,
    },
    tooltip: {
      backgroundColor: theme.palette.common.black,
      maxWidth: 196,
      padding: 10,
      textAlign: "center",
    },
  })
);
const Row = (props: {
  row?: EntityClassesAssignmentsView;
  classesAssignmentsUnattend: EntityClassesAssignmentsUnattendedStudentsView[];
  handleclickUnattendedTable: (class_id?: string) => any;
  unattendedTableOpenId?: string;
  classList?: MutiSelect.ISelect[];
  listTitle: string;
  type: string;
}) => {
  const { row, classList, classesAssignmentsUnattend, handleclickUnattendedTable, unattendedTableOpenId, listTitle, type } = props;
  const [childrenPage, setChildrenPage] = React.useState(1);
  const className = classList?.find((item) => item.value === row?.class_id)?.label;
  const total = classesAssignmentsUnattend.length;
  return (
    <React.Fragment>
      <TableRow style={{ height: "64px" }}>
        <TableCell align="center" component="th" scope="row" style={{ maxWidth: "250px" }}>
          {className}
        </TableCell>
        <TableCell align="center" style={{ maxWidth: "150px" }}>
          {row?.total}
        </TableCell>
        <TableCell align="center" style={{ maxWidth: "150px" }}>
          {Math.floor((row?.durations_ratio?.[0].ratio as number) * 100) + "%"}
        </TableCell>
        <TableCell align="center" style={{ maxWidth: "150px" }}>
          {Math.floor((row?.durations_ratio?.[1].ratio as number) * 100) + "%"}
        </TableCell>
        <TableCell align="center" style={{ maxWidth: "150px" }}>
          {Math.floor((row?.durations_ratio?.[2].ratio as number) * 100) + "%"}
        </TableCell>
        <TableCell
          align="center"
          style={{ minWidth: 168, color: unattendedTableOpenId === row?.class_id ? "#117ad5" : "", cursor: "pointer" }}
          onClick={() => {
            handleclickUnattendedTable(unattendedTableOpenId === row?.class_id ? "" : row?.class_id);
            setChildrenPage(1);
          }}
        >
          {type === "study" || type === "home_fun"
            ? t("report_student_usage_incomplete_students")
            : t("report_student_usage_unattendedStudents")}
          <IconButton aria-label="expand row" size="small">
            {unattendedTableOpenId === row?.class_id ? <KeyboardArrowUpIcon style={{ color: "#117ad5" }} /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#fcfcfc" }} colSpan={6}>
          <Collapse in={unattendedTableOpenId === row?.class_id} timeout="auto" unmountOnExit style={{ padding: "0 119px" }}>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div" style={{ height: "66px", lineHeight: "66px" }}>
                <b>{listTitle}</b>
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead style={{ backgroundColor: "#f2f5f7", height: "56px" }}>
                  <TableRow>
                    <TableCell align="center">{t("report_student_usage_student_name")}</TableCell>
                    <TableCell align="center">{t("report_student_usage_lesson_missed")}</TableCell>
                    <TableCell align="center">{t("report_student_usage_lesson_date")}</TableCell>
                    <TableCell align="center">{t("report_student_usage_lesson_time")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classesAssignmentsUnattend
                    .slice((childrenPage - 1) * PAGESIZE, (childrenPage - 1) * PAGESIZE + PAGESIZE)
                    .map((item, idx) => (
                      <TableRow key={`${item.time}-${item?.student_id}-${idx}`} style={{ height: "56px" }}>
                        <TableCell align="center" component="th" scope="row">
                          {item.student_name}
                        </TableCell>
                        <TableCell align="center">{item?.schedule?.schedule_name}</TableCell>
                        <TableCell align="center">{item.time ? `${moment(item.time * 1000).format("MM/DD/YYYY")}` : ""}</TableCell>
                        <TableCell align="center">{item.time ? `${moment(item.time * 1000).format("HH:mm")}` : ""}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableCell colSpan={6}>
                    <ReportPagination page={childrenPage} count={total} onChangePage={setChildrenPage} />
                  </TableCell>
                </TableFooter>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const numberToEnglish = (month: number) => {
  const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return Months[month - 1];
};

interface IClassesAndAssignmentsTable {
  classesAssignments: EntityClassesAssignmentsView[];
  classesAssignmentsUnattend: EntityClassesAssignmentsUnattendedStudentsView[];
  handleclickUnattendedTable: (class_id?: string) => any;
  unattendedTableOpenId?: string;
  listTitle: string;
  handleChangePage: (page: number) => any;
  page: number;
  total: number;
  type: string;
  classList?: MutiSelect.ISelect[];
}

export default function ClassesAndAssignmentsTable(props: IClassesAndAssignmentsTable) {
  const {
    classesAssignments,
    unattendedTableOpenId,
    classesAssignmentsUnattend,
    handleclickUnattendedTable,
    handleChangePage,
    page,
    total,
    classList,
    listTitle,
    type,
  } = props;
  const { months } = useTranslation();
  const latestThreeMonths = getTimeDots();
  const styles = useStyles();

  return (
    <div>
      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead style={{ backgroundColor: "#f2f5f7" }}>
            <TableRow>
              <TableCell align="center">
                <b>{t("report_student_usage_class")}</b>
                <Tooltip
                  arrow
                  placement="top"
                  title={d("Participants are not included").t("report_msg_participants_not_included")}
                  classes={styles}
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>{t("report_student_usage_total")}</b>
                <Tooltip
                  arrow
                  placement="top"
                  title={d("Numbers of scheduled classes in the past 3 months").t(
                    "report_numbers_of_scheduled_classes_in_the_past_3_months"
                  )}
                  classes={styles}
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>{months[numberToEnglish(latestThreeMonths[0])]}</b>
                <Tooltip
                  arrow
                  placement="top"
                  classes={styles}
                  title={d("This month‘s class attendance rate").t("report_student_usage_this_months_class_attendance_rate")}
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>{months[numberToEnglish(latestThreeMonths[1])]}</b>
                <Tooltip
                  arrow
                  placement="top"
                  classes={styles}
                  title={d("This month‘s class attendance rate").t("report_student_usage_this_months_class_attendance_rate")}
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>{months[numberToEnglish(latestThreeMonths[2])]}</b>
                <Tooltip
                  arrow
                  placement="top"
                  classes={styles}
                  title={d("This month‘s class attendance rate").t("report_student_usage_this_months_class_attendance_rate")}
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {classesAssignments.map((row: EntityClassesAssignmentsView, idx) => (
              <Row
                unattendedTableOpenId={unattendedTableOpenId}
                handleclickUnattendedTable={handleclickUnattendedTable}
                classesAssignmentsUnattend={classesAssignmentsUnattend}
                classList={classList}
                key={row.class_id}
                row={row}
                type={type}
                listTitle={listTitle}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableCell colSpan={6}>
              <ReportPagination page={page} count={total} onChangePage={handleChangePage} />
            </TableCell>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
