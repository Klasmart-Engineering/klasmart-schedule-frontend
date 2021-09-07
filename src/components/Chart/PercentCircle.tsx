import { Box } from "@material-ui/core";
import { Group } from "@visx/group";
import Pie from "@visx/shape/lib/shapes/Pie";
import { get } from "lodash";
import React from "react";

interface IProps {
  value: number;
  total: number;
  label?: string;
  percentAsLabel?: boolean;
  width: number;
  height: number;
  fontSize?: number;
  margin?: typeof defaultMargin;
  colors?: React.CSSProperties["color"][];
}
interface IData {
  label: string;
  value: number;
  color: React.CSSProperties["color"];
}

const getValue = (d: IData) => d.value;
// color scales
const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export default function PercentCircle({
  value,
  total,
  width,
  height,
  margin = defaultMargin,
  fontSize,
  colors,
  label,
  percentAsLabel,
}: IProps) {
  if (total < value) {
    return null;
  }

  const alldata: IData[] = [
    {
      label: "",
      value: total - value,
      color: get(colors, [1], "#e4e4e4"),
    },
    {
      label: "",
      value,
      color: get(colors, [0], "#0E78D5"),
    },
  ];

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = innerWidth / 10;
  const _fontSize = fontSize || width / 10;

  return (
    <Box>
      <svg width={width} height={height}>
        <Group top={centerY + margin.top} left={centerX + margin.left}>
          <Pie data={alldata} pieValue={getValue} outerRadius={radius} innerRadius={radius - donutThickness} cornerRadius={2} padAngle={0}>
            {(pie) => {
              return pie.arcs.map((arc, index) => {
                const arcPath = pie.path(arc);
                return (
                  <g key={index}>
                    <path d={arcPath!} fill={arc.data.color} />
                  </g>
                );
              });
            }}
          </Pie>
        </Group>

        {(percentAsLabel || label) && (
          <Group top={centerY + margin.top} left={centerX + margin.left}>
            <text x={0} y={0} textAnchor="middle" fontSize={_fontSize} dy=".33em">
              {percentAsLabel ? (
                <>
                  <tspan fontWeight="600" fontSize={_fontSize * 1.2}>
                    {value}
                  </tspan>
                  <tspan>/{total}</tspan>
                </>
              ) : (
                label
              )}
            </text>
          </Group>
        )}
      </svg>
    </Box>
  );
}
