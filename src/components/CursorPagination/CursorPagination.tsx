import { ConnectionDirection, ConnectionPageInfo } from "@api/api-ko-schema.auto";
import { t } from "@locale/LocaleManager";
import { createStyles, FormControl, IconButton, makeStyles, MenuItem, Select } from "@material-ui/core";
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from "@material-ui/icons";
import { CursorListProps, CursorType } from "@pages/MyContentList/OrganizationList";
import React from "react";
const useStyles = makeStyles(() =>
  createStyles({
    flexCenter: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    pageDesc: {
      marginRight: 6,
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.54)",
    },
  })
);
interface IPagination {
  total: number;
  pageDesc: string;
  pageInfo: ConnectionPageInfo;
  onChange: (props: CursorListProps) => any;
  pageSize?: number;
  rowsPerPages?: number[];
  onChangePageSize?: (pageSize: number) => any;
  disabled?: boolean;
}

export default function CursorPagination(props: IPagination) {
  const { pageDesc, total, pageInfo, onChange, rowsPerPages, pageSize, onChangePageSize, disabled } = props;
  const css = useStyles();
  const { hasNextPage, hasPreviousPage, startCursor, endCursor } = pageInfo;
  const handleChangePageSize = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChangePageSize?.(event.target.value as number);
    onChange({ direction: ConnectionDirection.Forward, count: Number(event.target.value) });
  };
  return (
    <div className={css.flexCenter}>
      {rowsPerPages?.length && (
        <div className={css.flexCenter} style={{ marginRight: 20 }}>
          <span style={{ marginRight: 6 }}>Rows per page </span>
          <FormControl>
            <Select value={pageSize} onChange={handleChangePageSize}>
              {rowsPerPages?.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      <span className={css.pageDesc}>{t("report_student_usage_of", { total, value: pageDesc })}</span>
      <IconButton
        disabled={disabled || !hasPreviousPage}
        onClick={() => onChange({ direction: ConnectionDirection.Forward, cursor: "", curentPageCursor: CursorType.start })}
      >
        <FirstPage />
      </IconButton>
      <IconButton
        disabled={disabled || !hasPreviousPage}
        onClick={() => onChange({ direction: ConnectionDirection.Backward, cursor: startCursor, curentPageCursor: CursorType.prev })}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        disabled={disabled || !hasNextPage}
        onClick={() => onChange({ direction: ConnectionDirection.Forward, cursor: endCursor, curentPageCursor: CursorType.next })}
      >
        <ChevronRight />
      </IconButton>
      <IconButton
        disabled={disabled || !hasNextPage}
        onClick={() => onChange({ direction: ConnectionDirection.Backward, cursor: "", curentPageCursor: CursorType.end })}
      >
        <LastPage />
      </IconButton>
    </div>
  );
}
