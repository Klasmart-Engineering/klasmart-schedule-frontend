import { Button, FormControlLabel, Grid, IconButton, makeStyles, Radio, RadioGroup, useMediaQuery, useTheme } from "@material-ui/core";
import { PersonOutline } from "@material-ui/icons";
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
      backgroundColor: "#fff",
      width: "5px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#d8d8d8",
      borderRadius: "4px",
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

interface InnerItem {
  id: string;
  name: string;
  selected: string;
}

interface Conflicts {
  class_roster_student_ids: InnerItem[];
  class_roster_teacher_ids: InnerItem[];
  participants_student_ids: InnerItem[];
  participants_teacher_ids: InnerItem[];
}

export default function TimeConflictsTemplate() {
  const css = useStyles();

  const { breakpoints } = useTheme();

  const sm = useMediaQuery(breakpoints.down("sm"));

  const data1 = {
    class_roster_student: [
      {
        id: "wewr",
        name: "sdsad",
      },
      {
        id: "dasdsa",
        name: "BKJADHJ",
      },
      {
        id: "wesdasdasgwr",
        name: "FSNDKLJDAL",
      },
      {
        id: "dsdsdsdt5y4",
        name: "LKJLCS_sdfo",
      },
    ],
    class_roster_teacher: [
      {
        id: "wewrjj",
        name: "sdsafdsfd",
      },
      {
        id: "dasdser3a",
        name: "BKJAfsdaDHJ",
      },
      {
        id: "343r",
        name: "dsdasdar4",
      },
      {
        id: "dsdsdsdfsdft5y4",
        name: "LKJLCSfsd33_sdfo",
      },
    ],
    participants_student: [
      {
        id: "wewrjjsdsddq",
        name: "sdsa3r3rfdsfd",
      },
      {
        id: "dasdseae222r3a",
        name: "wdasdas",
      },
      {
        id: "343adr",
        name: "wawery6y",
      },
      {
        id: "dsdsdsdsdafsdft5y4",
        name: "LKJLCdad2sdfo",
      },
    ],
    participants_teacher: [
      {
        id: "wewrjj1",
        name: "sdsafdsfd2",
      },
      {
        id: "dasdser3a3",
        name: "BKJAfsdaDHJ4",
      },
      {
        id: "343r5",
        name: "dsdasdar46",
      },
      {
        id: "dsdsdsdfsdft5y47",
        name: "LKJLCSfsd33_sdfo8",
      },
    ],
  };

  const [conflicts, setConflict] = React.useState<Conflicts>({
    class_roster_student_ids: data1.class_roster_student.map((item) => ({ ...item, selected: "" })),
    class_roster_teacher_ids: data1.class_roster_teacher.map((item) => ({ ...item, selected: "" })),
    participants_student_ids: data1.participants_student.map((item) => ({ ...item, selected: "" })),
    participants_teacher_ids: data1.participants_teacher.map((item) => ({ ...item, selected: "" })),
  });

  const handleChange = (
    event: any,
    id: string,
    signal: "class_roster_student_ids" | "class_roster_teacher_ids" | "participants_student_ids" | "participants_teacher_ids"
  ) => {
    let temp = conflicts[signal];
    temp.forEach((item) => {
      if (item.id === id) {
        item.selected = event.target.value;
      }
    });
    setConflict({ ...conflicts, [signal]: temp });
  };

  /**
   * 最终返回出去的数据
   */

  // let arr = {
  //   class_roster_student_ids: [],
  //   class_roster_teacher_ids: [],
  //   participants_student_ids: [],
  //   participants_teacher_ids: []
  // }
  // for (let key in conflicts) {
  //   // @ts-ignore
  //   arr[key] = conflicts[key as "class_roster_student_ids" | "class_roster_teacher_ids" | "participants_student_ids" | "participants_teacher_ids"].filter(item => item.selected === "schedule").map(item => item.id)
  // }

  const chechkPart = (
    item: any,
    type: string,
    signal: "class_roster_student_ids" | "class_roster_teacher_ids" | "participants_student_ids" | "participants_teacher_ids"
  ) => (
    <>
      <Grid item xs={5} sm={4} md={4} lg={4} xl={4} className={css.IconBox}>
        {type === "teacher" && (
          <IconButton className={css.itemIcon}>
            <PersonOutline />
          </IconButton>
        )}
        <h4 className={css.itemName}>{item.name}</h4>
      </Grid>
      <Grid item xs={7} sm={8} md={8} lg={8} xl={8}>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          className={css.radioBox}
          value={item.selected}
          onChange={(event) => handleChange(event, item.id, signal)}
        >
          <FormControlLabel value="not_schedule" control={<Radio />} label="Not schedule" className={css.radioItem} />
          <FormControlLabel value="schedule" control={<Radio />} label="Schedule anyway" className={css.radioItem} />
        </RadioGroup>
      </Grid>
    </>
  );
  return (
    <div>
      <div className={css.title}>{reportMiss("Time conflicts occured, please specify", "schedule_conflicts_specify")}</div>
      <div className={css.content}>
        <div className={css.classRoster}>
          <p>{reportMiss("Class Roster", "schedule_class_roster")}</p>
          <div className={css.scrollPart}>
            {conflicts.class_roster_student_ids.map((item) => {
              return (
                <Grid container key={item.id} alignItems={sm ? "flex-start" : "center"} className={css.itemContainer}>
                  {chechkPart(item, "student", "class_roster_student_ids")}
                </Grid>
              );
            })}
            {conflicts.class_roster_teacher_ids.map((item) => {
              return (
                <Grid container key={item.id} alignItems={sm ? "flex-start" : "center"} className={css.itemContainer}>
                  {chechkPart(item, "teacher", "class_roster_teacher_ids")}
                </Grid>
              );
            })}
          </div>
        </div>
        <div className={css.classRoster}>
          <p>{reportMiss("Participants", "schedule_participants")}</p>
          <div className={css.scrollPart}>
            {conflicts.participants_student_ids.map((item) => {
              return (
                <Grid container key={item.id} alignItems={sm ? "flex-start" : "center"} className={css.itemContainer}>
                  {chechkPart(item, "student", "participants_student_ids")}
                </Grid>
              );
            })}
            {conflicts.participants_teacher_ids.map((item) => {
              return (
                <Grid container key={item.id} alignItems={sm ? "flex-start" : "center"} className={css.itemContainer}>
                  {chechkPart(item, "teacher", "participants_teacher_ids")}
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
