import { createStyles, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import moment from "moment";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReportPagination from "../../../components/ReportPagination/ReportPagination";
import { t } from "../../..//locale/LocaleManager";
import { RootState } from "../../../reducers";
import { getListTeacherMissedLessons } from "../../../reducers/report";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontSize: 20,
      fontWeight: 700,
    },
  })
);

const teacherData = [
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 79,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 56,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 23,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 61,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 72,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 31,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 98,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 23,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 45,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "In Class",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
  {
    lesson_type: "live",
    lesson_name: "Lesson Name",
    class_name: "Class Name",
    no_of_student: 46,
    start_date: 1632282347,
    end_date: 1632366693,
  },
];

export default function LessonTable() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { listTeacherMissedLessons } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const [page, setPage] = React.useState(1);
  const total = teacherData.length;

  console.log(listTeacherMissedLessons);

  React.useEffect(() => {
    dispatch(
      getListTeacherMissedLessons({
        metaLoading: true,
        class_ids: ["11111"],
        duration: "555555-888888",
        page_number: page,
        page_size: 10,
        teacher_id: "vvbgn",
      })
    );
  }, [dispatch, page]);

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
          {teacherData.slice((page - 1) * 10, page * 10).map((item, idx) => (
            <TableRow key={`${idx}--${page}`}>
              <TableCell align="center">{item.lesson_type}</TableCell>
              <TableCell align="center">{item.lesson_name}</TableCell>
              <TableCell align="center">{item.class_name}</TableCell>
              <TableCell align="center">{item.no_of_student}</TableCell>
              <TableCell align="center">{item.start_date ? `${moment(item.start_date * 1000).format("MM/DD/YYYY HH:mm")}` : ""}</TableCell>
              <TableCell align="center">{item.end_date ? `${moment(item.end_date * 1000).format("MM/DD/YYYY HH:mm")}` : ""}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ReportPagination page={page} count={total} onChangePage={setPage} />
    </div>
  );
}
