import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { MockOptionsItem } from "../../api/extra";
import { TipImages, TipImagesType } from "../../components/TipImages";
import { setQuery, toQueryString } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, getAchievementList, getLessonPlan, getReportMockOptions } from "../../reducers/report";
import { ReportAchievementDetail } from "../ReportAchievementDetail";
import { ReportCategories } from "../ReportCategories";
import { AchievementListChart, AchievementListChartProps } from "./AchievementListChart";
import BriefIntroduction from "./BriefIntroduction";
import { FilterAchievementReport, FilterAchievementReportProps } from "./FilterAchievementReport";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import { QueryCondition } from "./types";

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const teacher_id = query.get("teacher_id") || "";
    const class_id = query.get("class_id") || "";
    const lesson_plan_id = query.get("lesson_plan_id") || "";
    const status = query.get("status") || "all";
    const sort_by = query.get("sort_by") || "desc";
    return clearNull({ teacher_id, class_id, lesson_plan_id, status, sort_by });
  }, [search]);
};

export function ReportAchievementList() {
  const condition = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const { reportList = [], student_name, reportMockOptions } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    if (value === Category.archived) return;
    if (value === Category.learningOutcomes) history.push(ReportCategories.routeBasePath);
  };
  const handleChangeFilter: FilterAchievementReportProps["onChange"] = async (e, tab) => {
    const value = e.target.value;
    computeFilter(tab, value);
  };
  const handleChangeMbFilter: FilterAchievementReportProps["onChangeMb"] = (e, value, tab) => {
    computeFilter(tab, value);
  };
  const handleChangeStudent: AchievementListChartProps["onClickStudent"] = (studentId) => {
    const { status, sort_by, ...ortherCondition } = condition;
    history.push({ pathname: ReportAchievementDetail.routeBasePath, search: toQueryString({ student_id: studentId, ...ortherCondition }) });
  };
  const getFirstLessonPlanId = useMemo(
    () => async (teacher_id: string, class_id: string) => {
      const { payload } = ((await dispatch(getLessonPlan({ teacher_id, class_id }))) as unknown) as PayloadAction<
        AsyncTrunkReturned<typeof getLessonPlan>
      >;
      if (payload && payload.length > 0) {
        const lesson_plan_id = (payload[0] && payload[0].id) || "";
        history.push({ search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id }) });
      }
    },
    [dispatch, history]
  );

  const computeFilter = useMemo(
    () => (tab: keyof QueryCondition, value: string) => {
      history.push({ search: setQuery(history.location.search, { [tab]: value }) });
      if (tab === "teacher_id") {
        const classlist = reportMockOptions.classList.user?.classesTeaching;
        const class_id = (classlist && classlist[0] && classlist[0].class_id) || "";
        class_id
          ? getFirstLessonPlanId(value, class_id)
          : history.push({
              search: setQuery(history.location.search, { teacher_id: value, class_id, lesson_plan_id: "" }),
            });
      }
      if (tab === "class_id") {
        getFirstLessonPlanId(condition.teacher_id, value);
      }
    },
    [condition.teacher_id, getFirstLessonPlanId, history, reportMockOptions.classList.user]
  );

  useEffect(() => {
    dispatch(getReportMockOptions({ metaLoading: true }));
  }, [dispatch]);
  // useEffect(() => {
  //   const { class_id, teacher_id } = ModelMockOptions.getReportFirstValue(mockOptions);
  //   if (class_id && teacher_id) {
  //     condition.teacher_id && condition.class_id
  //       ? dispatch(getLessonPlan({ teacher_id: condition.teacher_id, class_id: condition.class_id }))
  //       : getFirstLessonPlanId(teacher_id, class_id);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, getFirstLessonPlanId, history, mockOptions]);
  useEffect(() => {
    const firstTeacher =
      reportMockOptions.teacherList &&
      reportMockOptions.teacherList.organization &&
      reportMockOptions.teacherList.organization.teachers &&
      reportMockOptions.teacherList.organization.teachers[0];
    const firstClass =
      reportMockOptions.classList &&
      reportMockOptions.classList.user &&
      reportMockOptions.classList.user.classesTeaching &&
      reportMockOptions.classList.user.classesTeaching[0];
    const firstLessonPlan = reportMockOptions.lessonPlanList && reportMockOptions.lessonPlanList[0];
    if (firstTeacher?.user?.user_id && firstClass?.class_id && firstLessonPlan.id) {
      history.push({
        search: setQuery(history.location.search, {
          teacher_id: firstTeacher?.user?.user_id,
          class_id: firstClass?.class_id,
          lesson_plan_id: firstLessonPlan.id,
        }),
      });
    }
    // if(reportMockOptions.teacherList)
  }, [history, reportMockOptions.classList, reportMockOptions.lessonPlanList, reportMockOptions.teacherList]);

  useEffect(() => {
    if (condition.teacher_id) {
      dispatch(
        getAchievementList({
          teacher_id: condition.teacher_id,
          class_id: condition.class_id,
          lesson_plan_id: condition.lesson_plan_id,
          status: condition.status,
          sort_by: condition.sort_by,
          metaLoading: true,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition.lesson_plan_id, condition.sort_by, condition.status, dispatch]);

  return (
    <>
      <FirstSearchHeader value={Category.archived} onChange={handleChange} />
      <FirstSearchHeaderMb value={Category.archived} onChange={handleChange} />
      <FilterAchievementReport
        value={condition}
        onChange={handleChangeFilter}
        onChangeMb={handleChangeMbFilter}
        lessonPlanList={reportMockOptions.lessonPlanList as MockOptionsItem[]}
        reportMockOptions={reportMockOptions}
      ></FilterAchievementReport>
      <BriefIntroduction
        value={condition}
        reportMockOptions={reportMockOptions}
        student_name={student_name}
        lessonPlanList={reportMockOptions.lessonPlanList}
      />
      {true &&
        (reportList && reportList.length > 0 ? (
          <AchievementListChart data={reportList} filter={condition.status} onClickStudent={handleChangeStudent} />
        ) : (
          <TipImages type={TipImagesType.empty} text="library_label_empty" />
        ))}
      {/* {<AchievementListChart data={mockAchievementList} filter={condition.status} onClickStudent={handleChangeStudent} />} */}
    </>
  );
}

ReportAchievementList.routeBasePath = "/report/achievement-list";
ReportAchievementList.routeRedirectDefault = `/report/achievement-list`;
