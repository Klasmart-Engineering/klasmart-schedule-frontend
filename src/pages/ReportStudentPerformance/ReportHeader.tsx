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
type ReportHeaderProps = {
  title: string;
};
export function ReportHeader(props: ReportHeaderProps) {
  const { title } = props;
  const css = useStyles();
  return <Typography className={css.fontCss}>{title}</Typography>;
}
