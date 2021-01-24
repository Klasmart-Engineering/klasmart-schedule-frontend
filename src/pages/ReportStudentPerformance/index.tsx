import { Box, useMediaQuery, useTheme } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ChartLayout } from "../../components/Chart/ChartLayout";
import { HorizontalBarChart, horizontalBarChartSize, HorizontalSingleBarDataItem } from "../../components/Chart/HorizontalBarChart";
import { setQuery } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, getAchievementList, getLessonPlan, reportOnload } from "../../reducers/report";
import { ReportAchievementList, useReportQuery } from "../ReportAchievementList";
import { FilterAchievementReport, FilterAchievementReportProps } from "../ReportAchievementList/FilterAchievementReport";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "../ReportAchievementList/FirstSearchHeader";
import { QueryCondition } from "../ReportAchievementList/types";
import { ReportCategories } from "../ReportCategories";

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
  const condition = useReportQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const upLg = useMediaQuery(theme.breakpoints.up("lg"));
  console.log("upLg = ", upLg);
  const [w1, h1] = horizontalBarChartSize({ data: mockData1 });
  const [w2, h2] = horizontalBarChartSize({ data: mockData1 });
  const chartWidth = upLg ? w1 + w2 + 250 : Math.max(w1, w2);
  const chartHeight = Math.max(h1, h2);
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
        {...{ chartWidth, chartHeight }}
        render={(px) => (
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" width={chartWidth * px}>
            <HorizontalBarChart data={mockData1} color="#8693F0" px={px} />
            <HorizontalBarChart data={mockData2} color="#FF9492" px={px} />
          </Box>
        )}
      />
    </>
  );
}

ReportStudentPerformance.routeBasePath = "/report/student-performance";
ReportStudentPerformance.routeRedirectDefault = `/report/student-performance`;
