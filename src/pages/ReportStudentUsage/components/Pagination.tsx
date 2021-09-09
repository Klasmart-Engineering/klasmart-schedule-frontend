import { createStyles, makeStyles } from "@material-ui/core";
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { d } from "../../../locale/LocaleManager";

const useStyles = makeStyles(() =>
  createStyles({
    pagination: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    icon: {
      cursor: "pointer",
      padding: "12px",
      borderRadius: "50%",
      "&:hover": {
        background: "#eee",
      },
    },
    iconColor: {
      color: "#ccc",
    },
  })
);

interface IPagination {
  page: number;
  rowsPerPage: number;
  count: number;
  onFirstPage: () => void;
  onAddPage: () => void;
  onSubPage: () => void;
  onLastPage: () => void;
}

export default function Pagination(props: IPagination) {
  const { page, rowsPerPage, count, onFirstPage, onAddPage, onSubPage, onLastPage } = props;
  const css = useStyles();

  return (
    <div className={css.pagination}>
      <span style={{ marginRight: 6 }}>
        {d("Total").t("report_label_total")} {count} {d("results").t("report_student_usage_results")}
      </span>
      <FirstPage className={clsx(css.icon, page === 0 && css.iconColor)} onClick={() => page !== 0 && onFirstPage()} />
      <ChevronLeft className={clsx(css.icon, page === 0 && css.iconColor)} onClick={() => page !== 0 && onSubPage()} />
      <ChevronRight
        className={clsx(css.icon, page === Math.floor(count / rowsPerPage) && css.iconColor)}
        onClick={() => page !== Math.floor(count / rowsPerPage) && onAddPage()}
      />
      <LastPage
        className={clsx(css.icon, page === Math.floor(count / rowsPerPage) && css.iconColor)}
        onClick={() => page !== Math.floor(count / rowsPerPage) && onLastPage()}
      />
    </div>
  );
}
