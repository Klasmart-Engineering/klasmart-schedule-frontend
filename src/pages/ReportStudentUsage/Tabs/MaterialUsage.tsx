import { createStyles, Grid, IconButton, makeStyles, TablePagination, useTheme } from "@material-ui/core";
import { TablePaginationActionsProps } from "@material-ui/core/TablePagination/TablePaginationActions";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { ParentSize } from "@visx/responsive";
import React, { useEffect, useState } from "react";
import HorizontalBarChart from "../../../components/Chart/HorizontalBarChart";
import { d } from "../../../locale/LocaleManager";
import ClassFilter from "../components/ClassFilter";
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
    contentVal: "",
  });
  const [data, setData] = useState({
    contentData: [{ id: "", name: "" }],
  });

  const count = 4000;
  useEffect(() => {
    const conData = [
      { id: "All", name: d("All").t("report_label_all") },
      { id: "H5P", name: "H5P" },
      { id: "Images", name: d("Image").t("library_label_image") },
      { id: "Video", name: d("Video").t("library_label_video") },
      { id: "Audio", name: d("Audio").t("library_label_audio") },
      { id: "Document", name: d("Document").t("library_label_document") },
    ];
    setData({ ...data, contentData: conData });

    // eslint-disable-next-line
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
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
        <ClassFilter
          onChange={(v) => {
            console.log(v);
          }}
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
        <SelectBtn
          value={value.contentVal}
          label={d("Content").t("report_filter_content")}
          handleChange={handleChange}
          data={data.contentData}
        />
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
