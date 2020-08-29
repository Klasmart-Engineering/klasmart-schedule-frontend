import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import { ArrowBackIosOutlined, SearchOutlined } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router";

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    input: {
      width: "220px",
      borderRadius: 6,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 26px 10px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:focus": {
        borderRadius: 6,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  })
)(InputBase);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnRadio: {
      borderRadius: "20px",
      width: "160px",
      height: "40px",
    },
    modelSelect: {
      textAlign: "right",
    },
    searchBtn: {
      marginLeft: "12px",
    },
    toolBox: {
      padding: "36px 0px 20px 0px",
    },
    arrowsrt: {
      margin: "0px 20px 0px 20px",
      cursor: "pointer",
    },
  })
);

function Tool(props: ToolProps) {
  const css = useStyles();
  const [value, setSearchValue] = React.useState("");
  const [type, setModelType] = React.useState(20);
  const [teacherName, setTeacherName] = React.useState("");
  const history = useHistory();
  const { includeList, changeTimesTamp, changeModelView, modelView } = props;

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSearchValue(event.target.value as string);
  };

  const selectToday = () => {
    changeTimesTamp({
      start: Math.floor(new Date().getTime() / 1000),
      end: Math.floor(new Date().getTime() / 1000),
    });
  };

  const searchChange = (): void => {
    history.push(`/schedule/calendar/rightside/scheduleList/model/preview?name=${teacherName}`);
  };

  const backChange = (): void => {
    history.goBack();
  };

  return (
    <Box className={css.toolBox}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          {!includeList && (
            <Button variant="contained" color="primary" className={css.btnRadio}>
              Schedule Class
            </Button>
          )}
        </Grid>
        <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
          {includeList && <ArrowBackIosOutlined className={css.arrowsrt} onClick={backChange} />}
          <FormControl>
            <InputLabel htmlFor="demo-customized-textbox">Search</InputLabel>
            <BootstrapInput id="demo-customized-textbox" value={teacherName} onChange={(event) => setTeacherName(event.target.value)} />
          </FormControl>
          <Button variant="contained" color="primary" className={css.searchBtn} startIcon={<SearchOutlined />} onClick={searchChange}>
            Search
          </Button>
        </Grid>
        <Grid item xs={3} className={css.modelSelect}>
          {!includeList && (
            <Button size="large" variant="outlined" color="primary" style={{ marginRight: "12px" }} onClick={selectToday}>
              Today
            </Button>
          )}
          {!includeList && (
            <FormControl>
              <InputLabel htmlFor="demo-customized-select-native">Model</InputLabel>
              <NativeSelect id="demo-customized-select-native" value={modelView} onChange={changeModelView} input={<BootstrapInput />}>
                <option value="agenda">Work Week</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </NativeSelect>
            </FormControl>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

interface timesTampType {
  start: number;
  end: number;
}

interface CalendarStateProps {
  timesTamp: timesTampType;
  changeTimesTamp: (value: object) => void;
}

interface ToolProps extends CalendarStateProps {
  includeList: boolean;
  modelView: string;
  changeModelView: (event: React.ChangeEvent<{ value: unknown }>) => void;
}
export default function ScheduleTool(props: ToolProps) {
  const { includeList, timesTamp, changeTimesTamp, changeModelView, modelView } = props;
  return (
    <Tool
      includeList={includeList}
      changeTimesTamp={changeTimesTamp}
      timesTamp={timesTamp}
      changeModelView={changeModelView}
      modelView={modelView}
    />
  );
}
