import { makeStyles } from "@material-ui/core";
import { AxisLeft, AxisTop, TickRendererProps } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStackHorizontal } from "@visx/shape";
import { BarStack } from "@visx/shape/lib/types";
import { Text } from "@visx/text";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { UseTooltipParams } from "@visx/tooltip/lib/hooks/useTooltip";
import React, { ReactNode, useMemo } from "react";

const useStyle = makeStyles({
  chart: {
    marginTop: 24,
    marginBottom: 200,
    position: "relative",
  },
  svgContainer: {
    position: "absolute",
  },
  svg: {
    backgroundColor: "rgba(0,0,0, .02)",
    fontFamily: "Helvetica",
  },
  axiosLine: {
    stroke: "#999999",
  },
  toolTip: {
    padding: 0,
  },
});

const getPixels = (px: number) => ({
  barStackWidth: 1200 * px,
  barStackHeight: 55 * px,
  barStackMargin: 48 * px,
  yMarginLeft: 180 * px,
  yMarginRight: 180 * px,
  descMarginLeft: 16 * px,
});

const getInlineStyles = (px: number) => {
  const pixels = getPixels(px);
  return {
    yAxiosTickLabel: {
      stroke: "#0E78D5",
      fontSize: 18 * px,
      fontWeight: "lighter" as const,
      textAnchor: "end" as const,
      verticalAnchor: "middle" as const,
      dx: -20 * px,
      width: 120 * px,
    },
    yAxiosTickLabel__disable: {
      stroke: "black" as const,
    },
    yAxiosTickLabelSub: {
      stroke: "#999999",
      fontSize: 16 * px,
      lineHeight: 22 * px,
      dy: 22 * px,
      verticalAnchor: "start" as const,
    },
    xAxiosLabel: {
      x: pixels.barStackWidth + pixels.yMarginRight - 4 * px,
      y: 24 * px,
      fontSize: 16 * px,
      stroke: "#999",
      textAnchor: "end" as const,
    },
    tooltipContent: {
      display: "flex",
      alignItems: "center",
      height: 32 * px,
      fontSize: 16 * px,
      lineHeight: 1,
      paddingLeft: 20 * px,
      paddingRight: 20 * px,
      // 这里不需要转换，是固定调整
      margin: "-4.8px -8px",
      color: "black",
    },
    desc: {
      fontSize: 18 * px,
      alignmentBaseline: "middle" as const,
      stroke: "black" as const,
      fontWeight: "lighter" as const,
    },
  };
};

type ChartDataItem = Pick<HorizontalBarDataItem, "id" | "name" | "title" | "description"> & Record<string, number>;
type TBarStack = BarStack<ChartDataItem, string>;
type TBar = TBarStack["bars"][0];
type TooltipData = { bar: TBar; barStack: TBarStack };

const dataItemById = (id: string, data: HorizontalBarDataItem[]) => {
  return data.find((item) => item.id === id) as HorizontalBarDataItem;
};

const calcDataSum = (data: HorizontalBarDataItem[]) => {
  return data.map(({ value: categoryValues }) => {
    return categoryValues.reduce((r, item) => r + item.value, 0);
  });
};

const calcChartData = (data: HorizontalBarDataItem[]): ChartDataItem[] => {
  return data.map(({ value: categoryValues, ...restItem }) => {
    return categoryValues.reduce((r, c) => Object.assign(r, { [c.name]: c.value }), restItem as ChartDataItem);
  });
};

const calcCategoryNames = (data: HorizontalBarDataItem[]) => {
  if (!data[0]) return [];
  const { value: categoryValues } = data[0];
  return categoryValues.map((c) => c.name);
};

const calcColorRange = (data: HorizontalBarDataItem[]) => {
  if (!data[0]) return [];
  const { value: categoryValues } = data[0];
  return categoryValues.map((c) => c.color);
};

export const horizontalBarChartSize = (props: Pick<HorizontalBarChartProps, "data">) => {
  const { viewPort } = computed(parseProps({ ...props, color: "red" } as HorizontalBarChartProps));
  return [viewPort[2] - viewPort[0], viewPort[3] - viewPort[1]] as const;
};

function computed(props: HorizontalMultiBarChartProps) {
  const { px = 1, data } = props;
  const pixels = getPixels(px);
  const xMax = Math.max(...calcDataSum(data));
  const barStacksHeight = data.length * (pixels.barStackHeight + pixels.barStackMargin);
  const xScale = scaleLinear({ domain: [0, xMax], range: [0, pixels.barStackWidth] });
  const xAxiosScale = scaleLinear({ domain: [0, xMax], range: [0, pixels.barStackWidth + pixels.yMarginRight] });
  const paddingRatio = pixels.barStackMargin / (pixels.barStackMargin + pixels.barStackHeight);
  const yScale = scaleBand({ domain: data.map((item) => item.id as string), range: [0, barStacksHeight], padding: paddingRatio });
  const getY = (item: ChartDataItem) => item.id;
  const viewPort = [0, 0, pixels.barStackWidth + pixels.yMarginLeft + pixels.yMarginRight, barStacksHeight];
  const chartData = calcChartData(data);
  const categoryNames = calcCategoryNames(data);
  const colorScale = scaleOrdinal({ domain: categoryNames, range: calcColorRange(data) });
  return { chartData, categoryNames, xScale, xAxiosScale, yScale, getY, colorScale, barStacksHeight, viewPort };
}

