import { Text } from "@visx/text";
import memorize from "lodash/memoize";
import React, { Fragment } from "react";
import { ChartLayout } from "../../components/Chart/ChartLayout";
import {
  HorizontalBarStackChart,
  horizontalBarStackChartSize,
  HorizontalBarStackChartStructSize,
  HorizontalBarStackDataItem,
} from "../../components/Chart/HorizontalBarStackChart";

const structSize = memorize(
  (px: number): HorizontalBarStackChartStructSize => ({
    barStackWidth: 1175 * px,
    barStackHeight: 36 * px,
    barStackMargin: 48 * px,
    xMarginTop: 70 * px,
    yMarginLeft: 180 * px,
    yMarginRight: 230 * px,
    descMarginLeft: 16 * px,
  })
);

const data: HorizontalBarStackDataItem[] = [
  {
    id: "id 1",
    name: "name 1",
    description: "",
    value: [
      {
        name: "category-1",
        description: "description 11",
        value: 10,
        color: "rgb(0,0,10)",
      },
      {
        name: "category-2",
        description: "description 12",
        value: 10,
        color: "rgb(0,0,20)",
      },
      {
        name: "category-3",
        description: "description 13",
        value: 10,
        color: "rgb(0,0,30)",
      },
      {
        name: "category-4",
        description: "description 14",
        value: 10,
        color: "rgb(0,0,40)",
      },
      {
        name: "category-5",
        description: "description 15",
        value: 10,
        color: "rgb(0,0,50)",
      },
      {
        name: "category-6",
        description: "description 16",
        value: 10,
        color: "rgb(0,0,60)",
      },
      {
        name: "category-7",
        description: "description 17",
        value: 10,
        color: "rgb(0,0,70)",
      },
    ],
  },
  {
    id: "id 2",
    name: "name 2",
    description: "",
    value: [
      {
        name: "category-1",
        description: "description 21",
        value: 10,
        color: "rgb(0,10, 0)",
      },
      {
        name: "category-2",
        description: "description 22",
        value: 10,
        color: "rgb(0,20, 0)",
      },
      {
        name: "category-3",
        description: "description 23",
        value: 10,
        color: "rgb(0,30, 0)",
      },
      {
        name: "category-4",
        description: "description 24",
        value: 10,
        color: "rgb(0,40, 0)",
      },
      {
        name: "category-5",
        description: "description 25",
        value: 10,
        color: "rgb(0,50, 0)",
      },
      {
        name: "category-6",
        description: "description 26",
        value: 10,
        color: "rgb(0,60, 0)",
      },
      {
        name: "category-7",
        description: "description 27",
        value: 10,
        color: "rgb(0,70, 0)",
      },
    ],
  },
  {
    id: "id 3",
    name: "name 3",
    description: "",
    value: [
      {
        name: "category-1",
        description: "description 31",
        value: 10,
        color: "rgb(10, 0, 0)",
      },
      {
        name: "category-2",
        description: "description 32",
        value: 10,
        color: "rgb(20, 0, 0)",
      },
      {
        name: "category-3",
        description: "description 33",
        value: 10,
        color: "rgb(30, 0, 0)",
      },
      {
        name: "category-4",
        description: "description 34",
        value: 10,
        color: "rgb(40, 0, 0)",
      },
      {
        name: "category-5",
        description: "description 35",
        value: 10,
        color: "rgb(50, 0, 0)",
      },
      {
        name: "category-6",
        description: "description 36",
        value: 10,
        color: "rgb(60, 0, 0)",
      },
      {
        name: "category-7",
        description: "description 37",
        value: 10,
        color: "rgb(70, 0, 0)",
      },
    ],
  },
];
const tickValue2index = (v?: string) => (Number(v ?? 5) - 5) / 10;
const xLabels = [
  ["Mar.10th", "Monday"],
  ["Mar.11th", "Tuesday"],
  ["Mar.12th", "Wednesday"],
  ["Mar.13th", "Thursday"],
  ["Mar.14th", "Friday"],
  ["Mar.15th", "Saturday"],
  ["Mar.16th", "Sunday"],
];
export function ReportTeacherLoad() {
  const [chartWidth, chartHeight] = horizontalBarStackChartSize({ data, structSize: structSize(1) });
  return (
    <ChartLayout
      chartWidth={chartWidth}
      chartHeight={chartHeight}
      render={(px) => (
        <HorizontalBarStackChart
          px={px}
          data={data}
          valueAxiosLabel="Teaching hours in seven days"
          tickValues={[5, 15, 25, 35, 45, 55, 65]}
          gridValues={[10, 20, 30, 40, 50, 60, 70]}
          labelProps={{ stroke: "black" }}
          structSize={structSize(px)}
          renderRect={({ rectProps, index, stackIndex }) => <rect {...rectProps} fill={data[index].value[stackIndex].color} />}
          renderXAxiosLabel={({ formattedValue, ...textProps }) => (
            <Fragment>
              <Text {...textProps} dy="-1.2em">
                {xLabels[tickValue2index(formattedValue)][0]}
              </Text>
              <Text {...textProps} dy={0} fontWeight="bold">
                {xLabels[tickValue2index(formattedValue)][1]}
              </Text>
            </Fragment>
          )}
        />
      )}
    />
  );
}

ReportTeacherLoad.routeBasePath = "/report/teacher-load";
ReportTeacherLoad.routeRedirectDefault = `/report/teacher-load`;
