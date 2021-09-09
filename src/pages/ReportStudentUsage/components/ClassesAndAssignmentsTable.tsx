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
import { EntityClassesAssignmentsView } from "../../../api/api.auto";
import attendList from "../../../mocks/attendList.json";
import { RootState } from "../../../reducers";
import { getClassesAssignmentsUnattended } from "../../../reducers/report";
import { formatTime } from "../Tabs/ClassesAndAssignments";
import Pagination from "./Pagination";

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

// function sortByStudentName(studentName: string[]) {
//   studentName.sort((x: string, y: string) => {
//     let reg = /[a-zA-Z0-9]/
//     if(reg.test(x) || reg.test(y)) {
//       if (x> y) {
//         return 1
//       } else if (x < y) {
//         return -1
//       } else {
//         return 0
//       }
//     } else {
//       return x.localeCompare(y, "zh")
//     }
//   })
// }

function Row(props: { row: IRowProps; latestThreeMonths: ILatestThreeMonths }) {
  const dispatch = useDispatch();
  const { row, latestThreeMonths } = props;
  const [open, setOpen] = React.useState(false);
  const [childrenPage, setChildrenPage] = React.useState(0);
  const { classesAssignmentsUnattend } = useSelector<RootState, RootState["report"]>((state) => state.report);
  console.log(classesAssignmentsUnattend);

  // eslint-disable-next-line
  const [childrenRowsPerPage, setChildrenRowsPerPage] = useState(10);
  const handleClick = useCallback(() => {
    setOpen(!open);
    dispatch(
      getClassesAssignmentsUnattended({
        metaLoading: true,
        class_id: "",
        query: {
          page: childrenPage,
          page_size: childrenRowsPerPage,
          durations: [
            `${formatTime(latestThreeMonths.latestThreeMonthsDots[0])}-${formatTime(latestThreeMonths.latestThreeMonthsDots[1])}`,
            `${formatTime(latestThreeMonths.latestThreeMonthsDots[1])}-${formatTime(latestThreeMonths.latestThreeMonthsDots[2])}`,
            `${formatTime(latestThreeMonths.latestThreeMonthsDots[2])}-${(new Date() as any) / 1000}`,
          ],
        },
      })
    );
  }, [childrenPage, childrenRowsPerPage, dispatch, latestThreeMonths.latestThreeMonthsDots, open]);

  const onFirstPage = () => {
    setChildrenPage(0);
  };
  const onAddPage = () => {
    setChildrenPage(childrenPage + 1);
  };
  const onSubPage = () => {
    setChildrenPage(childrenPage - 1);
  };
  const onLastPage = () => {
    setChildrenPage(Math.floor(row.unAttendedList.length / childrenRowsPerPage));
  };

  return (
    <React.Fragment>
      <TableRow style={{ height: "64px" }}>
        <TableCell align="center" component="th" scope="row" style={{ width: "250px" }}>
          {row.className}
        </TableCell>
        <TableCell align="center" style={{ width: "200px" }}>
          {row.total}
        </TableCell>
        <TableCell align="center" style={{ width: "200px" }}>
          {row.firstMonth}
        </TableCell>
        <TableCell align="center" style={{ width: "200px" }}>
          {row.secondMonth}
        </TableCell>
        <TableCell align="center" style={{ width: "200px" }}>
          {row.thirdMound}
        </TableCell>
        <TableCell style={{ color: open ? "#117ad5" : "", cursor: "pointer" }} onClick={handleClick}>
          Unattended students
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
                <b>List of students missed live schedules</b>
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead style={{ backgroundColor: "#f2f5f7", height: "56px" }}>
                  <TableRow>
                    <TableCell align="center">Student name</TableCell>
                    <TableCell align="center">Lesson missed</TableCell>
                    <TableCell align="center">Lesson date</TableCell>
                    <TableCell align="center">Lesson time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(childrenRowsPerPage > 0
                    ? row.unAttendedList.slice(childrenPage * childrenRowsPerPage, childrenPage * childrenRowsPerPage + childrenRowsPerPage)
                    : row.unAttendedList
                  ).map((item, idx) => (
                    <TableRow key={idx} style={{ height: "56px" }}>
                      <TableCell align="center" component="th" scope="row">
                        {item.studentName}
                      </TableCell>
                      <TableCell align="center">{item.lessionMission}</TableCell>
                      <TableCell align="center">{item.lessonDate}</TableCell>
                      <TableCell align="center">{item.lessonTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableCell colSpan={6}>
                    <Pagination
                      page={childrenPage}
                      rowsPerPage={childrenRowsPerPage}
                      count={row.unAttendedList.length}
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
}

const numberToEnglish = (month: number) => {
  const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return Months[month - 1];
};

interface ILatestThreeMonths {
  latestThreeMonthsDate: number[];
  latestThreeMonthsDots: string[];
}

interface IClassesAndAssignmentsTable {
  classesAssignments: EntityClassesAssignmentsView[];
  latestThreeMonths: ILatestThreeMonths;
  getPageSize: (pageSize: number) => void;
}

export default function ClassesAndAssignmentsTable(props: IClassesAndAssignmentsTable) {
  const { classesAssignments, latestThreeMonths } = props;
  console.log(classesAssignments);

  const [page, setPage] = React.useState(0);
  // eslint-disable-next-line
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const onFirstPage = () => {
    setPage(0);
  };
  const onAddPage = () => {
    setPage(page + 1);
  };
  const onSubPage = () => {
    setPage(page - 1);
  };
  const onLastPage = () => {
    setPage(Math.floor(attendList.length / rowsPerPage));
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead style={{ backgroundColor: "#f2f5f7" }}>
            <TableRow>
              <TableCell align="center">
                <b>Class</b>
              </TableCell>
              <TableCell align="center">
                <b>Total</b>
                <Tooltip
                  title="Numbers of scheduled classes in the past 3 monts"
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>{numberToEnglish(latestThreeMonths.latestThreeMonthsDate[0])}</b>
                <Tooltip
                  title="Numbers of scheduled classes in the past 3 monts"
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>{numberToEnglish(latestThreeMonths.latestThreeMonthsDate[1])}</b>
                <Tooltip
                  title="Numbers of scheduled classes in the past 3 monts"
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>{numberToEnglish(latestThreeMonths.latestThreeMonthsDate[2])}</b>
                <Tooltip
                  title="This months class attendance rate"
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
            {(rowsPerPage > 0 ? attendList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : attendList).map((row) => (
              <Row key={row.className} row={row} latestThreeMonths={latestThreeMonths} />
            ))}
          </TableBody>
          <TableFooter>
            <TableCell colSpan={6}>
              <Pagination
                page={page}
                rowsPerPage={rowsPerPage}
                count={attendList.length}
                onAddPage={onAddPage}
                onFirstPage={onFirstPage}
                onLastPage={onLastPage}
                onSubPage={onSubPage}
              />
            </TableCell>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
