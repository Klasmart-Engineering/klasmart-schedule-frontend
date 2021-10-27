import { Box, Card, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {
      padding: "20px 40px 10px 40px",
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
    const CharacterCount = 40;
    return value ? reBytesStr(value, CharacterCount) : "";
  };

  const getTeacherList = (item: EntityScheduleShortInfo[] | undefined, student_num: number | undefined) => {
    if (!item) return `(${student_num})`;
    const temp = item.map((teacherItem: EntityScheduleShortInfo) => teacherItem.name);
    const list = temp.join(", ");
    return (
      <span>
        <Tooltip title={list} placement="top-start">
          <span>{textEllipsis(list)}</span>
        </Tooltip>{" "}
        ({student_num})
      </span>
    );
  };

  return (
    <Box className={classes.listContainer}>
      {searchScheduleList && searchScheduleList.length > 0 ? (
        <>
          {searchScheduleList.map((item: EntityScheduleSearchView, index: number) => (
            <div key={item.id} className={classes.partItem}>
              {isTitleSame(item, index) && (
                <h1 className={classes.titleDate}>{timeFormat((item.start_at! > 0 ? item.start_at : item.due_at) as number, "dateDay")}</h1>
              )}
              <Card className={classes.cardItem} onClick={() => previewSchedule((item.id as unknown) as number)}>
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
      ) : (
        <div style={{ textAlign: "center" }}>
          <img src={emptyBox} alt="" />
          <p>{d("No results found.").t("schedule_msg_no_result")}</p>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
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
