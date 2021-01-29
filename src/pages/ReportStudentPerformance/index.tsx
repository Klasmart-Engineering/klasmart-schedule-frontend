import { Box, useMediaQuery, useTheme } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  EntityStudentPerformanceH5PReportItem,
  EntityStudentPerformanceReportItem,
  EntityStudentsPerformanceH5PReportItem,
  EntityStudentsPerformanceReportItem,
} from "../../api/api.auto";
import { formatTimeToEn } from "../../api/extra";
import { ChartLayout } from "../../components/Chart/ChartLayout";
import {
  HorizontalBarStackChart,
  horizontalBarStackChartSize,
  HorizontalBarStackDataItem,
  HorizontalSingleBarStackDataItem,
} from "../../components/Chart/HorizontalBarStackChart";
import { VerticalBarGroupChart, verticalBarGroupChartSize, VerticalBarGroupDataItem } from "../../components/Chart/VerticalBarGroupChart";
import { VerticalBarStackChart, verticalBarStackChartSize, VerticalBarStackDataItem } from "../../components/Chart/VerticalBarStackChart";
import { setQuery } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import {
  AsyncTrunkReturned,
  getLessonPlan,
  getScheduleParticipant,
  getStuReportDetail,
  getStuReportList,
  stuPerformanceReportOnload,
} from "../../reducers/report";
import { ReportAchievementList, useReportQuery } from "../ReportAchievementList";
import BriefIntroduction from "../ReportAchievementList/BriefIntroduction";
import { FilterAchievementReport, FilterAchievementReportProps } from "../ReportAchievementList/FilterAchievementReport";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "../ReportAchievementList/FirstSearchHeader";
import { ALL_STUDENT, QueryCondition } from "../ReportAchievementList/types";
import { ReportCategories } from "../ReportCategories";

