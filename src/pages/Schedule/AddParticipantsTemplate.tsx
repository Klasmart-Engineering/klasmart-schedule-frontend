import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Hidden, makeStyles, Radio, RadioGroup, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { d, reportMiss } from "../../locale/LocaleManager";
import { ParticipantsData, ParticipantsShortInfo } from "../../types/scheduleTypes";

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
      backgroundColor: "#fff",
      width: "5px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#d8d8d8",
      borderRadius: "4px",
    },
  },
}));

interface Part {
  teachers: string[];
  students: string[];
}

interface InfoProps {
  handleClose: () => void;
  ParticipantsData?: ParticipantsData;
  handleChangeParticipants?: (type: string, data: ParticipantsShortInfo) => void;
  getParticipantsData?: (is_org: boolean) => void;
}

export default function AddParticipantsTemplate(props: InfoProps) {
  const { handleClose } = props;
  const css = useStyles();
  const [defaultFilter, setDefaultFilter] = React.useState("students");
  const data = {
    teachers: [
      {
        user_id: "sdhsdh",
        user_name: "Hff_fjjaira",
      },
      {
        user_id: "sdasfff",
        user_name: "HHFHASDsda",
      },
      {
        user_id: "sdadae2",
        user_name: "LKVifspodanj",
      },
      {
        user_id: "*@DHKJHDH",
        user_name: "SJKGXUOYCSKNDF",
      },
      {
        user_id: "fsdfsdgtr4twf",
        user_name: "FSN--NKJFSD",
      },
      {
        user_id: "vsdf_FSJK",
        user_name: "dfwesaRWR#FC",
      },
    ],
    students: [
      {
        user_id: "sdhsdsdh",
        user_name: "FSDXD",
      },
      {
        user_id: "sdassdfasfff",
        user_name: "sdderfetf ",
      },
      {
        user_id: "sdadaedsda2",
        user_name: "dgdsgvs fdf",
      },
      {
        user_id: "*@DHKJHsdsDH",
        user_name: "sfsdcFfrg s",
      },
      {
        user_id: "fsdfsdgtrsdsc4twf",
        user_name: "FSN--sdzCSFe",
      },
      {
        user_id: "vsdf_sdXSFFSJK",
        user_name: "vDVD#FC",
      },
    ],
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultFilter(event.target.value);
  };

  interface Part {
    teachers: string[];
    students: string[];
  }

  const filterData = defaultFilter === "students" ? data.students : data.teachers;
  const [part, setPart] = React.useState<Part>({
    teachers: [],
    students: [],
  });

  const is_tea_or_stu = defaultFilter === "students" ? part.students : part.teachers;

  const handleChange = (id: string) => {
    const is_exist = is_tea_or_stu.some((item) => item === id);
    if (!is_exist) {
      is_tea_or_stu.push(id);
      if (defaultFilter === "students") {
        setPart({ ...part, students: is_tea_or_stu });
        return;
      }
      setPart({ ...part, teachers: is_tea_or_stu });
      return;
    }
    is_tea_or_stu.splice(
      is_tea_or_stu.findIndex((item) => item === id),
      1
    );
    if (defaultFilter === "students") {
      setPart({ ...part, students: is_tea_or_stu });
      return;
    }
    setPart({ ...part, teachers: is_tea_or_stu });
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
          return (
            <FormControlLabel
              key={item.user_id}
              control={
                <Checkbox
                  name="checkedB"
                  color="primary"
                  checked={is_tea_or_stu.some((item1) => item1 === item.user_id)}
                  onChange={() => handleChange(item.user_id)}
                />
              }
              label={item.user_name}
            />
          );
        })}
      </FormGroup>
      <div className={css.buttons}>
        <Button variant="outlined" onClick={handleClose}>
          {d("Cancel").t("assess_button_cancel")}
        </Button>
        <Button variant="contained" color="primary" className={css.lastButton}>
          {d("OK").t("assess_label_ok")}
        </Button>
      </div>
    </div>
  );
}
