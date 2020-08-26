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
import React from "react";
import { useHistory } from "react-router";
import ModalBox from "../../components/ModalBox";
import mockList from "../../mocks/Autocomplete.json";
import theme from "../../theme";
import RepeatSchedule from "./Repeat";
import ScheduleAttachment from "./ScheduleAttachment";

function SmallCalendar() {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date("2014-08-18T21:11:54"));
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <DatePicker autoOk variant="static" openTo="date" value={selectedDate} onChange={handleDateChange} />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

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

function EditBox() {
  const css = useStyles();
  const history = useHistory();
  const [selectedDueDate, setSelectedDate] = React.useState<Date | null>(new Date(new Date().setHours(new Date().getHours())));
  const [openStatus, setOpenStatus] = React.useState(false);

  const [scheduleList, setScheduleList] = React.useState<InitData>({
    repeat: {},
    is_all_day: false,
    is_repeat: false,
    attachment_id: 0,
    class_id: 0,
    class_type: "",
    description: "",
    due_at: 0,
    end_at: new Date().getTime() / 1000,
    is_force: false,
    lesson_plan_id: 0,
    program_id: 0,
    start_at: new Date().getTime() / 1000,
    subject_id: 0,
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
        ids.push(val.year.toString());
      });
    } else {
      ids = value["year"];
    }
    const newTopocList = {
      ...scheduleList,
      [name]: ids as string | number | object | null,
    };
    setScheduleList((newTopocList as unknown) as { [key in keyof InitData]: InitData[key] });
  };

  /**
   * Normal input box change
   * @param event
   * @param name
   */
  const handleTopicListChange = (event: React.ChangeEvent<{ value: String | Number }>, name: string) => {
    const value = name === "start_at" || name === "end_at" ? timeToTimestamp(event.target.value as string) : (event.target.value as string);
    const newTopocList = {
      ...scheduleList,
      [name]: value,
    };
    setScheduleList((newTopocList as unknown) as { [key in keyof InitData]: InitData[key] });
  };

  /**
   * save schedule data
   */
  const saveSchedule = () => {
    const addData: any = {};
    if (checkedStatus.dueDateCheck) {
      // @ts-ignore
      addData["due_at"] = timestampInt(selectedDueDate.getTime() / 1000);
    }
    addData["is_all_day"] = checkedStatus.allDayCheck;
    addData["is_repeat"] = checkedStatus.repeatCheck;
    console.log({ ...scheduleList, ...addData });
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
          setOpenStatus(false);
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
            className={css.fieldset}
            label="Class Name"
            value={scheduleList.title}
            onChange={(e) => handleTopicListChange(e, "title")}
          ></TextField>
          <FileCopyOutlined className={css.iconField} />
        </Box>
        <Autocomplete
          id="combo-box-demo"
          options={mockList}
          getOptionLabel={(option) => option.title}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "class_id");
          }}
          renderInput={(params) => <TextField {...params} className={css.fieldset} label="Add Class" variant="outlined" />}
        />
        <Autocomplete
          id="combo-box-demo"
          freeSolo
          options={mockList}
          getOptionLabel={(option) => option.title}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "lesson_plan_id");
          }}
          renderInput={(params) => (
            <TextField {...params} className={css.fieldset} label="Lesson Plan" value={scheduleList.lesson_plan_id} variant="outlined" />
          )}
        />
        <Autocomplete
          id="combo-box-demo"
          freeSolo
          multiple
          options={mockList}
          getOptionLabel={(option) => option.title}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "teacher_ids");
          }}
          renderInput={(params) => (
            <TextField {...params} className={css.fieldset} label="Teacher" value={scheduleList.teacher_ids} variant="outlined" />
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
          options={mockList}
          getOptionLabel={(option) => option.title}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "subject_id");
          }}
          renderInput={(params) => (
            <TextField {...params} className={css.fieldset} label="Subject" variant="outlined" value={scheduleList.subject_id} />
          )}
        />
        <Autocomplete
          id="combo-box-demo"
          options={mockList}
          getOptionLabel={(option) => option.title}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "program_id");
          }}
          renderInput={(params) => (
            <TextField {...params} className={css.fieldset} label="Program" variant="outlined" value={scheduleList.program_id} />
          )}
        />
        <TextField
          className={css.fieldset}
          label="Class Type"
          value={scheduleList.class_type}
          onChange={(e) => handleTopicListChange(e, "class_type")}
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
            <RepeatSchedule />
          </Box>
        )}
      </Box>
      <ModalBox modalDate={modalDate} />
    </ThemeProvider>
  );
}

interface InitData {
  title: string;
  class_id: number;
  lesson_plan_id: number;
  teacher_ids: [];
  start_at: number;
  end_at: number;
  subject_id: number;
  program_id: number;
  class_type: string;
  due_at: number;
  description: string;
  attachment_id: number;
  is_force: boolean;
  is_repeat: boolean;
  is_all_day: boolean;
  repeat: object;
}

interface ScheduleEditProps {
  includePreview: boolean;
}

export default function ScheduleEdit(props: ScheduleEditProps) {
  const { includePreview } = props;
  const template = includePreview ? <SmallCalendar /> : <EditBox />;
  return template;
}
