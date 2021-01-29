import { Grid, makeStyles } from "@material-ui/core";
import React, { ReactNode } from "react";
import LayoutBox from "../../components/LayoutBox";

const useStyle = makeStyles({
  pageChartLayout: {
    marginTop: 24,
    marginBottom: 200,
  },
  pageChartLayoutContent: {
    position: "absolute",
  },
});
interface ReportStudentPerformanceChartLayoutProps {
  charts: ReactNode[];
}

export function ReportStudentPerformanceChartLayout(props: ReportStudentPerformanceChartLayoutProps) {
  const { charts } = props;
  const css = useStyle();
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Grid className={css.pageChartLayout} container spacing={4}>
        <Grid item lg={6} xs={12}>
          {charts[0]}
        </Grid>
        <Grid item lg={6} xs={12}>
          {charts[1]}
        </Grid>
      </Grid>
    </LayoutBox>
  );
}
