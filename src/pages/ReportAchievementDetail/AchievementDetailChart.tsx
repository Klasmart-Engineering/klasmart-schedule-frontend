import { makeStyles } from "@material-ui/core";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStack as VisxBarStack } from "@visx/shape";
import { BarStack } from "@visx/shape/lib/types";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { UseTooltipParams } from "@visx/tooltip/lib/hooks/useTooltip";
import React, { useMemo } from "react";
import { EntityStudentReportCategory } from "../../api/api.auto";
import LayoutBox from "../../components/LayoutBox";
import { ReportFilter, StatusColor } from "../ReportAchievementList/types";

const useStyle = makeStyles({
  chart: {
    marginTop: 24,
    position: "relative",
  },
  svg: {
    backgroundColor: "rgba(0,0,0, .02)",
  },
  desc: {
    textAnchor: "middle",
    alignmentBaseline: "baseline",
    stroke: "black",
  },
  axiosLine: {
    stroke: "#999999",
  },
  tooltipContent: {
    maxWidth: 240,
    fontSize: 14,
    lineHeight: 17 / 14,
  },
  tooltipTitle: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 1,
    marginTop: 11,
    marginBottom: 5,
    color: "#0E78D5",
  },
});

const pixels = {
  barStacksWidth: 1500,
  barStacksHeight: 400,
  barStackMarginRatio: 100 / (100 + 160),
  descMarginBottom: 16,
  xMarginTop: 180,
  xMarginBottom: 160,
};

const inlineStyles = {
  xAxiosTickLabel: {
    stroke: "black",
    fontSize: 18,
    textAnchor: "middle" as const,
    dy: 20,
  },
  yAxiosLabel: {
    x: 15,
    y: 40,
    fontSize: 16,
    stroke: "#999",
    textAnchor: "start" as const,
    transform: "",
  },
};

type TBarStack = BarStack<RatioExtendedCategory, string>;
type TBar = TBarStack["bars"][0];
type RatioKey = typeof RATIO_KEYS[keyof typeof RATIO_KEYS];
type DetailKey = typeof DETAIL_KEYS[keyof typeof DETAIL_KEYS];

const RATIO_KEYS = {
  [ReportFilter.achieved]: "achieved_ratio" as const,
  [ReportFilter.not_achieved]: "not_achieved_ratio" as const,
  [ReportFilter.not_attempted]: "not_attempted_ratio" as const,
};
const DETAIL_KEYS = {
  [ReportFilter.achieved]: "achieved_items" as const,
  [ReportFilter.not_achieved]: "not_achieved_items" as const,
  [ReportFilter.not_attempted]: "not_attempted_items" as const,
};

const ratioKey2DetailKey = (ratioKey: RatioKey): DetailKey => {
  const [filter] = Object.entries(RATIO_KEYS).find(([k, v]) => (v = ratioKey)) || [];
  return DETAIL_KEYS[(filter as unknown) as keyof typeof DETAIL_KEYS];
};

type RatioExtendedCategory = EntityStudentReportCategory &
  {
    [key in RatioKey | "sum"]: number;
  };
const mapRatio = (data: EntityStudentReportCategory[]): RatioExtendedCategory[] => {
  return data.map((item) => {
    const achieved_items = item.achieved_items || [];
    const not_achieved_items = item.not_achieved_items || [];
    const not_attempted_items = item.not_attempted_items || [];
    const sum = achieved_items.length + not_achieved_items.length + not_attempted_items.length;
    return {
      ...item,
      [RATIO_KEYS[ReportFilter.achieved]]: (100 * achieved_items.length) / sum,
      [RATIO_KEYS[ReportFilter.not_achieved]]: (100 * not_achieved_items.length) / sum,
      [RATIO_KEYS[ReportFilter.not_attempted]]: (100 * not_attempted_items.length) / sum,
      sum,
    };
  });
};

