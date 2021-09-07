import { Box, Grid, Paper, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import PercentCircle from "../../../components/Chart/PercentCircle";
import ReportRegistrationTrendChart from "../../../components/Chart/ReportRegistrationTrendChart";
import school from "../../../mocks/school.json";
import SelectBtn from "../components/selectBtn";

const useStyles = makeStyles(() =>
  createStyles({
    lineStyle: {
      flex: 4,
      height: "746px",
      opacity: 1,
      display: "flex",
      flexDirection: "column",
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.20), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14)",
      boxSizing: "border-box",
      marginRight: "47px",
    },
    pieStyle: {
      flex: 1,
      height: "746px",
      opacity: 1,
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.20), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14)",
      padding: "24px 24px 40px 24px",
      boxSizing: "border-box",
    },
    detailStyle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textStyle: {
      fontSize: "20px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
      color: "#000000",
    },
    title: {
      fontSize: "20px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
      color: "#000000",
      marginBottom: "48px",
    },
    pie: {
      height: "370px",
      marginBottom: "20px",
    },
    number: {
      fontSize: "18px",
      fontFamily: "Helvetica, Helvetica-Regular",
      fontWeight: 400,
      color: "#666666",
      textAlign: "center",
    },
    view: {
      width: "273px",
      height: "48px",
      margin: "108px auto 0",
      display: "flex",
      justifyContent: "center",
    },
    btn: {
      width: "100%",
      height: "100%",
      fontSize: "16px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
    },
    lineChartContainer: {
      display: "flex",
      flexDirection: "column",
      margin: "0 -24px",
      flex: 1,
    },
    lineChart: {
      flex: 1,
      maxHeight: "450px",
    },
    lineFooter: {
      display: "flex",
      justifyContent: "space-around",
      borderTop: "1px solid #e9e9e9",
      padding: "40px 0",
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
    chooser: {
      height: "100%",
      minWidth: "160px",
      marginLeft: "30px",
      border: "1px solid #CCCCCC",
      "& .MuiSelect-select": {
        padding: "10.5px 14px",
      },
      "& fieldset": {
        border: "none",
      },
    },
    trendChart: {
      display: "flex",
      width: "calc(100% - 48px)",
      flexDirection: "column",
      flex: 1,
      padding: "24px 24px 0 24px",
    },
  })
);

export default function () {
  const css = useStyles();
  const [value, setValue] = useState({
    schoolVal: "",
    classVal: "",
    timeVal: "",
  });
  const [data, setData] = useState({
    schoolData: [""],
    classData: [""],
    timeData: [""],
  });

  useEffect(() => {
    const sData = ["All"];
    const cData = ["All"];
    const tData = ["latest 4 weeks", "latest 3 months", "latest 12 months"];
    school.forEach((item: any) => sData.push(item.name));
    sData.push("None");
    switch (value.schoolVal) {
      case "All":
        school.forEach((item: any) => item.classes.forEach((value: any) => cData.push(value.name)));
        break;
      case "None":
        break;
      case "":
        break;
      default:
        setValue({ ...value, classVal: cData[0] });
        school.forEach((item: any) => {
          if (item.name === value.schoolVal) {
            item.classes.forEach((value: any) => cData.push(value.name));
          }
        });
        break;
    }
    setData({ schoolData: sData, classData: cData, timeData: tData });

    // eslint-disable-next-line
  }, [value.schoolVal]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, schoolVal: event.target.value as string });
  };
  const handleChange2 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, classVal: event.target.value as string });
  };
  const handleChange3 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, timeVal: event.target.value as string });
  };

  const renderLineFooterBlock = (content: string, count: number, color: string) => {
    return (
      <div className={css.dataBlock}>
        <div className={css.point} style={{ background: color }}></div>
        <div className={css.blockRight}>
          {content}
          <div className={css.blockCount}>{count}</div>
        </div>
      </div>
    );
  };
  return (
    <Grid
      container
      spacing={3}
      style={{
        marginTop: 20,
      }}
    >
      <Grid container item xs={12} md={9}>
        <Paper className={css.trendChart}>
          <div className={css.detailStyle}>
            <div className={css.textStyle}>Class Registration Details</div>
            <div>
              <SelectBtn value={value.schoolVal} handleChange={handleChange} label="School" data={data.schoolData} />
              <SelectBtn value={value.classVal} handleChange={handleChange2} label="Class" data={data.classData} />
              <SelectBtn value={value.timeVal} handleChange={handleChange3} data={data.timeData} />
            </div>
          </div>
          <div className={css.lineChartContainer}>
            <div className={css.lineChart}>
              <ReportRegistrationTrendChart
                registeredData={[10, 20, 30, 76]}
                createdData={[20, 30, 10, 23]}
                notCreateDate={[32, 43, 23, 55]}
                dates={["2018-4-3", "2018-4-4", "2018-4-5", "2018-4-6"]}
              />
            </div>
            <div className={css.lineFooter}>
              {renderLineFooterBlock("Number of students registrted", 3600, "#0e78d5")}
              {renderLineFooterBlock("Number of students who created accounts", 3600, "#8693f0")}
              {renderLineFooterBlock("Number of students who did not create accounts", 3600, "#ff9492")}
            </div>
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 24,
            }}
          >
            <Typography
              variant="h5"
              style={{
                width: "100%",
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "left",
                marginBottom: 48,
              }}
            >
              Number of students <br /> created account
            </Typography>
            <PercentCircle
              width={370}
              height={370}
              total={9600}
              value={4000}
              fontSize={22}
              margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
              percentAsLabel
            />
            <Typography
              style={{
                marginTop: 20,
                marginBottom: 100,
              }}
            >
              Out off 9000 Students
            </Typography>
            <Button fullWidth variant="contained" color="primary">
              View Full List
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
