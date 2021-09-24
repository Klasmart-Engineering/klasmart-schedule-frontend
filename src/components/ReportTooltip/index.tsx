import { Grid, Tooltip } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { ReactElement } from "react";
import { EntityContentUsage } from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";

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

export default function ReportTooltip(props: Props) {
  const classes = useStyles();
  const count = props.content.reduce((count, item) => Number(item.count) + count, 0);
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
        count !== 0 ? (
          <Grid container direction={"column"}>
            {props.content.map((item, key) => {
              return (
                <Grid container justify={"space-between"} className={classes.item} key={key}>
                  {item.type}
                  <label>{item.count}</label>
                </Grid>
              );
            })}
            <Grid container justify={"space-between"} className={classes.item} style={{ margin: 0 }}>
              {d("Total").t("report_student_usage_total")}
              <label>{count}</label>
            </Grid>
          </Grid>
        ) : (
          ""
        )
      }
    >
      {props.children}
    </Tooltip>
  );
}
