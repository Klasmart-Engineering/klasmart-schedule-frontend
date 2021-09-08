import { createStyles, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SelectBtn from "../components/selectBtn";
import ClassFilter from "../components/ClassFilter";

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
  })
);

export default function () {
  const style = useStyles();
  const [value, setValue] = useState({
    contentVal: "",
  });
  const [data, setData] = useState({
    contentData: [{ id: "", name: "" }],
  });

  useEffect(() => {
    const conData = [
      { id: "All", name: "All" },
      { id: "H5P", name: "H5P" },
      { id: "Images", name: "Images" },
      { id: "Video", name: "Video" },
      { id: "Audio", name: "Audio" },
      { id: "Document", name: "Document" },
    ];
    setData({ ...data, contentData: conData });

    // eslint-disable-next-line
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, contentVal: event.target.value as string });
  };
  return (
    <div className={style.material}>
      <div className={style.selected}>
        <ClassFilter />
      </div>
      <div className={style.total}>
        <span>Content total viewed (latest 3 months):4000</span>
        <SelectBtn value={value.contentVal} label="Content" handleChange={handleChange} data={data.contentData} />
      </div>
    </div>
  );
}
