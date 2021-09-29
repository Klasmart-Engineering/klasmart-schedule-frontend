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
  })
);

interface ILessonTable {
  listTeacherMissedLessons: EntityTeacherLoadMissedLessonsResponse["list"];
  classIds: MutiSelect.ISelect[];
}

export default function LessonTable(props: ILessonTable) {
  const { listTeacherMissedLessons, classIds } = props;
  const classes = useStyles();
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
          {listTeacherMissedLessons
            ? listTeacherMissedLessons.map((item, idx) => (
                <TableRow key={item.class_id}>
                  <TableCell align="center">{item.class_type}</TableCell>
                  <TableCell align="center">{item.title}</TableCell>
                  <TableCell align="center">{classIds.find((item2) => item2.value === item.class_id)?.label || item.class_id}</TableCell>
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
    </div>
  );
}
