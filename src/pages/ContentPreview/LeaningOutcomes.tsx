import { Box, createStyles, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import React from "react";
import { LearningOutcomes } from "../../api/api";
import { Empty } from "../ContentEdit/MediaAssets";

const useStyles = makeStyles((theme) =>
  createStyles({
    tableHead: {
      height: 80,
      backgroundColor: "#f2f5f7",
    },
    tableCell: {
      textAlign: "center",
    },
    tabContainer: {
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
      <TableCell className={css.tableCell}>{outcome.assumed}</TableCell>
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
    <Box className={css.tabContainer}>
      {list.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead className={css.tableHead}>
              <TableRow>
                <TableCell className={css.tableCell}>Learning Outcomes</TableCell>
                <TableCell className={css.tableCell}>Short Code</TableCell>
                <TableCell className={css.tableCell}>Assumed</TableCell>
                <TableCell className={css.tableCell}>Author</TableCell>
              </TableRow>
            </TableHead>

            <TableBody className={css.tableCell}>
              {list.map((item, idx) => (
                <OutComeRow key={item.outcome_id} outcome={item} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Empty />
      )}
    </Box>
  );
}
