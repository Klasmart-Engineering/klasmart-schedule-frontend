import { Box, Grid, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { d, t } from "../../locale/LocaleManager";
const useStyle = makeStyles(() => ({
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
    minWidth: "12px",
    maxWidth: "12px",
    marginTop: "6px",
    marginRight: "16px",
    borderRadius: "50%",
  },
  blockCount: {
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "16px",
  },
  tableItem: {
    height: "80px",
    fontSize: "18px",
    borderBottom: "1px solid #e9e9e9",
  },
  chartField: {
    width: "calc(25% / 2)",
    borderLeft: "1px solid #e9e9e9",
  },
  tearchName: {
    width: "15%",
    paddingRight: "20px",
    fontWeight: "bold",
  },
  chartBar: {
    borderLeft: "1px solid #e9e9e9",
    width: "60%",
  },
  totalType: {
    marginTop: "40px",
  },
  table: {
    maxWidth: "1500px",
  },
  filter: {
    marginBottom: "40px",
  },
}));

interface Props {}

const lang = {
  lessonTitle: d("Total Lessons (Live and In Class) Scheduled").t("report_teaching_load_lesson_title"),
  teacher: d("Teacher").t("report_label_teacher"),
  menuItem1: t("report_teaching_load_lesson_menu_item", { days: 7 }),
  menuItem2: t("report_teaching_load_lesson_menu_item", { days: 30 }),
};
const colors = ["#005096", "#0E78D5", "#CC8685", "#E9BEBD"];
export function LessonTotalChart(props: Props) {
  const style = useStyle();

  const renderLineFooterBlock = (content: string, count: string, index: number) => {
    return (
      <div className={style.dataBlock} key={index}>
        <div className={style.point} style={{ background: colors[index] }}></div>
        <div className={style.blockRight}>
          {content}
          <div className={style.blockCount}>{count}</div>
        </div>
      </div>
    );
  };

  const renderTableItem = () => {
    return (
      <Grid item container className={style.tableItem}>
        <Grid item container justify={"flex-end"} alignItems={"center"} className={style.tearchName}></Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={style.chartField}>
          dd
        </Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={style.chartField}>
          dd
        </Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={style.chartBar}>
          <Box flex={1} width={"100%"} height={36}>
            <Box marginRight={3}></Box>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderFilter = () => {
    return (
      <Grid container justify={"space-between"} className={style.filter}>
        <Grid item>{lang.lessonTitle}</Grid>
        <Select value={7}>
          <MenuItem value={7}>{lang.menuItem1}</MenuItem>
          <MenuItem value={30}>{lang.menuItem2}</MenuItem>
        </Select>
      </Grid>
    );
  };

  const renderHeader = () => {
    return (
      <Grid item container justify={"space-between"} className={style.tableItem}>
        <Grid item container justify={"flex-end"} alignItems={"center"} className={style.tearchName}>
          {lang.teacher}
        </Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={style.chartField}>
          dd
        </Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={style.chartField}>
          dd
        </Grid>
        <Grid item container justify={"center"} alignItems={"center"} className={style.chartBar}>
          <Box flex={1} width={"100%"} height={36}>
            <Box marginRight={3}></Box>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderBody = () => {
    return (
      <Grid item container direction={"column"}>
        {renderTableItem()}
      </Grid>
    );
  };

  const renderTotalType = () => {
    return (
      <Grid container wrap={"nowrap"} justify={"space-around"} className={style.totalType}>
        {renderLineFooterBlock("Live Lessons Completed", "70(1hrs)", 0)}
        {renderLineFooterBlock("In Class Lessons Completed", "32(1hrs 5mins)", 1)}
        {renderLineFooterBlock("Live Lessons Missed", "18(55 mins)", 2)}
        {renderLineFooterBlock("In Class Lessons Missed", "8(1hrs)", 3)}
      </Grid>
    );
  };

  return (
    <Grid container justify={"center"}>
      <Grid container direction={"column"} className={style.table}>
        {renderFilter()}
        {renderHeader()}
        {renderBody()}
        {renderTotalType()}
      </Grid>
    </Grid>
  );
}
