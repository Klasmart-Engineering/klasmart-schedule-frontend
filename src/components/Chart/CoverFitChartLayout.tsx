import { makeStyles } from "@material-ui/core";
import { ParentSize } from "@visx/responsive";
import React, { ReactNode, useRef } from "react";

const useStyle = makeStyles({
  chartLayout: {
    position: "relative",
    overflow: "auto",
    boxSizing: "border-box",
  },
  chartLayoutContent: {
    position: "absolute",
  },
});

const MIN_WIDTH_GAP = 50;
const filterWidth = (width: number, prev: number) => (Math.abs(width - prev) < MIN_WIDTH_GAP ? prev : width);

export interface CoverFitChartLayoutProps {
  chartWidth: number;
  chartHeight: number;
  render: (px: number) => ReactNode;
  aspectRatio: number;
}
export function CoverFitChartLayout(props: CoverFitChartLayoutProps) {
  const { chartWidth, chartHeight, aspectRatio, render } = props;
  const parentWidthRef = useRef(0);
  const css = useStyle();
  const chartAspectRatio = chartWidth / chartHeight;

  return (
    <div className={css.chartLayout} style={{ paddingBottom: `${100 * aspectRatio}%` }}>
      <ParentSize>
        {({ width: parentWidth }) => {
          const filteredWidth = filterWidth(parentWidth, parentWidthRef.current);
          if (filteredWidth !== parentWidthRef.current) {
            parentWidthRef.current = filteredWidth;
          }
          const px = chartAspectRatio > aspectRatio ? filteredWidth / aspectRatio / chartHeight : filteredWidth / chartWidth;
          return !px ? null : <div className={css.chartLayoutContent}>{render(px)}</div>;
        }}
      </ParentSize>
    </div>
  );
}
