import { Box, Grid, MenuItem, OutlinedInput, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EntityTeacherLoadLesson, EntityTeacherLoadLessonRequest } from "../../../api/api.auto";
import ReportPagination from "../../../components/ReportPagination/ReportPagination";
import ReportTooltip from "../../../components/ReportTooltip";
import { RootState } from "../../../reducers";
import { getLessonTeacherLoad } from "../../../reducers/report";
import useTranslation from "../hooks/useTranslation";
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
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
    marginBottom: "-1px",
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
    fontSize: "20px",
    fontWeight: "bold",
  },
  selector: {
    height: "40px",
  },
  datumGraph: {
    transition: "ease 400ms",
  },
}));

interface Props {
  teacherChange: (id?: string, days?: number) => void;
  teacherIds: { label: string; value: string }[];
  classIds: { label: string; value: string }[];
}

const computeTimeStamp = (days: number) => {
  return `${moment().subtract(days, "days").unix()}-${moment().unix()}`;
};

const useFormatTime = () => {
  const lang = useTranslation().lessonLang;
  return (value: number = 0) => {
    const mins = value / 60;
    const hours = Math.floor(mins / 60);
    const minutes = Math.floor(mins % 60);
    const hoursText = `${hours} ${lang.hrs}`;
    const minuteText = `${minutes} ${lang.mins}`;
    return mins ? `${hours ? hoursText : ""} ${minutes ? minuteText : ""}` : `0 ${lang.mins}`;
  };
};

const PAGE_SIZE = 5;

export default function (props: Props) {
  const style = useStyle();
  const dispatch = useDispatch();
  const [selectItem, setSelectItem] = useState(7);
  const [page, setPage] = useState(0);
  const pageRef = useRef(page);
  const [count, setCount] = useState(0);
  const queryParams = useRef<EntityTeacherLoadLessonRequest>({
    class_ids: [],
    duration: computeTimeStamp(selectItem),
    teacher_ids: [],
  });
  const currentOpenedTeacher = useRef<string>();
  const { teacherLoadLesson } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const { lessonColors, lessonLang } = useTranslation();
  const formatTime = useFormatTime();
  const lang = lessonLang,
    colors = lessonColors;
  const { list, statistic } = teacherLoadLesson;
  const filterChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>, child: React.ReactNode) => {
    setSelectItem(event.target.value as number);
    pageRef.current = 0;
    setPage(pageRef.current);
    queryParams.current.duration = computeTimeStamp(event.target.value as number);
    getList();
  };

  const computeCurrentPage = () => {
    return list.reduce((preValue, item) => {
      return (
        preValue +
        (item.completed_in_class_lessons ?? 0) +
        (item.completed_live_Lessons ?? 0) +
        (item.missed_in_class_lessons ?? 0) +
        (item.missed_live_lessons ?? 0)
      );
    }, 0);
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
    pageRef.current = pageNumber - 1;
    setPage(pageRef.current);
    getList();
  };

  const clickTeacher = (id?: string) => {
    currentOpenedTeacher.current = currentOpenedTeacher.current === id ? undefined : id;
    props.teacherChange(currentOpenedTeacher.current, selectItem);
  };

  const getList = async () => {
    const params = {
      ...queryParams.current,
      metaLoading: true,
      teacher_ids: queryParams.current.teacher_ids?.slice(pageRef.current * PAGE_SIZE, pageRef.current * PAGE_SIZE + PAGE_SIZE),
    };
    await dispatch(getLessonTeacherLoad(params));
    props.teacherChange();
  };

  useEffect(() => {
    if (props.classIds.length) {
      queryParams.current.class_ids = props.classIds.map((item) => item.value);
      queryParams.current.teacher_ids = props.teacherIds.map((item) => item.value);
      pageRef.current = 0;
      setPage(pageRef.current);
      setCount(props.teacherIds.length);
      getList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.classIds]);

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

  const renderTableItem = (item: EntityTeacherLoadLesson) => {
    const count =
      (item.completed_in_class_lessons ?? 0) +
      (item.completed_live_Lessons ?? 0) +
      (item.missed_in_class_lessons ?? 0) +
      (item.missed_live_lessons ?? 0);
    const handlePercentage = (v?: number) => ((v || 0) / count) * 100 + "%";
    return (
      <Grid item container className={style.tableItem} key={item.teacher_id}>
        <Grid
          item
          container
          justify={"flex-end"}
          alignItems={"center"}
          onClick={() => clickTeacher(item.teacher_id)}
          className={clsx(style.tearchName, style.itemTearchName)}
        >
          {props.teacherIds.find((v) => v.value === item.teacher_id)?.label}
        </Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={style.chartField}>
          {item.number_of_classes}
        </Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={style.chartField}>
          {item.number_of_students}
        </Grid>
        <Grid item container alignItems={"center"} className={style.chartBar}>
          <ReportTooltip
            totalText={lang.totalScheduled}
            content={[
              { count: item.completed_live_Lessons || 0, type: lang.liveCompleted },
              { count: item.completed_in_class_lessons || 0, type: lang.inClassCompleted },
              { count: item.missed_live_lessons || 0, type: lang.liveMissed },
              { count: item.missed_in_class_lessons || 0, type: lang.inClassMidded },
            ]}
          >
            <Box display={"flex"} width={(count / computeCurrentPage()) * 100 + "%"} height={36}>
              {item.completed_in_class_lessons ? (
                <Box
                  bgcolor={colors[0]}
                  width={handlePercentage(item.completed_in_class_lessons)}
                  marginRight={"3px"}
                  className={style.datumGraph}
                ></Box>
              ) : (
                ""
              )}
              {item.completed_live_Lessons ? (
                <Box bgcolor={colors[1]} width={handlePercentage(item.completed_live_Lessons)} marginRight={"3px"}></Box>
              ) : (
                ""
              )}
              {item.missed_in_class_lessons ? (
                <Box bgcolor={colors[2]} width={handlePercentage(item.missed_in_class_lessons)} marginRight={"3px"}></Box>
              ) : (
                ""
              )}
              {item.missed_live_lessons ? (
                <Box bgcolor={colors[3]} width={handlePercentage(item.missed_live_lessons)} marginRight={"3px"}></Box>
              ) : (
                ""
              )}
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
          {lang.lessonTitle}: {computeCountNumber() || 0}（{computeAmountTime()}）
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
          {list.map((item) => {
            return renderTableItem(item);
          })}
        </Grid>
        <ReportPagination page={page + 1} rowsPerPage={PAGE_SIZE} count={count} onChangePage={pageWillChange} />
      </Grid>
    );
  };

  const renderTotalType = () => {
    return (
      <Grid container wrap={"nowrap"} justify={"space-around"} className={style.totalType}>
        {renderLineFooterBlock(
          lang.liveCompleted,
          `${statistic.completed_live_lessons?.count || 0}（${formatTime(statistic.completed_live_lessons?.duration)}）`,
          0
        )}
        {renderLineFooterBlock(
          lang.inClassCompleted,
          `${statistic.completed_in_class_lessons?.count || 0}（${formatTime(statistic.completed_in_class_lessons?.duration)}）`,
          1
        )}
        {renderLineFooterBlock(
          lang.liveMissed,
          `${statistic.missed_live_lessons?.count || 0}（${formatTime(statistic.missed_live_lessons?.duration)}）`,
          2
        )}
        {renderLineFooterBlock(
          lang.inClassMidded,
          `${statistic.missed_in_class_lessons?.count || 0}（${formatTime(statistic.missed_in_class_lessons?.duration)}）`,
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
