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
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date("2014-08-18T21:11:54"));
  const [openStatus, setOpenStatus] = React.useState(false);

  const handleClose = () => {
    setOpenStatus(false);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const [checkedStatus, setStatus] = React.useState({
    allDayCheck: false,
    repeatCheck: false,
    dueDateCheck: false,
  });

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus({ ...checkedStatus, [event.target.name]: event.target.checked });
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
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={css.fieldBox}>
          <TextField className={css.fieldset} label="Class Name"></TextField>
          <FileCopyOutlined className={css.iconField} />
        </Box>
        <Autocomplete
          id="combo-box-demo"
          options={mockList}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => <TextField {...params} className={css.fieldset} label="Add Class" variant="outlined" />}
        />
        <Autocomplete
          id="combo-box-demo"
          freeSolo
          options={mockList}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => <TextField {...params} className={css.fieldset} label="Lesson Plan" variant="outlined" />}
        />
        <Autocomplete
          id="combo-box-demo"
          freeSolo
          multiple
          options={mockList}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => <TextField {...params} className={css.fieldset} label="Teacher" variant="outlined" />}
        />
        <Box>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={5}>
                <TextField
                  id="time"
                  label="Time"
                  type="time"
                  defaultValue="07:30"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={css.fieldset}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </Grid>
              <Grid item xs={2} style={{ textAlign: "center" }}>
                <span>—</span>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  id="time"
                  label="Time"
                  type="time"
                  defaultValue="07:30"
                  className={css.fieldset}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
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
          renderInput={(params) => <TextField {...params} className={css.fieldset} label="Subject" variant="outlined" />}
        />
        <Autocomplete
          id="combo-box-demo"
          options={mockList}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => <TextField {...params} className={css.fieldset} label="Program" variant="outlined" />}
        />
        <TextField className={css.fieldset} label="Class Type" select>
          <MenuItem value={1}>3-4</MenuItem>
          <MenuItem value={2}>4-2</MenuItem>
          <MenuItem value={3}>5-6</MenuItem>
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
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </Box>
        <TextField id="outlined-multiline-static" className={css.fieldset} label="Description" multiline rows={4} variant="outlined" />
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

interface ScheduleEditProps {
  includePreview: boolean;
}
export default function ScheduleEdit(props: ScheduleEditProps) {
  const { includePreview } = props;
  const template = includePreview ? <SmallCalendar /> : <EditBox />;
  return template;
}
