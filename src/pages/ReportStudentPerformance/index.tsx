import { Box, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { ChartLayout } from "../../components/Chart/ChartLayout";
import { HorizontalBarChart, horizontalBarChartSize, HorizontalSingleBarDataItem } from "../../components/Chart/HorizontalBarChart";

const mockData1: HorizontalSingleBarDataItem[] = [
  {
    id: "id 0",
    name: "name 0",
    description: "description 0",
    value: 3,
  },
  {
    id: "id 1",
    name: "name 1",
    title: "title 1",
    description: "description 1",
    value: 6,
  },
  {
    id: "id 2",
    name: "name 2",
    description: "description 2",
    value: 9,
  },
];

const mockData2: HorizontalSingleBarDataItem[] = [
  {
    id: "id 0",
    name: "name 0",
    description: "description 0",
    value: 70,
  },
  {
    id: "id 1",
    name: "name 1",
    title: "title 1",
    description: "description 1",
    value: 40,
  },
  {
    id: "id 2",
    name: "name 2",
    description: "description 2",
    value: 90,
  },
  {
    id: "id 3",
    name: "name 3",
    description: "description 3",
    value: 120,
  },
];

export function ReportStudentPerformance() {
  const theme = useTheme();
  const upLg = useMediaQuery(theme.breakpoints.up("lg"));
  console.log("upLg = ", upLg);
  const [w1, h1] = horizontalBarChartSize({ data: mockData1 });
  const [w2, h2] = horizontalBarChartSize({ data: mockData1 });
  const chartWidth = upLg ? w1 + w2 + 250 : Math.max(w1, w2);
  const chartHeight = Math.max(h1, h2);
  return (
    <ChartLayout
      {...{ chartWidth, chartHeight }}
      render={(px) => (
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" width={chartWidth * px}>
          <HorizontalBarChart data={mockData1} color="#8693F0" px={px} />
          <HorizontalBarChart data={mockData2} color="#FF9492" px={px} />
        </Box>
      )}
    />
  );
}

ReportStudentPerformance.routeBasePath = "/report/student-performance";
ReportStudentPerformance.routeRedirectDefault = `/report/student-performance`;
