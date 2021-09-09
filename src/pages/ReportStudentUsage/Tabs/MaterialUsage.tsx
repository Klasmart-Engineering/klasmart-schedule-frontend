import { Box, createStyles, Grid, IconButton, makeStyles } from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { ParentSize } from "@visx/responsive";
import moment, { Moment } from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EntityStudentUsageMaterialReportResponse } from "../../../api/api.auto";
import HorizontalBarChart from "../../../components/Chart/HorizontalBarChart";
import { d, t } from "../../../locale/LocaleManager";
import { RootState } from "../../../reducers";
import { getStudentUsageMaterial } from "../../../reducers/report";
import ClassFilter, { MutiSelect } from "../components/ClassFilter";
const useStyles = makeStyles(() =>
  createStyles({
    material: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    selected: {
      padding: "24px 0",
      display: "flex",
      justifyContent: "flex-end",
    },
    total: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      "&>span": {
        fontSize: "20px",
        fontFamily: "Helvetica, Helvetica-Bold",
        fontWeight: 700,
      },
    },
    tableContainer: {
      maxHeight: "380px",
      height: "380px",
      borderBottom: "1px solid #e9e9e9",
    },
    dataBlock: {
      display: "flex",
      alignItems: "flex-start",
    },
    blockRight: {
      wordBreak: "break-all",
      marginBottom: "16px",
      maxWidth: "180px",
    },
    point: {
      height: "12px",
      width: "12px",
      marginTop: "6px",
      marginRight: "16px",
      borderRadius: "50%",
    },
    blockCount: {
      fontSize: "20px",
      fontWeight: "bold",
      marginTop: "16px",
    },
    lineFooter: {
      display: "flex",
      justifyContent: "space-around",
      borderTop: "1px solid #e9e9e9",
      padding: "40px 0",
    },
    viewedAmount: {},
    tableItem: {
      flex: 1,
      height: "inherit",
      display: "flex",
      flexDirection: "column",
    },
    date: {
      flex: 1,
      alignSelf: "flex-end",
      paddingRight: "200px",
      color: "#999",
      textAlign: "right",
      paddingTop: "13px",
      paddingBottom: "13px",
    },
    chartTitle: {
      width: "160px",
      color: "#999",
    },
    dateList: {},
    pagination: {
      border: "none",
      "& .MuiTablePagination-toolbar": {
        "& .MuiTablePagination-input": {
          display: "none",
        },
        "& .MuiTablePagination-caption": {
          display: "none",
        },
      },
    },
    paginationLabel: {
      whiteSpace: "nowrap",
      color: "#999",
    },
  })
);
const conData = [
  { value: "all", label: d("All").t("report_label_all") },
  { value: "H5P", label: "H5P" },
  { value: "Images", label: d("Image").t("library_label_image") },
  { value: "Video", label: d("Video").t("library_label_video") },
  { value: "Audio", label: d("Audio").t("library_label_audio") },
  { value: "Document", label: d("Document").t("library_label_document") },
];

const colors = ["#0062FF", "#408AFF", "#73A9FF", "#A6C9FF", "#E6EFFF"];

const viewType: Record<string, string> = {
  h5p: d("No of H5P viewed").t("report_student_usage_h5p_viewed"),
  audio: d("Audio listened").t("report_student_usage_audio_listened"),
  video: d("Video viewed").t("report_student_usage_video_viewed"),
  image: d("Images viewed").t("report_student_usage_images_viewed"),
  document: d("Document viewed").t("report_student_usage_document_viewed"),
};

const months: Record<string, string> = {
  January: d("January").t("schedule_calendar_january"),
  February: d("February").t("schedule_calendar_february"),
  March: d("March").t("schedule_calendar_march"),
  April: d("April").t("schedule_calendar_april"),
  May: d("May").t("schedule_calendar_may"),
  June: d("June").t("schedule_calendar_june"),
  July: d("July").t("schedule_calendar_july"),
  August: d("August").t("schedule_calendar_august"),
  September: d("September").t("schedule_calendar_september"),
  October: d("October").t("schedule_calendar_october"),
  November: d("November").t("schedule_calendar_november"),
  December: d("December").t("schedule_calendar_december"),
};

const computeTimestamp = (month: Moment, now?: boolean): string => {
  if (now) {
    return month.set("D", 1).valueOf() + "-" + month.valueOf();
  }
  return month.set("D", 1).valueOf() + "-" + month.clone().add(1, "M").set("D", 1).valueOf();
};

const transferData = (
  data: EntityStudentUsageMaterialReportResponse,
  classList: { label: string; value: string }[]
): Record<string, string>[][] => {
  const result: Record<string, string>[][] = [[], [], []];
  const dates: string[] = [];
  const originData: { id: string; blockChart: Map<string, Array<any>> }[] = [];
  data.class_usage_list?.forEach((item) => {
    const obj = { id: item.id as string, blockChart: new Map() };
    originData.push(obj);
    item.content_usage_list?.forEach((item) => {
      dates.push(item.time_range as string);
      obj.blockChart.set(item.time_range, [...(obj.blockChart.get(item.time_range) || []), item]);
    });
  });
  dates.forEach((time, i) => {
    originData.forEach((datum) => {
      const obj: Record<string, string> = {};
      datum.blockChart.get(time)?.forEach((item) => {
        obj[viewType[item.type]] = item.count;
      });
      result[i].push({ date: classList.find((item) => item.value === datum.id)?.label as string, ...obj });
    });
  });
  return result;
};

