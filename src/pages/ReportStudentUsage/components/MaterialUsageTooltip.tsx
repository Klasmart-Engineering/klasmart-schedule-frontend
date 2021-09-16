import { Grid, Tooltip } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { ReactElement } from "react";
import { EntityContentUsage } from "../../../api/api.auto";
import { d } from "../../../locale/LocaleManager";
import useTranslation from "../hooks/useTranslation";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: "none",
    },
    item: {
      marginBottom: "10px",
    },
    arrow: {
      color: "#000",
      // background: '#000'
    },
    container: {
      color: "#fff",
      width: "156px",
      fontSize: "14px",
      background: "#000",
      borderRadius: "10px",
      padding: "10px 14px",
      position: "relative",
      bottom: "-20px",
      "&::after": {
        content: " ",
        height: "10px",
        width: "10px",
        position: "absolute",
        left: "50%",
        background: "#000",
      },
    },
  })
);
interface Props {
  content: EntityContentUsage[];
  children: ReactElement;
}

export default function MaterialUsageTooltip(props: Props) {
  const classes = useStyles();
  const { MaterialUsageConData } = useTranslation();
  return (
    <Tooltip
      id="mouse-over-popover"
      classes={{
        tooltip: classes.container,
        tooltipArrow: classes.arrow,
        arrow: classes.arrow,
      }}
      arrow
      placement="top"
      title={
        <Grid container direction={"column"}>
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
      }
    >
      {props.children}
    </Tooltip>
  );
}
