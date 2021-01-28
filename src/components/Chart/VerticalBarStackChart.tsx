import { makeStyles } from "@material-ui/core";
import { AxisBottom, AxisLeft, TickRendererProps } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStack as VisxBarStack } from "@visx/shape";
import { BarStack } from "@visx/shape/lib/types";
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
  barStacksWidth: 560 * px,
  barStacksHeight: 400 * px,
  barStackMarginRatio: (84 / (84 + 40)) * px,
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

type ChartDataItem = Pick<VerticalBarStackDataItem, "id" | "name" | "title" | "description"> & Record<string, number>;
type TBarStack = BarStack<ChartDataItem, string>;
type TBar = TBarStack["bars"][0];
type TooltipData = { bar: TBar; barStack: TBarStack };

const dataItemById = (id: string, data: VerticalBarStackDataItem[]) => {
  return data.find((item) => item.id === id) as VerticalBarStackDataItem;
};

const calcDataSum = (data: VerticalBarStackDataItem[]) => {
  return data.map(({ value: categoryValues }) => {
    return categoryValues.reduce((r, item) => r + item.value, 0);
  });
};

const calcChartData = (data: VerticalBarStackDataItem[]): ChartDataItem[] => {
  return data.map(({ value: categoryValues, ...restItem }) => {
    return categoryValues.reduce((r, c) => Object.assign(r, { [c.name]: c.value }), restItem as ChartDataItem);
  });
};

const calcCategoryNames = (data: VerticalBarStackDataItem[]) => {
  if (!data[0]) return [];
  const { value: categoryValues } = data[0];
  return categoryValues.map((c) => c.name);
};

const calcColorRange = (data: VerticalBarStackDataItem[]) => {
  if (!data[0]) return [];
  const { value: categoryValues } = data[0];
  return categoryValues.map((c) => c.color);
};

export const verticalBarStackChartSize = (props: Pick<VerticalBarStackChartProps, "data">) => {
  const { viewPort } = computed(parseProps({ ...props, color: "red" } as VerticalBarStackChartProps));
  return [viewPort[2] - viewPort[0], viewPort[3] - viewPort[1]] as const;
};

function computed(props: Pick<VerticalMultiBarChartProps, "px" | "data">) {
  const { px = 1, data } = props;
  const pixels = getPixels(px);
  const yMax = Math.max(...calcDataSum(data));
  const xScale = scaleBand({
    domain: data.map((item) => item.id),
    range: [0, pixels.barStacksWidth],
    padding: pixels.barStackMarginRatio,
  });
  const yScale = scaleLinear({ domain: [yMax, 0], range: [0, pixels.barStacksHeight] });
  const yAxiosScale = scaleLinear({ domain: [yMax, 0], range: [0, pixels.barStacksHeight + pixels.xMarginTop] });
  const getX = (item: ChartDataItem) => item.id;
  const xAxiosLabelWidth = data.length ? (pixels.barStacksWidth / data.length) * AXIOS_TICK_RABEL_MAX_WIDTH_RATIO : pixels.barStacksWidth;
  const viewPort = [0, 0, pixels.barStacksWidth, pixels.barStacksHeight + pixels.xMarginTop + pixels.xMarginBottom];
  const chartData = calcChartData(data);
  const categoryNames = calcCategoryNames(data);
  const colorScale = scaleOrdinal({ domain: categoryNames, range: calcColorRange(data) });
  return { chartData, categoryNames, xScale, yScale, yAxiosScale, colorScale, getX, xAxiosLabelWidth, viewPort };
}

const showBarTooltip = (tooltipData: TooltipData, showTooltip: UseTooltipParams<TooltipData>["showTooltip"], px: number) => {
  const { bar } = tooltipData;
  const pixels = getPixels(px);
  showTooltip({
    tooltipLeft: bar.x + bar.width,
    tooltipTop: bar.y + pixels.xMarginTop,
    tooltipData,
  });
};

function parseProps(props: VerticalBarStackChartProps): VerticalMultiBarChartProps {
  let data: VerticalBarStackDataItem[];
  const { px, onSelect, valueAxiosLabel } = props;
  if (isVerticalSingleBarChartProps(props)) {
    data = props.data.map((item) => ({ ...item, value: [{ name: "KEY", value: item.value, color: props.color }] }));
  } else {
    data = props.data;
  }
  return { px, onSelect, data, valueAxiosLabel };
}

export interface VerticalBarStackDataItemCategoryValue {
  name: string;
  description?: string;
  value: number;
  color: string;
}

export interface VerticalBarStackDataItem {
  id: string;
  name: string;
  title?: string;
  description: string;
  value: VerticalBarStackDataItemCategoryValue[];
}

export interface VerticalSingleBarStackDataItem extends Omit<VerticalBarStackDataItem, "value"> {
  value: number;
}

export interface VerticalSingleBarStackChartProps {
  data: VerticalSingleBarStackDataItem[];
  onSelect?: (id: string) => any;
  color: string;
  px?: number;
  valueAxiosLabel: string;
}

export interface VerticalMultiBarChartProps {
  data: VerticalBarStackDataItem[];
  onSelect?: (id: string) => any;
  px?: number;
  valueAxiosLabel: string;
}

export type VerticalBarStackChartProps = VerticalSingleBarStackChartProps | VerticalMultiBarChartProps;
export function VerticalBarStackChart(props: VerticalBarStackChartProps) {
  const { onSelect, px = 1, data, valueAxiosLabel } = useMemo(() => parseProps(props), [props]);
  const css = useStyle();
  const pixels = useMemo(() => getPixels(px), [px]);
  const inlineStyles = useMemo(() => getInlineStyles(px), [px]);
  const { chartData, categoryNames, xScale, yScale, yAxiosScale, colorScale, getX, xAxiosLabelWidth, viewPort } = useMemo(
    () => computed({ px, data }),
    [data, px]
  );
  const { tooltipOpen, tooltipData, tooltipTop, tooltipLeft, showTooltip, hideTooltip } = useTooltip<TooltipData>();

  const rectList = (barStacks: TBarStack[]) =>
    barStacks.map((barStack) =>
      barStack.bars.map((bar) => (
        <rect
          key={`bar-${bar.key}-${bar.index}`}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          fill={bar.color}
          onMouseOver={() => showBarTooltip({ bar, barStack }, showTooltip, px)}
          onMouseLeave={hideTooltip}
        />
      ))
    );
  const descriptionList = (barStacks: TBarStack[]) => {
    if (!barStacks.length) return [];
    barStacks.slice(-1)[0].bars.map((bar) => (
      <text key={`desc-${bar.index}`} x={bar.x + 0.5 * bar.width} y={bar.y - pixels.descMarginBottom} style={inlineStyles.desc}>
        12334
        {data[bar.index].description}
      </text>
    ));
  };
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
  const tooltipContent = tooltipOpen && tooltipData ? data[tooltipData.bar.index].value[tooltipData.barStack.index].description : undefined;
  return (
    <div className={css.svg}>
      <svg width={viewPort[2]} height={viewPort[3]}>
        <Group top={pixels.xMarginTop}>
          <VisxBarStack data={chartData} keys={categoryNames} xScale={xScale} yScale={yScale} color={colorScale} x={getX}>
            {(barStacks) => [rectList(barStacks), descriptionList(barStacks)]}
          </VisxBarStack>
          <AxisBottom
            hideTicks
            top={pixels.barStacksHeight}
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

function isVerticalSingleBarChartProps(props: VerticalBarStackChartProps): props is VerticalSingleBarStackChartProps {
  if (props.data[0] == null) return true;
  return typeof props.data[0].value === "number";
}