const mockData1: HorizontalBarStackDataItem[] = [
  {
    id: "id 0",
    name: "name 0",
    description: "description 0",
    value: [
      { name: "category A", description: "name 1 category A description", value: 100, color: "#8693F0" },
      { name: "category A", description: "name 1 category B description", value: 40, color: "#FE9B9B" },
      { name: "category A", description: "name 1 category B description", value: 40, color: "#DADADA" },
    ],
  },
  {
    id: "id 1",
    name: "name 1",
    title: "title 1",
    description: "description 1",
    value: [
      { name: "category A", description: "name 1 category A description", value: 100, color: "#8693F0" },
      { name: "category B", description: "name 1 category B description", value: 40, color: "#FE9B9B" },
      { name: "category C", description: "name 1 category B description", value: 40, color: "#DADADA" },
    ],
  },
  {
    id: "id 2",
    name: "name 2",
    description: "description 2",
    value: [
      { name: "category A", description: "name 1 category A description", value: 100, color: "#8693F0" },
      { name: "category B", description: "name 1 category B description", value: 40, color: "#FE9B9B" },
      { name: "category C", description: "name 1 category B description", value: 40, color: "#DADADA" },
    ],
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

const mockData3: VerticalBarStackDataItem[] = [
  {
    id: "id 0",
    name: "name 0",
    description: "description 0",
    value: [
      { name: "category A", description: "name 1 category A description", value: 100, color: "#8693F0" },
      { name: "category B", description: "name 1 category B description", value: 40, color: "#FE9B9B" },
      { name: "category C", description: "name 1 category B description", value: 40, color: "#DADADA" },
    ],
  },
  {
    id: "id 1",
    name: "name 1",
    title: "title 1",
    description: "description 1",
    value: [
      { name: "category A", description: "name 1 category A description", value: 100, color: "#8693F0" },
      { name: "category B", description: "name 1 category B description", value: 40, color: "#FE9B9B" },
      { name: "category C", description: "name 1 category B description", value: 40, color: "#DADADA" },
    ],
  },
  {
    id: "id 2",
    name: "name 2",
    description: "description 2",
    value: [
      { name: "category A", description: "name 1 category A description", value: 100, color: "#8693F0" },
      { name: "category B", description: "name 1 category B description", value: 40, color: "#FE9B9B" },
      { name: "category C", description: "name 1 category B description", value: 40, color: "#DADADA" },
    ],
  },
  {
    id: "id 3",
    name: "name 3",
    description: "description 3",
    value: [
      { name: "category A", description: "name 1 category A description", value: 100, color: "#8693F0" },
      { name: "category B", description: "name 1 category B description", value: 40, color: "#FE9B9B" },
      { name: "category C", description: "name 1 category B description", value: 40, color: "#DADADA" },
    ],
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

export const convertStuReportListType = (stuReportList: EntityStudentsPerformanceReportItem[]): HorizontalBarStackDataItem[] => {
  const stuReport = stuReportList.map((item) => {
    const achieved_count = item.achieved_names ? item.achieved_names.length : 0;
    const not_achieve_count = item.not_achieved_names ? item.not_achieved_names.length : 0;
    const not_attempted_count = item.not_attempted_names ? item.not_attempted_names.length : 0;
    const count = achieved_count + not_achieve_count + not_attempted_count;
    return {
      id: item.student_id || "",
      name: item.student_name || "",
      description: `${count ? 100 : 0}%, ${count} LOs`,
      value: [
        {
          name: "achieved_count",
          description: `${Math.round((achieved_count / count) * 100)}% ${achieved_count}LOs`,
          value: achieved_count,
          color: "#8693F0",
        },
        {
          name: "not_achieve_count",
          description: `${Math.round((not_achieve_count / count) * 100)}% ${not_achieve_count}LOs`,
          value: not_achieve_count,
          color: "#FE9B9B",
        },
        {
          name: "not_attempted_count",
          description: `${Math.round((not_attempted_count / count) * 100)}% ${not_attempted_count}LOs`,
          value: not_attempted_count,
          color: "#DADADA",
        },
      ],
    };
  });
  return stuReport;
};
export const convertH5pReportListType = (h5pReportList: EntityStudentsPerformanceH5PReportItem[]): HorizontalSingleBarStackDataItem[] => {
  const h5pReport = h5pReportList.map((item) => {
    return {
      id: item.student_id || "",
      name: item.student_name || "",
      description: `${item.spent_time ? item.spent_time / 60 : 0}  mins`,
      value: item.spent_time || 0,
    };
  });
  return h5pReport;
};
export const convertStuReportDetailType = (stuReportDetail: EntityStudentPerformanceReportItem[]): VerticalBarStackDataItem[] => {
  const stuReport = stuReportDetail.map((item) => {
    const achieved_count = item.achieved_names ? item.achieved_names.length : 0;
    const not_achieve_count = item.not_achieved_names ? item.not_achieved_names.length : 0;
    const not_attempted_count = item.not_attempted_names ? item.not_attempted_names.length : 0;
    const count = achieved_count + not_achieve_count + not_attempted_count;
    return {
      id: item.schedule_id || "",
      name: item.schedule_start_time ? formatTimeToEn(item.schedule_start_time) : "",
      description: `${count ? 100 : 0}% ${count} LOs`,
      value: [
        {
          name: "achieved_count",
          description: `${Math.round((achieved_count / count) * 100)}% ${achieved_count}LOs`,
          value: achieved_count,
          color: "#8693F0",
        },
        {
          name: "not_achieve_count",
          description: `${Math.round((not_achieve_count / count) * 100)}% ${not_achieve_count}LOs`,
          value: not_achieve_count,
          color: "#FE9B9B",
        },
        {
          name: "not_attempted_count",
          description: `${Math.round((not_attempted_count / count) * 100)}% ${not_attempted_count}LOs`,
          value: not_attempted_count,
          color: "#DADADA",
        },
      ],
    };
  });
  return stuReport;
};
export const convertH5pReportDetailType = (h5pReportDetail: EntityStudentPerformanceH5PReportItem[]): VerticalBarGroupDataItem[] => {
  const h5pReport = h5pReportDetail.map((item) => {
    return {
      id: item.material_id || "",
      name: `${item.material_name}`,
      description: "",
      value: [
        {
          name: "total",
          title: `${item.total_spent_time ? item.total_spent_time / 60 : 0} mins`,
          description: "",
          value: item.total_spent_time || 0,
          color: "#8693F0",
        },
        {
          name: "svg",
          title: `${item.avg_spent_time ? item.avg_spent_time / 60 : 0} mins`,
          description: "",
          value: item.avg_spent_time || 0,
          color: "#77DCB7",
        },
      ],
    };
  });
  return h5pReport;
};

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
  const stuReportMockOptions = totalData.stuReportMockOptions;
  const stuReportList = totalData.stuReportList ?? [];
  const h5pReportList = totalData.h5pReportList ?? [];
  const stuReportDetail = totalData.stuReportDetail ?? [];
  const h5pReportDetail = totalData.h5pReportDetail ?? [];
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    if (value === Category.archived) history.push(ReportAchievementList.routeBasePath);
    if (value === Category.learningOutcomes) history.push(ReportCategories.routeBasePath);
    if (value === Category.studentPerformance) return;
  };
  const handleChangeFilter: FilterAchievementReportProps["onChange"] = async (value, tab) => {
    computeFilter(tab, value);
  };
  const getStudentName = useMemo(() => {
    if (stuReportMockOptions && stuReportMockOptions.studentList && condition.student_id !== ALL_STUDENT) {
      return stuReportMockOptions.studentList.find((item) => item.user_id === condition.student_id)?.user_name as string;
    } else {
      return "";
    }
  }, [condition.student_id, stuReportMockOptions]);
  const finalStuReportList = useMemo(() => convertStuReportListType(stuReportList), [stuReportList]);
  const finalH5pReportList = useMemo(() => convertH5pReportListType(h5pReportList), [h5pReportList]);
  const finalStuReportDetail = useMemo(() => convertStuReportDetailType(stuReportDetail), [stuReportDetail]);
  const finalH5pRepirtDetail = useMemo(() => convertH5pReportDetailType(h5pReportDetail), [h5pReportDetail]);
  console.log(finalH5pRepirtDetail);
  const getFirstLessonPlanId = useMemo(
    () => async (teacher_id: string, class_id: string) => {
      await dispatch(getScheduleParticipant({ class_id }));
      const { payload: data } = ((await dispatch(getLessonPlan({ metaLoading: true, teacher_id, class_id }))) as unknown) as PayloadAction<
        AsyncTrunkReturned<typeof getLessonPlan>
      >;
      if (data) {
        const lesson_plan_id = (data[0] && data[0].id) || "";
        history.push({ search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id, student_id: ALL_STUDENT }) });
        lesson_plan_id && dispatch(getStuReportList({ metaLoading: true, teacher_id, class_id, lesson_plan_id }));
      } else {
        history.push({ search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id: "" }) });
      }
    },
    [dispatch, history]
  );

  const computeFilter = useMemo(
    () => async (tab: keyof QueryCondition, value: string) => {
      const { teacher_id, class_id, lesson_plan_id } = condition;
      history.push({ search: setQuery(history.location.search, { [tab]: value }) });
      if (tab === "teacher_id") {
        history.push({
          search: setQuery(history.location.search, { teacher_id: value, class_id: "", lesson_plan_id: "", student_id: ALL_STUDENT }),
        });
      }
      if (tab === "class_id") {
        getFirstLessonPlanId(condition.teacher_id, value);
      }
      if (tab === "lesson_plan_id") {
        history.push({
          search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id: value, student_id: ALL_STUDENT }),
        });
        dispatch(getStuReportList({ metaLoading: true, teacher_id, class_id, lesson_plan_id: value }));
      }
      if (tab === "student_id") {
        value === ALL_STUDENT
          ? dispatch(getStuReportList({ metaLoading: true, teacher_id, class_id, lesson_plan_id }))
          : dispatch(getStuReportDetail({ metaLoading: true, teacher_id, class_id, lesson_plan_id, id: value }));
      }
    },
    [condition, history, getFirstLessonPlanId, dispatch]
  );
  useEffect(() => {
    dispatch(
      stuPerformanceReportOnload({
        teacher_id: condition.teacher_id,
        class_id: condition.class_id,
        lesson_plan_id: condition.lesson_plan_id,
        status: condition.status,
        sort_by: condition.sort_by,
        student_id: condition.student_id,
        metaLoading: true,
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition.teacher_id, dispatch]);

  useEffect(() => {
    if (stuReportMockOptions) {
      const { teacher_id, class_id, lesson_plan_id, student_id } = stuReportMockOptions;
      teacher_id &&
        history.push({
          search: setQuery(history.location.search, {
            teacher_id,
            class_id,
            lesson_plan_id,
            student_id: student_id ? student_id : ALL_STUDENT,
          }),
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, stuReportMockOptions.teacher_id]);
  return (
    <>
      <FirstSearchHeader value={Category.studentPerformance} onChange={handleChange} />
      <FirstSearchHeaderMb value={Category.archived} onChange={handleChange} />
      <FilterAchievementReport
        value={condition}
        onChange={handleChangeFilter}
        reportMockOptions={stuReportMockOptions}
        isShowStudentList={true}
      ></FilterAchievementReport>
      <BriefIntroduction value={condition} reportMockOptions={stuReportMockOptions} student_name={getStudentName} />
      {condition.student_id === ALL_STUDENT && (
        <ChartLayout
          chartWidth={horizontalChartWidth}
          chartHeight={horizontalChartHeight}
          render={(px) => (
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" width={horizontalChartWidth * px}>
              <HorizontalBarStackChart data={finalStuReportList} color="#8693F0" px={px} valueAxiosLabel="in % of LOs" />
              <HorizontalBarStackChart data={finalH5pReportList} color="#FF9492" px={px} valueAxiosLabel="in mins" />
            </Box>
          )}
        />
      )}
      {condition.student_id && condition.student_id !== ALL_STUDENT && (
        <ChartLayout
          chartWidth={verticalChartWidth}
          chartHeight={verticalChartHeight}
          render={(px) => (
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" width={verticalChartWidth * px}>
              <VerticalBarStackChart data={finalStuReportDetail} color="#8693F0" px={px} valueAxiosLabel="in % of LOs" />
              <VerticalBarGroupChart data={finalH5pRepirtDetail} px={px} valueAxiosLabel="in mins" />
            </Box>
          )}
        />
      )}
    </>
  );
}

ReportStudentPerformance.routeBasePath = "/report/student-performance";
ReportStudentPerformance.routeRedirectDefault = `/report/student-performance`;
