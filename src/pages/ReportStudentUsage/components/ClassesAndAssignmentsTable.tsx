import { Box, Typography } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
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
import moment from "moment";
import React from "react";
import { Maybe, School } from "../../../api/api-ko-schema.auto";
import { EntityClassesAssignmentsUnattendedStudentsView, EntityClassesAssignmentsView } from "../../../api/api.auto";
import { d, t } from "../../../locale/LocaleManager";
import Pagination from "./Pagination";

const PAGESIZE = 10;
const Row = (props: {
  row?: EntityClassesAssignmentsView;
  classesAssignmentsUnattend: EntityClassesAssignmentsUnattendedStudentsView[];
  handleclickUnattendedTable: (class_id?: string) => any;
  unattendedTableOpenId?: string;
  classes: IClasses[];
}) => {
  const { row, classes, classesAssignmentsUnattend, handleclickUnattendedTable, unattendedTableOpenId } = props;
  const [childrenPage, setChildrenPage] = React.useState(1);
  const className = classes.find((item) => item.class_id === row?.class_id)?.class_name;
  const total = classesAssignmentsUnattend.length;
  return (
    <React.Fragment>
      <TableRow style={{ height: "64px" }}>
        <TableCell align="center" component="th" scope="row" style={{ width: "250px" }}>
          {className}
        </TableCell>
        <TableCell align="center" style={{ width: "200px" }}>
          {row?.total}
        </TableCell>
        <TableCell align="center" style={{ width: "200px" }}>
          {Math.floor((row?.durations_ratio?.[0].ratio as number) * 100) + "%"}
        </TableCell>
        <TableCell align="center" style={{ width: "200px" }}>
          {Math.floor((row?.durations_ratio?.[1].ratio as number) * 100) + "%"}
        </TableCell>
        <TableCell align="center" style={{ width: "200px" }}>
          {Math.floor((row?.durations_ratio?.[2].ratio as number) * 100) + "%"}
        </TableCell>
        <TableCell
          style={{ minWidth: 168, color: unattendedTableOpenId === row?.class_id ? "#117ad5" : "", cursor: "pointer" }}
          onClick={() => {
            handleclickUnattendedTable(unattendedTableOpenId === row?.class_id ? "" : row?.class_id);
            setChildrenPage(1);
          }}
        >
          {t("report_student_usage_unattendedStudents")}
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
                <b>{t("report_student_usage_missed_schedules")}</b>
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
                  {classesAssignmentsUnattend.slice((childrenPage - 1) * 10, (childrenPage - 1) * 10 + 10).map((item) => (
                    <TableRow key={`${item.time}-${item?.student_id}`} style={{ height: "56px" }}>
                      <TableCell align="center" component="th" scope="row">
                        {item.student_name}
                      </TableCell>
                      <TableCell align="center">{item?.schedule?.schedule_name}</TableCell>
                      <TableCell align="center">{item.time ? `${moment(item.time * 1000).format("MM/DD/YYYY")}` : ""}</TableCell>
                      <TableCell align="center">{item.time ? ` ${moment(item.time * 1000).format("HH:mm a")}` : ""}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableCell colSpan={6}>
                    <Pagination
                      page={childrenPage}
                      count={total}
                      onAddPage={() => setChildrenPage(childrenPage + 1)}
                      onFirstPage={() => setChildrenPage(1)}
                      onLastPage={() => setChildrenPage(Math.ceil(total / 10))}
                      onSubPage={() => setChildrenPage(childrenPage - 1)}
                    />
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
  const Months = [
    t("schedule_calendar_january"),
    t("schedule_calendar_february"),
    t("schedule_calendar_march"),
    t("schedule_calendar_april"),
    t("schedule_calendar_may"),
    t("schedule_calendar_june"),
    t("schedule_calendar_july"),
    t("schedule_calendar_august"),
    t("schedule_calendar_september"),
    t("schedule_calendar_october"),
    t("schedule_calendar_november"),
    t("schedule_calendar_december"),
  ];
  return Months[month - 1];
};

interface ILatestThreeMonths {
  latestThreeMonthsDate: number[];
  latestThreeMonthsDots: string[];
}

interface IClassesAndAssignmentsTable {
  classesAssignments: EntityClassesAssignmentsView[];
  classesAssignmentsUnattend: EntityClassesAssignmentsUnattendedStudentsView[];
  handleclickUnattendedTable: (class_id?: string) => any;
  unattendedTableOpenId?: string;
  latestThreeMonths: ILatestThreeMonths;
  handleChangePage: (page: number) => any;
  page: number;
  total: number;
  type: string;
  studentUsage: {
    organization_id: string;
    schoolList: Pick<School, "classes" | "school_id" | "school_name">[];
  };
}
interface IClasses {
  class_id: string;
  class_name?: Maybe<string> | undefined;
}

export default function ClassesAndAssignmentsTable(props: IClassesAndAssignmentsTable) {
  const {
    classesAssignments,
    unattendedTableOpenId,
    latestThreeMonths,
    classesAssignmentsUnattend,
    handleclickUnattendedTable,
    handleChangePage,
    page,
    total,
    studentUsage,
  } = props;
  const classes: IClasses[] = [{ class_id: "" }];
  studentUsage.schoolList.map((val) => val.classes?.map((item) => item && classes.push(item)));
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead style={{ backgroundColor: "#f2f5f7" }}>
            <TableRow>
              <TableCell align="center">
                <b>{t("report_student_usage_class")}</b>
              </TableCell>
              <TableCell align="center">
                <b>{t("report_student_usage_total")}</b>
                <Tooltip
                  title={d("Numbers of scheduled classes in the past 3 months").t(
                    "report_numbers_of_scheduled_classes_in_the_past_3_months"
                  )}
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>{numberToEnglish(latestThreeMonths.latestThreeMonthsDate[0])}</b>
                <Tooltip
                  title={d("This months class attendance rate").t("report_student_usage_this_months_class_attendance_rate")}
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>{numberToEnglish(latestThreeMonths.latestThreeMonthsDate[1])}</b>
                <Tooltip
                  title={d("This months class attendance rate").t("report_student_usage_this_months_class_attendance_rate")}
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>{numberToEnglish(latestThreeMonths.latestThreeMonthsDate[2])}</b>
                <Tooltip
                  title={d("This months class attendance rate").t("report_student_usage_this_months_class_attendance_rate")}
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
                classes={classes}
                key={row.class_id}
                row={row}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableCell colSpan={6}>
              <Pagination
                page={page}
                count={total}
                onAddPage={() => handleChangePage(page + 1)}
                onFirstPage={() => handleChangePage(1)}
                onLastPage={() => handleChangePage(Math.ceil(total / PAGESIZE))}
                onSubPage={() => handleChangePage(page - 1)}
              />
            </TableCell>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
