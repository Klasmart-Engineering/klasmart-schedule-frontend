import { ConnectionDirection, ConnectionPageInfo } from "@api/api-ko-schema.auto";
import { t } from "@locale/LocaleManager";
import { createStyles, IconButton, makeStyles } from "@material-ui/core";
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from "@material-ui/icons";
import { CursorListProps, CursorType } from "@pages/MyContentList/OrganizationList";
import React from "react";
const useStyles = makeStyles(() =>
  createStyles({
    pagination: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);
interface IPagination {
  total: number;
  pageDesc: string;
  pageInfo: ConnectionPageInfo;
  onChange: (props: CursorListProps) => any;
}

export default function CursorPagination(props: IPagination) {
  const { pageDesc, total, pageInfo, onChange } = props;
  const css = useStyles();
  const { hasNextPage, hasPreviousPage, startCursor, endCursor } = pageInfo;
  return (
    <div className={css.pagination}>
      <span style={{ marginRight: 6, fontSize: 14, color: "rgba(0, 0, 0, 0.54)" }}>
        {t("report_student_usage_of", { total, value: pageDesc })}
      </span>
      <IconButton
        disabled={!hasPreviousPage}
        onClick={() => onChange({ direction: ConnectionDirection.Forward, cursor: "", curentPageCursor: CursorType.start })}
      >
        <FirstPage />
      </IconButton>
      <IconButton
        disabled={!hasPreviousPage}
        onClick={() => onChange({ direction: ConnectionDirection.Backward, cursor: startCursor, curentPageCursor: CursorType.prev })}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        disabled={!hasNextPage}
        onClick={() => onChange({ direction: ConnectionDirection.Forward, cursor: endCursor, curentPageCursor: CursorType.next })}
      >
        <ChevronRight />
      </IconButton>
      <IconButton
        disabled={!hasNextPage}
        onClick={() => onChange({ direction: ConnectionDirection.Backward, cursor: "", curentPageCursor: CursorType.end })}
      >
        <LastPage />
      </IconButton>
    </div>
  );
}
