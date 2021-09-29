import { Text } from "@visx/text";
import memorize from "lodash/memoize";
import React, { Fragment } from "react";
import { EntityReportListTeachingLoadDuration } from "../../../api/api.auto";
import { ChartLayout } from "../../../components/Chart/ChartLayout";
import {
  HorizontalBarStackChart,
  horizontalBarStackChartSize,
  HorizontalBarStackChartStructSize,
  HorizontalBarStackDataItem
} from "../../../components/Chart/HorizontalBarStackChart";
import { d, t } from "../../../locale/LocaleManager";
import { time2colorLevel } from "../../../models/ModelReports";

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

const tickValue2index = (v?: string) => (Number(v ?? 5) - 5) / 10;
export function TeacherLoadChart(props: { data: HorizontalBarStackDataItem[]; xLabels?: string[][] }) {
  const { data, xLabels } = props;
  const [chartWidth, chartHeight] = horizontalBarStackChartSize({ data, structSize: structSize(1) });
  return (
    <ChartLayout
      chartWidth={chartWidth}
      chartHeight={chartHeight}
      render={(px) => (
        <HorizontalBarStackChart
          px={px}
          data={data}
          valueAxiosLabel={t("report_label_teaching_hours")}
          tickValues={[5, 15, 25, 35, 45, 55, 65]}
          gridValues={[10, 20, 30, 40, 50, 60, 70]}
          labelProps={{ stroke: "black" }}
          structSize={structSize(px)}
          renderRect={({ rectProps, index, stackIndex }) => <rect {...rectProps} fill={data[index].value[stackIndex].color} />}
          renderXAxiosLabel={({ formattedValue, ...textProps }) => (
            <Fragment>
              <Text {...textProps} dy="-1.2em">
                {xLabels && xLabels[tickValue2index(formattedValue)][0]}
              </Text>
              <Text {...textProps} dy={0} fontWeight="bold">
                {xLabels && xLabels[tickValue2index(formattedValue)][1]}
              </Text>
            </Fragment>
          )}
        />
      )}
    />
  );
}
export const teacherLoadDescription = (props: EntityReportListTeachingLoadDuration) => {
  const online = props.online ?? 0;
  const offline = props.offline ?? 0;
  const totalTime = offline + online;
  const total = time2colorLevel(totalTime);
  const live = time2colorLevel(online);
  const classtype = time2colorLevel(offline);
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <p>
        {t("report_label_total")}: <b>{total.hour}</b> {t("report_label_hours")} <b>{total.min}</b> {t("report_label_mins")}
      </p>
      <p>
        {d("Live").t("report_label_live")}: <b>{live.hour}</b> {t("report_label_hours")} <b>{live.min}</b> {t("report_label_mins")}
      </p>
      <p>
        {d("Class").t("report_label_class")}: <b>{classtype.hour}</b> {t("report_label_hours")} <b>{classtype.min}</b>{" "}
        {t("report_label_mins")}
      </p>
    </div>
  );
};
