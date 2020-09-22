import { Box, createStyles, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import React from "react";
import { EntityOutcome } from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
import { Empty } from "../ContentEdit/MediaAssets";
import CreateOutcomings from "../OutcomeEdit";

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
  outcome: EntityOutcome;
}
function OutComeRow(props: OutcomeProps) {
  const css = useStyles();
  const { outcome } = props;
  const handleClickOutcome = () => {
    window.open(`#${CreateOutcomings.routeBasePath}?outcome_id=${outcome.outcome_id}`);
  };
  return (
    <TableRow>
      <TableCell className={css.tableCell} onClick={handleClickOutcome}>
        {outcome.outcome_name}
      </TableCell>
      <TableCell className={css.tableCell}>{outcome.shortcode}</TableCell>
      <TableCell className={css.tableCell}>{outcome.assumed ? "Yes" : ""}</TableCell>
      <TableCell className={css.tableCell}>{outcome.author_name}</TableCell>
    </TableRow>
  );
}
interface LearningOutcomeProps {
  list: EntityOutcome[];
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
                <TableCell className={css.tableCell}>{d("Learning Outcomes").t("library_label_learning_outcomes")}</TableCell>
                <TableCell className={css.tableCell}>{d("Short Code").t("assess_label_short_code")}</TableCell>
                <TableCell className={css.tableCell}>{d("Assumed").t("assess_label_assumed")}</TableCell>
                <TableCell className={css.tableCell}>{d("Author").t("library_label_author")}</TableCell>
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
