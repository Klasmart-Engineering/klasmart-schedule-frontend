import { Box, Grid, MenuItem, OutlinedInput, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EntityTeacherLoadLessonRequest } from "../../../api/api.auto";
import ReportPagination from "../../../components/ReportPagination/ReportPagination";
import ReportTooltip from "../../../components/ReportTooltip";
import { d, t } from "../../../locale/LocaleManager";
import { RootState } from "../../../reducers";
import { getLessonTeacherLoad } from "../../../reducers/report";
const useStyle = makeStyles(() => ({
  dataBlock: {
    display: "flex",
    alignItems: "flex-start",
  },
  blockRight: {
    wordBreak: "break-all",
    marginBottom: "16px",
    maxWidth: "180px",
    color: "#666666",
  },
  point: {
    height: "12px",
    width: "12px",
    minWidth: "12px",
    maxWidth: "12px",
    marginTop: "6px",
    marginRight: "16px",
    borderRadius: "50%",
  },
  blockCount: {
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "16px",
  },
  tableItem: {
    height: "80px",
    fontWeight: 600,
    fontSize: "18px",
  },
  chartField: {
    width: "calc(25% / 2)",
    borderLeft: "1px solid #e9e9e9",
    position: "relative",
    borderTop: "1px solid #e9e9e9",
  },
  headerField: {
    borderLeft: "none",
    width: "calc(25% / 2)",
    position: "relative",
    "&:before": {
      content: "' '",
      height: "50%",
      display: "block",
      position: "absolute",
      bottom: "0",
      left: "0",
      borderLeft: "1px solid #e9e9e9",
    },
  },
  headerFieldBar: {
    width: "60%",
    borderBottom: "1px solid #e9e9e9",
  },
  tableHeaderItem: {
    height: "60px",
  },
  tearchName: {
    width: "15%",
    paddingRight: "20px",
    fontWeight: "bold",
  },
  itemTearchName: {
    color: "#4B88F5",
    borderTop: "1px solid #e9e9e9",
    cursor: "pointer",
  },
  chartBar: {
    borderLeft: "1px solid #e9e9e9",
    width: "60%",
  },
  totalType: {
    paddingTop: "40px",
    borderTop: "1px solid #e9e9e9",
  },
  table: {
    maxWidth: "1500px",
  },
  tableContainer: {
    borderBottom: "1px solid #e9e9e9",
  },
  filter: {
    margin: "40px 0",
  },
  selector: {
    height: "40px",
  },
}));

const lang = {
  lessonTitle: d("Total Lessons (Live and In Class) Scheduled").t("report_teaching_load_lesson_title"),
  teacher: d("Teacher").t("report_label_teacher"),
  menuItem1: t("report_teaching_load_lesson_menu_item", { days: 7 }),
  menuItem2: t("report_teaching_load_lesson_menu_item", { days: 30 }),
  noOfClasses: d("No of Classes").t("report_teaching_load_lesson_classes_column"),
  noOfStudent: d("No of Student").t("report_teaching_load_lesson_student_column"),
  current: d("current").t("report_teaching_load_lesson_current"),
  liveCompleted: d("Live Lessons Completed").t("report_teaching_load_lesson_live_completed"),
  inClassCompleted: d("In Class Lessons Completed").t("report_teaching_load_lesson_in_class_completed"),
  liveMissed: d("Live Lessons Missed").t("report_teaching_load_lesson_live_missed"),
  inClassMidded: d("In Class Lessons Missed").t("report_teaching_load_lesson_in_class_missed"),
  hrs: d("hrs").t("report_label_hrs_lower"),
  mins: d("mins").t("report_label_mins_lower"),
};
const colors = ["#005096", "#0E78D5", "#CC8685", "#E9BEBD"];

interface Props {
  teacherChange: (id?: string) => void;
}

const computeTimeStamp = (days: number) => {
  return `${moment().unix()}-${moment().subtract(days, "days").unix()}`;
};

