import { makeStyles } from "@material-ui/core";
import { AxisBottom, AxisLeft, TickRendererProps } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarGroup as VisxBarGroup } from "@visx/shape";
import { BarGroup } from "@visx/shape/lib/types";
import { Text } from "@visx/text";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { UseTooltipParams } from "@visx/tooltip/lib/hooks/useTooltip";
import React, { ReactNode, useMemo } from "react";

const AXIOS_TICK_RABEL_MAX_WIDTH_RATIO = 0.6;

const useStyle = makeStyles({
  svg: {
    position: "relative",
    padding: 1,
    backgroundColor: "rgba(0,0,0, .02)",
    fontFamily: "Helvetica",
  },
  axiosLine: {
    stroke: "#999999",
  },
});

const getPixels = (px: number) => ({
  barGroupsWidth: 630 * px,
  barGroupsHeight: 400 * px,
  barGroupMarginRatio: (60 / (60 + 90)) * px,
  descMarginBottom: 16 * px,
  xMarginTop: 180 * px,
  xMarginBottom: 160 * px,
});

const getInlineStyles = (px: number) => ({
  xAxiosTickLabel: {
    stroke: "black",
    fontSize: 18 * px,
    fontWeight: "lighter" as const,
    textAnchor: "middle" as const,
    verticalAnchor: "start" as const,
  },
  yAxiosLabel: {
    x: 15 * px,
    y: 40 * px,
    fontSize: 16 * px,
    stroke: "#999",
    textAnchor: "start" as const,
    transform: "",
  },
  tooltipContent: {
    maxWidth: 240 * px,
    fontSize: 14 * px,
    lineHeight: 20 / 14,
  },
  tooltipTitle: {
    fontSize: 14 * px,
    fontWeight: "bold" as const,
    lineHeight: 1,
    marginTop: 11 * px,
    marginBottom: 5 * px,
    color: "#0E78D5" as const,
  },
  desc: {
    textAnchor: "middle" as const,
    alignmentBaseline: "baseline" as const,
    stroke: "black" as const,
    fontSize: 18 * px,
    fontWeight: "lighter" as const,
  },
});

type ChartDataItem = Pick<VerticalBarGroupDataItem, "id" | "name" | "title" | "description"> & Record<string, number>;
type TBarGroup = BarGroup<string>;
type TBar = TBarGroup["bars"][0];
type TooltipData = { bar: TBar; barGroup: TBarGroup };

const dataItemById = (id: string, data: VerticalBarGroupDataItem[]) => {
  return data.find((item) => item.id === id) as VerticalBarGroupDataItem;
};

const calcYMax = (data: VerticalBarGroupDataItem[]) => {
  return Math.max(
    ...data.map(({ value: categoryValues }) => {
      return Math.max(...categoryValues.map((c) => c.value));
    })
  );
};

const calcChartData = (data: VerticalBarGroupDataItem[]): ChartDataItem[] => {
  return data.map(({ value: categoryValues, ...restItem }) => {
    return categoryValues.reduce((r, c) => Object.assign(r, { [c.name]: c.value }), restItem as ChartDataItem);
  });
};

const calcCategoryNames = (data: VerticalBarGroupDataItem[]) => {
  if (!data[0]) return [];
  const { value: categoryValues } = data[0];
  return categoryValues.map((c) => c.name);
};

const calcColorRange = (data: VerticalBarGroupDataItem[]) => {
  if (!data[0]) return [];
  const { value: categoryValues } = data[0];
  return categoryValues.map((c) => c.color);
};

export const verticalBarGroupChartSize = (props: Pick<VerticalBarGroupChartProps, "data">) => {
  const { viewPort } = computed(props);
  return [viewPort[2] - viewPort[0], viewPort[3] - viewPort[1]] as const;
};

function computed(props: Pick<VerticalMultiBarChartProps, "px" | "data">) {
  const { px = 1, data } = props;
  const pixels = getPixels(px);
  const yMax = calcYMax(data);
  console.log("yMax = ", yMax);
  const xScale = scaleBand({
    domain: data.map((item) => item.id),
    range: [0, pixels.barGroupsWidth],
    padding: pixels.barGroupMarginRatio,
  });
  const yScale = scaleLinear({ domain: [yMax, 0], range: [0, pixels.barGroupsHeight] });
  const yAxiosScale = scaleLinear({ domain: [yMax, 0], range: [0, pixels.barGroupsHeight + pixels.xMarginTop] });
  const getX = (item: ChartDataItem) => item.id;
  const xAxiosLabelWidth = data.length ? (pixels.barGroupsWidth / data.length) * AXIOS_TICK_RABEL_MAX_WIDTH_RATIO : pixels.barGroupsWidth;
  const viewPort = [0, 0, pixels.barGroupsWidth, pixels.barGroupsHeight + pixels.xMarginTop + pixels.xMarginBottom];
  const chartData = calcChartData(data);
  const categoryNames = calcCategoryNames(data);
  const categoryScale = scaleBand({ domain: categoryNames, range: [0, xScale.bandwidth()], padding: 0.2 });
  const colorScale = scaleOrdinal({ domain: categoryNames, range: calcColorRange(data) });
  return { chartData, categoryNames, categoryScale, xScale, yScale, yAxiosScale, colorScale, getX, xAxiosLabelWidth, viewPort };
}

