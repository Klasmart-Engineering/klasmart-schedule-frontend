import { Box, Card, createStyles, Grid, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { AccessTime, PeopleOutlineOutlined } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import emptyBox from "../../../src/assets/icons/empty.svg";
import { EntityScheduleSearchView, EntityScheduleShortInfo } from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
import { RootState } from "../../reducers";
import { getSearchScheduleList } from "../../reducers/schedule";
import { timestampType } from "../../types/scheduleTypes";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";

const useStyles = makeStyles(({ breakpoints }) =>
  createStyles({
    listContainer: {
      padding: "20px 40px 10px 40px",
      [breakpoints.down(1400)]: {
        padding: "8px 8px 0px 0px",
      },
      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.16)",
      borderRadius: "8px",
    },
    cardItem: {
      width: "100%",
      height: "200px",
      backgroundColor: "#009688",
      borderRadius: "16px",
      padding: "20px 30px 30px 40px",
      boxSizing: "border-box",
      marginBottom: "30px",
      cursor: "pointer",
    },
    titleDate: {
      marginTop: 0,
    },
    itemTitle: {
      color: "#fff",
    },
    clockIcon: {
      color: "#fff",
      fontSize: "30px",
      verticalAlign: "middle",
      marginRight: "15px",
      [breakpoints.down(1400)]: {
        fontSize: "20px",
      },
    },
    timeItem: {
      display: "inline-block",
      height: "30px",
      color: "#fff",
      fontSize: "20px",
    },
    firstLine: {
      marginBottom: "20px",
    },
    partItem: {
      marginBottom: "30px",
    },
    circle: {
      textAlign: "center",
    },
    paginationUl: {
      justifyContent: "center",
    },
    searchItemMb: {
      padding: "22px",
      "& span": {
        display: "block",
        color: "#FFFFFF",
      },
    },
  })
);

function timeFormat(time: number, type: string = "time") {
  if (type === "age") {
    if (!time) return "";
    var currentTime: number = new Date().valueOf();
    return parseInt(`${(currentTime / 1000 - time) / 3600 / 24 / 365}`);
  }

  time = time * 1000;
  if (!time) {
    return;
  }
  const date = new Date(time);
  const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
  const [Y, M, D, h, m, s] = [
    // es6 解构赋值
    date.getFullYear(),
    dateNumFun(date.getMonth() + 1),
    dateNumFun(date.getDate()),
    dateNumFun(date.getHours()),
    dateNumFun(date.getMinutes()),
    dateNumFun(date.getSeconds()),
  ];
  if (type === "date") {
    return `${Y}-${M}`;
  } else if (type === "dateDay") {
    return `${Y}-${M}-${D}`;
  } else if (type === "timeOnly") {
    return `${h}:${m}`;
  } else {
    return `${Y}-${M}-${D} ${h}:${m}:${s}`; // 一定要注意是反引号，否则无效。
  }
}

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const name = query.get("name") || "";
  return { name };
};

interface SearchListProps {
  timesTamp: timestampType;
}

