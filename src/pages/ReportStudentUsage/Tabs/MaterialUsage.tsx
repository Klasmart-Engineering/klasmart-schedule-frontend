import { createStyles, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SelectBtn from "../components/selectBtn";
import school from "../../../mocks/school.json";

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
      marginTop: "10px",
      "&>span": {
        fontSize: "20px",
        fontFamily: "Helvetica, Helvetica-Bold",
        fontWeight: 700,
      },
    },
  })
);

export default function () {
  const style = useStyles();
  const [value, setValue] = useState({
    schoolVal: "",
    classVal: "",
    contentVal: "",
  });
  const [data, setData] = useState({
    schoolData: [""],
    classData: [""],
    contentData: [""],
  });

  useEffect(() => {
    const sData = ["All"];
    const cData = ["All"];
    const conData = ["All Content", "No of H5P viewed", "Images viewed", "Video viewed", "Audio listened", "Document viewed"];
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
    setData({ schoolData: sData, classData: cData, contentData: conData });

    // eslint-disable-next-line
  }, [value.schoolVal]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, schoolVal: event.target.value as string });
  };
  const handleChange2 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, classVal: event.target.value as string });
  };
  const handleChange3 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, contentVal: event.target.value as string });
  };
  return (
    <div className={style.material}>
      <div className={style.selected}>
        <SelectBtn value={value.schoolVal} handleChange={handleChange} label="School" data={data.schoolData} />
        <SelectBtn value={value.classVal} handleChange={handleChange2} label="Class" data={data.classData} />
      </div>
      <div className={style.total}>
        <span>Content total viewed (latest 3 months):4000</span>
        <SelectBtn value={value.contentVal} handleChange={handleChange3} data={data.contentData} />
      </div>
    </div>
  );
}
