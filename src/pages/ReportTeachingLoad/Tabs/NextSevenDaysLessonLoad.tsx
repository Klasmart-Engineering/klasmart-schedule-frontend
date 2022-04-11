import moment from "moment";
import React, { Fragment, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectContext } from "..";
import ReportPagination from "../../../components/ReportPagination/ReportPagination";
import { emptyTip } from "../../../components/TipImages";
import { formatTeachingLoadList } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getTeachingLoadReport } from "../../../reducers/report";
import { InfoTeacherLoad } from "../components/InfoTeacherLoad";
import { TeacherLoadChart } from "../components/TeacherLoadChart";
const PAGESIZE = 5;
const TIME_OFFSET = moment().utcOffset() * 60;
export default function NextSevenDaysLessonLoad() {
  const dispatch = useDispatch();
  const { next7DaysLessonLoadList } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const [page, setPage] = React.useState(1);
  const { teachers, classes } = useContext(SelectContext);
  const total = teachers.length;
  const handleChangePge = React.useMemo(
    () => (page: number) => {
      setPage(page);
      const class_ids = classes?.map((item) => item.value);
      const teacher_ids = teachers?.slice((page - 1) * PAGESIZE, (page - 1) * PAGESIZE + PAGESIZE).map((item) => item.value);
      if (!class_ids.length || !teacher_ids.length) return;
      dispatch(getTeachingLoadReport({ metaLoading: true, time_offset: TIME_OFFSET, teacher_ids, class_ids }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, classes]
  );

  useEffect(() => {
    setPage(1);
    const class_ids = classes?.map((item) => item.value);
    const teacher_ids = teachers?.slice(0, PAGESIZE).map((item) => item.value);
    if (!class_ids.length || !teacher_ids.length) return;
    dispatch(getTeachingLoadReport({ metaLoading: true, time_offset: TIME_OFFSET, teacher_ids, class_ids }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, classes]);

  return (
    <Fragment>
      {next7DaysLessonLoadList && next7DaysLessonLoadList.length > 0 ? (
        <>
          <InfoTeacherLoad />
          <TeacherLoadChart
            data={formatTeachingLoadList(next7DaysLessonLoadList).formatedData}
            xLabels={formatTeachingLoadList(next7DaysLessonLoadList).xLabels}
          />
          <ReportPagination page={page} count={total} onChangePage={handleChangePge} rowsPerPage={PAGESIZE} />
        </>
      ) : (
        emptyTip
      )}
    </Fragment>
  );
}
