import { Box, createStyles, makeStyles, Theme, Button } from "@material-ui/core";
import { VisibilityOff } from "@material-ui/icons";
import React from "react";
import { timestampType } from "../../types/scheduleTypes";
import CloseIcon from "@material-ui/icons/Close";
import { EntityScheduleListView } from "../../api/api.auto";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "black",
      zIndex: 999,
      opacity: 0.6,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    anyTimeBox: {
      width: "80%",
      height: "60%",
      position: "absolute",
      backgroundColor: "white",
      zIndex: 999,
      left: "11%",
      top: "16%",
    },
    anyTimeTitle: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid #eeeeee",
      padding: "8px 16px 24px 20px",
      "& span": {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    itemBox: {
      padding: "0px 30px 0px 30px",
      "& p": {
        fontSize: "16px",
        fontWeight: "bold",
        padding: "10px 0px 0px 30px",
      },
      "& div": {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px 10px 50px",
        "& span": {
          display: "flex",
        },
      },
    },
  })
);

interface SearchListProps {
  timesTamp: timestampType;
  handleChangeShowAnyTime: (is_show: boolean) => void;
  scheduleAnyTimeViewData: EntityScheduleListView[];
}

interface AnyTimeData {
  study: EntityScheduleListView[];
  homeFun: EntityScheduleListView[];
}

function AnyTimeSchedule(props: SearchListProps) {
  const classes = useStyles();
  const { handleChangeShowAnyTime, scheduleAnyTimeViewData } = props;
  const [anyTimeData, setAnyTimeData] = React.useState<AnyTimeData>({ homeFun: [], study: [] });

  React.useEffect(() => {
    if (scheduleAnyTimeViewData) {
      const study: EntityScheduleListView[] = [];
      const homeFun: EntityScheduleListView[] = [];
      scheduleAnyTimeViewData.forEach((view: EntityScheduleListView) => {
        if (view.is_home_fun) homeFun.push(view);
        if (!view.start_at && !view.end_at) study.push(view);
      });
      setAnyTimeData({ study, homeFun });
    }
  }, [scheduleAnyTimeViewData]);

  const buttonGroup = (type: string) => {
    return (
      <span>
        {type === "study" && (
          <>
            <Button style={{ marginLeft: "20px" }} variant="outlined" color="primary">
              Preview
            </Button>
            <Button style={{ marginLeft: "20px" }} variant="contained" color="primary">
              Go Study
            </Button>
          </>
        )}
        <Button style={{ marginLeft: "20px", border: "1px solid #009688", color: "#009688" }} variant="outlined" color="inherit">
          Edit
        </Button>
        <Button style={{ marginLeft: "20px", border: "1px solid red", color: "red" }} variant="outlined" color="secondary">
          Delete
        </Button>
      </span>
    );
  };

  return (
    <Box className={classes.anyTimeBox}>
      <p className={classes.anyTimeTitle}>
        <span>View Anytime Study - Class1</span>
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleChangeShowAnyTime(false);
          }}
        />
      </p>
      {anyTimeData.study.length > 0 && (
        <div className={classes.itemBox}>
          <p>Anytime Study</p>
          {anyTimeData.homeFun.map((view: EntityScheduleListView) => {
            return (
              <div>
                <span>{view.title} </span>
                {buttonGroup("study")}
              </div>
            );
          })}
        </div>
      )}
      {anyTimeData.homeFun.length > 0 && (
        <div className={classes.itemBox}>
          <p>Anytime Study - Home Fun</p>
          {anyTimeData.homeFun.map((view: EntityScheduleListView) => {
            return (
              <div>
                <span>
                  {view.title} <VisibilityOff style={{ color: "#000000", marginLeft: "10px" }} />
                </span>
                {buttonGroup("home_fun")}
              </div>
            );
          })}
        </div>
      )}
    </Box>
  );
}

export default function ScheduleAnyTime(props: SearchListProps) {
  const { timesTamp, handleChangeShowAnyTime, scheduleAnyTimeViewData } = props;
  const classes = useStyles();
  return (
    <>
      <Box className={classes.listContainer} />
      <AnyTimeSchedule
        timesTamp={timesTamp}
        handleChangeShowAnyTime={handleChangeShowAnyTime}
        scheduleAnyTimeViewData={scheduleAnyTimeViewData}
      />
    </>
  );
}
