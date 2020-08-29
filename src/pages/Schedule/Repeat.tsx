import DateFnsUtils from "@date-io/date-fns";
import {
  Card,
  createStyles,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Theme,
} from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import { useRepeatSchedule } from "../../hooks/useRepeatSchedule";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: "350px",
      padding: "0 20px 30px 20px",
      boxSizing: "border-box",
      "& .MuiInputBase-root": {
        height: "40px",
      },
      fontSize: "14px",
      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.16)",
      zIndex: 999,
    },
    formControl: {
      width: "100%",
    },
    every: {
      fontWeight: "bold",
    },
    repeatItem: {
      marginBottom: "20px",
    },
    weeklyDayBox: {
      paddingLeft: "20px",
    },
    weeklyDay: {
      display: "inline-block",
      width: "13.8%",
      height: "32px",
      border: "1px solid #979797",
      borderRight: "none",
      lineHeight: "30px",
      textAlign: "center",
      "&:last-of-type": {
        borderRight: "1px solid #979797",
        borderRadius: "0px 100px 100px 0px",
      },
      "&:first-of-type": {
        borderRadius: "100px 0px 0px 100px",
      },
      cursor: "pointer",
    },
    currentSelected: {
      backgroundColor: "#0e78d5",
    },
    positionText: {
      position: "absolute",
      right: "5px",
      top: "10px",
    },
    positionInput: {
      position: "relative",
      height: "50%",
    },
    specialContainer: {
      // height: '100%'
      position: "absolute",
      bottom: "20px",
      right: 0,
    },
    specialFar: {
      position: "relative",
    },
    datePicker: {
      "& input": {
        fontSize: "14px",
      },
    },
    lastRepeat: {
      marginBottom: "10px",
    },
  })
);

interface RepeatCycleProps {
  state: object;
  dispatch: any;
}

