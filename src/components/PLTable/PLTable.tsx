import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { PLTableHeader } from "./PLTableHeader";

import { PLField, PLTableProps, PLSortType, PLGridRowData } from "./PLTableTypes";
import { cloneDeep, sortBy } from "lodash";
import clsx from "clsx";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

/** 排序 ---- 切换排序方式 **/
const toggleSortString = (sortType: PLSortType) => (sortType === undefined ? "asc" : sortType === "asc" ? "desc" : undefined);
export const sortData = (fieldID: string, rows: any, sortType: PLSortType) => {
  return sortType === "desc" ? sortBy(rows, [fieldID]).reverse() : sortBy(rows, [fieldID]);
};

export function PLTable(props: PLTableProps) {
  const classes = useStyles();
  const { sortChange, clickRows, dblclickRows, loading, className, style } = props;

  let [fields, setFields] = useState(props.fields);
  let [rows, setRows] = useState(props.rows);
  let defaultRows = cloneDeep(props.rows); /** 默认的数据，用于排序和筛选 **/
  let [sortField, setSortField] = useState("");

  /** 表头排序事件 **/
  const emitSort = (fieldID: string, event?: React.MouseEvent<unknown>) => {
    setSortField(fieldID);
    let curField: undefined | PLField;
    fields.forEach((f) => {
      if (f.value === fieldID) {
        f.sortType = toggleSortString(f.sortType);
        curField = f;
      } else {
        f.sortType = undefined;
      }
    });
    fields = [...fields];
    setFields(fields);
    if (sortChange) sortChange(curField, event);
    /** 更改排序事件的回调 **/ else {
      setRows(curField?.sortType ? sortData(fieldID, rows, curField?.sortType) : defaultRows);
    }
  };

  /** 鼠标事件 **/
  const onclickRows = (row: PLGridRowData, e: React.MouseEvent<unknown>) => {
    clickRows && clickRows(row, e);
  };
  const ondblclickRows = (row: PLGridRowData, e: React.MouseEvent<unknown>) => {
    dblclickRows && dblclickRows(row, e);
  };

  return (
    <TableContainer component={Paper} className={clsx(className)} style={style}>
      <Table className={classes.table}>
        <PLTableHeader fields={fields} sortField={sortField} emitSort={emitSort} loading={loading} />
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx} onClick={(e) => onclickRows(row, e)} onDoubleClick={(e) => ondblclickRows(row, e)}>
              {fields.map((field) =>
                field.hidden ? (
                  ""
                ) : (
                  <TableCell key={`cell_${field.value}_${idx}`} align={field.align}>
                    {row[field.value]}
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