const showBarTooltip = (tooltipData: TooltipData, showTooltip: UseTooltipParams<TooltipData>["showTooltip"], px: number) => {
  const { bar } = tooltipData;
  const pixels = getPixels(px);
  const inlineStyles = getInlineStyles(px);
  showTooltip({
    tooltipLeft: bar.x + pixels.yMarginLeft + bar.width / 2,
    tooltipTop: bar.y - inlineStyles.tooltipContent.height - 4 * px,
    tooltipData,
  });
};

function parseProps(props: HorizontalBarChartProps): HorizontalMultiBarChartProps {
  let data: HorizontalBarDataItem[];
  const { px, onSelect } = props;
  if (isHorizontalSingleBarChartProps(props)) {
    data = props.data.map((item) => ({ ...item, value: [{ name: "KEY", value: item.value, color: props.color }] }));
  } else {
    data = props.data;
  }
  return { px, onSelect, data };
}

export interface HorizontalBarDataItemCategoryValue {
  name: string;
  description?: string;
  value: number;
  color: string;
}

export interface HorizontalBarDataItem {
  id: string;
  name: string;
  title?: string;
  description: string;
  value: HorizontalBarDataItemCategoryValue[];
}

export interface HorizontalSingleBarDataItem extends Omit<HorizontalBarDataItem, "value"> {
  value: number;
}

export interface HorizontalSingleBarChartProps {
  data: HorizontalSingleBarDataItem[];
  onSelect?: (id: string) => any;
  color: string;
  px?: number;
}

export interface HorizontalMultiBarChartProps {
  data: HorizontalBarDataItem[];
  onSelect?: (id: string) => any;
  px?: number;
}

export type HorizontalBarChartProps = HorizontalSingleBarChartProps | HorizontalMultiBarChartProps;
export function HorizontalBarChart(props: HorizontalBarChartProps) {
  const { onSelect, px = 1, data } = useMemo(() => parseProps(props), [props]);
  const css = useStyle();
  const pixels = useMemo(() => getPixels(px), [px]);
  const inlineStyles = useMemo(() => getInlineStyles(px), [px]);
  const { chartData, categoryNames, xScale, xAxiosScale, yScale, getY, colorScale, barStacksHeight, viewPort } = useMemo(
    () => computed({ onSelect, px, data }),
    [data, onSelect, px]
  );
  const { tooltipOpen, tooltipData, tooltipTop, tooltipLeft, showTooltip, hideTooltip } = useTooltip<TooltipData>();

  const rectList = (barStacks: TBarStack[], px: number) =>
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
  const descriptionList = (barStacks: TBarStack[], px: number) => {
    const pixels = getPixels(px);
    return barStacks.slice(-1)[0].bars.map((bar) => (
      <text key={`desc-${bar.index}`} x={bar.x + bar.width + pixels.descMarginLeft} y={bar.y + 0.5 * bar.height} style={inlineStyles.desc}>
        {data[bar.index].description}
      </text>
    ));
  };
  const tickComponent = (tickProps: TickRendererProps): ReactNode => {
    const { formattedValue: id, ...tickTextProps } = tickProps;
    if (!id) return null;
    const { name, title } = dataItemById(id, data);
    return title ? (
      [
        <Text {...tickTextProps} {...inlineStyles.yAxiosTickLabel__disable} key="name">
          {name}
        </Text>,
        <Text {...tickTextProps} {...inlineStyles.yAxiosTickLabelSub} key="title">
          {title}
        </Text>,
      ]
    ) : (
      <Text {...tickTextProps} onClick={() => onSelect && onSelect(id)}>
        {name}
      </Text>
    );
  };
  const tooltipContent = tooltipOpen && tooltipData ? data[tooltipData.bar.index].value[tooltipData.barStack.index].description : undefined;
  return (
    <>
      <svg width={viewPort[2]} height={viewPort[3]} className={css.svg}>
        <Group left={pixels.yMarginLeft}>
          <BarStackHorizontal
            data={chartData}
            keys={categoryNames}
            height={barStacksHeight}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}
            y={getY}
          >
            {(barStacks) => [rectList(barStacks, px), descriptionList(barStacks, px)]}
          </BarStackHorizontal>
          <AxisLeft
            hideTicks
            scale={yScale}
            numTicks={data.length}
            axisLineClassName={css.axiosLine}
            tickLabelProps={() => inlineStyles.yAxiosTickLabel}
            tickComponent={tickComponent}
          />
          <AxisTop
            hideTicks
            top={0}
            scale={xAxiosScale}
            axisLineClassName={css.axiosLine}
            label="in % of all Learning Outcomes"
            labelOffset={0}
            labelProps={inlineStyles.xAxiosLabel}
          />
        </Group>
      </svg>
      {tooltipContent && (
        <Tooltip top={tooltipTop} left={tooltipLeft} offsetLeft={0} offsetTop={0}>
          <div style={inlineStyles.tooltipContent}>{tooltipContent}</div>
        </Tooltip>
      )}
    </>
  );
}

function isHorizontalSingleBarChartProps(props: HorizontalBarChartProps): props is HorizontalSingleBarChartProps {
  if (props.data[0] == null) return true;
  return typeof props.data[0].value === "number";
}