export default function SearchList(props: SearchListProps) {
  const dispatch = useDispatch();
  const { name } = useQuery();
  const [page, setPage] = React.useState(1);
  const { timesTamp } = props;
  React.useEffect(() => {
    const data = {
      teacher_name: name,
      page: 1,
      page_size: 10,
      time_zone_offset: -new Date().getTimezoneOffset() * 60,
      start_at: timesTamp.start,
      order_by: "schedule_at" as "create_at" | "-create_at" | "start_at" | "-start_at" | "schedule_at" | undefined,
    };
    dispatch(getSearchScheduleList({ data, metaLoading: true }));
  }, [dispatch, name, timesTamp.start]);
  const { searchScheduleList, total } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const classes = useStyles();

  const history = useHistory();

  let flag: boolean;

  function isTitleSame(date: EntityScheduleSearchView, number: number) {
    if (number === 0) {
      flag = true;
    } else {
      searchScheduleList.forEach((item: EntityScheduleSearchView, index: number) => {
        if (index < number) {
          if (
            timeFormat((item.start_at! > 0 ? item.start_at : item.due_at) as number, "dateDay") ===
            timeFormat((date.start_at! > 0 ? date.start_at : date.due_at) as number, "dateDay")
          ) {
            flag = false;
            return;
          } else {
            flag = true;
            return;
          }
        }
      });
    }
    if (flag) return true;
    return false;
  }
  const previewSchedule = (id: number) => {
    history.push(`/schedule/calendar/rightside/scheduleList/model/edit/?name=${name}&schedule_id=${id}`);
    document.documentElement.scrollTop = 0;
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    const data = {
      teacher_name: name,
      page: value,
      page_size: 10,
      time_zone_offset: -new Date().getTimezoneOffset() * 60,
      start_at: timesTamp.start,
      order_by: "schedule_at" as "create_at" | "-create_at" | "start_at" | "-start_at" | "schedule_at" | undefined,
    };
    dispatch(getSearchScheduleList({ data, metaLoading: true }));
    document.documentElement.scrollTop = 0;
  };

  const reBytesStr = (str: string, len: number) => {
    let bytesNum = 0;
    let afterCutting = "";
    for (let i = 0, lens = str.length; i < lens; i++) {
      bytesNum += str.charCodeAt(i) > 255 ? 2 : 1;
      if (bytesNum > len) break;
      afterCutting = str.substring(0, i + 1);
    }
    return bytesNum > len ? `${afterCutting} ....` : afterCutting;
  };

  const textEllipsis = (value?: string) => {
    const CharacterCount = mobile ? 36 : 40;
    return value ? reBytesStr(value, CharacterCount) : "";
  };

  const getTeacherList = (item: EntityScheduleShortInfo[] | undefined, student_num: number | undefined) => {
    if (!item) return `(${student_num})`;
    const temp = item.map((teacherItem: EntityScheduleShortInfo) => teacherItem.name);
    const list = temp.join(", ");
    return (
      <span style={{ display: "inline" }}>
        <Tooltip title={list} placement="top-start">
          <span style={{ display: "inline" }}>{textEllipsis(list)}</span>
        </Tooltip>{" "}
        ({student_num})
      </span>
    );
  };

  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

  const eventColorMb = [
    { id: "OnlineClass", color: "#0E78D5" },
    { id: "OfflineClass", color: "#1BADE5" },
    { id: "Homework", color: "#13AAA9" },
    { id: "Task", color: "#AFBA0A" },
  ];

  const CustomEvent = (id?: string) => {
    const eventTemplate = eventColorMb.filter((item) => item.id === id);
    return id ? eventTemplate[0].color : "#009688";
  };

  return (
    <Box className={classes.listContainer}>
      {searchScheduleList && searchScheduleList.length > 0 ? (
        mobile ? (
          <Box>
            {searchScheduleList.map((item: EntityScheduleSearchView, index: number) => (
              <div style={{ padding: "0px 16px 0px 16px" }} onClick={() => previewSchedule(item.id as unknown as number)}>
                {isTitleSame(item, index) && (
                  <p style={{ fontSize: "16px", fontWeight: 700 }}>
                    {timeFormat((item.start_at! > 0 ? item.start_at : item.due_at) as number, "dateDay")}
                  </p>
                )}
                <div
                  className={classes.searchItemMb}
                  style={{ backgroundColor: CustomEvent(item.class_type), borderRadius: "12px", marginTop: "10px" }}
                >
                  <span
                    style={{ fontSize: "20px", fontWeight: 700, wordBreak: "break-word" }}
                    onClick={() => previewSchedule(item.id as unknown as number)}
                  >
                    {item.title}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 400, marginTop: "18px" }}>
                    <AccessTime className={classes.clockIcon} /> {timeFormat(item.start_at as number, "timeOnly")} -{" "}
                    {timeFormat(item.end_at as number, "timeOnly")}{" "}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 400, marginTop: "18px" }}>
                    <PeopleOutlineOutlined className={classes.clockIcon} /> {getTeacherList(item.member_teachers, item.student_count)}{" "}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 300, marginTop: "18px" }}>{item?.lesson_plan?.name}</span>
                  <span style={{ fontSize: "12px", fontWeight: 300, marginTop: "6px" }}>{item?.program?.name}</span>
                </div>
              </div>
            ))}
          </Box>
        ) : (
          <>
            {searchScheduleList.map((item: EntityScheduleSearchView, index: number) => (
              <div key={item.id} className={classes.partItem}>
                {isTitleSame(item, index) && (
                  <h1 className={classes.titleDate}>
                    {timeFormat((item.start_at! > 0 ? item.start_at : item.due_at) as number, "dateDay")}
                  </h1>
                )}
                <Card className={classes.cardItem} onClick={() => previewSchedule(item.id as unknown as number)}>
                  <h1 className={`${classes.titleDate} ${classes.itemTitle}`}>{item.title}</h1>
                  <Grid container alignItems="center" className={classes.firstLine}>
                    <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                      <span className={classes.timeItem}>
                        <AccessTime className={classes.clockIcon} />
                      </span>
                      <span className={classes.timeItem}>
                        {timeFormat(item.start_at as number, "timeOnly")} - {timeFormat(item.end_at as number, "timeOnly")}
                      </span>
                    </Grid>
                    <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                      <span className={classes.timeItem}>{item?.lesson_plan?.name}</span>
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center">
                    <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                      <span className={classes.timeItem}>
                        <PeopleOutlineOutlined className={classes.clockIcon} />
                      </span>
                      <span className={classes.timeItem}>{getTeacherList(item.member_teachers, item.student_count)}</span>
                    </Grid>
                    <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                      <span className={classes.timeItem}>{item?.program?.name}</span>
                    </Grid>
                  </Grid>
                </Card>
              </div>
            ))}
          </>
        )
      ) : (
        <div style={{ textAlign: "center" }}>
          <img src={emptyBox} alt="" />
          <p>{d("No results found.").t("schedule_msg_no_result")}</p>
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Pagination
          count={Math.ceil(total / 10)}
          color="primary"
          classes={{ ul: classes.paginationUl }}
          onChange={handlePageChange}
          page={page}
        />
      </div>
    </Box>
  );
}
