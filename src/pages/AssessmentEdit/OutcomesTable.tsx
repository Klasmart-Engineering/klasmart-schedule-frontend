import {
  Checkbox,
  FormControlLabel,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import { AssessmentDetail, Outcomes } from ".";

const useStyles = makeStyles({
  tableContainer: {
    marginTop: 5,
    maxHeight: 800,
    marginBottom: 20,
  },
  table: {
    // minWidth: 700 - 162,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
});

interface OutcomesTableProps {
  outcomesList: AssessmentDetail["outcomes"];
  attendenceList: AssessmentDetail["attendenceList"];
}
export function OutcomesTable(props: OutcomesTableProps) {
  const css = useStyles();
  const { outcomesList, attendenceList } = props;
  const fliterAttendence = attendenceList.map((item) => (
    <FormControlLabel
      key={item.id}
      control={
        <Checkbox
          // checked={state.checkedB}
          // onChange={handleChange}
          name={item.name}
          color="primary"
        />
      }
      label={item.name}
    />
  ));
  const rows = outcomesList.map((item: Outcomes) => (
    <TableRow key={item.id}>
      <TableCell align="center">{item.name}</TableCell>
      <TableCell align="center">{item.assumed ? "Assumed" : "Unassumed"}</TableCell>
      <TableCell>{fliterAttendence}</TableCell>
    </TableRow>
  ));
  return (
    <TableContainer className={css.tableContainer}>
      <Table className={css.table} stickyHeader>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell width={250} align="center">
              Learning Outcomes
            </TableCell>
            <TableCell width={100} align="center">
              Assumed
            </TableCell>
            <TableCell>Assessing Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}
