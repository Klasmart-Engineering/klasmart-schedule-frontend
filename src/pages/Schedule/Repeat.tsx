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
  TextField,
  Theme,
} from "@material-ui/core";
import React from "react";
import ModalBox from "../../components/ModalBox";
import { stateProps } from "../../types/scheduleTypes";

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
    after_time: {
      "& input": {
        fontSize: "15px",
      },
    },
  })
);

interface weekItem {
  day: string;
  selected: boolean;
}

function RepeatCycle(props: ExtendsProps) {
  const { state, handleRepeatData } = props;
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
  const { on_type, on, on_week, on_week_seq, on_date_day, on_week_month, on_date_month } = state[state.type];
  const { type } = state;
  let _state = JSON.parse(JSON.stringify(state));

  if (type === "weekly") {
    weekends.forEach((item, index) => {
      if (on.length > 0) {
        on.forEach((item1: string) => {
          if (item.day === item1) {
            item.selected = true;
          }
        });
      }
    });
  }

  const handleWeekdaySelect = (index: number): void => {
    let temp = JSON.parse(JSON.stringify(weekends));
    temp.forEach((item: weekItem) => {
      if (temp[index].day === item.day) {
        item.selected = !item.selected;
      }
    });
    setWeekends(temp);
    let selectedDays: Array<string> = on;
    let idx = selectedDays.indexOf(weekends[index].day);
    if (idx > -1) {
      selectedDays.splice(idx, 1);
    } else {
      selectedDays.push(weekends[index].day);
    }
    _state[type].on = selectedDays;
    handleRepeatData(_state);
  };

  const changeOnType = (event: React.ChangeEvent<HTMLInputElement>) => {
    _state[type].on_type = event.target.value;
    handleRepeatData(_state);
  };

  const handleOnDateDay = (event: React.ChangeEvent<HTMLInputElement>) => {
    _state[type].on_date_day = +event.target.value;
    handleRepeatData(_state);
  };

  const handleOnWeekSeq = (event: React.ChangeEvent<{ value: unknown }>) => {
    _state[type].on_week_seq = event.target.value;
    handleRepeatData(_state);
  };

  const handleOnWeek = (event: React.ChangeEvent<{ value: unknown }>) => {
    _state[type].on_week = event.target.value as string;
    handleRepeatData(_state);
  };

  const handleOnWeekMonth = (event: React.ChangeEvent<{ value: unknown }>) => {
    _state[type].on_week_month = event.target.value;
    handleRepeatData(_state);
  };

  const handleOnDateMonth = (event: React.ChangeEvent<{ value: unknown }>) => {
    _state[type].on_date_month = event.target.value;
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
                <FormControlLabel
                  value="date"
                  control={<Radio />}
                  label={type === "monthly" ? "On" : "Every"}
                  className={classes.repeatItem}
                />
                <FormControlLabel value="week" control={<Radio />} label="The" />
              </RadioGroup>
            </Grid>
            <Grid item xs={8} sm={8} md={8} lg={8} xl={8} className={classes.positionInput}>
              <Grid container>
                {type === "monthly" && (
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
                )}
                {type === "yearly" && (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.repeatItem}>
                    <Grid container justify="space-between" className={classes.positionInput}>
                      <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                        <FormControl variant="outlined" size="small">
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={on_date_month}
                            labelWidth={0}
                            disabled={on_type !== "date"}
                            onChange={handleOnDateMonth}
                            // defaultValue={order}
                          >
                            {monthList.map((item, index) => (
                              <MenuItem key={index} value={index + 1}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormControl variant="outlined" style={{ width: "100%" }} size="small">
                          <OutlinedInput
                            id="outlined-adornment-weight"
                            value={on_date_day}
                            onChange={handleOnDateDay}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                              "aria-label": "weight",
                            }}
                            labelWidth={0}
                            disabled={on_type !== "date"}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Grid container justify="space-between" className={classes.positionInput}>
                    <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                      <FormControl variant="outlined" size="small">
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={on_week_seq}
                          labelWidth={0}
                          disabled={on_type !== "week"}
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
                          disabled={on_type !== "week"}
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
                    disabled={on_type !== "week"}
                  >
                    {monthList.map((item, index) => (
                      <MenuItem key={index} value={index + 1}>
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

function EndRepeat(props: ExtendsProps) {
  const classes = useStyles();
  const { state, handleRepeatData, setOpenStatus } = props;
  const { type } = state;
  const { end } = state[type];
  let _state = JSON.parse(JSON.stringify(state));

  const handleEndType = (event: React.ChangeEvent<HTMLInputElement>) => {
    _state[type].end.type = event.target.value;
    handleRepeatData(_state);
  };

  const handleAfterCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    _state[type].end.after_count = +event.target.value;
    handleRepeatData(_state);
  };

  const handleAfterTime = (event: React.ChangeEvent<{ value: string }>) => {
    let _date = timeToTimestamp(event.target.value);
    if (_date > Date.now() + 2 * 365 * 24 * 60 * 60 * 1000) {
      setOpenStatus(true);
      return;
    }
    _state[type].end.after_time = _date;
    handleRepeatData(_state);
  };

  const timestampToTime = (timestamp: Number | null) => {
    const date = new Date(Number(timestamp));
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
    const [Y, M, D, h, m] = [
      date.getFullYear(),
      dateNumFun(date.getMonth() + 1),
      dateNumFun(date.getDate()),
      dateNumFun(date.getHours()),
      dateNumFun(date.getMinutes()),
      dateNumFun(date.getSeconds()),
    ];
    return `${Y}-${M}-${D}T${h}:${m}`;
  };

  const timeToTimestamp = (time: string) => {
    const currentTime = time.replace(/-/g, "/").replace(/T/g, " ");
    return timestampInt(new Date(currentTime).getTime());
  };
  const timestampInt = (timestamp: number) => Math.floor(timestamp);

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
              <TextField
                fullWidth
                id="datetime-local"
                label={null}
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                value={timestampToTime(end.after_time)}
                disabled={end.type !== "after_time"}
                onChange={handleAfterTime}
                className={classes.after_time}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

function RepeatHeader(props: ExtendsProps) {
  const classes = useStyles();
  const { state, handleRepeatData, setOpenStatus } = props;
  const { type } = state;
  const { interval } = state[type];
  let _state = JSON.parse(JSON.stringify(state));

  const handleChangeType = (event: React.ChangeEvent<{ value: unknown }>) => {
    _state.type = event.target.value as string;
    handleRepeatData(_state);
  };
  const handleChangeInterval = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "daily" && +event.target.value > 2 * 365) {
      setOpenStatus(true);
      return;
    }
    if (type === "weekly" && +event.target.value > Math.floor((2 * 365) / 7)) {
      setOpenStatus(true);
      return;
    }
    if (type === "monthly" && +event.target.value > 24) {
      setOpenStatus(true);
      return;
    }
    if (type === "yearly" && +event.target.value > 2) {
      setOpenStatus(true);
      return;
    }
    _state[type].interval = +event.target.value;
    handleRepeatData(_state);
  };

  const endAdornment = type === "daily" ? "day(s)" : type === "weekly" ? "week(s)" : type === "monthly" ? "month(s)" : "year(s)";

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

interface RepeatScheduleProps {
  handleRepeatData: (data: stateProps) => void;
  repeatState: stateProps;
}

interface ExtendsProps {
  handleRepeatData: (data: stateProps) => void;
  state: any;
  setOpenStatus: (value: boolean) => void;
}

export default function RepeatSchedule(props: RepeatScheduleProps) {
  const classes = useStyles();
  const { handleRepeatData, repeatState } = props;

  const [openStatus, setOpenStatus] = React.useState(false);

  const modalData: any = {
    title: "",
    text: "You cannot scheduel a class beyond two years.",
    openStatus: openStatus,
    enableCustomization: false,
    buttons: [
      {
        label: "OK",
        event: () => {
          setOpenStatus(false);
        },
      },
    ],
    handleClose: () => {
      setOpenStatus(false);
    },
  };
  return (
    <Card className={classes.container}>
      <RepeatHeader state={repeatState} handleRepeatData={handleRepeatData} setOpenStatus={setOpenStatus} />
      <RepeatCycle state={repeatState} handleRepeatData={handleRepeatData} setOpenStatus={setOpenStatus} />
      <EndRepeat state={repeatState} handleRepeatData={handleRepeatData} setOpenStatus={setOpenStatus} />
      <ModalBox modalDate={modalData} />
    </Card>
  );
}
