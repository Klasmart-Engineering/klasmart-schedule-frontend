import {
  Box,
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
import { AssessmentDetailProps, Outcomes } from ".";

const useStyles = makeStyles({
  tableContainer: {
    marginTop: 5,
    maxHeight: 830,
    marginBottom: 20,
  },
  table: {
    minWidth: 900,
    fontSize: "14px !important",
  },
  checkBoxUi: {
    fontSize: "14px !important",
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  tableCellLine: {
    "&:not(:last-child)": {
      borderRight: "1px solid #ebebeb",
    },
  },
  assessActionline: {
    borderLeft: "1px solid #ebebeb",
  },
});

interface OutcomesTableProps {
  outcomesList: AssessmentDetailProps["outcomesList"];
  attendenceList: AssessmentDetailProps["attendenceList"];
}
export function OutcomesTable(props: OutcomesTableProps) {
  const css = useStyles();
  const { outcomesList, attendenceList } = props;
  const fliterAttendence = attendenceList.map((item) => (
    <FormControlLabel
      key={item.id}
      className={css.checkBoxUi}
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
  const assessAction = (
    <Box display="flex" alignItems="center">
      <Box width={500} fontSize={14}>
        <FormControlLabel
          control={
            <Checkbox
              // checked={state.checkedB}
              // onChange={handleChange}
              name="award"
              color="primary"
            />
          }
          label="Award All"
        />
        <FormControlLabel
          control={
            <Checkbox
              // checked={state.checkedB}
              // onChange={handleChange}
              name="skip"
              color="primary"
            />
          }
          label="Skip"
        />
      </Box>
      <Box px={3} className={css.assessActionline}>
        {fliterAttendence}
      </Box>
    </Box>
  );
  const rows = outcomesList.map((item: Outcomes) => (
    <TableRow key={item.id}>
      <TableCell className={css.tableCellLine} align="center">
        {item.name}
      </TableCell>
      <TableCell className={css.tableCellLine} align="center">
        {item.assumed ? "Assumed" : "Unassumed"}
      </TableCell>
      <TableCell>{assessAction}</TableCell>
    </TableRow>
  ));
  return (
    <TableContainer className={css.tableContainer}>
      <Table className={css.table} stickyHeader>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell width={150} align="center">
              Learning Outcomes
            </TableCell>
            <TableCell width={80} align="center">
              Assumed
            </TableCell>
            <TableCell align="center">Assessing Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}
