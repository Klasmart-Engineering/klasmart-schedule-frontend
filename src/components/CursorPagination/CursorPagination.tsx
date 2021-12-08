import { ConnectionDirection, ConnectionPageInfo } from "@api/api-ko-schema.auto";
import { GetOrganizationsQueryVariables } from "@api/api-ko.auto";
import { createStyles, IconButton, makeStyles } from "@material-ui/core";
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from "@material-ui/icons";
import React from "react";
const useStyles = makeStyles(() =>
  createStyles({
    pagination: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
  })
);

interface IPagination {
  total: number;
  pageInfo: ConnectionPageInfo;
  onChange: (props: Pick<GetOrganizationsQueryVariables, "direction" | "cursor">) => any;
}

export default function CursorPagination(props: IPagination) {
  const { total, pageInfo, onChange } = props;
  const css = useStyles();
  const { hasNextPage, hasPreviousPage, startCursor, endCursor } = pageInfo;
  return (
    <div className={css.pagination}>
      <span style={{ marginRight: 6, fontSize: 14, color: "rgba(0, 0, 0, 0.54)" }}>{total}</span>
      <IconButton disabled={!hasPreviousPage}>
        <FirstPage onClick={() => onChange({ direction: ConnectionDirection.Forward, cursor: "" })} />
      </IconButton>
      <IconButton disabled={!hasPreviousPage}>
        <ChevronLeft onClick={() => onChange({ direction: ConnectionDirection.Backward, cursor: startCursor })} />
      </IconButton>
      <IconButton disabled={!hasNextPage}>
        <ChevronRight onClick={() => onChange({ direction: ConnectionDirection.Forward, cursor: endCursor })} />
      </IconButton>
      <IconButton disabled={!hasNextPage}>
        <LastPage onClick={() => onChange({ direction: ConnectionDirection.Backward, cursor: "" })} />
      </IconButton>
    </div>
  );
}
