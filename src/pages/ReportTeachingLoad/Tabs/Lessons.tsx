import React, { useContext } from "react";
import { getDurationByDay } from "../../../models/ModelReports";
import { getListTeacherMissedLessons } from "../../../reducers/report";
import LessonChart from "../components/LessonChart";
import LessonTable from "../components/LessonTable";
import { SelectContext } from "../index";
import { useDispatch, useSelector } from "react-redux";
import ReportPagination from "../../../components/ReportPagination/ReportPagination";
import { RootState } from "../../../reducers";

export interface IState {
  id: string | undefined;
  days: number;
}

export default function () {
  const dispatch = useDispatch();
  const { teachers, classes } = useContext(SelectContext);
  const [state, setState] = React.useState<IState>({
    id: "150de04b-6777-4cab-a381-5f36a9b750ef",
    days: 7,
  });
  const { listTeacherMissedLessons } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const [page, setPage] = React.useState(1);

  const teacherChange = (id?: string, days?: number) => {
    setState({ id, days: days ? days : 7 });
  };
  const handleChangePage = React.useMemo(
    () => (page: number) => {
      setPage(page);
    },
    []
  );

  React.useEffect(() => {
    const class_ids = classes.map((item) => item.value);
    const teacher_id = state.id ? state.id : "";
    if (!teacher_id) return;
    dispatch(
      getListTeacherMissedLessons({
        metaLoading: true,
        class_ids,
        duration: getDurationByDay(state.days),
        page,
        page_size: 10,
        teacher_id,
      })
    );
  }, [dispatch, page, classes, state.id, state.days]);

  return (
    <div>
      <LessonChart teacherChange={teacherChange} teacherIds={teachers} classIds={classes} />
      {state.id && (
        <div>
          <LessonTable listTeacherMissedLessons={listTeacherMissedLessons.list} classIds={classes} />
          <ReportPagination
            page={page}
            count={listTeacherMissedLessons?.total ? listTeacherMissedLessons?.total : 0}
            onChangePage={handleChangePage}
          />
        </div>
      )}
    </div>
  );
}
