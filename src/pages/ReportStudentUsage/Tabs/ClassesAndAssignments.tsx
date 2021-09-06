import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import SelectBtn from "../components/selectBtn";
import ClassesAndAssignmentsTable from "./ClassesAndAssignmentsTable";
import school from "../../../mocks/school.json";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    styles: {
      display: "inline-block",
      width: "260px",
      height: "130px",
      boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.10), 0px 9px 40px 0px rgba(0,0,0,0.12)",
      borderRadius: "8px",
      marginRight: "40px",
      padding: "32px 20px",
      boxSizing: "border-box",
    },
    LiveScheduled: {
      boxShadow: "0px 4px 16px 0px rgba(14,120,213,0.80)",
      background: "#0e78d5",
      color: "#fff",
    },
    selectContainer: {
      display: "flex",
      justifyContent: "space-between",
      height: "112px",
      alignItems: "center",
    },
    text: {
      fontSize: "20px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
      color: "#000000",
    },
    left: {
      float: "left",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    },
    right: {
      float: "right",
    },
    textStyle: {
      fontSize: "16px",
      fontFamily: "Helvetica, Helvetica-Regular",
      fontWeight: 400,
    },
    number: {
      fontSize: "26px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
    },
  })
);

export default function () {
  const css = useStyles();
  const [value, setValue] = useState({
    schoolVal: "",
    classVal: "",
  });
  const [data, setData] = useState({
    schoolData: [""],
    classData: [""],
  });

  useEffect(() => {
    const sData = ["All"];
    const cData = ["All"];
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
    setData({ schoolData: sData, classData: cData });
    // eslint-disable-next-line
  }, [value.schoolVal]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, schoolVal: event.target.value as string });
  };
  const handleChange2 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, classVal: event.target.value as string });
  };
  return (
    <div>
      <div style={{ marginTop: "32px" }}>
        <div className={clsx(css.LiveScheduled, css.styles)}>
          <div className={css.left}>
            <div className={css.textStyle}>Live Scheduled</div>
            <div className={css.number}>4000</div>
          </div>
          <div className={css.right}>饼图</div>
        </div>
        <div className={css.styles}>
          <div className={css.left}>
            <div className={css.textStyle}>Study</div>
            <div className={css.number}>4000</div>
          </div>
          <div className={css.right}>饼图</div>
        </div>
        <div className={css.styles}>
          <div className={css.left}>
            <div className={css.textStyle}>Home Fun</div>
            <div className={css.number}>4000</div>
          </div>
          <div className={css.right}>饼图</div>
        </div>
      </div>
      <div className={css.selectContainer}>
        <div className={css.text}>Live Scheduled(latest 3 moths)</div>
        <div>
          <SelectBtn value={value.schoolVal} handleChange={handleChange} label="School" data={data.schoolData} />
          <SelectBtn value={value.classVal} handleChange={handleChange2} label="Class" data={data.classData} />
        </div>
      </div>
      <ClassesAndAssignmentsTable />
    </div>
  );
}
