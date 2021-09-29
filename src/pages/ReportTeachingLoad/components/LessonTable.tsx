import { createStyles, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import moment from "moment";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReportPagination from "../../../components/ReportPagination/ReportPagination";
import { t } from "../../../locale/LocaleManager";
import { getDurationByDay } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getListTeacherMissedLessons } from "../../../reducers/report";
import { IState } from "../Tabs/Lessons";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontSize: 20,
      fontWeight: 700,
    },
  })
);

interface ILessonTable {
  state: IState;
  classIds: { label: string; value: string }[];
}

export default function LessonTable(props: ILessonTable) {
  const { state, classIds } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const { listTeacherMissedLessons } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    const class_ids = classIds.map((item) => item.value);
    dispatch(
      getListTeacherMissedLessons({
        metaLoading: true,
        class_ids,
        duration: getDurationByDay(state.days),
        page_number: page,
        page_size: 10,
        teacher_id: state.id,
      })
    );
  }, [dispatch, page, classIds, state.id, state.days]);

  return (
    <div>
      <p className={classes.title}>{t("report_label_missed_lessons")}</p>
      <Table aria-label="purchases" style={{ marginBottom: 20 }}>
        <TableHead style={{ backgroundColor: "#f2f5f7", height: "56px" }}>
          <TableRow>
            <TableCell align="center">{t("report_label_lesson_type")}</TableCell>
            <TableCell align="center">{t("report_label_lesson_name")}</TableCell>
            <TableCell align="center">{t("report_label_class_name")}</TableCell>
            <TableCell align="center">{t("report_label_students_number")}</TableCell>
            <TableCell align="center">{t("report_label_start_date_time")}</TableCell>
            <TableCell align="center">{t("report_label_end_date_time")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listTeacherMissedLessons.list
            ? listTeacherMissedLessons.list.map((item, idx) => (
                <TableRow key={`${idx}--${page}`}>
                  <TableCell align="center">{item.lesson_type}</TableCell>
                  <TableCell align="center">{item.lesson_name}</TableCell>
                  <TableCell align="center">
                    {classIds.find((item2) => item2.value === item.class_name)?.label || item.class_name}
                  </TableCell>
                  <TableCell align="center">{item.no_of_student}</TableCell>
                  <TableCell align="center">
                    {item.start_date ? `${moment(item.start_date * 1000).format("MM/DD/YYYY HH:mm")}` : ""}
                  </TableCell>
                  <TableCell align="center">{item.end_date ? `${moment(item.end_date * 1000).format("MM/DD/YYYY HH:mm")}` : ""}</TableCell>
                </TableRow>
              ))
            : ""}
        </TableBody>
      </Table>
      <ReportPagination page={page} count={listTeacherMissedLessons?.total ? listTeacherMissedLessons?.total : 0} onChangePage={setPage} />
    </div>
  );
}