function RepeatCycle(props: any) {
  const { state, dispatch, handleRepeatData } = props;
  const classes = useStyles();
  const weekendList = [
    {
      day: "Sunday",
      selected: false,
    },
    {
      day: "Monday",
      selected: false,
    },
    {
      day: "Tuesday",
      selected: false,
    },
    {
      day: "Wednesday",
      selected: false,
    },
    {
      day: "Thursday",
      selected: false,
    },
    {
      day: "Friday",
      selected: false,
    },
    {
      day: "Saturday",
      selected: false,
    },
  ];
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [weekends, setWeekends] = React.useState(weekendList);
  const { on_type, on, on_week, on_week_seq, on_date_day, on_week_month } = state[state.type];
  const { type } = state;
  let _state = JSON.parse(JSON.stringify(state));

  if (type === "weekly") {
    weekends.forEach((item, index) => {
      if (on.length > 0) {
        on.forEach((item1: any, index1: any) => {
          if (item.day === item1) {
            item.selected = true;
          }
        });
      }
    });
  }

  const handleWeekdaySelect = (index: number) => {
    let temp = JSON.parse(JSON.stringify(weekends));
    temp.forEach((item: any) => {
      if (temp[index].day === item.day) {
        item.selected = !item.selected;
      }
    });
    setWeekends(temp);
    let selectedDays: any = on;
    let idx = selectedDays.indexOf(weekends[index].day);
    if (idx > -1) {
      selectedDays.splice(idx, 1);
    } else {
      selectedDays.push(weekends[index].day);
    }
    _state[type].on = selectedDays;
    dispatch({ type: "changeData", data: _state });
    handleRepeatData(_state);
  };

  const changeOnType = (event: React.ChangeEvent<HTMLInputElement>) => {
    _state[type].on_type = event.target.value;
    dispatch({ type: "changeData", data: _state });
    handleRepeatData(_state);
  };

  const handleOnDateDay = (event: React.ChangeEvent<HTMLInputElement>) => {
    _state[type].on_date_day = +event.target.value;
    dispatch({ type: "changeData", data: _state });
    handleRepeatData(_state);
  };

  const handleOnWeekSeq = (event: React.ChangeEvent<{ value: unknown }>) => {
    _state[type].on_week_seq = event.target.value;
    dispatch({ type: "changeData", data: _state });
    handleRepeatData(_state);
  };

  const handleOnWeek = (event: React.ChangeEvent<{ value: unknown }>) => {
    _state[type].on_week = event.target.value as string;
    dispatch({ type: "changeData", data: _state });
    handleRepeatData(_state);
  };

  const handleOnWeekMonth = (event: React.ChangeEvent<{ value: unknown }>) => {
    _state[type].on_week_month = event.target.value;
    dispatch({ type: "changeData", data: _state });
    handleRepeatData(_state);
  };

  return (
    <>
      {type === "weekly" && (
        <div className={classes.repeatItem}>
          <h3>On</h3>
          <div className={classes.weeklyDayBox}>
            {weekends.map((item, index) => {
              return (
                <span
                  key={index}
                  className={`${classes.weeklyDay} ${item.selected ? `${classes.currentSelected}` : ""}`}
                  onClick={() => handleWeekdaySelect(index)}
                >
                  {item.day.substr(0, 3)}
                </span>
              );
            })}
          </div>
        </div>
      )}
      {(type === "monthly" || type === "yearly") && (
        <>
          <Grid container className={classes.repeatItem}>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <RadioGroup aria-label="gender" name="gender1" value={on_type} onChange={changeOnType}>
                <FormControlLabel value="date" control={<Radio />} label="On" className={classes.repeatItem} />
                <FormControlLabel value="month" control={<Radio />} label="The" />
              </RadioGroup>
            </Grid>
            <Grid item xs={8} sm={8} md={8} lg={8} xl={8} className={classes.positionInput}>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.repeatItem}>
                  <FormControl variant="outlined" style={{ width: "100%" }} size="small">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      // value={specificDayChange}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      labelWidth={0}
                      disabled={on_type !== "date"}
                      onChange={handleOnDateDay}
                      defaultValue={on_date_day}
                    />
                  </FormControl>
                  <span className={classes.positionText}>of every month</span>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Grid container justify="space-between" className={classes.positionInput}>
                    <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                      <FormControl variant="outlined" size="small">
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={on_week_seq}
                          labelWidth={0}
                          disabled={on_type !== "month"}
                          onChange={handleOnWeekSeq}
                          // defaultValue={order}
                        >
                          <MenuItem value={"first"}>first</MenuItem>
                          <MenuItem value={"second"}>second</MenuItem>
                          <MenuItem value={"third"}>third</MenuItem>
                          <MenuItem value={"fourth"}>fourth</MenuItem>
                          <MenuItem value={"last"}>last</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                      <FormControl variant="outlined" size="small">
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={on_week}
                          labelWidth={0}
                          disabled={on_type !== "month"}
                          onChange={handleOnWeek}
                        >
                          {weekends.map((item, index) => (
                            <MenuItem key={index} value={item.day}>
                              {item.day}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {type === "yearly" && (
            <Grid container className={classes.repeatItem} justify="flex-end">
              <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormControl variant="outlined" className={`${classes.formControl}`} size="small">
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={on_week_month}
                    labelWidth={0}
                    onChange={handleOnWeekMonth}
                    disabled={on_type !== "month"}
                  >
                    {monthList.map((item, index) => (
                      <MenuItem key={index} value={index}>
                        of {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
}

function EndRepeat(props: any) {
  const classes = useStyles();
  const { state, dispatch, handleRepeatData } = props;
  const { type } = state;
  const { end } = state[type];
  let _state = JSON.parse(JSON.stringify(state));

  const handleEndType = (event: React.ChangeEvent<HTMLInputElement>) => {
    _state[type].end.type = event.target.value;
    dispatch({ type: "changeData", data: _state });
    handleRepeatData(_state);
  };

  const handleAfterCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    _state[type].end.after_count = +event.target.value;
    dispatch({ type: "changeData", data: _state });
    handleRepeatData(_state);
  };

  const handleAfterTime = (date: any) => {
    let _date = new Date(date).getTime() / 1000;
    _state[type].end.after_time = _date;
    dispatch({ type: "changeData", data: _state });
    handleRepeatData(_state);
  };

  return (
    <div>
      <h3>End Repeat</h3>
      <Grid container className={`${classes.repeatItem} ${classes.specialFar}`}>
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <RadioGroup aria-label="gender" name="gender1" value={end.type} onChange={handleEndType}>
            <FormControlLabel value="never" control={<Radio />} label="Never" className={classes.repeatItem} />
            <FormControlLabel value="after_count" control={<Radio />} label="After" className={classes.repeatItem} />
            <FormControlLabel value="after_time" control={<Radio />} label="After" />
          </RadioGroup>
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} className={`${classes.positionInput} ${classes.specialContainer}`}>
          <Grid container alignItems="flex-end">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={`${classes.repeatItem} ${classes.lastRepeat}`}>
              <FormControl variant="outlined" style={{ width: "100%" }} size="small">
                <OutlinedInput
                  id="outlined-adornment-weight"
                  value={end.after_count}
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  labelWidth={0}
                  onChange={handleAfterCount}
                  disabled={end.type !== "after_count"}
                />
              </FormControl>
              <span className={classes.positionText}>occurrence(s)</span>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={`${classes.repeatItem} ${classes.lastRepeat}`}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label={null}
                  value={end.after_time}
                  onChange={handleAfterTime}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  size="small"
                  disabled={end.type !== "after_time"}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

function RepeatHeader(props: any) {
  const classes = useStyles();
  const { state, dispatch, handleRepeatData } = props;
  const { interval } = state[state.type];
  const { type } = state;
  let _state = JSON.parse(JSON.stringify(state));

  const handleChangeType = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({ type: "changeData", data: { ...state, type: event.target.value as string } });
    handleRepeatData({ ...state, type: event.target.value as string });
  };
  const handleChangeInterval = (event: React.ChangeEvent<HTMLInputElement>) => {
    _state[type].interval = +event.target.value;
    dispatch({ type: "changeData", data: _state });
    handleRepeatData(_state);
  };

  const endAdornment = type === "daily" ? "day(s)" : type === "weekly" ? "week(s)" : "month(s)";

  return (
    <div>
      <h2>Repeat</h2>
      <FormControl variant="outlined" className={`${classes.formControl} ${classes.repeatItem}`} size="small">
        <InputLabel id="demo-simple-select-outlined-label">{type}</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={type}
          onChange={handleChangeType}
          label={type}
          required
        >
          <MenuItem value={"daily"}>Daily</MenuItem>
          <MenuItem value={"weekly"}>Weekly</MenuItem>
          <MenuItem value={"monthly"}>Monthly</MenuItem>
          <MenuItem value={"yearly"}>Yearly</MenuItem>
        </Select>
      </FormControl>
      <Grid container alignItems="center" className={classes.repeatItem}>
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <div className={classes.every}>Repeat every </div>
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
          <FormControl variant="outlined" style={{ width: "100%" }} size="small">
            <OutlinedInput
              id="outlined-adornment-weight"
              value={interval}
              onChange={handleChangeInterval}
              endAdornment={endAdornment}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              labelWidth={0}
            />
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
}

export default function RepeatSchedule(props: any) {
  const classes = useStyles();
  const [state, dispatchRepeat] = useRepeatSchedule();
  const { handleRepeatData } = props;
  return (
    <Card className={classes.container}>
      <RepeatHeader state={state} dispatch={dispatchRepeat} handleRepeatData={handleRepeatData} />
      <RepeatCycle state={state} dispatch={dispatchRepeat} handleRepeatData={handleRepeatData} />
      <EndRepeat state={state} dispatch={dispatchRepeat} handleRepeatData={handleRepeatData} />
    </Card>
  );
}
