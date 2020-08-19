import React from "react";
import {
  Card,
  makeStyles,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Grid,
  OutlinedInput,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    width: "350px",
    padding: "0 20px 30px 20px",
    boxSizing: "border-box",
    "& .MuiInputBase-root": {
      height: "40px",
    },
    fontSize: "14px",
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
});

interface RepeatCycleProps {
  cycle: string;
}

function RepeatCycle(props: RepeatCycleProps) {
  const { cycle } = props;
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
  const [onThe, setOnThe] = React.useState("on");
  const [specificDayChange, setSpecificDayChange] = React.useState(1);
  const [order, setOrder] = React.useState("first");
  const [weekday, setWeekday] = React.useState("Saturday");
  const [month, setMonth] = React.useState("January");

  const handleWeekdaySelect = (index: number) => {
    let temp = JSON.parse(JSON.stringify(weekends));
    temp.forEach((item: any) => {
      if (temp[index].day === item.day) {
        item.selected = !item.selected;
      }
    });
    setWeekends(temp);
  };

  const changeOnThe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnThe(event.target.value);
  };

  const handelSpecificDayChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSpecificDayChange(event.target.value as number);
  };

  const handleOrderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOrder(event.target.value as string);
  };

  const handleWeekdayChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setWeekday(event.target.value as string);
  };

  const handleMonthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMonth(event.target.value as string);
  };

  return (
    <>
      {cycle === "weekly" && (
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
      {(cycle === "monthly" || cycle === "yearly") && (
        <>
          <Grid container className={classes.repeatItem}>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <RadioGroup aria-label="gender" name="gender1" value={onThe} onChange={changeOnThe}>
                <FormControlLabel value="on" control={<Radio />} label="On" className={classes.repeatItem} />
                <FormControlLabel value="the" control={<Radio />} label="The" />
              </RadioGroup>
            </Grid>
            <Grid item xs={8} sm={8} md={8} lg={8} xl={8} className={classes.positionInput}>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.repeatItem}>
                  <FormControl variant="outlined" style={{ width: "100%" }}>
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      value={specificDayChange}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      labelWidth={0}
                      disabled={onThe !== "on"}
                      onChange={handelSpecificDayChange}
                    />
                  </FormControl>
                  <span className={classes.positionText}>of every month</span>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Grid container justify="space-between" className={classes.positionInput}>
                    <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                      <FormControl variant="outlined">
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={order}
                          labelWidth={0}
                          disabled={onThe !== "the"}
                          onChange={handleOrderChange}
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
                      <FormControl variant="outlined">
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={weekday}
                          labelWidth={0}
                          disabled={onThe !== "the"}
                          onChange={handleWeekdayChange}
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
          {cycle === "yearly" && (
            <Grid container className={classes.repeatItem} justify="flex-end">
              <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                <FormControl variant="outlined" className={`${classes.formControl} ${classes.repeatItem}`}>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={month}
                    labelWidth={0}
                    onChange={handleMonthChange}
                    disabled={onThe !== "the"}
                  >
                    {monthList.map((item, index) => (
                      <MenuItem key={index} value={item}>
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

function EndRepeat() {
  const classes = useStyles();
  const [endRepeat, setEndRepeat] = React.useState("occurrence");
  const [occurrence, setOccurrence] = React.useState(1);

  const handelleEndRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndRepeat(event.target.value);
  };

  const handleOccurrenceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOccurrence(event.target.value as number);
  };

  return (
    <div>
      <h3>End Repeat</h3>
      <Grid container className={`${classes.repeatItem} ${classes.specialFar}`}>
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <RadioGroup aria-label="gender" name="gender1" value={endRepeat} onChange={handelleEndRepeatChange}>
            <FormControlLabel value="never" control={<Radio />} label="Never" className={classes.repeatItem} />
            <FormControlLabel value="occurrence" control={<Radio />} label="After" className={classes.repeatItem} />
            <FormControlLabel value="date" control={<Radio />} label="After" />
          </RadioGroup>
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8} className={`${classes.positionInput} ${classes.specialContainer}`}>
          <Grid container alignItems="flex-end">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.repeatItem}>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  value={occurrence}
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  labelWidth={0}
                  disabled={endRepeat !== "occurrence"}
                  onChange={handleOccurrenceChange}
                />
              </FormControl>
              <span className={classes.positionText}>occurrence(s)</span>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.repeatItem}>
              <FormControl variant="outlined" fullWidth>
                <TextField
                  id="datetime-local"
                  label={null}
                  type="datetime-local"
                  disabled={endRepeat !== "date"}
                  className={classes.datePicker}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default function RepeatSchedule() {
  const classes = useStyles();
  const [cycle, setCycle] = React.useState("monthly");
  const [cycleTime, setCycleTime] = React.useState(1);

  const handleChangeCycle = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCycle(event.target.value as string);
  };
  const handleChangeCycleTime = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCycleTime(event.target.value as number);
  };

  return (
    <Card className={classes.container}>
      <h2>Repeat</h2>
      <FormControl variant="outlined" className={`${classes.formControl} ${classes.repeatItem}`}>
        <InputLabel id="demo-simple-select-outlined-label">{cycle}</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={cycle}
          onChange={handleChangeCycle}
          label={cycle}
          required
        >
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
          <FormControl variant="outlined" style={{ width: "100%" }}>
            <OutlinedInput
              id="outlined-adornment-weight"
              value={cycleTime}
              onChange={handleChangeCycleTime}
              endAdornment={cycle === "weekly" ? "week(s)" : "month(s)"}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              labelWidth={0}
            />
          </FormControl>
        </Grid>
      </Grid>
      <RepeatCycle cycle={cycle} />
      <EndRepeat />
    </Card>
  );
}
