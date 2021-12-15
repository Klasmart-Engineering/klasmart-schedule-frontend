import { Box, Button, FormControlLabel, Grid, IconButton, makeStyles, Radio, RadioGroup, useMediaQuery, useTheme } from "@material-ui/core";
import { CloseOutlined, PersonOutline } from "@material-ui/icons";
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
    "& .MuiFormControlLabel-label": {
      [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
        marginLeft: "8px",
      },
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
  lastIcon: {
    color: "red",
    marginLeft: "25px",
    cursor: "pointer",
  },
  templateMbBox: {
    width: "80vmin",
    height: "75vh",
    paddingTop: "12px",
    paddingBottom: "12px",
  },
  closeMb: {
    textAlign: "end",
    paddingRight: "15px",
  },
  contentMb: {
    overflow: "auto",
    paddingLeft: "20px",
  },
  titleMb: {
    fontSize: "25px",
    fontWeight: "bold",
  },
  groupTitle: {
    fontWeight: "bold",
    fontSize: "14px",
    margin: "8px 0px 8px 0px",
    display: "block",
  },
  desTitle: {
    color: "#666666",
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
  handleDestroyOperations: (value?: boolean) => void;
  participantsIds?: ParticipantsShortInfo;
  classRosterIds?: ParticipantsShortInfo;
}

interface TimeConflictsTemplateMbProps extends TimeConflictsTemplateProps {
  conflicts: Conflicts;
  checkPartMb: (
    item: any,
    type: string,
    signal: "class_roster_student_ids" | "class_roster_teacher_ids" | "participants_student_ids" | "participants_teacher_ids"
  ) => JSX.Element;
  handleConfirm: () => void;
  personalExist: (type: string) => boolean;
}

function TimeConflictsTemplateMb(props: TimeConflictsTemplateMbProps) {
  const { handleClose, conflicts, checkPartMb, handleConfirm, personalExist } = props;
  const classes = useStyles();
  const { breakpoints } = useTheme();
  const mobile325 = useMediaQuery(breakpoints.down(325));
  const previewDetailMbHeight = () => {
    if (mobile325) return "60vh";
    return "63vh";
  };
  return (
    <Box className={classes.templateMbBox}>
      <div className={classes.closeMb}>
        <CloseOutlined className={classes.lastIcon} onClick={handleClose} style={{ color: "#000000" }} />
      </div>
      <div className={classes.contentMb} style={{ height: previewDetailMbHeight() }}>
        <div className={classes.titleMb}>Schedule Conflict</div>
        <span className={classes.desTitle}>Please select a further action.</span>
        <div style={{ marginTop: "20px" }}>
          {personalExist("roster") && <span className={classes.groupTitle}>{d("Class Roster").t("schedule_detail_class_roster")}</span>}
          {conflicts.class_roster_student_ids &&
            conflicts.class_roster_student_ids.map((item) => {
              return checkPartMb(item, "student", "class_roster_student_ids");
            })}
          {conflicts.class_roster_teacher_ids &&
            conflicts.class_roster_teacher_ids.map((item) => {
              return checkPartMb(item, "teacher", "class_roster_teacher_ids");
            })}
          {personalExist("participants") && (
            <span className={classes.groupTitle}>{d("Participants").t("schedule_time_conflict_checking")}</span>
          )}
          {conflicts.participants_student_ids &&
            conflicts.participants_student_ids.map((item) => {
              return checkPartMb(item, "student", "participants_student_ids");
            })}
          {conflicts.participants_teacher_ids &&
            conflicts.participants_teacher_ids.map((item) => {
              return checkPartMb(item, "teacher", "participants_teacher_ids");
            })}
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          style={{ width: "200px", borderRadius: "10px", marginLeft: 0, marginTop: "3vh" }}
          onClick={handleConfirm}
          className={classes.lastButton}
        >
          {d("OK").t("assess_label_ok")}
        </Button>
      </div>
    </Box>
  );
}

export default function TimeConflictsTemplate(props: TimeConflictsTemplateProps) {
  const { conflictsData, handleChangeParticipants, handleClose, handleDestroyOperations, classRosterIds, participantsIds } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));

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

  const finalData = (afterTreatment: InnerItem[], preTreatment?: ClassOptionsItem[]) => {
    const filterData =
      afterTreatment?.filter((item: InnerItem) => item.selected === "not_schedule").map((item: InnerItem) => item.id) ?? [];
    return preTreatment?.filter((treatment: ClassOptionsItem) => !filterData.includes(treatment.id));
  };

  const handleConfirm = () => {
    let keepRosterOpen = false;
    for (let key in conflicts) {
      if (conflicts[key] && conflicts[key].some((item) => item.selected === "not_schedule")) keepRosterOpen = true;
    }
    handleChangeParticipants("classRoster", {
      teacher: finalData(conflicts.class_roster_teacher_ids, classRosterIds?.teacher),
      student: finalData(conflicts.class_roster_student_ids, classRosterIds?.student),
    } as ParticipantsShortInfo);
    handleChangeParticipants("paiticipants", {
      teacher: finalData(conflicts.participants_teacher_ids, participantsIds?.teacher),
      student: finalData(conflicts.participants_student_ids, participantsIds?.student),
    } as ParticipantsShortInfo);
    handleDestroyOperations(keepRosterOpen);
    handleClose();
  };

  const checkPart = (
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
          <FormControlLabel
            value="not_schedule"
            control={<Radio />}
            label={d("Not schedule").t("schedule_time_conflict_option_1")}
            className={css.radioItem}
          />
          <FormControlLabel
            value="schedule"
            control={<Radio />}
            label={d("Schedule anyway").t("schedule_time_conflict_option_2")}
            className={css.radioItem}
          />
        </RadioGroup>
      </Grid>
    </>
  );

  const checkPartMb = (
    item: any,
    type: string,
    signal: "class_roster_student_ids" | "class_roster_teacher_ids" | "participants_student_ids" | "participants_teacher_ids"
  ) => (
    <div>
      <div style={{ display: "flex" }}>
        <span className={css.desTitle} style={{ marginRight: "10px" }}>
          Tester 02 Stress
        </span>{" "}
        {type === "teacher" && <PersonOutline />}
      </div>
      <RadioGroup
        aria-label="gender"
        name="gender1"
        className={css.radioBox}
        style={{ marginLeft: "10px" }}
        value={item.selected}
        onChange={(event) => handleChange(event, item.id, signal)}
      >
        <FormControlLabel
          value="not_schedule"
          control={<Radio />}
          label={d("Not schedule").t("schedule_time_conflict_option_1")}
          className={css.radioItem}
        />
        <FormControlLabel
          value="schedule"
          control={<Radio />}
          label={d("Schedule anyway").t("schedule_time_conflict_option_2")}
          className={css.radioItem}
        />
      </RadioGroup>
    </div>
  );

  const personalExist = (type: string) => {
    if (type === "participants") {
      return (
        (conflicts.participants_student_ids && conflicts.participants_student_ids.length > 0) ||
        (conflicts.participants_teacher_ids && conflicts.participants_teacher_ids.length > 0)
      );
    } else {
      return (
        (conflicts.class_roster_student_ids && conflicts.class_roster_student_ids.length > 0) ||
        (conflicts.class_roster_teacher_ids && conflicts.class_roster_teacher_ids.length > 0)
      );
    }
  };

  const mobile = useMediaQuery(breakpoints.down(600));

  return mobile ? (
    <TimeConflictsTemplateMb
      conflictsData={conflictsData}
      handleChangeParticipants={handleChangeParticipants}
      handleClose={handleClose}
      handleDestroyOperations={handleDestroyOperations}
      checkPartMb={checkPartMb}
      conflicts={conflicts}
      handleConfirm={handleConfirm}
      personalExist={personalExist}
    />
  ) : (
    <div>
      <div className={css.title}>{d("Time conflicts occured, please specify").t("schedule_time_conflict_msg")}</div>
      <div className={css.content}>
        <div className={css.classRoster}>
          {personalExist("roster") && <p>{d("Class Roster").t("schedule_detail_class_roster")}</p>}
          <div className={css.scrollPart}>
            {conflicts.class_roster_student_ids &&
              conflicts.class_roster_student_ids.map((item) => {
                return (
                  <Grid container key={item.id} alignItems={sm ? "flex-start" : "center"} className={css.itemContainer}>
                    {checkPart(item, "student", "class_roster_student_ids")}
                  </Grid>
                );
              })}
            {conflicts.class_roster_teacher_ids &&
              conflicts.class_roster_teacher_ids.map((item) => {
                return (
                  <Grid container key={item.id} alignItems={sm ? "flex-start" : "center"} className={css.itemContainer}>
                    {checkPart(item, "teacher", "class_roster_teacher_ids")}
                  </Grid>
                );
              })}
          </div>
        </div>
        <div className={css.classRoster}>
          {personalExist("participants") && <p>{d("Participants").t("schedule_time_conflict_checking")}</p>}
          <div className={css.scrollPart}>
            {conflicts.participants_student_ids &&
              conflicts.participants_student_ids.map((item) => {
                return (
                  <Grid container key={item.id} alignItems={sm ? "flex-start" : "center"} className={css.itemContainer}>
                    {checkPart(item, "student", "participants_student_ids")}
                  </Grid>
                );
              })}
            {conflicts.participants_teacher_ids &&
              conflicts.participants_teacher_ids.map((item) => {
                return (
                  <Grid container key={item.id} alignItems={sm ? "flex-start" : "center"} className={css.itemContainer}>
                    {checkPart(item, "teacher", "participants_teacher_ids")}
                  </Grid>
                );
              })}
          </div>
        </div>
      </div>
      <div className={css.buttons}>
        <Button variant="outlined" onClick={handleClose}>
          {d("Cancel").t("assess_button_cancel")}
        </Button>
        <Button variant="contained" color="primary" className={css.lastButton} onClick={handleConfirm}>
          {d("OK").t("assess_label_ok")}
        </Button>
      </div>
    </div>
  );
}