const momentRef = moment().locale("en");
export default function () {
  const style = useStyles();
  const [contentTypeList, setContentTypeList] = useState<string[]>(["All"]);
  const contentTypeListRef = useRef(contentTypeList);
  const [timeRangeList] = useState<Moment[]>([momentRef.clone().subtract(2, "M"), momentRef.clone().subtract(1, "M"), momentRef]);
  const [classIdList, setClassIdList] = useState<{ label: string; value: string }[]>([]);
  const classIdListRef = useRef(classIdList);
  const { studentUsageReport } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const pageRef = useRef(page);

  const count = 4000;
  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, []);

  const getList = () => {
    dispatch(
      getStudentUsageMaterial({
        class_id_list: classIdListRef.current.slice(page * 5, page * 5 + 5).map((item) => item.value),
        content_type_list:
          contentTypeListRef.current.indexOf("all") > -1
            ? conData.filter((item) => item.value !== "all").map((item) => item.value)
            : contentTypeListRef.current,
        time_range_list: [computeTimestamp(timeRangeList[0]), computeTimestamp(timeRangeList[1]), computeTimestamp(timeRangeList[2], true)],
      })
    );
  };
  const handleChange = (
    value: {
      label: string;
      value: string;
    }[]
  ) => {
    setContentTypeList(value.map((item) => item.value));
    contentTypeListRef.current = value.map((item) => item.value);
    getList();
  };

  const handleClass = (value: { label: string; value: string }[]) => {
    console.log("classChange");
    setClassIdList(value);
    classIdListRef.current = value;
    getList();
  };

  const renderLineFooterBlock = (content: string, count: number, color: string) => {
    return (
      <div className={style.dataBlock}>
        <div className={style.point} style={{ background: color }}></div>
        <div className={style.blockRight}>
          {content}
          <div className={style.blockCount}>{count}</div>
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    const data = transferData(studentUsageReport[0], classIdList);
    return (
      <Grid container wrap={"nowrap"} className={style.tableContainer}>
        <Grid item className={style.tableItem} style={{ width: "40%", minWidth: "40%", maxWidth: "40%" }}>
          <ParentSize>{(info) => <HorizontalBarChart data={data[0]} width={info.width} height={info.height} />}</ParentSize>
        </Grid>
        <Grid item className={style.tableItem}>
          <ParentSize>{(info) => <HorizontalBarChart data={data[1]} width={info.width} height={info.height} noAxis />}</ParentSize>
        </Grid>
        <Grid item className={style.tableItem}>
          <ParentSize>{(info) => <HorizontalBarChart data={data[2]} width={info.width} height={info.height} noAxis />}</ParentSize>
        </Grid>
      </Grid>
    );
  };

  const TablePaginationActions = () => {
    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      pageRef.current = page - 5 <= 0 ? 0 : page - 5;
      setPage(pageRef.current);
      getList();
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      pageRef.current = page - 1 <= 0 ? 0 : page - 1;
      setPage(pageRef.current);
      getList();
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      pageRef.current = page + 1 > classIdList.length ? classIdList.length : page + 1;
      setPage(pageRef.current);
      getList();
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      pageRef.current = page + 5 > classIdList.length ? classIdList.length : page + 5;
      setPage(pageRef.current);
      getList();
    };

    return (
      <Grid container wrap={"nowrap"} justify={"center"} alignItems={"center"}>
        <label className={style.paginationLabel}>
          {d("Total").t("report_student_usage_total")} {classIdList.length} {d("results").t("report_student_usage_results")}
        </label>
        <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
          <FirstPageIcon />
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(classIdList.length / 5) - 1} aria-label="next page">
          <KeyboardArrowRight />
        </IconButton>
        <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(classIdList.length / 5) - 1} aria-label="last page">
          <LastPageIcon />
        </IconButton>
      </Grid>
    );
  };

  return (
    <div className={style.material}>
      <div className={style.selected}>
        <ClassFilter
          onChange={handleClass}
          onClose={() => {
            console.log("close");
          }}
        />
      </div>
      <div className={style.total}>
        <span>
          {d("Content total viewed (latest 3 months):").t("content_total_viewed")}
          {count}
        </span>
        <Box
          style={{
            position: "relative",
            height: 50,
          }}
        >
          <MutiSelect options={conData} limitTags={2} label={t("report_filter_content")} onChange={handleChange} onClose={() => {}} />
        </Box>
      </div>
      {renderBarChart()}
      <Grid container>
        <Grid item className={style.date} style={{ width: "40%", minWidth: "40%", maxWidth: "40%" }}>
          {months[timeRangeList[0].format("MMMM")]}
        </Grid>
        <Grid item className={style.date}>
          {months[timeRangeList[1].format("MMMM")]}
        </Grid>
        <Grid item className={style.date}>
          {months[timeRangeList[2].format("MMMM")]}
        </Grid>
      </Grid>
      <Grid container direction={"column"} className={style.viewedAmount}>
        <Grid item className={style.lineFooter}>
          {(studentUsageReport[1].content_usage_list || []).map((item, index) => {
            return renderLineFooterBlock(viewType[item.type as string], item.count as number, colors[index]);
          })}
        </Grid>
      </Grid>
      <Grid container justify={"center"} item>
        {TablePaginationActions()}
      </Grid>
    </div>
  );
}