const showBarTooltip = (tooltipData: TooltipData, showTooltip: UseTooltipParams<TooltipData>["showTooltip"], px: number) => {
  const { bar, barGroup } = tooltipData;
  const pixels = getPixels(px);
  showTooltip({
    tooltipLeft: barGroup.x0 + bar.x + bar.width,
    tooltipTop: bar.y + pixels.xMarginTop,
    tooltipData,
  });
};

export interface VerticalBarGroupDataItemCategoryValue {
  name: string;
  title?: string;
  description?: string;
  value: number;
  color: string;
}

export interface VerticalBarGroupDataItem {
  id: string;
  name: string;
  title?: string;
  description: string;
  value: VerticalBarGroupDataItemCategoryValue[];
}

export interface VerticalMultiBarChartProps {
  data: VerticalBarGroupDataItem[];
  onSelect?: (id: string) => any;
  px?: number;
  valueAxiosLabel: string;
}

export type VerticalBarGroupChartProps = VerticalMultiBarChartProps;
export function VerticalBarGroupChart(props: VerticalBarGroupChartProps) {
  const { onSelect, px = 1, data, valueAxiosLabel } = props;
  const css = useStyle();
  const pixels = useMemo(() => getPixels(px), [px]);
  const inlineStyles = useMemo(() => getInlineStyles(px), [px]);
  const {
    chartData,
    categoryNames,
    categoryScale,
    xScale,
    yScale,
    yAxiosScale,
    colorScale,
    getX,
    xAxiosLabelWidth,
    viewPort,
  } = useMemo(() => computed({ px, data }), [data, px]);
  const { tooltipOpen, tooltipData, tooltipTop, tooltipLeft, showTooltip, hideTooltip } = useTooltip<TooltipData>();

  const rectList = (barGroups: TBarGroup[]) =>
    barGroups.map((barGroup) => (
      <Group key={`barGroup-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
        {barGroup.bars.map((bar) => (
          <Group key={`bar-${bar.key}-${bar.index}`}>
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={bar.color}
              onMouseOver={() => showBarTooltip({ bar, barGroup }, showTooltip, px)}
              onMouseLeave={hideTooltip}
            />
            <text x={bar.x + 0.5 * bar.width} y={bar.y - pixels.descMarginBottom} style={inlineStyles.desc}>
              {data[barGroup.index].value[bar.index].title}
            </text>
          </Group>
        ))}
      </Group>
    ));

  const tickComponent = (tickProps: TickRendererProps): ReactNode => {
    const { formattedValue: id, ...tickTextProps } = tickProps;
    if (!id) return null;
    const { name } = dataItemById(id, data);
    return (
      <Text {...tickTextProps} onClick={() => onSelect && onSelect(id)}>
        {name}
      </Text>
    );
  };
  const tooltipContent =
    tooltipOpen && tooltipData ? data[tooltipData.barGroup.index].value[tooltipData.bar.index]?.description : undefined;
  return (
    <div className={css.svg}>
      <svg width={viewPort[2]} height={viewPort[3]}>
        <Group top={pixels.xMarginTop}>
          <VisxBarGroup
            height={pixels.barGroupsHeight}
            data={chartData}
            keys={categoryNames}
            x0Scale={xScale}
            x1Scale={categoryScale}
            yScale={yScale}
            color={colorScale}
            x0={getX}
          >
            {(barGroups) => rectList(barGroups)}
          </VisxBarGroup>
          <AxisBottom
            hideTicks
            top={pixels.barGroupsHeight}
            scale={xScale}
            axisLineClassName={css.axiosLine}
            tickLabelProps={() => ({ ...inlineStyles.xAxiosTickLabel, width: xAxiosLabelWidth })}
            tickComponent={tickComponent}
          />
        </Group>
        <AxisLeft
          hideTicks
          top={0}
          scale={yAxiosScale}
          axisLineClassName={css.axiosLine}
          label={valueAxiosLabel}
          labelOffset={0}
          labelProps={inlineStyles.yAxiosLabel}
        />
      </svg>
      {tooltipContent && (
        <Tooltip top={tooltipTop} left={tooltipLeft} offsetLeft={0} offsetTop={0}>
          <div style={inlineStyles.tooltipContent}>{tooltipContent}</div>
        </Tooltip>
      )}
    </div>
  );
}