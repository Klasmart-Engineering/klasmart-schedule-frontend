import {
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  FormGroup,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  Theme,
  withStyles,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { d } from "../../locale/LocaleManager";
import { ClassOptionsItem, ParticipantsData, ParticipantsShortInfo, RolesData } from "../../types/scheduleTypes";
import InputBase from "@material-ui/core/InputBase/InputBase";

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    input: {
      width: "160px",
      borderRadius: 6,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 26px 10px 12px",
      marginLeft: "10px",
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

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "24px",
    fontWeight: 700,
    paddingBottom: "20px",
    borderBottom: "1px solid #eeeeee",
  },
  searchPart: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
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
    <div style={{ width: "600px" }}>
      <div className={css.title}>{d("Add Participants").t("schedule_detail_participants")}</div>
      <Grid container alignItems="center" className={css.searchPart}>
        <BootstrapInput
          id="outlined-basic"
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          placeholder={d("Search").t("schedule_button_search")}
        />
        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<Search />}
          onClick={handleSearch}
          style={{ marginRight: "50px" }}
        >
          {d("Search").t("schedule_button_search")}
        </Button>
        <RadioGroup aria-label="gender" name="gender1" className={css.radioBox} value={defaultFilter} onChange={handleFilterChange}>
          <FormControlLabel
            value="students"
            control={<Radio color="primary" />}
            label={d("Student").t("schedule_time_conflict_student")}
            className={css.radioItem}
          />
          <FormControlLabel
            value="teachers"
            control={<Radio color="primary" />}
            label={d("Teacher").t("schedule_detail_teacher")}
            className={css.radioItem}
          />
        </RadioGroup>
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
