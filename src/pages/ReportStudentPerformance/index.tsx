import { Box, useMediaQuery, useTheme } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ChartLayout } from "../../components/Chart/ChartLayout";
import {
  HorizontalBarStackChart,
  horizontalBarStackChartSize,
  HorizontalSingleBarStackDataItem
} from "../../components/Chart/HorizontalBarStackChart";
import { VerticalBarGroupChart, verticalBarGroupChartSize, VerticalBarGroupDataItem } from "../../components/Chart/VerticalBarGroupChart";
import {
  VerticalBarStackChart,
  verticalBarStackChartSize,
  VerticalSingleBarStackDataItem
} from "../../components/Chart/VerticalBarStackChart";
import { setQuery } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, getAchievementList, getLessonPlan, reportOnload } from "../../reducers/report";
import { ReportAchievementList, useReportQuery } from "../ReportAchievementList";
import { FilterAchievementReport, FilterAchievementReportProps } from "../ReportAchievementList/FilterAchievementReport";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "../ReportAchievementList/FirstSearchHeader";
import { QueryCondition } from "../ReportAchievementList/types";
import { ReportCategories } from "../ReportCategories";

const mockData1: HorizontalSingleBarStackDataItem[] = [
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

const mockData2: HorizontalSingleBarStackDataItem[] = [
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

const mockData3: VerticalSingleBarStackDataItem[] = [
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

const mockData4: VerticalBarGroupDataItem[] = [
  {
    id: "id 0",
    name: "name 0",
    description: "description 0",
    value: [
      { name: "category A", title: "200 min", description: "name 0 category A description", value: 200, color: "#8693F0" },
      { name: "category B", title: "70 min", description: "name 0 category B description", value: 70, color: "#77DCB7" },
    ],
  },
  {
    id: "id 1",
    name: "name 1",
    title: "title 1",
    description: "description 1",
    value: [
      { name: "category A", title: "100 min", description: "name 1 category A description", value: 100, color: "#8693F0" },
      { name: "category B", title: "40 min", description: "name 1 category B description", value: 40, color: "#77DCB7" },
    ],
  },
  {
    id: "id 2",
    name: "name 2",
    description: "description 2",
    value: [
      { name: "category A", title: "150 min", description: "name 2 category A description", value: 150, color: "#8693F0" },
      { name: "category B", title: "90 min", description: "name 2 category B description", value: 90, color: "#77DCB7" },
    ],
  },
  {
    id: "id 3",
    name: "name 3",
    description: "description 3",
    value: [
      { name: "category A", title: "160 min", description: "name 3 category A description", value: 160, color: "#8693F0" },
      { name: "category B", title: "120 min", description: "name 3 category B description", value: 120, color: "#77DCB7" },
    ],
  },
];

export function ReportStudentPerformance() {
  const condition = useReportQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const upLg = useMediaQuery(theme.breakpoints.up("lg"));
  console.log("upLg = ", upLg);
  const [w1, h1] = horizontalBarStackChartSize({ data: mockData1 });
  const [w2, h2] = horizontalBarStackChartSize({ data: mockData2 });
  const [w3, h3] = verticalBarStackChartSize({ data: mockData3 });
  const [w4, h4] = verticalBarGroupChartSize({ data: mockData4 });
  const horizontalChartWidth = upLg ? w1 + w2 + 120 : Math.max(w1, w2);
  const horizontalChartHeight = Math.max(h1, h2);
  const verticalChartWidth = upLg ? w3 + w4 + 120 : Math.max(w3, w4);
  const verticalChartHeight = Math.max(h3, h4);
  const totalData = useSelector<RootState, RootState["report"]>((state) => state.report);
  // const reportList = totalData.reportList ?? [];
  const reportMockOptions = totalData.reportMockOptions;
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    if (value === Category.archived) history.push(ReportAchievementList.routeBasePath);
    if (value === Category.learningOutcomes) history.push(ReportCategories.routeBasePath);
    if (value === Category.studentPerformance) return;
  };
  const handleChangeFilter: FilterAchievementReportProps["onChange"] = async (value, tab) => {
    computeFilter(tab, value);
  };
  const getFirstLessonPlanId = useMemo(
    () => async (teacher_id: string, class_id: string) => {
      const { payload: data } = ((await dispatch(getLessonPlan({ metaLoading: true, teacher_id, class_id }))) as unknown) as PayloadAction<
        AsyncTrunkReturned<typeof getLessonPlan>
      >;
      if (data) {
        const lesson_plan_id = (data[0] && data[0].id) || "";
        history.push({ search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id }) });
        lesson_plan_id && dispatch(getAchievementList({ metaLoading: true, teacher_id, class_id, lesson_plan_id }));
      } else {
        history.push({ search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id: "" }) });
      }
    },
    [dispatch, history]
  );

  const computeFilter = useMemo(
    () => async (tab: keyof QueryCondition, value: string) => {
      history.push({ search: setQuery(history.location.search, { [tab]: value }) });
      if (tab === "teacher_id") {
        history.push({
          search: setQuery(history.location.search, { teacher_id: value, class_id: "", lesson_plan_id: "" }),
        });
      }
      if (tab === "class_id") {
        getFirstLessonPlanId(condition.teacher_id, value);
      }
      if (tab === "lesson_plan_id") {
        if (condition.teacher_id && condition.class_id) {
          dispatch(
            getAchievementList({
              metaLoading: true,
              teacher_id: condition.teacher_id,
              class_id: condition.class_id,
              lesson_plan_id: value,
            })
          );
        }
      }
    },
    [dispatch, getFirstLessonPlanId, history, condition.teacher_id, condition.class_id]
  );
  useEffect(() => {
    dispatch(
      reportOnload({
        teacher_id: condition.teacher_id,
        class_id: condition.class_id,
        lesson_plan_id: condition.lesson_plan_id,
        status: condition.status,
        sort_by: condition.sort_by,
        metaLoading: true,
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition.teacher_id, condition.sort_by, condition.status, dispatch]);
  return (
    <>
      <FirstSearchHeader value={Category.studentPerformance} onChange={handleChange} />
      <FirstSearchHeaderMb value={Category.archived} onChange={handleChange} />
      <FilterAchievementReport
        value={condition}
        onChange={handleChangeFilter}
        reportMockOptions={reportMockOptions}
        isShowStudentList={true}
      ></FilterAchievementReport>
      <ChartLayout
        chartWidth={horizontalChartWidth}
        chartHeight={horizontalChartHeight}
        render={(px) => (
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" width={horizontalChartWidth * px}>
            <HorizontalBarStackChart data={mockData1} color="#8693F0" px={px} valueAxiosLabel="in % of LOs" />
            <HorizontalBarStackChart data={mockData2} color="#FF9492" px={px} valueAxiosLabel="in mins" />
          </Box>
        )}
      />
      <ChartLayout
        chartWidth={verticalChartWidth}
        chartHeight={verticalChartHeight}
        render={(px) => (
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" width={verticalChartWidth * px}>
            <VerticalBarStackChart data={mockData3} color="#8693F0" px={px} valueAxiosLabel="in % of LOs" />
            <VerticalBarGroupChart data={mockData4} px={px} valueAxiosLabel="in mins" />
          </Box>
        )}
      />
    </>
  );
}

ReportStudentPerformance.routeBasePath = "/report/student-performance";
ReportStudentPerformance.routeRedirectDefault = `/report/student-performance`;
