import React from "react";
import { Box, Card, Theme, makeStyles, createStyles, Grid } from "@material-ui/core";
import { AccessTime, PeopleOutlineOutlined } from "@material-ui/icons";
import { isBefore } from "date-fns";

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
      marginBottom: "40px",
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
  const dateNumFun = (num: any) => (num < 10 ? `0${num}` : num);
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
  const searchList = [
    {
      id: Math.floor(1000),
      title: "Zoo Animals",
      theme: "STEAM - Bada Genius",
      start_at: 1597812763,
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
      id: Math.floor(1000),
      title: "Zoo Animals",
      theme: "STEAM - Bada Genius",
      start_at: 1597912763,
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
      id: Math.floor(1000),
      title: "Zoo Animals",
      theme: "STEAM - Bada Genius",
      start_at: 1597912763,
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
      id: Math.floor(1000),
      title: "Zoo Animals",
      theme: "STEAM - Bada Genius",
      start_at: 1597812763,
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

  let middleList: any = [];

  middleList = searchList.map((item) => {
    return {
      titleDate: timeFormat(item.start_at, "dateDay"),
      schedules: [item],
      start_at: item.start_at,
    };
  });
  let result: any;
  let some: any = [];
  middleList.forEach((item: any) => {
    result = middleList.filter((item1: any) => item1.titleDate === item.titleDate);
    some = middleList.filter((item1: any) => item1.titleDate !== item.titleDate);
  });
  result.forEach((item: any, index: number) => {
    if (index > 0) {
      result[0].schedules.push(item.schedules[0]);
      result.length = 1;
    }
  });
  result = [...result, ...some];

  function compare(property: string) {
    return function (a: any, b: any) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    };
  }
  searchList.sort(compare("start_at"));

  return (
    <Box className={classes.listContainer}>
      {searchList.map((item: any, index: number) => (
        <div key={index} className={classes.partItem}>
          <h2 className={classes.titleDate}>{timeFormat(item.start_at, "dateDay")}</h2>
          {/* {
              item.schedules.map((child: any, index: number) => ( */}
          <Card key={index} className={classes.cardItem}>
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
          {/* ))
            } */}
        </div>
      ))}
    </Box>
  );
}
