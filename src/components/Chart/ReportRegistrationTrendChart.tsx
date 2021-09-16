import { makeStyles } from "@material-ui/core";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import { AnimatedAxis, AnimatedLineSeries, Grid, lightTheme, Tooltip, XYChart } from "@visx/xychart";
import React from "react";
const useStyle = makeStyles(() => ({
  axisLine: {
    transform: "scaleX(2)",
    transformOrigin: "center center",
    stroke: "#e9e9e9",
    strokeWidth: 1,
  },
  axis: {
    stroke: "#e9e9e9",
    "& text": {
      fontSize: "16px",
      color: "#fff",
      transform: "translateY(16px)",
      fill: "#999",
    },
  },
  axisYLabel: {
    transform: "translateY(-10px)",
    "& text": {
      fontSize: "14px",
      fill: "#D0D0D0",
    },
  },
  toolBox: {
    background: "#000",
    margin: "-6px -8px",
    color: "#fff",
    borderRadius: "4px",
    padding: "8px",
    overflow: "hidden",
  },
  scoreLabel: {
    display: "flex",
    marginTop: "6px",
    "& label": {
      marginRight: "10px",
    },
  },
  toolBoxTitle: {
    fontSize: "14px",
    margin: "-8px",
    padding: "8px",
  },
}));
interface Props {
  registeredData: Array<number | string>;
  createdData: Array<number | string>;
  notCreateDate: Array<number | string>;
  dates: Array<string>;
}
export default function ReportRegistrationTrendChart(props: Props) {
  const css = useStyle();
  const colors = ["#0e78d5", "#8693f0", "#fe9b9b"];
  return (
    <ParentSize>
      {(info) => {
        return (
          <XYChart
            theme={{ ...lightTheme, colors }}
            xScale={{ type: "band", paddingInner: 0.3 }}
            yScale={{ type: "linear" }}
            height={info.height}
          >
            <Grid key={`grid`} rows={false} columns={false} />
            <AnimatedLineSeries
              dataKey="registered"
              data={props.registeredData.map((str, index) => ({ registered: str, date: props.dates[index] }))}
              xAccessor={(d) => d.date}
              yAccessor={(c) => c.registered}
            />
            <AnimatedLineSeries
              dataKey="created"
              data={props.createdData.map((str, index) => ({ created: str, date: props.dates[index] }))}
              xAccessor={(d) => d.date}
              yAccessor={(c) => c.created}
            />
            <AnimatedLineSeries
              dataKey="notCreated"
              data={props.notCreateDate.map((str, index) => ({ notCreated: str, date: props.dates[index] }))}
              xAccessor={(d) => d.date}
              yAccessor={(c) => c.notCreated}
            />
            <AnimatedAxis axisLineClassName={css.axisLine} tickClassName={css.axis} hideTicks key={1} orientation={"bottom"} />
            <AnimatedAxis hideTicks tickClassName={css.axisYLabel} axisLineClassName={css.axis} key={2} orientation={"left"} />
            <Tooltip
              showVerticalCrosshair
              showSeriesGlyphs
              renderTooltip={({ tooltipData, colorScale }: Record<string, any>) => {
                return (
                  <div className={css.toolBox}>
                    <div className={css.toolBoxTitle}>{tooltipData?.nearestDatum?.datum["date"]}</div>
                    <div>
                      {Object.values(tooltipData?.datumByKey as object).map((item: Record<string, any>, index) => {
                        return (
                          <div className={css.scoreLabel}>
                            <label style={{ color: colors[index] }}>{item.key}</label>
                            {item.datum[item.key]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }}
            />
          </XYChart>
        );
      }}
    </ParentSize>
  );
}
