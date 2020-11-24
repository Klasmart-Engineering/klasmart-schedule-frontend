import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleOrdinal } from "@visx/scale";
import { Pie } from "@visx/shape";
import { PieArcDatum, ProvidedProps } from "@visx/shape/lib/shapes/Pie";
import { Text } from "@visx/text";
import { Tooltip, useTooltip } from "@visx/tooltip";
import React, { useMemo, useState } from "react";
import { EntityTeacherReportCategory } from "../../api/api.auto";
import LayoutBox from "../../components/LayoutBox";
import { useChartScale } from "../../hooks/useChartScale";

interface RatioExtendedEntityTeacherReportCategory extends EntityTeacherReportCategory {
  items_ratio: number;
}

// todo: 如果颜色超过10个， 需要 doris 补颜色
const categoryColors = ["#89C4F9", "#FF9492", "#A4DDFF", "#CB9BFF", "#8693F0", "#FFA966", "#FB7575", "#9E46FF", "#77DCB7", "#FBD775"];
const LEGEND_WIDTH = 130;

const useStyle = makeStyles(({ breakpoints }) => ({
  chart: {
    marginTop: 24,
    marginBottom: 300,
    position: "relative",
    [breakpoints.up("md")]: {
      paddingRight: LEGEND_WIDTH,
    },
  },
  legend: {
    [breakpoints.up("md")]: {
      position: "absolute",
      top: 0,
      right: 0,
      width: LEGEND_WIDTH,
    },
    [breakpoints.down("sm")]: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
    },
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: 12,
    width: LEGEND_WIDTH,
    [breakpoints.down("sm")]: {
      marginRight: 24,
      width: "auto",
      height: 20,
    },
  },
  legendIcon: {
    width: 32,
    height: 20,
    marginRight: 12,
  },
  legendTitle: {
    width: 88,
    fontSize: 16,
    fontWeight: "lighter",
    lineHeight: 20 / 16,
    [breakpoints.down("sm")]: {
      width: "auto",
      height: 20,
      minWidth: LEGEND_WIDTH - 32 - 12,
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

const getPixels = (px: number) => ({
  outerRadius: 300 * px,
  innerRadius: 100 * px,
  extendRadius: 340 * px,
  tooltipWidth: 240 * px,
  tooltipMargin: 80 * px,
  viewMargin: 80 * px,
});

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
    boxShadow: "rgba(33, 33, 33, 0.2) 0px 1px 2px",
    pointerEvents: "none" as const,
    padding: 12 * px,
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
    marginTop: 11 * px,
    marginBottom: 5 * px,
    color: "#0E78D5" as const,
  },
  tooltipLinker: {
    fill: "none",
    strokeWidth: 1.5 * px,
  },
});

const mapRatio = (data: EntityTeacherReportCategory[]): RatioExtendedEntityTeacherReportCategory[] => {
  const sum = data.reduce((r, item) => r + (item.items?.length || 0), 0);
  return data.map((item) => {
    return {
      ...item,
      items_ratio: sum === 0 ? 0 : (item.items?.length || 0) / sum,
    };
  });
};

const computed = (props: CategoriesStaticChartProps) => {
  const { px, data } = props;
  const pixels = getPixels(px);
  const viewPort = [
    0,
    0,
    2 * (pixels.viewMargin + pixels.tooltipWidth + pixels.tooltipMargin + pixels.outerRadius),
    2 * (pixels.viewMargin + pixels.outerRadius),
  ];
  const colorScale = scaleOrdinal({ domain: data.map((item) => item.name as string), range: categoryColors.slice(0, data.length) });
  const radiusScale = (radius: number) => (2 * radius) / (pixels.outerRadius + pixels.innerRadius);
  const pieValue = (item: RatioExtendedEntityTeacherReportCategory) => item.items_ratio;
  return { viewPort, colorScale, pieValue, radiusScale };
};

const sig = (x: boolean) => (x ? 1 : -1);

interface TooltipData {
  yProperty: "top" | "bottom";
  xProperty: "left" | "right";
  data: EntityTeacherReportCategory;
}
interface PieItemProps {
  pie: ProvidedProps<RatioExtendedEntityTeacherReportCategory>;
  arc: PieArcDatum<RatioExtendedEntityTeacherReportCategory>;
}
export interface CategoriesStaticChartProps extends CategoriesChartProps {
  px: number;
}
export function CategoriesStaticChart(props: CategoriesStaticChartProps) {
  const { px } = props;
  const data = mapRatio(props.data);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const css = useStyle();
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
    const x2 = sig(isRight) * (pixels.outerRadius + pixels.tooltipMargin);
    const showPieTooltip = () => {
      setActiveCategoryName(arc.data.name as string);
      showTooltip({
        tooltipLeft: x2 + viewPort[2] / 2,
        tooltipTop: y1 + viewPort[3] / 2,
        tooltipData: {
          data: arc.data,
          xProperty: isRight ? "left" : "right",
          yProperty: isBottom ? "bottom" : "top",
        },
      });
    };
    return (
      <g key={arc.data.name}>
        <path
          d={pie.path({ ...arc }) || undefined}
          fill={colorScale(arc.data.name as string)}
          onMouseOver={showPieTooltip}
          onMouseLeave={() => {
            hideTooltip();
            setActiveCategoryName("");
          }}
        />
        <Text x={centroidX} y={centroidY} style={inlineStyles.pieText}>
          {arc.data.items_ratio < 0.05 ? '' : (100 * arc.data.items_ratio).toFixed(0) + "%"}
        </Text>
        {activeCategoryName === arc.data.name && (
          <path d={`M${x0},${y0} L${x1},${y1} H${x2}`} stroke={colorScale(arc.data.name)} {...inlineStyles.tooltipLinker} />
        )}
      </g>
    );
  };
  return (
    <div className={css.chart}>
      <div className={css.legend}>
        {data.map(({ name }) => (
          <div className={css.legendItem} key={name}>
            <div className={css.legendIcon} style={{ backgroundColor: colorScale(name as string) }} />
            <div className={css.legendTitle}>{name}</div>
          </div>
        ))}
      </div>
      <svg width={viewPort[2]} height={viewPort[3]} className={css.svg}>
        <Group top={0.5 * viewPort[3]} left={0.5 * viewPort[2]}>
          <Pie data={data} pieValue={pieValue} outerRadius={pixels.outerRadius} innerRadius={pixels.innerRadius}>
            {(pie) => pie.arcs.map((arc) => pieItem({ pie, arc }))}
          </Pie>
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <Tooltip top={tooltipTop} left={tooltipLeft} offsetTop={0} offsetLeft={0} style={{ position: "absolute" }}>
          <div style={{ ...inlineStyles.tooltip, [tooltipData.yProperty]: 0, [tooltipData.xProperty]: 0 }}>
            <div style={inlineStyles.tooltipTitle}>{tooltipData.data.items?.length}&nbsp;LOs</div>
            {tooltipData.data.items?.map((desc, idx) => (
              <div key={idx} style={inlineStyles.tooltipContent}>
                {desc}
              </div>
            ))}
          </div>
        </Tooltip>
      )}
    </div>
  );
}

export interface CategoriesChartProps {
  data: EntityTeacherReportCategory[];
}
export function CategoriesChart(props: CategoriesChartProps) {
  const css = useStyle();
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  const scale = useChartScale();
  const {
    viewPort: [, , svgWidth, svgHeight],
  } = useMemo(() => computed({ ...props, px: 1 }), [props]);
  if (scale(1) !== 1) {
    const scalableWidth = window.innerWidth - (upMd ? 1 : 0) * LEGEND_WIDTH;
    const px = scale(scalableWidth / svgWidth);
    return (
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <div className={css.chart} style={{ height: svgHeight * px, overflowX: "scroll" }}>
          <div className={css.svgContainer}>
            <CategoriesStaticChart {...props} px={px} />
          </div>
        </div>
      </LayoutBox>
    );
  }

  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div className={css.chart} style={{ paddingBottom: `${(100 * svgHeight) / svgWidth}%` }}>
        <ParentSize>
          {(info) => {
            const px = info.width / svgWidth;
            return !px ? null : (
              <div className={css.svgContainer}>
                <CategoriesStaticChart {...props} px={px} />
              </div>
            );
          }}
        </ParentSize>
      </div>
    </LayoutBox>
  );
}
