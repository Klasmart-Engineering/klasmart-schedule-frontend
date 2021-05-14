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
      width: "260px",
      justifyContent: "space-between",
      alignItems: "center",
      "& a": {
        fontSize: "14px",
        color: "#006CCF",
      },
    },
  },
});

function createData(name: string, calories: string, fat: string, carbs: number, protein: number, score: number, percent: string) {
  return { name, calories, fat, carbs, protein, score, percent };
}

const rows = [
  createData("1", "Every Living Things", "Video", 24, 4.0, 3.5, "35%"),
  createData("2", "Animal Names", "Video Recording", 37, 4.3, 4.5, "35%"),
  createData("3", "Living Animals", "Drag and Drop", 24, 6.0, 6.5, "35%"),
  createData("4", "Animal Body Parts", "Multiple Choice", 67, 4.3, 5.5, "35%"),
  createData("5", "Animal Care", "Essay", 49, 3.9, 6.5, "35%"),
];

function BasicTable(props: tableProps) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [editScore, setEditScore] = React.useState(false);
  const { handleElasticLayerControl } = props;
  return (
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
          <span>小学生</span>
          <a href="https://www.baidu.com" style={{ visibility: checked ? "visible" : "hidden" }}>
            Click to add a comment
          </a>
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
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.calories}</TableCell>
                  <TableCell align="center">{row.fat}</TableCell>
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
                  <TableCell align="center">{row.protein}</TableCell>
                  <TableCell align="center">
                    {!editScore && (
                      <>
                        {row.score}{" "}
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
                        <Input value={row.score} style={{ width: "10%" }} />
                        <CheckIcon
                          onClick={() => {
                            setEditScore(false);
                          }}
                          style={{ fontSize: "15px", marginLeft: "10px", cursor: "pointer" }}
                        />
                      </>
                    )}
                  </TableCell>
                  <TableCell align="center">{row.percent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Collapse>
    </TableContainer>
  );
}

interface tableProps {
  handleElasticLayerControl: (elasticLayerControlData: ElasticLayerControl) => void;
}

export function DetailTable(props: tableProps) {
  const mock = [1, 2, 3, 4, 5, 6, 7, 8];
  const { handleElasticLayerControl } = props;
  return (
    <>
      {mock.map((value) => {
        return <BasicTable handleElasticLayerControl={handleElasticLayerControl} />;
      })}
    </>
  );
}
