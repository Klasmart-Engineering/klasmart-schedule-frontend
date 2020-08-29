import DateFnsUtils from "@date-io/date-fns";
import { Box, Button, MenuItem, TextField, ThemeProvider } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Close, DeleteOutlineOutlined, FileCopyOutlined, Save } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import ModalBox from "../../components/ModalBox";
import { removeSchedule, saveScheduleData } from "../../reducers/schedule";
import theme from "../../theme";
import RepeatSchedule from "./Repeat";
import ScheduleAttachment from "./ScheduleAttachment";
import { RootState } from "../../reducers";
import { useRepeatSchedule } from "../../hooks/useRepeatSchedule";
import { CommonShort } from "../../api/api";
import mockClass from "../../mocks/backendMock/class.json";
import mockProgram from "../../mocks/backendMock/program.json";
import mockSubject from "../../mocks/backendMock/subject.json";
import mockTeacher from "../../mocks/backendMock/teacher.json";

const useStyles = makeStyles(({ shadows }) => ({
  fieldset: {
    marginTop: 20,
    width: "100%",
  },
  halfFieldset: {
    marginTop: 20,
    width: "calc(50% - 10px)",
    "&:not(:first-child)": {
      marginLeft: 20,
    },
  },
  formControset: {
    padding: "10px 10px 20px 10px",
    boxShadow: shadows[3],
    position: "relative",
  },
  toolset: {
    fontSize: "20px",
    cursor: "pointer",
  },
  fieldBox: {
    position: "relative",
  },
  iconField: {
    position: "absolute",
    right: "10px",
    top: "48%",
  },
  descFiled: {
    height: "100px",
  },
  repeatBox: {
    position: "absolute",
    top: "0",
    left: "101%",
    boxShadow: shadows[3],
    zIndex: 999,
  },
}));

