import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReportPagination from "../../../components/ReportPagination/ReportPagination";
import { emptyTip } from "../../../components/TipImages";
import teachingLoadJson from "../../../mocks/teachingLoad.json";
import { formatTeachingLoadList } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
// import { getTeachingLoadReport } from "../../../reducers/report";
import { InfoTeacherLoad } from "../Components/InfoTeacherLoad";
import { TeacherLoadChart } from "../Components/TeacherLoadChart";
// const TIME_OFFSET = moment().utcOffset() * 60;
export default function () {
  const dispatch = useDispatch();
  const { next7DaysLessonLoadList: list } = useSelector<RootState, RootState["report"]>((state) => state.report);
  // 如果没有数据，使用mock的数据
  const next7DaysLessonLoadList = list && list?.length ? list : teachingLoadJson.items;
  const [page, setPage] = React.useState(1);
  const total = 10;
  const handleChangePge = React.useMemo(
    () => (page: number) => {
      setPage(page);
      // dispatch(getTeachingLoadReport({metaLoading: true, time_offset:TIME_OFFSET, teacher_ids:[], class_ids:[] }));
    },
    []
  );

  useEffect(() => {
    setPage(1);
    // dispatch(getTeachingLoadReport({metaLoading: true, time_offset:TIME_OFFSET, teacher_ids:[], class_ids:[] }));
  }, [dispatch]);

  return (
    <Fragment>
      {next7DaysLessonLoadList && next7DaysLessonLoadList.length > 0 ? (
        <>
          <InfoTeacherLoad />
          <TeacherLoadChart
            data={formatTeachingLoadList(next7DaysLessonLoadList).formatedData}
            xLabels={formatTeachingLoadList(next7DaysLessonLoadList).xLabels}
          />
          <ReportPagination page={page} count={total} onChangePage={(page) => handleChangePge(page)} />
        </>
      ) : (
        emptyTip
      )}
    </Fragment>
  );
}
