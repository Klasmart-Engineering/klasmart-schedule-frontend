import { Grid } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { EntityContentUsage } from "../../../api/api.auto";
import { d } from "../../../locale/LocaleManager";
import useTranslation from "../hooks/useTranslation";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: "none",
    },
    container: {},
    item: {
      marginBottom: "10px",
    },
    paper: {
      color: "#fff",
      width: "156px",
      fontSize: "14px",
      background: "#000",
      borderRadius: "10px",
      padding: "10px 14px",
      position: "relative",
      top: "-10px",
      "&::after": {
        content: " ",
        height: "10px",
        width: "10px",
        position: "absolute",
        left: "50%",
        bottom: "-10px",
        background: "#000",
      },
    },
  })
);
interface Props {
  anchorEl: HTMLDivElement | null;
  content: EntityContentUsage[];
}

export default function MaterialUsageTooltip(props: Props) {
  const classes = useStyles();
  const { MaterialUsageConData } = useTranslation();
  return (
    <Popover
      id="mouse-over-popover"
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={Boolean(props.anchorEl)}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      disableRestoreFocus
    >
      <Grid container direction={"column"} className={classes.container}>
        {props.content.map((item, key) => {
          return (
            <Grid container justify={"space-between"} className={classes.item} key={key}>
              {MaterialUsageConData.find((v) => v.value === item.type)?.label}
              <label>{item.count}</label>
            </Grid>
          );
        })}
        <Grid container justify={"space-between"} className={classes.item} style={{ margin: 0 }}>
          {d("Total").t("report_student_usage_total")}
          <label>{props.content.reduce((count, item) => Number(item.count) + count, 0)}</label>
        </Grid>
      </Grid>
    </Popover>
  );
}
