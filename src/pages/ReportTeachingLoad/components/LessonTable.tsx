import { createStyles, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { EntityTeacherLoadMissedLessonsResponse } from "../../../api/api.auto";
import { t } from "../../../locale/LocaleManager";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontSize: 20,
      fontWeight: 700,
    },
    tableHead: {
      fontSize: 16,
      fontWeight: 700,
      color: "#666666",
    },
    tableBody: {
      fontSize: 18,
      color: "#333333",
    },
  })
);

interface ILessonTable {
  listTeacherMissedLessons: EntityTeacherLoadMissedLessonsResponse["list"];
  classIds: MutiSelect.ISelect[];
  page: number;
}

export default function LessonTable(props: ILessonTable) {
  const { listTeacherMissedLessons, classIds, page } = props;
  const classes = useStyles();

  return (
    <div>
      <p className={classes.title}>{t("report_label_missed_lessons")}</p>
      <Table aria-label="purchases" style={{ marginBottom: 20 }}>
        <TableHead style={{ backgroundColor: "#f2f5f7", height: "56px" }}>
          <TableRow>
            <TableCell align="center" className={classes.tableHead}>
              {t("report_label_lesson_type")}
            </TableCell>
            <TableCell align="center" className={classes.tableHead}>
              {t("report_label_lesson_name")}
            </TableCell>
            <TableCell align="center" className={classes.tableHead}>
              {t("report_label_class_name")}
            </TableCell>
            <TableCell align="center" className={classes.tableHead}>
              {t("report_label_students_number")}
            </TableCell>
            <TableCell align="center" className={classes.tableHead}>
              {t("report_label_start_date_time")}
            </TableCell>
            <TableCell align="center" className={classes.tableHead}>
              {t("report_label_end_date_time")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listTeacherMissedLessons
            ? listTeacherMissedLessons.map((item, idx) => (
                <TableRow key={`${page}--${idx}`}>
                  <TableCell align="center" className={classes.tableBody}>
                    {item.class_type === "OnlineClass" ? t("report_label_live") : t("report_label_class")}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {item.title}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {classIds.find((item2) => item2.value === item.class_id)?.label || item.class_id}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {item.no_of_student}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {item.start_date ? `${moment(item.start_date * 1000).format("MM/DD/YYYY HH:mm")}` : ""}
                  </TableCell>
                  <TableCell align="center" className={classes.tableBody}>
                    {item.end_date ? `${moment(item.end_date * 1000).format("MM/DD/YYYY HH:mm")}` : ""}
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}
