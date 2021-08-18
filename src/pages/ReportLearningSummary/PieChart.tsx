import { makeStyles } from "@material-ui/core";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import Pie, { PieArcDatum, ProvidedProps } from "@visx/shape/lib/shapes/Pie";
import { Text } from "@visx/text";
import { Tooltip, useTooltip } from "@visx/tooltip";
import React, { useMemo, useState } from "react";
import { d } from "../../locale/LocaleManager";
const categoryColors = ["#8693f0", "#fe9b9b", "#A4DDFF", "#CB9BFF", "#8693F0", "#FFA966", "#FB7575", "#9E46FF", "#77DCB7", "#FBD775"];
const LEGEND_WIDTH = 53;
const useStyle = makeStyles(({ breakpoints }) => ({
  chart: {
    // marginTop: 24,
    // marginBottom: 300,
    width: "100%",
    height: "100%",
    position: "relative",
    boxSizing: "border-box",
    [breakpoints.up("md")]: {
      paddingRight: LEGEND_WIDTH,
    },
    display: "flex",
  },
  pieCon: {
    flex: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  legend: {
    flex: 2,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
    // [breakpoints.up("md")]: {
    //   // position: "absolute",
    //   // top: 0,
    //   // right: 0,
    //   width: LEGEND_WIDTH,
    // },
    // [breakpoints.down("sm")]: {
    //   width: "100%",
    //   display: "flex",
    //   flexWrap: "wrap",
    // },
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
    marginLeft: 65,
    [breakpoints.down("sm")]: {
      marginRight: 24,
      width: "auto",
      height: 25,
    },
  },

  legendIcon: {
    width: 53,
    height: 25,
    marginRight: 12,
  },
  legendTitle: {
    width: "calc(100% - 118px)",
    fontSize: 14,
    fontWeight: "lighter",
    textAlign: "left",
    lineHeight: 20 / 16,
    [breakpoints.down("sm")]: {
      width: "auto",
      height: 20,
      minWidth: LEGEND_WIDTH - 80 - 32 - 12,
      maxWidth: 2 * LEGEND_WIDTH - 32 - 12,
      overflowX: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
  svgContainer: {
    position: "absolute",
  },
  svg: {
    // backgroundColor: "rgba(0,0,0, .02)",
    fontFamily: "Helvetica",
  },
}));
const getInlineStyles = (px: number) => ({
  pieText: {
    fill: "white",
    fontSize: 16 * px,
    fontWeight: "lighter" as const,
    textAnchor: "middle" as const,
    verticalAnchor: "middle" as const,
  },
  tooltip: {
    position: "absolute" as const,
    backgroundColor: "white" as const,
    color: "rgb(102, 102, 102)",
    borderRadius: 3 * px,
    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14)",
    pointerEvents: "none" as const,
    padding: 12 * px,
    wordBreak: "keep-all" as const,
  },
  tooltipContent: {
    width: 240 * px,
    fontSize: 14 * px,
    lineHeight: 20 / 14,
  },
  tooltipTitle: {
    fontSize: 14 * px,
    fontWeight: "bold" as const,
    lineHeight: 1,
    marginBottom: 5 * px,
    color: "#0E78D5" as const,
  },
  tooltipLinker: {
    fill: "none",
    strokeWidth: 1.5 * px,
  },
});
const getPixels = (px: number) => ({
  outerRadius: 130 * px,
  innerRadius: 0 * px,
  extendRadius: 0 * px,
  tooltipWidth: 240 * px,
  tooltipMargin: 0 * px,
  viewMargin: 80 * px,
});

export interface PieDataProps {
  name: string;
  value: number;
}
const mapRatio = (data: PieDataProps[]): RatioExtendedEntityTeacherReportCategory[] => {
  const sum = data.reduce((r, item) => r + (item.value || 0), 0);
  return data.map((item) => {
    return {
      ...item,
      items_ratio: sum === 0 ? 0 : (item.value || 0) / sum,
    };
  });
};
const computed = (props: PieChartProps) => {
  const { px, data } = props;
  const pixels = getPixels(px);
  const viewPort = [
    0,
    0,
    300,
    300,
    // 2 * (pixels.viewMargin + pixels.tooltipWidth + pixels.tooltipMargin + pixels.outerRadius),
    // 2 * (pixels.viewMargin + pixels.outerRadius),
  ];
  const colorScale = scaleOrdinal({ domain: data.map((item) => item.name), range: categoryColors.slice(0, data.length) });
  const radiusScale = (radius: number) => (2 * radius) / (pixels.outerRadius + pixels.innerRadius);
  const pieValue = (item: RatioExtendedEntityTeacherReportCategory) => item.items_ratio;
  return { viewPort, colorScale, pieValue, radiusScale };
};
const sig = (x: boolean) => (x ? 1 : -1);
export interface PieChartProps {}
interface RatioExtendedEntityTeacherReportCategory extends PieDataProps {
  items_ratio: number;
}
interface PieItemProps {
  pie: ProvidedProps<RatioExtendedEntityTeacherReportCategory>;
  arc: PieArcDatum<RatioExtendedEntityTeacherReportCategory>;
}
export interface PieChartProps {
  px: number;
  data: PieDataProps[];
}
interface TooltipData {
  yProperty: "top" | "bottom";
  xProperty: "left" | "right";
  data: RatioExtendedEntityTeacherReportCategory;
}
export function PieChart(props: PieChartProps) {
  const css = useStyle();
  const { px } = props;
  const data = mapRatio(props.data);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const pixels = useMemo(() => getPixels(px), [px]);
  const { viewPort, colorScale, pieValue, radiusScale } = useMemo(() => computed(props), [props]);
  const inlineStyles = useMemo(() => getInlineStyles(px), [px]);
  const { tooltipOpen, tooltipData, showTooltip, hideTooltip, tooltipLeft, tooltipTop } = useTooltip<TooltipData>();
  const pieItem = ({ pie, arc }: PieItemProps) => {
    const [centroidX, centroidY] = pie.path.centroid(arc);
    const angle = (arc.startAngle + arc.endAngle) / 2;
    const isBottom = angle > Math.PI / 2 && angle < Math.PI * 1.5;
    const isRight = angle < Math.PI;
    const x0 = centroidX * radiusScale(pixels.outerRadius);
    const y0 = centroidY * radiusScale(pixels.outerRadius);
    const x1 = centroidX * radiusScale(pixels.extendRadius);
    const y1 = centroidY * radiusScale(pixels.extendRadius);
    const x2 = sig(isRight) * 20;
    const showPieTooltip = () => {
      setActiveCategoryName("test" as string);
      setActiveCategoryName("test");
      showTooltip({
        tooltipLeft: 120 + x2 + viewPort[3] / 2,
        tooltipTop: y1 + viewPort[3] / 2,
        tooltipData: {
          data: arc.data,
          xProperty: isRight ? "left" : "right",
          yProperty: isBottom ? "bottom" : "top",
        },
      });
    };
    return (
      <g key={arc.index}>
        <path
          d={pie.path({ ...arc }) || undefined}
          fill={colorScale(arc.data.name)}
          onMouseOver={showPieTooltip}
          onMouseLeave={() => {
            hideTooltip();
            setActiveCategoryName("");
          }}
        />
        <Text x={centroidX + 1} y={arc.data.items_ratio === 1 ? 0 : centroidY} style={inlineStyles.pieText}>
          {arc.data.items_ratio < 0.05 ? "" : (100 * arc.data.items_ratio).toFixed(1) + "%"}
        </Text>
        {activeCategoryName === "none" && (
          <path d={`M${x0},${y0} L${x1},${y1} H${x2}`} stroke={colorScale(arc.data.name)} {...inlineStyles.tooltipLinker} />
        )}
      </g>
    );
  };
  const dataLegend = () => [d("Attended").t("report_liveclass_attended"), d("Absent").t("report_liveclass_absent")];
  return (
    <div className={css.chart}>
      <div className={css.pieCon}>
        <svg width={viewPort[2]} height={viewPort[3]} className={css.svg}>
          <Group top={0.5 * viewPort[3]} left={0.5 * viewPort[2]}>
            <Pie data={data} pieValue={pieValue} outerRadius={pixels.outerRadius} innerRadius={pixels.innerRadius}>
              {(pie) => pie.arcs.map((arc) => pieItem({ pie, arc }))}
            </Pie>
          </Group>
        </svg>
      </div>
      <div className={css.legend}>
        {dataLegend().map((item, index) => (
          <div className={css.legendItem} key={item}>
            <div className={css.legendIcon} style={{ backgroundColor: categoryColors[index] }} />
            <div className={css.legendTitle}>{item}</div>
          </div>
        ))}
      </div>
      {tooltipOpen && tooltipData && (
        <Tooltip top={tooltipTop} left={tooltipLeft} offsetTop={0} offsetLeft={0} style={{ position: "absolute" }}>
          <div style={{ ...inlineStyles.tooltip, [tooltipData.yProperty]: 0, [tooltipData.xProperty]: 0 }}>
            <div style={inlineStyles.tooltipTitle}>
              {(tooltipData.data.items_ratio * 100).toFixed(1)}%&nbsp;
              {tooltipData.data.name}
              {/* {tooltipData.data?.value}&nbsp; */}
            </div>
            {/* {tooltipData.data.items?.map((desc, idx) => (
              <div key={idx} style={inlineStyles.tooltipContent}>
                {desc}
              </div>
            ))} */}
          </div>
        </Tooltip>
      )}
    </div>
  );
}
