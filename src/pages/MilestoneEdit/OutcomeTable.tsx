import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { cloneDeep } from "lodash";
import React from "react";
import { GetOutcomeDetail, GetOutcomeList, MilestoneDetailResult } from "../../api/type";
import { d } from "../../locale/LocaleManager";
const createColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  cursor: "pointer",
  "&:hover": {
    color: paletteColor.dark,
  },
});
const useStyles = makeStyles(({ breakpoints, palette }) => ({
  addGreen: createColor(palette.success, palette),
  removeRead: createColor(palette.error, palette),
  tableContainer: {
    marginTop: 5,
    maxHeight: 790,
    marginBottom: 20,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  tableCell: {
    textAlign: "center",
    maxWidth: 200,
  },
  liCon: {
    textAlign: "left",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    listStylePosition: "inside",
  },
}));
interface OutcomeTableProps {
  outcomeList: GetOutcomeList;
  value?: MilestoneDetailResult["outcome_ancestor_ids"];
  onChange?: (value: MilestoneDetailResult["outcome_ancestor_ids"]) => any;
  canEdit: boolean;
}
export default function OutcomeTable(props: OutcomeTableProps) {
  const { outcomeList, value, onChange, canEdit } = props;
  const css = useStyles();

  const handleAction = (item: GetOutcomeDetail, type: "add" | "remove") => {
    const { outcome_id: id } = item;
    if (type === "add") {
      if (id && value) {
        onChange && onChange(value.concat([item.ancestor_id as string]));
      }
    } else {
      if (id && value) {
        let newValue = cloneDeep(value);
        newValue = newValue.filter((v) => v !== id);
        onChange && onChange(newValue);
      }
    }
  };

  const rows =
    outcomeList &&
    outcomeList.map((item) => (
      <TableRow key={item.outcome_id}>
        <TableCell className={css.tableCell}>{item.outcome_name}</TableCell>
        <TableCell className={css.tableCell}>{item.shortcode}</TableCell>
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
          {!canEdit &&
            (value && value[0] ? (
              value.indexOf(item.ancestor_id as string) < 0 ? (
                <AddCircle className={css.addGreen} onClick={() => handleAction(item, "add")} />
              ) : (
                <RemoveCircle className={css.removeRead} onClick={() => handleAction(item, "remove")} />
              )
            ) : (
              <AddCircle className={css.addGreen} onClick={() => handleAction(item, "add")} />
            ))}
          {/* {value && value[0] && value.indexOf(item.ancestor_id as string) < 0 ? (
              <AddCircle className={css.addGreen} onClick={() => handleAction(item, "add")} />
            ) : (
              <RemoveCircle className={css.removeRead} onClick={() => handleAction(item, "remove")} />
            )} */}
        </TableCell>
      </TableRow>
    ));
  return (
    <TableContainer className={css.tableContainer}>
      <Table>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell className={css.tableCell}>{d("Learning Outcomes").t("library_label_learning_outcomes")}</TableCell>
            <TableCell className={css.tableCell}>{d("Short Code").t("assess_label_short_code")}</TableCell>
            <TableCell className={css.tableCell}>{d("Assumed").t("assess_label_assumed")}</TableCell>
            <TableCell className={css.tableCell}>{d("Learning Outcome Set").t("assess_set_learning_outcome_set")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}
