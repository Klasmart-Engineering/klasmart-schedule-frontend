import { makeStyles } from "@material-ui/core";
import { AxisLeft, AxisTop } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStackHorizontal } from "@visx/shape";
import { BarStack } from "@visx/shape/lib/types";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { UseTooltipParams } from "@visx/tooltip/lib/hooks/useTooltip";
import React, { useMemo } from "react";
import { EntityStudentReportItem } from "../../api/api.auto";
import LayoutBox from "../../components/LayoutBox";
import { ReportFilter, StatusColor } from "./types";

const useStyle = makeStyles({
  chart: {
    marginTop: 24,
    position: "relative",
  },
  svgContainer: {
    position: "absolute",
  },
  svg: {
    backgroundColor: "rgba(0,0,0, .02)",
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
      textAnchor: "end" as const,
      dx: -37 * px,
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
    },
  };
};

type TBarStack = BarStack<RatioExtendedEntityStudentReportItem, string>;
type TBar = TBarStack["bars"][0];
type RatioKey = typeof RATIO_KEYS[keyof typeof RATIO_KEYS];
type CountKey = typeof COUNT_KEYS[keyof typeof COUNT_KEYS];

const RATIO_KEYS = {
  [ReportFilter.achieved]: "achieved_ratio" as const,
  [ReportFilter.not_achieved]: "not_achieved_ratio" as const,
  [ReportFilter.not_attempted]: "not_attempted_ratio" as const,
};
const COUNT_KEYS = {
  [ReportFilter.achieved]: "achieved_count" as const,
  [ReportFilter.not_achieved]: "not_achieved_count" as const,
  [ReportFilter.not_attempted]: "not_attempted_count" as const,
};

const ratioKey2countKey = (ratioKey: RatioKey): CountKey => {
  const [filter] = Object.entries(RATIO_KEYS).find(([k, v]) => (v = ratioKey)) || [];
  return COUNT_KEYS[(filter as unknown) as keyof typeof COUNT_KEYS];
};

type RatioExtendedEntityStudentReportItem = EntityStudentReportItem &
  {
    [key in RatioKey | "sum"]: number;
  };
const mapRatio = (data: EntityStudentReportItem[]): RatioExtendedEntityStudentReportItem[] => {
  return data.map((item) => {
    const { achieved_count = 0, not_achieved_count = 0, not_attempted_count = 0 } = item;
    const sum = achieved_count + not_achieved_count + not_attempted_count;
    return {
      ...item,
      [RATIO_KEYS[ReportFilter.achieved]]: (100 * achieved_count) / sum,
      [RATIO_KEYS[ReportFilter.not_achieved]]: (100 * not_achieved_count) / sum,
      [RATIO_KEYS[ReportFilter.not_attempted]]: (100 * not_attempted_count) / sum,
      sum,
    };
  });
};

const studentName2studentId = (name: string, data: EntityStudentReportItem[]) => {
  return data.find((item) => item.student_name === name)?.student_id as string;
};

const computed = (props: AchievementListStaticChartProps) => {
  const { filter, px } = props;
  const pixels = getPixels(px);
  const data = mapRatio(props.data);
  const barStacksHeight = data.length * (pixels.barStackHeight + pixels.barStackMargin);
  const xScale = scaleLinear({ domain: [0, 100], range: [0, pixels.barStackWidth] });
  const xAxiosScale = scaleLinear({ domain: [0, 100], range: [0, pixels.barStackWidth + pixels.yMarginRight] });
  const paddingRatio = pixels.barStackMargin / (pixels.barStackMargin + pixels.barStackHeight);
  const yScale = scaleBand({ domain: data.map((item) => item.student_name as string), range: [barStacksHeight, 0], padding: paddingRatio });
  const ratioKeys = filter === ReportFilter.all ? Object.values(RATIO_KEYS) : [RATIO_KEYS[filter]];
  const colorScale = scaleOrdinal({
    domain: ratioKeys,
    range: filter === ReportFilter.all ? Object.values(StatusColor) : [StatusColor[filter]],
  });
  const getY = (data: EntityStudentReportItem) => data.student_name as string;
  const viewPort = [0, 0, pixels.barStackWidth + pixels.yMarginLeft + pixels.yMarginRight, barStacksHeight];
  return { data, xScale, xAxiosScale, yScale, colorScale, getY, ratioKeys, barStacksHeight, viewPort };
};

