import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { InfoOutlined } from "@material-ui/icons";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Maybe, School } from "../../../api/api-ko-schema.auto";
import { EntityClassesAssignmentsView } from "../../../api/api.auto";
import { d, t } from "../../../locale/LocaleManager";
// import mock from "../../../mocks/attendList.json";
import { RootState } from "../../../reducers";
import { getClassesAssignmentsUnattended } from "../../../reducers/report";
import { formatTime } from "../Tabs/ClassesAndAssignments";
import Pagination from "./Pagination";
import unAttendedList from "../../../mocks/unAttendedList.json";
import moment from "moment";

const PAGESIZE = 10;

// eslint-disable-next-line
const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  })
);

interface IUnAttendedListProps {
  studentName: string;
  lessionMission: string;
  lessonDate: string;
  lessonTime: string;
}

interface IRowProps {
  className: string;
  total: number;
  firstMonth: string;
  secondMonth: string;
  thirdMound: string;
  unAttendedList: IUnAttendedListProps[];
}

function sortByStudentName(studentName: any) {
  return function (x: any, y: any) {
    let reg = /[a-zA-Z0-9]/;
    if (reg.test(x[studentName]) || reg.test(y[studentName])) {
      if (x[studentName] > y[studentName]) {
        return 1;
      } else if (x[studentName] < y[studentName]) {
        return -1;
      } else {
        return 0;
      }
    } else {
      return x[studentName].localeCompare(y[studentName], "zh");
    }
  };
}

const Row = (props: { row?: EntityClassesAssignmentsView; latestThreeMonths: ILatestThreeMonths; idx: number; classes: IClasses[] }) => {
  const dispatch = useDispatch();
  const { row, latestThreeMonths, classes } = props;
  const { class_id } = row || {};
  const [open, setOpen] = React.useState(false);
  const [childrenPage, setChildrenPage] = React.useState(0);
  const { classesAssignmentsUnattend: classesAssignmentsUnattendRow } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );
  let className = "";
  classes.map((item) => {
    if (item.class_id === row?.class_id) {
      className = item.class_name || "";
    }
    return className;
  });
  var classesAssignmentsUnattend = classesAssignmentsUnattendRow.length > 0 ? classesAssignmentsUnattendRow : unAttendedList;

  classesAssignmentsUnattend = classesAssignmentsUnattend.sort(sortByStudentName("student_name"));

  const [childrenRowsPerPage] = useState(10);
  const handleClick = useCallback(() => {
    setOpen(!open);
    class_id &&
      dispatch(
        getClassesAssignmentsUnattended({
          metaLoading: true,
          class_id,
          query: {
            durations: [
              `${formatTime(latestThreeMonths.latestThreeMonthsDots[0])}-${formatTime(latestThreeMonths.latestThreeMonthsDots[1])}`,
              `${formatTime(latestThreeMonths.latestThreeMonthsDots[1])}-${formatTime(latestThreeMonths.latestThreeMonthsDots[2])}`,
              `${formatTime(latestThreeMonths.latestThreeMonthsDots[2])}-${Math.floor((new Date() as any) / 1000)}`,
            ],
          },
        })
      );
  }, [class_id, dispatch, latestThreeMonths.latestThreeMonthsDots, open]);

  const onFirstPage = () => {
    setChildrenPage(1);
  };
  const onAddPage = () => {
    setChildrenPage(childrenPage + 1);
  };
  const onSubPage = () => {
    setChildrenPage(childrenPage - 1);
  };
  const onLastPage = () => {
    setChildrenPage(Math.ceil(classesAssignmentsUnattend.length / childrenRowsPerPage));
  };

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
          {(row?.durations_ratio?.[0].ratio as number) * 100 + "%"}
        </TableCell>
        <TableCell align="center" style={{ width: "200px" }}>
          {(row?.durations_ratio?.[1].ratio as number) * 100 + "%"}
        </TableCell>
        <TableCell align="center" style={{ width: "200px" }}>
          {(row?.durations_ratio?.[2].ratio as number) * 100 + "%"}
        </TableCell>
        <TableCell style={{ color: open ? "#117ad5" : "", cursor: "pointer" }} onClick={handleClick}>
          {t("report_student_usage_unattendedStudents")}
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon style={{ color: "#117ad5" }} /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#fcfcfc" }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit style={{ padding: "0 119px" }}>
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
                  {(childrenRowsPerPage > 0
                    ? classesAssignmentsUnattend.slice(
                        childrenPage * childrenRowsPerPage,
                        childrenPage * childrenRowsPerPage + childrenRowsPerPage
                      )
                    : classesAssignmentsUnattend
                  ).map((item) => (
                    <TableRow key={item.student_id} style={{ height: "56px" }}>
                      <TableCell align="center" component="th" scope="row">
                        {item.student_name}
                      </TableCell>
                      <TableCell align="center">{item?.schedule?.schedule_name}</TableCell>
                      <TableCell align="center">{`${moment(item.time).format("MM/DD/YYYY")}`}</TableCell>
                      <TableCell align="center">{`${moment(item.time).format("HH:mm a")}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableCell colSpan={6}>
                    <Pagination
                      page={childrenPage}
                      count={classesAssignmentsUnattend.length}
                      onAddPage={onAddPage}
                      onFirstPage={onFirstPage}
                      onLastPage={onLastPage}
                      onSubPage={onSubPage}
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
  latestThreeMonths: ILatestThreeMonths;
  handleChangePage: (page: number) => any;
  page: number;
  total: number;
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
  const { classesAssignments, latestThreeMonths, handleChangePage, page, total, studentUsage } = props;
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
                  title={d("Numbers of scheduled classes in the past 3 monts").t("numbers_of_scheduled_classes_in_the_past_3_monts")}
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
              <Row classes={classes} key={row.class_id} row={row} idx={idx} latestThreeMonths={latestThreeMonths} />
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