function SmallCalendar(props: CalendarStateProps) {
  const { timesTamp, changeTimesTamp } = props;
  const getTimestamp = (date: any | null) => new Date(date).getTime() / 1000;
  const handleDateChange = (date: Date | null) => {
    changeTimesTamp({ start: getTimestamp(date), end: getTimestamp(date) });
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <DatePicker autoOk variant="static" openTo="date" value={new Date(timesTamp.start * 1000)} onChange={handleDateChange} />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

function EditBox(props: CalendarStateProps) {
  const css = useStyles();
  const history = useHistory();
  const [selectedDueDate, setSelectedDate] = React.useState<Date | null>(new Date(new Date().setHours(new Date().getHours())));
  const [openStatus, setOpenStatus] = React.useState(false);
  const { timesTamp } = props;
  const { scheduleDetial } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const { contentsList } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const dispatch = useDispatch();
  const [classItem, setClassItem] = React.useState<any>({});
  const [lessonPlan, setLessonPlan] = React.useState<any>({});
  const [subjectItem, setSubjectItem] = React.useState<any>({});
  const [programItem, setProgramItem] = React.useState<any>({});
  const [teacherItem, setTeacherItem] = React.useState<any>({});
  const [attachmentId, setAttachmentId] = React.useState<string>("");
  const [contentsListSelect, setContentsListSelect] = React.useState<any>({});

  React.useEffect(() => {
    const newContentsData: any = [];
    if (contentsList.length > 0) {
      contentsList.forEach((item: CommonShort) => {
        newContentsData.push({ id: item.id, name: item.name });
      });
    }
    setContentsListSelect(newContentsData);
  }, [contentsList]);

  React.useEffect(() => {
    console.log(timesTamp);
  }, [timesTamp]);

  React.useEffect(() => {
    if (scheduleDetial.id) {
      const newData: any = {
        attachment_id: scheduleDetial.attachment,
        class_id: scheduleDetial.class!.id,
        class_type: scheduleDetial.class_type,
        description: scheduleDetial.description,
        due_at: scheduleDetial.due_at,
        end_at: scheduleDetial.end_at,
        is_all_day: scheduleDetial.is_all_day,
        is_force: true,
        is_repeat: true,
        lesson_plan_id: scheduleDetial.lesson_plan!.id,
        program_id: scheduleDetial.program!.id,
        repeat: scheduleDetial.subject,
        start_at: scheduleDetial.start_at,
        subject_id: scheduleDetial.subject!.id,
        teacher_ids: scheduleDetial.teachers,
        title: scheduleDetial.title,
      };
      setStatus({
        allDayCheck: newData.is_all_day,
        repeatCheck: false,
        dueDateCheck: newData.due_at ? true : false,
      });
      setClassItem(scheduleDetial.class);
      setLessonPlan(scheduleDetial.lesson_plan);
      setSubjectItem(scheduleDetial.subject);
      setProgramItem(scheduleDetial.program);
      setTeacherItem(scheduleDetial.teachers);
      setScheduleList(newData);
    }
  }, [scheduleDetial]);

  React.useEffect(() => {
    console.log(timesTamp);
  }, [timesTamp]);

  const [state, dispatchRepeat] = useRepeatSchedule();
  const { type } = state;
  const repeatData = {
    type,
    [type]: state[type],
  };

  const [scheduleList, setScheduleList] = React.useState<InitData>({
    attachment_id: "",
    class_id: "",
    class_type: "",
    description: "",
    due_at: new Date().getTime() / 1000,
    end_at: new Date().getTime() / 1000,
    is_all_day: false,
    is_force: true,
    is_repeat: false,
    lesson_plan_id: "",
    program_id: "",
    repeat: {},
    start_at: new Date().getTime() / 1000,
    subject_id: "",
    teacher_ids: [],
    title: "",
  });
  const timestampInt = (timestamp: number) => Math.floor(timestamp);

  const timeToTimestamp = (time: string) => {
    const currentTime = time.replace(/-/g, "/").replace(/T/g, " ");
    return timestampInt(new Date(currentTime).getTime() / 1000);
  };

  const timestampToTime = (timestamp: Number | null) => {
    const date = new Date(Number(timestamp) * 1000);
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
    const [Y, M, D, h, m, s] = [
      date.getFullYear(),
      dateNumFun(date.getMonth() + 1),
      dateNumFun(date.getDate()),
      dateNumFun(date.getHours()),
      dateNumFun(date.getMinutes()),
      dateNumFun(date.getSeconds()),
    ];
    return `${Y}-${M}-${D}T${h}:${m}:${s}`;
  };

  /**
   * autocomplete input change
   * @param value
   * @param name
   */
  const autocompleteChange = (value: any | null, name: string) => {
    let ids: any[] = [];
    if (name === "teacher_ids") {
      value.map((val: any, key: number) => {
        ids.push(val.id.toString());
      });
      setTeacherItem(value);
    } else {
      ids = value ? value["id"] : "";
    }
    if (name === "class_id") {
      setClassItem(value);
    }
    if (name === "lesson_plan_id") {
      setLessonPlan(value);
    }
    if (name === "subject_id") {
      setSubjectItem(value);
    }
    if (name === "program_id") {
      setProgramItem(value);
    }
    setScheduleData(name, ids);
  };

  /**
   * Normal input box change
   * @param event
   * @param name
   */
  const handleTopicListChange = (event: React.ChangeEvent<{ value: String | Number }>, name: string) => {
    const value = name === "start_at" || name === "end_at" ? timeToTimestamp(event.target.value as string) : (event.target.value as string);
    setScheduleData(name, value);
  };

  const setScheduleData = (name: string, value: string | number | object | null) => {
    const newTopocList = {
      ...scheduleList,
      [name]: value as string | number | object | null,
    };
    setScheduleList((newTopocList as unknown) as { [key in keyof InitData]: InitData[key] });
  };

  /**
   * form input validator
   */
  const isValidator = {
    title: false,
    class_id: false,
    lesson_plan_id: false,
    teacher_ids: false,
    start_at: false,
    end_at: false,
    subject_id: false,
    program_id: false,
    class_type: false,
  };
  const [validator, setValidator] = React.useState(isValidator);

  const validatorFun = () => {
    let verificaPath = true;
    for (let name in scheduleList) {
      if (isValidator.hasOwnProperty(name)) {
        // @ts-ignore
        const result = scheduleList[name].length > 0;
        // @ts-ignore
        isValidator[name] = !result;
        if (result) {
          verificaPath = false;
        }
      }
    }
    setValidator({ ...isValidator });
  };

  /**
   * save schedule data
   */
  const saveSchedule = () => {
    // @ts-ignore
    // validatorFun();
    const addData: any = {};
    if (checkedStatus.dueDateCheck) {
      // @ts-ignore
      addData["due_at"] = timestampInt(selectedDueDate.getTime() / 1000);
    }
    addData["is_all_day"] = checkedStatus.allDayCheck;
    addData["is_repeat"] = checkedStatus.repeatCheck;
    addData["repeat"] = repeatData;
    addData["attachment_id"] = attachmentId;
    const result = { ...scheduleList, ...addData };
    dispatch(saveScheduleData({ ...result }));
  };

  const [checkedStatus, setStatus] = React.useState({
    allDayCheck: false,
    repeatCheck: false,
    dueDateCheck: false,
  });

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus({ ...checkedStatus, [event.target.name]: event.target.checked });
  };

  const handleDueDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleClose = () => {
    setOpenStatus(false);
  };

  const deleteScheduleByid = () => {
    dispatch(removeSchedule("1"));
    setOpenStatus(false);
  };

  /**
   * modal text useState
   */
  const [modalText, setModalText] = React.useState<string>("");

  /**
   * modal buttons useState
   */
  const [buttons, setButtons] = React.useState<object>([]);

  const modalDate: any = {
    title: "",
    text: modalText,
    openStatus: openStatus,
    buttons: buttons,
    handleClose: handleClose,
  };

  /**
   * modal type delete
   */
  const handleDelete = () => {
    const button = [
      {
        label: "Cancel",
        event: () => {
          setOpenStatus(false);
        },
      },
      {
        label: "Delete",
        event: () => {
          deleteScheduleByid();
        },
      },
    ];
    setOpenStatus(true);
    setModalText("Are you sure you want to delete this event?");
    setButtons(button);
  };

  /**
   * modal type confirm close
   */
  const closeEdit = () => {
    const button = [
      {
        label: "Cancel",
        event: () => {
          setOpenStatus(false);
        },
      },
      {
        label: "Discard",
        event: () => {
          history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
        },
      },
    ];
    setOpenStatus(true);
    setModalText("Discard unsave changes?");
    setButtons(button);
  };

  const handleRepeatData = (data: any) => {
    dispatchRepeat({ type: "changeData", data });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={css.formControset}>
        <Box>
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs={6}>
              <Close
                style={{
                  color: "#666666",
                }}
                className={css.toolset}
                onClick={closeEdit}
              />
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>
              <DeleteOutlineOutlined
                style={{
                  color: "#D74040",
                  visibility: scheduleDetial.id ? "visible" : "hidden",
                }}
                className={css.toolset}
                onClick={handleDelete}
              />
              <Save
                style={{
                  color: "#0E78D5",
                  marginLeft: "10px",
                }}
                className={css.toolset}
                onClick={saveSchedule}
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={css.fieldBox}>
          <TextField
            error={validator.title}
            className={css.fieldset}
            label="Class Name"
            value={scheduleList.title}
            onChange={(e) => handleTopicListChange(e, "title")}
          ></TextField>
          <FileCopyOutlined className={css.iconField} />
        </Box>
        <Autocomplete
          id="combo-box-demo"
          options={mockClass}
          getOptionLabel={(option) => option.name}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "class_id");
          }}
          value={classItem}
          renderInput={(params) => (
            <TextField {...params} error={validator.class_id} className={css.fieldset} label="Add Class" variant="outlined" />
          )}
        />
        <Autocomplete
          id="combo-box-demo"
          freeSolo
          options={contentsListSelect}
          getOptionLabel={(option) => option.name}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "lesson_plan_id");
          }}
          value={lessonPlan}
          renderInput={(params) => (
            <TextField
              {...params}
              className={css.fieldset}
              label="Lesson Plan"
              error={validator.lesson_plan_id}
              value={scheduleList.lesson_plan_id}
              variant="outlined"
            />
          )}
        />
        <Autocomplete
          id="combo-box-demo"
          freeSolo
          multiple
          options={mockTeacher}
          getOptionLabel={(option) => option.name}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "teacher_ids");
          }}
          value={teacherItem}
          renderInput={(params) => (
            <TextField
              {...params}
              className={css.fieldset}
              label="Teacher"
              error={validator.teacher_ids}
              value={scheduleList.teacher_ids}
              variant="outlined"
            />
          )}
        />
        <Box>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={12}>
                <TextField
                  id="datetime-local"
                  label="Start Time"
                  type="datetime-local"
                  className={css.fieldset}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={validator.start_at}
                  value={timestampToTime(scheduleList.start_at)}
                  onChange={(e) => handleTopicListChange(e, "start_at")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="datetime-local"
                  label="End Time"
                  type="datetime-local"
                  className={css.fieldset}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={validator.end_at}
                  value={timestampToTime(scheduleList.end_at)}
                  onChange={(e) => handleTopicListChange(e, "end_at")}
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </Box>
        <Box>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox name="allDayCheck" color="primary" checked={checkedStatus.allDayCheck} onChange={handleCheck} />}
              label="All Day"
            />
            <FormControlLabel
              control={<Checkbox name="repeatCheck" color="primary" checked={checkedStatus.repeatCheck} onChange={handleCheck} />}
              label="Repeat"
            />
          </FormGroup>
        </Box>
        <Autocomplete
          id="combo-box-demo"
          options={mockSubject}
          getOptionLabel={(option) => option.name}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "subject_id");
          }}
          value={subjectItem}
          renderInput={(params) => (
            <TextField
              {...params}
              className={css.fieldset}
              label="Subject"
              error={validator.subject_id}
              variant="outlined"
              value={scheduleList.subject_id}
            />
          )}
        />
        <Autocomplete
          id="combo-box-demo"
          options={mockProgram}
          getOptionLabel={(option) => option.name}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "program_id");
          }}
          value={programItem}
          renderInput={(params) => (
            <TextField
              {...params}
              className={css.fieldset}
              label="Program"
              variant="outlined"
              error={validator.program_id}
              value={scheduleList.program_id}
            />
          )}
        />
        <TextField
          className={css.fieldset}
          label="Class Type"
          value={scheduleList.class_type}
          onChange={(e) => handleTopicListChange(e, "class_type")}
          error={validator.class_type}
          select
        >
          <MenuItem value="onlineClass">online class</MenuItem>
          <MenuItem value="offlineClass">offline class</MenuItem>
          <MenuItem value="task">task</MenuItem>
          <MenuItem value="homework">homework</MenuItem>
        </TextField>
        <Box>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={4}>
                <FormControlLabel
                  control={<Checkbox name="dueDateCheck" color="primary" checked={checkedStatus.dueDateCheck} onChange={handleCheck} />}
                  label="Due Date"
                />
              </Grid>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Pick Time"
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  value={selectedDueDate}
                  onChange={handleDueDateChange}
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </Box>
        <TextField
          id="outlined-multiline-static"
          className={css.fieldset}
          label="Description"
          multiline
          rows={4}
          variant="outlined"
          value={scheduleList.description}
          onChange={(e) => handleTopicListChange(e, "description")}
        />
        <ScheduleAttachment />
        <Box className={css.fieldset}>
          <Button variant="contained" color="primary" style={{ width: "45%", marginRight: "10%" }}>
            Preview in Live
          </Button>
          <Button variant="contained" color="primary" style={{ width: "45%" }}>
            Go Live
          </Button>
        </Box>
        {checkedStatus.repeatCheck && (
          <Box className={css.repeatBox}>
            <RepeatSchedule handleRepeatData={handleRepeatData} />
          </Box>
        )}
      </Box>
      <ModalBox modalDate={modalDate} />
    </ThemeProvider>
  );
}

interface InitData {
  title: string;
  class_id: string;
  lesson_plan_id: string;
  teacher_ids: [];
  start_at: number;
  end_at: number;
  repeat: {};
  subject_id: string;
  program_id: string;
  class_type: string;
  due_at: number;
  description: string;
  attachment_id: string;
  is_force: boolean;
  is_repeat: boolean;
  is_all_day: boolean;
}

interface timesTampType {
  start: number;
  end: number;
}

interface CalendarStateProps {
  timesTamp: timesTampType;
  changeTimesTamp: (value: object) => void;
  repeatData: object;
}

interface ScheduleEditProps extends CalendarStateProps {
  includePreview: boolean;
}

export default function ScheduleEdit(props: ScheduleEditProps) {
  const { includePreview, timesTamp, changeTimesTamp, repeatData } = props;
  const template = includePreview ? (
    <SmallCalendar changeTimesTamp={changeTimesTamp} timesTamp={timesTamp} repeatData={repeatData} />
  ) : (
    <EditBox changeTimesTamp={changeTimesTamp} timesTamp={timesTamp} repeatData={repeatData} />
  );
  return template;
}