const showBarTooltip = (bar: TBar, showTooltip: UseTooltipParams<TBar>["showTooltip"], px: number) => {
  const pixels = getPixels(px);
  const inlineStyles = getInlineStyles(px);
  showTooltip({
    tooltipLeft: bar.x + pixels.yMarginLeft + bar.width / 2,
    tooltipTop: bar.y - inlineStyles.tooltipContent.height - 4 * px,
    tooltipData: bar,
  });
};

interface AchievementListStaticChartProps extends AchievementListChartProps {
  px: number;
}
export function AchievementListStaticChart(props: AchievementListStaticChartProps) {
  const { filter, onClickStudent, px } = props;
  const css = useStyle();
  const pixels = useMemo(() => getPixels(px), [px]);
  const inlineStyles = useMemo(() => getInlineStyles(px), [px]);
  const { data, xScale, xAxiosScale, yScale, colorScale, getY, ratioKeys, barStacksHeight, viewPort } = useMemo(() => computed(props), [
    props,
  ]);
  const { tooltipOpen, tooltipData, tooltipTop, tooltipLeft, showTooltip, hideTooltip } = useTooltip<TBar>();

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
          onMouseOver={() => showBarTooltip(bar, showTooltip, px)}
          onMouseLeave={hideTooltip}
        />
      ))
    );
  const descriptionList = (barStacks: TBarStack[], px: number) => {
    const pixels = getPixels(px);
    return barStacks.slice(-1)[0].bars.map((bar) => (
      <text key={`desc-${bar.index}`} x={bar.x + bar.width + pixels.descMarginLeft} y={bar.y + 0.5 * bar.height} style={inlineStyles.desc}>
        {filter === ReportFilter.all ? 100 : data[bar.index][RATIO_KEYS[filter]].toFixed(0)}%,&nbsp;
        {filter === ReportFilter.all ? data[bar.index].sum : data[bar.index][COUNT_KEYS[filter]]}&nbsp;LOs
      </text>
    ));
  };
  return (
    <>
      <svg width={viewPort[2]} height={viewPort[3]} className={css.svg}>
        <Group left={pixels.yMarginLeft}>
          <BarStackHorizontal
            data={data}
            keys={ratioKeys}
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
            axisLineClassName={css.axiosLine}
            tickLabelProps={() => inlineStyles.yAxiosTickLabel}
            tickComponent={({ formattedValue, ...tickTextProps }) => (
              <text {...tickTextProps} onClick={() => onClickStudent(studentName2studentId(formattedValue as string, data))}>
                {formattedValue}
              </text>
            )}
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
      {tooltipOpen && tooltipData && (
        <Tooltip top={tooltipTop} left={tooltipLeft} offsetLeft={0} offsetTop={0}>
          <div style={inlineStyles.tooltipContent}>
            {tooltipData.bar.data[tooltipData.key as RatioKey].toFixed(0)}%&nbsp;&nbsp;
            {tooltipData.bar.data[ratioKey2countKey(tooltipData.key as RatioKey)]}&nbsp;LOs
          </div>
        </Tooltip>
      )}
    </>
  );
}

export interface AchievementListChartProps {
  data: EntityStudentReportItem[];
  filter: ReportFilter;
  onClickStudent: (studentId: string) => any;
}
export function AchievementListChart(props: AchievementListChartProps) {
  const css = useStyle();
  const {
    viewPort: [, , svgWidth, svgHeight],
  } = useMemo(() => computed({ ...props, px: 1 }), [props]);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div className={css.chart} style={{ paddingTop: `${svgHeight / svgWidth}%` }}>
        <ParentSize>
          {(info) => {
            const px = info.width / svgWidth;
            return !px ? null : (
              <div className={css.svgContainer}>
                <AchievementListStaticChart {...props} px={px} />
              </div>
            );
          }}
        </ParentSize>
      </div>
    </LayoutBox>
  );
}
