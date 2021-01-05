import { Button, FormControlLabel, Grid, makeStyles, Radio, RadioGroup, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { d, reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "20px",
    fontWeight: 700,
    paddingBottom: "20px",
    borderBottom: "1px solid #eeeeee",
  },
  content: {},
  classRoster: {
    "& p": {
      marginBottom: 0,
    },
  },
  participants: {},
  radioBox: {
    flexDirection: "initial",
    flexWrap: "nowrap",
    [theme.breakpoints.down("sm")]: {
      // flexDirection: 'initial',
      flexWrap: "wrap",
    },
  },
  itemContainer: {
    "& h4": {
      margin: "6px 0",
    },
  },
  radioItem: {
    width: "220px",
    [theme.breakpoints.down("sm")]: {
      width: "171px",
    },
  },
  itemName: {
    paddingLeft: "40px",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "20px",
    },
  },
  scrollPart: {
    maxHeight: "300px",
    [theme.breakpoints.down("lg")]: {
      height: "200px",
    },
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "3px",
      backgroundColor: "rgb(220, 220, 220)",
      boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)",
    },
    "&::-webkit-scrollbar-thumb:window-inactive": {
      backgroundColor: "rgba(220,220,220,0.4)",
    },
  },
  buttons: {
    textAlign: "right",
    marginTop: "20px",
    [theme.breakpoints.down("sm")]: {
      paddingRight: "40px",
    },
  },
  lastButton: {
    marginLeft: "30px",
  },
  IconBox: {
    position: "relative",
  },
  itemIcon: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
  },
}));

export default function TimeConflictsTemplate() {
  const css = useStyles();

  const { breakpoints } = useTheme();

  const sm = useMediaQuery(breakpoints.down("sm"));

  const data = {
    roster: ["dasdsdas", "Wffd ASAf", "FASfdds", "dsad", "shjJHHljsdj", "shjJHHljsdj", "shjJHHljsdj", "shjJHHljsdj"],
    participants: ["dasdadad", "dsdsada", "Twdsad JJSDs", "dfsda sd "],
  };

  return (
    <div>
      <div className={css.title}>{reportMiss("Time conflicts occured, please specify", "schedule_conflicts_specify")}</div>
      <div className={css.content}>
        <div className={css.classRoster}>
          <p>{reportMiss("Class Roster", "schedule_class_roster")}</p>
          <div className={css.scrollPart}>
            {data.roster.map((item) => {
              return (
                <Grid container key={item} alignItems={sm ? "flex-start" : "center"} className={css.itemContainer}>
                  <Grid item xs={5} sm={4} md={4} lg={4} xl={4} className={css.IconBox}>
                    {/* <IconButton className={css.itemIcon}>
                        <PersonOutline />
                      </IconButton> */}
                    <h4 className={css.itemName}>{item}</h4>
                  </Grid>
                  <Grid item xs={7} sm={8} md={8} lg={8} xl={8}>
                    <RadioGroup aria-label="gender" name="gender1" className={css.radioBox} defaultValue="schedule">
                      <FormControlLabel value="not_schedule" control={<Radio />} label="Not schedule" className={css.radioItem} />
                      <FormControlLabel value="schedule" control={<Radio />} label="Schedule anyway" className={css.radioItem} />
                    </RadioGroup>
                  </Grid>
                </Grid>
              );
            })}
          </div>
        </div>
        <div className={css.classRoster}>
          <p>{reportMiss("Participants", "schedule_participants")}</p>
          <div className={css.scrollPart}>
            {data.participants.map((item) => {
              return (
                <Grid container key={item} alignItems={sm ? "flex-start" : "center"} className={css.itemContainer}>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <h4 className={css.itemName}>{item}</h4>
                  </Grid>
                  <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                    <RadioGroup aria-label="gender" name="gender1" className={css.radioBox} defaultValue="schedule">
                      <FormControlLabel value="not_schedule" control={<Radio />} label="Not schedule" className={css.radioItem} />
                      <FormControlLabel value="schedule" control={<Radio />} label="Schedule anyway" className={css.radioItem} />
                    </RadioGroup>
                  </Grid>
                </Grid>
              );
            })}
          </div>
        </div>
      </div>
      <div className={css.buttons}>
        <Button variant="outlined">{d("Cancel").t("assess_button_cancel")}</Button>
        <Button variant="contained" color="primary" className={css.lastButton}>
          {d("OK").t("assess_label_ok")}
        </Button>
      </div>
    </div>
  );
}
