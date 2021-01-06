import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Hidden, makeStyles, Radio, RadioGroup, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { d, reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "24px",
    fontWeight: 700,
    paddingBottom: "20px",
    borderBottom: "1px solid #eeeeee",
  },
  searchPart: {
    marginTop: "20px",
  },
  searchInput: {
    width: "500px",
  },
  radioBox: {
    flexDirection: "initial",
    "& label": {
      margin: 0,
    },
  },
  radioItem: {},
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
  checkboxContainer: {
    paddingLeft: "50px",
    marginTop: "30px",
    maxHeight: "250px",
    overflow: "auto",
    flexWrap: "nowrap",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "3px",
      backgroundColor: "rgb(220, 220, 220)",
      boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)",
    },
    "&::-webkit-scrollbar-thumb:window-inactive": {
      backgroundColor: "rgba(220,220,220,0.4)",
    },
  },
}));

export default function AddParticipantsTemplate() {
  const css = useStyles();
  const [defaultFilter, setDefaultFilter] = React.useState("students");
  const data = {
    teachers: ["dasdad", "dasdadfgsd", "Hanf hHdnsa", "fsdfhddsd", "Hsdsh_dfjkas", "sdsjkfjd", "sdsjjj", "frdk"],
    students: ["student1", "student2", "student3", "sdgasdvd", "fgrtyja0-Dds", " fsdfhsdiz", "_somfeu)1111sh"],
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultFilter(event.target.value);
  };

  const filterData = defaultFilter === "students" ? data.students : data.teachers;

  return (
    <div>
      <div className={css.title}>{reportMiss("Add participants", "schedule_add_participants")}</div>
      <Grid container alignItems="center" className={css.searchPart}>
        <Grid item xs={4} sm={5} md={5} lg={5} xl={5} className={css.searchInput}>
          <TextField size="small" id="outlined-basic" label="Search" variant="outlined" />
        </Grid>
        <Hidden smDown>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <Button variant="contained" color="primary" size="medium" startIcon={<Search />}>
              {d("Search").t("schedule_button_search")}
            </Button>
          </Grid>
        </Hidden>
        <Grid item xs={8} sm={5} md={5} lg={5} xl={5}>
          <RadioGroup
            aria-label="gender"
            name="gender1"
            className={css.radioBox}
            defaultValue={defaultFilter}
            onChange={handleFilterChange}
          >
            <FormControlLabel value="students" control={<Radio />} label="Student" className={css.radioItem} />
            <FormControlLabel value="teachers" control={<Radio />} label="Teacher" className={css.radioItem} />
          </RadioGroup>
        </Grid>
      </Grid>
      <FormGroup className={css.checkboxContainer}>
        {filterData.map((item) => {
          return <FormControlLabel control={<Checkbox name="checkedB" color="primary" />} label={item} />;
        })}
      </FormGroup>
      <div className={css.buttons}>
        <Button variant="outlined">{d("Cancel").t("assess_button_cancel")}</Button>
        <Button variant="contained" color="primary" className={css.lastButton}>
          {d("OK").t("assess_label_ok")}
        </Button>
      </div>
    </div>
  );
}
