import { Button, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { RemoveCircle } from "@material-ui/icons";
import { cloneDeep } from "lodash";
import React, { useMemo } from "react";
import { GetOutcomeDetail, GetOutcomeList } from "../../api/type";
import AnyTimeNoData from "../../assets/icons/any_time_no_data.png";
import { d } from "../../locale/LocaleManager";

const createColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  cursor: "pointer",
  "&:hover": {
    color: paletteColor.dark,
  },
});
const useStyles = makeStyles(({ breakpoints, palette }) => ({
  tableContainer: {
    marginTop: 5,
    maxHeight: 900,
    marginBottom: 20,
  },
  table: {
    minWidth: 700 - 162,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
    textAlign: "center",
  },
  tableCell: {
    maxWidth: 200,
    textAlign: "center",
  },
  liCon: {
    textAlign: "left",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    listStylePosition: "inside",
  },
  addGreen: createColor(palette.success, palette),
  removeRead: createColor(palette.error, palette),
}));

const stopPropagation = <T extends React.MouseEvent, R = void>(handler?: (arg: T) => R) => (e: T) => {
  e.stopPropagation();
  if (handler) return handler(e);
};
export interface ContainedOutcomeListProps {
  outcomeList: GetOutcomeList;
  value: GetOutcomeList;
  addOrRemoveOutcome: (outcome: GetOutcomeDetail, type: "add" | "remove") => any;
  canEdit: boolean;
  onClickOutcome: (id: GetOutcomeDetail["outcome_id"]) => any;
}

export default function ContainedOutcomeList(props: ContainedOutcomeListProps) {
  const css = useStyles();
  const { outcomeList, canEdit, addOrRemoveOutcome, onClickOutcome } = props;
  const containedList = useMemo(() => {
    const newList = cloneDeep(outcomeList);
    return newList.reverse();
  }, [outcomeList]);
  const rows =
    containedList &&
    containedList[0] &&
    containedList.map((item) => (
      <TableRow key={item.outcome_id} onClick={(e) => onClickOutcome(item.ancestor_id)}>
        <TableCell className={css.tableCell}>{item.outcome_name}</TableCell>
        <TableCell className={css.tableCell}>{item.shortcode}</TableCell>
        <TableCell className={css.tableCell}>{item.program && item.program[0] ? item.program[0].program_name : ""}</TableCell>
        <TableCell className={css.tableCell}>{item.developmental?.map((v) => v.developmental_name).join(",")}</TableCell>
        <TableCell className={css.tableCell}>{item.assumed ? "Yes" : ""}</TableCell>
        <TableCell className={css.tableCell}>
          <ul>
            {item.sets?.map((item, index) => (
              <li className={css.liCon} key={`${index}${item.set_name}`}>
                {item.set_name}
              </li>
            ))}
          </ul>
        </TableCell>
        <TableCell className={css.tableCell}>
          {/* <AddCircle className={css.addGreen} /> */}
          {canEdit && <RemoveCircle className={css.removeRead} onClick={stopPropagation((e) => addOrRemoveOutcome(item, "remove"))} />}
        </TableCell>
      </TableRow>
    ));
  return (
    <>
      <h1 style={{ marginLeft: 10 }}>{d("Contained Learning Outcomes").t("assess_milestone_contained_lo")}</h1>
      <TableContainer className={css.tableContainer}>
        <Table className={css.table} stickyHeader>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell className={css.tableCell}>{d("Learning Outcomes").t("library_label_learning_outcomes")}</TableCell>
              <TableCell className={css.tableCell}>{d("Short Code").t("assess_label_short_code")}</TableCell>
              <TableCell className={css.tableCell}>{d("Program").t("assess_column_program")}</TableCell>
              <TableCell className={css.tableCell}>{d("Category").t("assess_label_category")}</TableCell>
              <TableCell className={css.tableCell}>{d("Assumed").t("assess_label_assumed")}</TableCell>
              <TableCell className={css.tableCell}>{d("Learning Outcome Set").t("assess_set_learning_outcome_set")}</TableCell>
              <TableCell className={css.tableCell}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export interface AddOutcomesProps {
  onAddOutcome: () => any;
}
export function AddOutcomes(props: AddOutcomesProps) {
  const { onAddOutcome } = props;
  return (
    <div style={{ textAlign: "right" }}>
      <Button variant="contained" color="primary" onClick={onAddOutcome}>
        {d("Add").t("assess_milestone_detail_add")} +
      </Button>
    </div>
  );
}

export function NoOutcome() {
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <img src={AnyTimeNoData} style={{ width: "50%" }} alt="" />
      <p>{d("No learning outcome is available.").t("assess_msg_no_lo")}</p>
    </div>
  );
}