const formatTime = (mins: number = 0) => {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours ? hours + lang.hrs : ""}${minutes ? minutes + lang.mins : ""}`;
};

export default function LessonChart(props: Props) {
  const style = useStyle();
  const dispatch = useDispatch();
  const [selectItem, setSelectItem] = useState(7);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const queryParams = useRef<EntityTeacherLoadLessonRequest>({
    class_ids: [],
    duration: computeTimeStamp(selectItem),
    teacher_ids: [],
  });

  const { teacherLoadLesson } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const { list, statistic } = teacherLoadLesson;
  console.log(list);
  const filterChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>, child: React.ReactNode) => {
    setSelectItem(event.target.value as number);
    queryParams.current.duration = computeTimeStamp(event.target.value as number);
    getList();
  };

  const computeCountNumber = () => {
    let count = 0;
    Object.values(statistic).forEach((item) => {
      count += item.count ?? 0;
    });
    return count;
  };
  const computeAmountTime = () => {
    let time = 0;
    Object.values(statistic).forEach((item) => {
      time += item.duration ?? 0;
    });
    return formatTime(time);
  };
  const pageWillChange = (pageNumber: number) => {
    setPage(pageNumber);
    setCount(0);
  };

  const getList = () => {
    dispatch(getLessonTeacherLoad(queryParams.current));
  };
  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(teacherLoadLesson);
  }, [teacherLoadLesson]);

  const renderLineFooterBlock = (content: string, count: string, index: number) => {
    return (
      <div className={style.dataBlock} key={index}>
        <div className={style.point} style={{ background: colors[index] }}></div>
        <div className={style.blockRight}>
          {content}
          <div className={style.blockCount}>{count}</div>
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <Grid item container justify={"space-between"} className={clsx(style.tableItem, style.tableHeaderItem)}>
        <Grid item container justify={"flex-end"} alignItems={"center"} className={style.tearchName}>
          {lang.teacher}
        </Grid>
        <Grid item container direction={"column"} justify={"center"} alignItems={"center"} className={style.headerField}>
          {lang.noOfClasses}
          <Box color={"#c2c2c2"}>({lang.current})</Box>
        </Grid>
        <Grid item container direction={"column"} justify={"center"} alignItems={"center"} className={style.headerField}>
          {lang.noOfStudent}
          <Box color={"#c2c2c2"}>({lang.current})</Box>
        </Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={clsx(style.headerFieldBar, style.headerField)}>
          <Box display={"flex"} flex={1} width={"100%"} height={36}>
            <Box marginRight={3}></Box>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderTableItem = () => {
    return (
      <Grid item container className={style.tableItem}>
        <Grid
          item
          container
          justify={"flex-end"}
          alignItems={"center"}
          onClick={() => props.teacherChange("id222222")}
          className={clsx(style.tearchName, style.itemTearchName)}
        >
          Teacher
        </Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={style.chartField}>
          dd
        </Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={style.chartField}>
          dd
        </Grid>
        <Grid item container alignItems={"center"} className={style.chartBar}>
          <ReportTooltip content={[{ count: 3, type: "2323" }]}>
            <Box display={"flex"} width={"60%"} height={36}>
              {colors.map((item) => {
                return <Box bgcolor={item} width={"25%"} marginRight={"3px"}></Box>;
              })}
            </Box>
          </ReportTooltip>
        </Grid>
      </Grid>
    );
  };

  const renderFilter = () => {
    return (
      <Grid container justify={"space-between"} className={style.filter}>
        <Grid item>
          {lang.lessonTitle}: {computeCountNumber()}({computeAmountTime()})
        </Grid>
        <Select value={selectItem} onChange={filterChange} className={style.selector} input={<OutlinedInput />}>
          <MenuItem value={7}>{lang.menuItem1}</MenuItem>
          <MenuItem value={30}>{lang.menuItem2}</MenuItem>
        </Select>
      </Grid>
    );
  };

  const renderBody = () => {
    return (
      <Grid item container direction={"column"}>
        <Grid item container direction={"column"} className={style.tableContainer}>
          {renderTableItem()}
          {renderTableItem()}
        </Grid>
        <ReportPagination page={page} count={count} onChangePage={pageWillChange} />
      </Grid>
    );
  };

  const renderTotalType = () => {
    return (
      <Grid container wrap={"nowrap"} justify={"space-around"} className={style.totalType}>
        {renderLineFooterBlock(
          lang.liveCompleted,
          `${statistic.completed_live_lessons?.count}(${formatTime(statistic.completed_live_lessons?.duration)})`,
          0
        )}
        {renderLineFooterBlock(
          lang.inClassCompleted,
          `${statistic.completed_in_class_lessons?.count}(${formatTime(statistic.completed_in_class_lessons?.duration)})`,
          1
        )}
        {renderLineFooterBlock(lang.liveMissed, `${statistic.missed_live_lessons}(${formatTime(statistic.missed_live_lessons?.count)})`, 2)}
        {renderLineFooterBlock(
          lang.inClassMidded,
          `${statistic.missed_in_class_lessons}(${formatTime(statistic.missed_in_class_lessons?.count)})`,
          3
        )}
      </Grid>
    );
  };

  return (
    <Grid container justify={"center"}>
      <Grid container direction={"column"} className={style.table}>
        {renderFilter()}
        {renderHeader()}
        {renderBody()}
        {renderTotalType()}
      </Grid>
    </Grid>
  );
}
