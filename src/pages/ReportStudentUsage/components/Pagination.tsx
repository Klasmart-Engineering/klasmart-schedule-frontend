import { createStyles, makeStyles } from "@material-ui/core";
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { t } from "../../../locale/LocaleManager";
const PAGESIZE = 10;

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
  count: number;
  onFirstPage: () => void;
  onAddPage: () => void;
  onSubPage: () => void;
  onLastPage: () => void;
}

export default function Pagination(props: IPagination) {
  const { page, count, onFirstPage, onAddPage, onSubPage, onLastPage } = props;
  const css = useStyles();
  const lastPage = (page - 1) * PAGESIZE + PAGESIZE > count ? count : (page - 1) * PAGESIZE + PAGESIZE;

  return (
    <div className={css.pagination}>
      <span style={{ marginRight: 6 ,fontSize: 14, color:"rgba(0, 0, 0, 0.54)" }}>
        {/* {d("Total").t("report_label_total")} {count} {d("Results").t("report_student_usage_results")} */}
        {`${(page - 1) * PAGESIZE + 1}-${lastPage}`} {t("report_student_usage_of")} {count}
      </span>
      <FirstPage className={clsx(css.icon, page === 1 && css.iconColor)} onClick={() => page !== 1 && onFirstPage()} />
      <ChevronLeft className={clsx(css.icon, page === 1 && css.iconColor)} onClick={() => page !== 1 && onSubPage()} />
      <ChevronRight
        className={clsx(css.icon, (page === Math.ceil(count / PAGESIZE) || count === 0) && css.iconColor)}
        onClick={() => page !== Math.ceil(count / PAGESIZE) && count !== 0 && onAddPage()}
      />
      <LastPage
        className={clsx(css.icon, (page === Math.ceil(count / PAGESIZE) || count === 0) && css.iconColor)}
        onClick={() => page !== Math.ceil(count / PAGESIZE) && count !== 0 && onLastPage()}
      />
    </div>
  );
}
