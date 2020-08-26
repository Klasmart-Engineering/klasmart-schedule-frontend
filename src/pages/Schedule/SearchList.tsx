import { Box, Card, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AccessTime, PeopleOutlineOutlined } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import VisibilitySensor from "react-visibility-sensor";
import searchList from "../../mocks/scheduleList";

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
      padding: "20px 30px 30px",
      boxSizing: "border-box",
      marginBottom: "30px",
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

export default function SearchList() {
  const classes = useStyles();

  const [scheduleList, setScheduleList] = React.useState(searchList);

  const history = useHistory();

  function compare(property: string) {
    return function (a: any, b: any) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    };
  }
  scheduleList.sort(compare("start_at"));

  let someone: any;

  function another(date: any, number: number) {
    if (number === 0) {
      someone = true;
    } else {
      scheduleList.forEach((item: any, index: number) => {
        if (index < number) {
          if (timeFormat(item.start_at, "dateDay") === timeFormat(date.start_at, "dateDay")) {
            someone = false;
            return;
          } else {
            someone = true;
            return;
          }
        }
      });
    }
    if (someone) return true;
    return false;
  }
  const previewSchedule = (index: number) => {
    history.push(`/schedule/calendar/rightside/scheduleList/model/edit/id/${index}`);
  };

  let listssss = [
    {
      id: "Math.floor(1000)",
      title: "Zoo Animals",
      theme: "STEAM - Bada Genius",
      start_at: 1599912763,
      end_at: 1597916363,
      lesson_plan: {
        id: Math.floor(1000),
        name: "Big Lesson Plan",
      },
      teachers: [
        {
          id: Math.floor(1000),
          name: "handsome teacher",
        },
      ],
    },
    {
      id: "Math.floor(1000)",
      title: "Zoo Animals",
      theme: "STEAM - Bada Genius",
      start_at: 1599912763,
      end_at: 1597916363,
      lesson_plan: {
        id: Math.floor(1000),
        name: "Big Lesson Plan",
      },
      teachers: [
        {
          id: Math.floor(1000),
          name: "handsome teacher",
        },
      ],
    },
    {
      id: "Math.floor(1000)",
      title: "Zoo Animals",
      theme: "STEAM - Bada Genius",
      start_at: 1599912763,
      end_at: 1597916363,
      lesson_plan: {
        id: Math.floor(1000),
        name: "Big Lesson Plan",
      },
      teachers: [
        {
          id: Math.floor(1000),
          name: "handsome teacher",
        },
      ],
    },
  ];

  const getBottom = (value: any) => {
    if (value) {
      setScheduleList([...scheduleList, ...listssss]);
    }
  };

  return (
    <Box className={classes.listContainer} id="sss-container">
      {scheduleList.map((item: any, index: number) => (
        <div key={index} className={classes.partItem}>
          {another(item, index) && <h1 className={classes.titleDate}>{timeFormat(item.start_at, "dateDay")}</h1>}
          <Card key={index} className={classes.cardItem} onClick={() => previewSchedule(index)}>
            <h1 className={`${classes.titleDate} ${classes.itemTitle}`}>{item.title}</h1>
            <Grid container alignItems="center" className={classes.firstLine}>
              <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                <span className={classes.timeItem}>
                  <AccessTime className={classes.clockIcon} />
                </span>
                <span className={classes.timeItem}>
                  {timeFormat(item.start_at, "timeOnly")} - {timeFormat(item.end_at, "timeOnly")}
                </span>
              </Grid>
              <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                <span className={classes.timeItem}>{item.lesson_plan.name}</span>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                <span className={classes.timeItem}>
                  <PeopleOutlineOutlined className={classes.clockIcon} />
                </span>
                <span className={classes.timeItem}>{item.teachers[0].name}</span>
              </Grid>
              <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                <span className={classes.timeItem}>{item.theme}</span>
              </Grid>
            </Grid>
          </Card>
        </div>
      ))}
      {scheduleList.length % 10 === 0 ? (
        <VisibilitySensor onChange={getBottom}>
          <div className={classes.circle}>
            <CircularProgress />
          </div>
        </VisibilitySensor>
      ) : (
        <div className={classes.circle}>{"No More Data"}</div>
      )}
    </Box>
  );
}
