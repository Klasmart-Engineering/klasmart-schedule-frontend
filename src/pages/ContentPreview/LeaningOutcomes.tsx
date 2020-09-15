import { Box, createStyles, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import React from "react";
import { LearningOutcomes } from "../../api/api";

const useStyles = makeStyles((theme) =>
  createStyles({
    tableHead: {
      height: 80,
      backgroundColor: "#f2f5f7",
    },
    tableCell: {
      textAlign: "center",
    },
  })
);
interface OutcomeProps {
  outcome: LearningOutcomes;
}
function OutComeRow(props: OutcomeProps) {
  const css = useStyles();
  const { outcome } = props;
  return (
    <TableRow>
      <TableCell className={css.tableCell}>{outcome.outcome_name}</TableCell>
      <TableCell className={css.tableCell}>{outcome.shortcode}</TableCell>
      {/* <TableCell className={css.tableCell}>{outcome.program}</TableCell>
      <TableCell className={css.tableCell}>{outcome.subject}</TableCell>
      <TableCell className={css.tableCell}>{outcome.skills}</TableCell>
      <TableCell className={css.tableCell}>{outcome.publish_scope}</TableCell> */}
      <TableCell className={css.tableCell}>{outcome.assumed}</TableCell>
      {/* <TableCell className={css.tableCell}>{formattedTime(outcome.created_at)}</TableCell> */}
      <TableCell className={css.tableCell}>{outcome.author_name}</TableCell>
    </TableRow>
  );
}
interface LearningOutcomeProps {
  list: LearningOutcomes[];
}
export function LearningOutcome(props: LearningOutcomeProps) {
  const css = useStyles();
  const { list } = props;
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell className={css.tableCell}>Learning Outcomes</TableCell>
              <TableCell className={css.tableCell}>Short Code</TableCell>
              {/* <TableCell className={css.tableCell}>Program</TableCell>
              <TableCell className={css.tableCell}>Subject</TableCell>
              <TableCell className={css.tableCell}>Milestone</TableCell>
              <TableCell className={css.tableCell}>Standard</TableCell> */}
              <TableCell className={css.tableCell}>Assumed</TableCell>
              {/* <TableCell className={css.tableCell}>Created On</TableCell> */}
              <TableCell className={css.tableCell}>Author</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item, idx) => (
              <OutComeRow key={item.outcome_id} outcome={item} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
