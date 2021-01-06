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
    padding: "30px 0 0 50px",
  },
}));

export default function AddParticipantsTemplate() {
  const css = useStyles();
  const data = {
    teachers: ["dasdad", "dasdadfgsd", "Hanf hHdnsa", "fsdfhddsd"],
  };
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
          <RadioGroup aria-label="gender" name="gender1" className={css.radioBox} defaultValue="student">
            <FormControlLabel value="student" control={<Radio />} label="Student" className={css.radioItem} />
            <FormControlLabel value="teacher" control={<Radio />} label="Teacher" className={css.radioItem} />
          </RadioGroup>
        </Grid>
      </Grid>
      <FormGroup className={css.checkboxContainer}>
        {data.teachers.map((item) => {
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
