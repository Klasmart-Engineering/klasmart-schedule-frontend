import React from "react";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, withStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import Box from "@material-ui/core/Box";
import { SearchOutlined } from "@material-ui/icons";

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
  })
);

function Tool() {
  const css = useStyles();
  const [value, setSearchValue] = React.useState("");
  const [type, setModelType] = React.useState(20);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSearchValue(event.target.value as string);
  };
  return (
    <Box className={css.toolBox}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Button variant="contained" color="primary" className={css.btnRadio}>
            Schedule Class
          </Button>
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel htmlFor="demo-customized-textbox">Search</InputLabel>
            <BootstrapInput id="demo-customized-textbox" />
          </FormControl>
          <Button variant="contained" color="primary" className={css.searchBtn} startIcon={<SearchOutlined />}>
            Search
          </Button>
        </Grid>
        <Grid item xs={3} className={css.modelSelect}>
          <FormControl>
            <InputLabel htmlFor="demo-customized-select-native">Model</InputLabel>
            <NativeSelect id="demo-customized-select-native" value={type} onChange={handleChange} input={<BootstrapInput />}>
              <option value={10}>Day</option>
              <option value={20}>Week</option>
              <option value={30}>Month</option>
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function ScheduleTool() {
  return <Tool />;
}
