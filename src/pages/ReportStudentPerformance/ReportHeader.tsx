import { createStyles, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() =>
  createStyles({
    fontCss: {
      fontSize: "18px",
      fontFamily: " Helvetica, Helvetica-Bold",
      fontWeight: 700,
    },
  })
);
type ReportTitleProps = {
  title: string;
};
export function ReportTitle(props: ReportTitleProps) {
  const { title } = props;
  const css = useStyles();
  return <Typography className={css.fontCss}>{title}</Typography>;
}
