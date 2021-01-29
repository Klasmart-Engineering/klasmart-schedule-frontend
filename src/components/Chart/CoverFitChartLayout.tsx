import { makeStyles } from "@material-ui/core";
import { ParentSize } from "@visx/responsive";
import React, { ReactNode } from "react";
import { useChartScale } from "../../hooks/useChartScale";

const useStyle = makeStyles({
  chartLayout: {
    position: "relative",
    overflow: 'scroll',
  },
  chartLayoutContent: {
    position: "absolute",
  },
});

export interface CoverFitChartLayoutProps {
  chartWidth: number;
  chartHeight: number;
  render: (px: number) => ReactNode;
  aspectRatio: number;
}
export function CoverFitChartLayout(props: CoverFitChartLayoutProps) {
  const { chartWidth, chartHeight, aspectRatio, render } = props;
  const scale = useChartScale();
  const css = useStyle();
  const chartAspectRatio = chartWidth / chartHeight;

  return (
    <div className={css.chartLayout} style={{ paddingBottom: `${100 * aspectRatio}%` }}>
      <ParentSize>
        {(info) => {
          const px = chartAspectRatio > aspectRatio ? (info.height / chartHeight) : (info.width / chartWidth);
          return !px ? null : <div className={css.chartLayoutContent}>{render(px)}</div>;
        }}
      </ParentSize>
    </div>
  );
}