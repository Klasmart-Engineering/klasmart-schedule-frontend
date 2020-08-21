import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import { Box, Button, MenuItem, TextField, ThemeProvider } from "@material-ui/core";
import theme from "../../theme";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import { CloudUploadOutlined, FileCopyOutlined, DeleteOutlineOutlined, Save, Close } from "@material-ui/icons";
import ScheduleAttachment from "./ScheduleAttachment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import mockList from "../../mocks/Autocomplete.json";

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

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
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
}));

function EditBox() {
  const css = useStyles();
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date("2014-08-18T21:11:54"));

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
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
              />
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>
              <DeleteOutlineOutlined
                style={{
                  color: "#D74040",
                }}
                className={css.toolset}
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
            <FormControlLabel control={<Checkbox name="ALL Day" color="primary" />} label="All Day" />
            <FormControlLabel control={<Checkbox name="checkedB" color="primary" />} label="Repeat" />
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
                <FormControlLabel control={<Checkbox name="ALL Day" color="primary" />} label="Due Date" />
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
      </Box>
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