const computed = (props: AchievementDetailChartProps) => {
  const data = mapRatio(props.data);
  const xScale = scaleBand({
    domain: data.map((item) => item.name as string),
    range: [0, pixels.barStacksWidth],
    padding: pixels.barStackMarginRatio,
  });
  const yScale = scaleLinear({ domain: [100, 0], range: [0, pixels.barStacksHeight] });
  const yAxiosScale = scaleLinear({ domain: [100, 0], range: [0, pixels.barStacksHeight + pixels.xMarginTop] });
  const ratioKeys = Object.values(RATIO_KEYS);
  const colorScale = scaleOrdinal({ domain: ratioKeys, range: Object.values(StatusColor) });
  const getX = (data: EntityStudentReportCategory) => data.name as string;
  return { data, xScale, yScale, yAxiosScale, colorScale, getX, ratioKeys };
};

const showBarTooltip = (bar: TBar, showTooltip: UseTooltipParams<TBar>["showTooltip"]) => {
  showTooltip({
    tooltipLeft: bar.x + bar.width,
    tooltipTop: bar.y + pixels.xMarginTop,
    tooltipData: bar,
  });
};

export interface AchievementDetailChartProps {
  data: EntityStudentReportCategory[];
}

export function AchievementDetailChart(props: AchievementDetailChartProps) {
  const css = useStyle();
  const { data, xScale, yScale, yAxiosScale, colorScale, getX, ratioKeys } = useMemo(() => computed(props), [props]);
  const { tooltipOpen, tooltipData, tooltipTop, tooltipLeft, showTooltip, hideTooltip } = useTooltip<TBar>();

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
          onMouseOver={() => showBarTooltip(bar, showTooltip)}
          onMouseLeave={hideTooltip}
        />
      ))
    );
  const descriptionList = (barStacks: TBarStack[]) =>
    barStacks.slice(-1)[0].bars.map((bar) => (
      <text key={`desc-${bar.index}`} x={bar.x + 0.5 * bar.width} y={bar.y - pixels.descMarginBottom} className={css.desc}>
        100%,&nbsp;
        {data[bar.index].sum}&nbsp;LOs
      </text>
    ));
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div className={css.chart}>
        <svg width={pixels.barStacksWidth} height={pixels.barStacksHeight + pixels.xMarginTop + pixels.xMarginBottom} className={css.svg}>
          <Group top={pixels.xMarginTop}>
            <VisxBarStack data={data} keys={ratioKeys} xScale={xScale} yScale={yScale} color={colorScale} x={getX}>
              {(barStacks) => [rectList(barStacks), descriptionList(barStacks)]}
            </VisxBarStack>
            <AxisBottom
              hideTicks
              top={pixels.barStacksHeight}
              scale={xScale}
              axisLineClassName={css.axiosLine}
              tickLabelProps={() => inlineStyles.xAxiosTickLabel}
            />
          </Group>
          <AxisLeft
            hideTicks
            top={0}
            scale={yAxiosScale}
            axisLineClassName={css.axiosLine}
            label="% of Learning Outcomes"
            labelOffset={0}
            labelProps={inlineStyles.yAxiosLabel}
          />
        </svg>
        {tooltipOpen && tooltipData && (
          <Tooltip top={tooltipTop} left={tooltipLeft} offsetLeft={0} offsetTop={0}>
            <div className={css.tooltipContent}>
              <div className={css.tooltipTitle}>
                {tooltipData.bar.data[ratioKey2DetailKey(tooltipData.key as RatioKey)]?.length}&nbsp;LOs
              </div>
              {tooltipData.bar.data[ratioKey2DetailKey(tooltipData.key as RatioKey)]?.map((desc, idx) => [
                ...desc.split("\n").map((p, idy) => [p, <br key={`br-${idx}-${idy}`} />]),
                <br key={`br-${idx}`} />,
              ])}
            </div>
          </Tooltip>
        )}
      </div>
    </LayoutBox>
  );
}
