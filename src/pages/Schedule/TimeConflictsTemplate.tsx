import { Button, FormControlLabel, Grid, IconButton, makeStyles, Radio, RadioGroup, useMediaQuery, useTheme } from "@material-ui/core";
import { PersonOutline } from "@material-ui/icons";
import React from "react";
import { d } from "../../locale/LocaleManager";
import { ClassOptionsItem, ConflictsData, ParticipantsShortInfo } from "../../types/scheduleTypes";

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
  id?: string;
  name?: string;
  selected: string;
}

interface Conflicts {
  class_roster_student_ids: InnerItem[];
  class_roster_teacher_ids: InnerItem[];
  participants_student_ids: InnerItem[];
  participants_teacher_ids: InnerItem[];
  [key: string]: InnerItem[];
}

interface TimeConflictsTemplateProps {
  handleClose: () => void;
  conflictsData: ConflictsData;
  handleChangeParticipants: (type: string, data: ParticipantsShortInfo) => void;
}

export default function TimeConflictsTemplate(props: TimeConflictsTemplateProps) {
  const { conflictsData, handleChangeParticipants, handleClose } = props;
  const css = useStyles();

  const { breakpoints } = useTheme();

  const sm = useMediaQuery(breakpoints.down("sm"));

  // const [participants, setParticipants] = React.useState<ParticipantsShortInfo>(participantsIds)
  // const [classRoster, setClassRoster] = React.useState<ParticipantsShortInfo>(classRosterIds)

  const [conflicts, setConflict] = React.useState<Conflicts>({
    class_roster_student_ids:
      conflictsData.class_roster_students &&
      conflictsData.class_roster_students.map((item: ClassOptionsItem) => ({ ...item, selected: "not_schedule" })),
    class_roster_teacher_ids:
      conflictsData.class_roster_teachers &&
      conflictsData.class_roster_teachers.map((item: ClassOptionsItem) => ({ ...item, selected: "not_schedule" })),
    participants_student_ids:
      conflictsData.participants_students &&
      conflictsData.participants_students.map((item: ClassOptionsItem) => ({ ...item, selected: "not_schedule" })),
    participants_teacher_ids:
      conflictsData.participants_teachers &&
      conflictsData.participants_teachers.map((item: ClassOptionsItem) => ({ ...item, selected: "not_schedule" })),
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

  let arr = {
    class_roster_student_ids: [],
    class_roster_teacher_ids: [],
    participants_student_ids: [],
    participants_teacher_ids: [],
  };

  const handleConfirm = () => {
    for (let key in conflicts) {
      // @ts-ignore
      arr[key] = conflicts[
        key as "class_roster_student_ids" | "class_roster_teacher_ids" | "participants_student_ids" | "participants_teacher_ids"
      ]
        .filter((item) => item.selected === "schedule")
        .map((item) => ({ id: item.id, name: item.name }));
    }
    handleChangeParticipants("paiticipants", {
      teacher: arr.participants_teacher_ids,
      student: arr.participants_student_ids,
    });
    handleChangeParticipants("classRoster", {
      teacher: arr.class_roster_teacher_ids,
      student: arr.class_roster_student_ids,
    });
    handleClose();
  };

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
      <div className={css.title}>{d("Time conflicts occured, please specify").t("schedule_time_conflict_msg")}</div>
      <div className={css.content}>
        <div className={css.classRoster}>
          <p>{d("Class Roster").t("schedule_detail_class_roster")}</p>
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
          <p>{d("Participants").t("schedule_time_conflict_checking")}</p>
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
        <Button variant="contained" color="primary" className={css.lastButton} onClick={handleConfirm}>
          {d("OK").t("assess_label_ok")}
        </Button>
      </div>
    </div>
  );
}
