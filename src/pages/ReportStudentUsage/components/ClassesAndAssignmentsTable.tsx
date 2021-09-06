import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { InfoOutlined } from "@material-ui/icons";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Pagination from "@material-ui/lab/Pagination";
import React, { useState } from "react";
import attendList from "../../../mocks/attendList.json";

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

function Row(props: { row: IRowProps }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [childrenPage, setChildrenPage] = React.useState(1);
  const [childrenRowsPerPage] = useState(10);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setChildrenPage(value);
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
        <TableCell style={{ color: open ? "#117ad5" : "", cursor: "pointer" }} onClick={() => setOpen(!open)}>
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
                    ? row.unAttendedList.slice(
                        (childrenPage - 1) * childrenRowsPerPage,
                        (childrenPage - 1) * childrenRowsPerPage + childrenRowsPerPage
                      )
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
              </Table>
            </Box>
            <div style={{ margin: "20px auto", display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(row.unAttendedList.length / childrenRowsPerPage)}
                page={childrenPage}
                color="primary"
                variant="text"
                onChange={handleChange}
                size="small"
              />
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function H5pTable() {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage] = React.useState(10);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
                <b>June</b>
                <Tooltip
                  title="Numbers of scheduled classes in the past 3 monts"
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>July</b>
                <Tooltip
                  title="Numbers of scheduled classes in the past 3 monts"
                  aria-label="info"
                  style={{ position: "relative", left: "12px", top: "5px", fontSize: "19px", color: "#818283" }}
                >
                  <InfoOutlined></InfoOutlined>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <b>August</b>
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
            {(rowsPerPage > 0 ? attendList.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage) : attendList).map(
              (row) => (
                <Row key={row.className} row={row} />
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ margin: "80px auto 40px auto", display: "flex", justifyContent: "center" }}>
        <Pagination count={Math.ceil(attendList.length / rowsPerPage)} page={page} color="primary" onChange={handleChange} />
      </div>
    </div>
  );
}
