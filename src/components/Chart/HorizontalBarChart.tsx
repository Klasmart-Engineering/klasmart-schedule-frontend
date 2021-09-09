import { AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStackHorizontal } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { defaultStyles, Tooltip, withTooltip } from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import moment from "moment";
import React from "react";

type TooltipData = {
  bar: SeriesPoint<any>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export type BarStackHorizontalProps = {
  width: number;
  height: number;
  noAxis?: boolean;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

export const background = "#eaedff";
const defaultMargin = { top: 0, left: 2, right: 0, bottom: 0 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
};

const data = [
  { h5Pviewed: 23, imagesViewed: 43, videoViewed: 55, audioListened: 22, documentViewed: 98, date: "2012-3-2" },
  { h5Pviewed: 22, imagesViewed: 64, videoViewed: 34, audioListened: 22, documentViewed: 34, date: "2012-3-3" },
  { h5Pviewed: 11, imagesViewed: 54, videoViewed: 54, audioListened: 72, documentViewed: 43, date: "2012-3-4" },
  { h5Pviewed: 11, imagesViewed: 54, videoViewed: 54, audioListened: 72, documentViewed: 43, date: "2012-3-5" },
  { h5Pviewed: 11, imagesViewed: 54, videoViewed: 54, audioListened: 72, documentViewed: 43, date: "2012-3-6" },
];
const keys = Object.keys(data[0]).filter((d) => d !== "date");
const temperatureTotals = data.reduce((allTotals, currentDate) => {
  const totalTemperature = keys.reduce((dailyTotal, k) => {
    dailyTotal += (currentDate as any)[k];
    return dailyTotal;
  }, 0);
  allTotals.push(totalTemperature);
  return allTotals;
}, [] as number[]);

const formatDate = (date: string) => moment(date).format("YYYY-MM-DD");

// accessors
const getDate = (d: any) => d.date;

// scales
const temperatureScale = scaleLinear<number>({
  domain: [0, Math.max(...temperatureTotals)],
  nice: true,
});
const dateScale = scaleBand<string>({
  domain: data.map(getDate),
  padding: 0.2,
});
const colorScale = scaleOrdinal({
  domain: keys,
  range: ["#0062FF", "#408AFF", "#73A9FF", "#A6C9FF", "#E6EFFF"],
});

let tooltipTimeout: number;
const HorizontalBarChart = withTooltip<BarStackHorizontalProps, TooltipData>(
  ({
    width,
    height,
    margin = defaultMargin,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
    noAxis,
  }: BarStackHorizontalProps & WithTooltipProvidedProps<TooltipData>) => {
    // bounds
    margin.left = noAxis ? 2 : 160;
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    temperatureScale.rangeRound([0, xMax]);
    dateScale.rangeRound([height, 0]);

    return (
      <div>
        <svg width={width} height={height}>
          <Group top={margin.top} left={margin.left}>
            <BarStackHorizontal
              data={data}
              keys={keys}
              height={yMax}
              y={getDate}
              xScale={temperatureScale}
              yScale={dateScale}
              color={colorScale}
            >
              {(barStacks) =>
                barStacks.map((barStack) => {
                  //console.log(barStack);
                  return barStack.bars.map((bar) => (
                    <rect
                      key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={(height / data.length) * bar.index + 30}
                      width={bar.width - 3}
                      height={28}
                      fill={bar.color}
                      onMouseLeave={() => {
                        hideTooltip();
                      }}
                      onMouseMove={() => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        const top = (height / data.length) * bar.index + 40;
                        const left = bar.x + bar.width + margin.left;
                        showTooltip({
                          tooltipData: bar,
                          tooltipTop: top,
                          tooltipLeft: left,
                        });
                      }}
                    />
                  ));
                })
              }
            </BarStackHorizontal>
            <AxisLeft
              hideTicks
              scale={dateScale}
              tickFormat={formatDate}
              stroke={"#ccc"}
              ticksComponent={(props) => {
                return (
                  <g>
                    {props.ticks.map((item, index) => {
                      return (
                        <text fill={"#999"} x={-100} y={(height / data.length) * index + 50}>
                          {item.formattedValue}
                        </text>
                      );
                    })}
                  </g>
                );
              }}
              tickStroke={"#ccc"}
              tickLabelProps={() => ({
                display: noAxis ? "none" : "block",
                fill: "#999",
                fontSize: 16,
                textAnchor: "end",
                dy: "-0.6em",
                dx: "-2em",
              })}
            />
          </Group>
        </svg>

        {tooltipOpen && tooltipData && (
          <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
            <div style={{ color: colorScale(tooltipData.key) }}>
              <strong>{tooltipData.key}</strong>
            </div>
            <div>{tooltipData.bar.data[tooltipData.key]}℉</div>
            <div>
              <small>{formatDate(getDate(tooltipData.bar.data))}</small>
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
);

export default HorizontalBarChart;
