import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Hidden, makeStyles, Radio, RadioGroup, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { d, reportMiss } from "../../locale/LocaleManager";
import { ClassOptionsItem, ParticipantsData, ParticipantsShortInfo, RolesData } from "../../types/scheduleTypes";

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

interface InfoProps {
  handleClose: () => void;
  ParticipantsData?: ParticipantsData;
  handleChangeParticipants?: (type: string, data: ParticipantsShortInfo) => void;
  getParticipantsData?: (is_org: boolean) => void;
  participantsIds: ParticipantsShortInfo;
}

export default function AddParticipantsTemplate(props: InfoProps) {
  const { handleClose, ParticipantsData, handleChangeParticipants, participantsIds } = props;
  const css = useStyles();
  const [defaultFilter, setDefaultFilter] = React.useState("students");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultFilter(event.target.value);
  };

  const [searchData, setSearchData] = React.useState(ParticipantsData);

  const filterData: RolesData[] = (defaultFilter === "students"
    ? searchData?.classes.students
    : searchData?.classes.teachers) as RolesData[];
  const [part, setPart] = React.useState<ParticipantsShortInfo>(participantsIds);

  const is_tea_or_stu =
    defaultFilter === "students"
      ? (JSON.parse(JSON.stringify(part.student)) as ClassOptionsItem[])
      : (JSON.parse(JSON.stringify(part.teacher)) as ClassOptionsItem[]);

  const handleChange = (value: RolesData) => {
    const is_exist = is_tea_or_stu.some((item) => item.id === value.user_id);
    if (!is_exist) {
      is_tea_or_stu.push({ id: value.user_id, name: value.user_name });
      if (defaultFilter === "students") {
        setPart({ ...part, student: is_tea_or_stu });
        return;
      }
      setPart({ ...part, teacher: is_tea_or_stu });
      return;
    }
    is_tea_or_stu.splice(
      is_tea_or_stu.findIndex((item) => item.id === value.user_id),
      1
    );
    if (defaultFilter === "students") {
      setPart({ ...part, student: is_tea_or_stu });
      return;
    }
    setPart({ ...part, teacher: is_tea_or_stu });
  };

  const handleConfirm = () => {
    handleChangeParticipants && handleChangeParticipants("addParticipants", part);
    handleClose();
  };

  const [name, setName] = React.useState("");

  const handleSearch = () => {
    setSearchData(ParticipantsData);
    if (name) {
      // @ts-ignore
      const result = ParticipantsData?.classes[defaultFilter].filter((item) => item.user_name.includes(name));
      setSearchData({
        classes: {
          teachers: searchData?.classes.teachers as RolesData[],
          students: searchData?.classes.students as RolesData[],
          [defaultFilter]: result,
        },
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  return (
    <div>
      <div className={css.title}>{reportMiss("Add participants", "schedule_add_participants")}</div>
      <Grid container alignItems="center" className={css.searchPart}>
        <Grid item xs={4} sm={5} md={5} lg={5} xl={5} className={css.searchInput}>
          <TextField
            size="small"
            id="outlined-basic"
            label="Search"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
          />
        </Grid>
        <Hidden smDown>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <Button variant="contained" color="primary" size="medium" startIcon={<Search />} onClick={handleSearch}>
              {d("Search").t("schedule_button_search")}
            </Button>
          </Grid>
        </Hidden>
        <Grid item xs={8} sm={5} md={5} lg={5} xl={5}>
          <RadioGroup aria-label="gender" name="gender1" className={css.radioBox} value={defaultFilter} onChange={handleFilterChange}>
            <FormControlLabel value="students" control={<Radio />} label="Student" className={css.radioItem} />
            <FormControlLabel value="teachers" control={<Radio />} label="Teacher" className={css.radioItem} />
          </RadioGroup>
        </Grid>
      </Grid>
      <FormGroup className={css.checkboxContainer}>
        {filterData &&
          filterData.map((item: RolesData) => {
            return (
              <FormControlLabel
                key={item.user_id}
                control={
                  <Checkbox
                    name="checkedB"
                    color="primary"
                    checked={is_tea_or_stu.some((item1) => item1.id === item.user_id)}
                    onChange={() => handleChange(item)}
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
        <Button variant="contained" color="primary" className={css.lastButton} onClick={handleConfirm}>
          {d("OK").t("assess_label_ok")}
        </Button>
      </div>
    </div>
  );
}
