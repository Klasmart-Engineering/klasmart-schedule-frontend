import { createStyles, Grid, IconButton, makeStyles, TablePagination, useTheme } from "@material-ui/core";
import { TablePaginationActionsProps } from "@material-ui/core/TablePagination/TablePaginationActions";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { ParentSize } from "@visx/responsive";
import React, { useEffect, useState } from "react";
import HorizontalBarChart from "../../../components/Chart/HorizontalBarChart";
import school from "../../../mocks/school.json";
import SelectBtn from "../components/selectBtn";
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
    return (
      <Grid container wrap={"nowrap"} className={style.tableContainer}>
        <Grid item className={style.tableItem} style={{ width: "40%", minWidth: "40%", maxWidth: "40%" }}>
          <ParentSize>{(info) => <HorizontalBarChart width={info.width} height={info.height} />}</ParentSize>
        </Grid>
        <Grid item className={style.tableItem}>
          <ParentSize>{(info) => <HorizontalBarChart width={info.width} height={info.height} noAxis />}</ParentSize>
        </Grid>
        <Grid item className={style.tableItem}>
          <ParentSize>{(info) => <HorizontalBarChart width={info.width} height={info.height} noAxis />}</ParentSize>
        </Grid>
      </Grid>
    );
  };

  const TablePaginationActions = (props: TablePaginationActionsProps) => {
    const theme = useTheme();
    const { count, page, rowsPerPage } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      //onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      //onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      //onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      //onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Grid container wrap={"nowrap"} alignItems={"center"}>
        <label className={style.paginationLabel}>Total {count} results</label>
        <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
          {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Grid>
    );
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
      {renderBarChart()}
      <Grid container>
        <Grid item className={style.date} style={{ width: "40%", minWidth: "40%", maxWidth: "40%" }}>
          june
        </Grid>
        <Grid item className={style.date}>
          july
        </Grid>
        <Grid item className={style.date}>
          august
        </Grid>
      </Grid>
      <Grid container direction={"column"} className={style.viewedAmount}>
        <Grid item className={style.lineFooter}>
          {renderLineFooterBlock("No of H5p viewed", 3600, "#0062FF")}
          {renderLineFooterBlock("images viewed", 3600, "#408AFF")}
          {renderLineFooterBlock("Video viewed", 3600, "#73A9FF")}
          {renderLineFooterBlock("Audio listened", 3600, "#A6C9FF")}
          {renderLineFooterBlock("Document viewed", 3600, "#E6EFFF")}
        </Grid>
      </Grid>
      <Grid container justify={"center"} item>
        <TablePagination
          className={style.pagination}
          count={100}
          rowsPerPage={10}
          page={1}
          onChangePage={() => {}}
          ActionsComponent={TablePaginationActions}
        />
      </Grid>
    </div>
  );
}
