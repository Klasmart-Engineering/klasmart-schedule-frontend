import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  LinearProgress,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { modelSchedule } from "@models/ModelSchedule";
import { cloneDeep } from "lodash";
import React, { ChangeEvent, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ParticipantsByClassQuery } from "@api/api-ko.auto";
import { d } from "@locale/LocaleManager";
import { RootState } from "@reducers/index";
import { resetParticipantsData } from "@reducers/schedule";
import { ParticipantsShortInfo, ParticipantString, ParticipantValue, RolesData } from "../../types/scheduleTypes";

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
    paddingBottom: "8px",
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
  schoolTemplateStyleMore: {
    color: "RGB(0,98,192)",
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    cursor: "pointer",
  },
  emptyCon: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchInputBox: {
    "& .schedule-MuiInputBase-input": {
      height: "3px",
    },
  },
}));

interface InfoProps {
  handleClose: () => void;
  handleChangeParticipants?: (type: string, data: ParticipantsShortInfo) => void;
  getParticipantsData?: (metaLoading: boolean, search: string, hash: string, roleName: ParticipantString["key"]) => void;
  participantsIds: ParticipantsShortInfo;
  participantList: ParticipantsByClassQuery;
  nameUpperLevel: string;
  setSearchName: (value: string) => void;
}

export default function AddParticipantsTemplate(props: InfoProps) {
  const { ParticipantsData } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const { handleClose, handleChangeParticipants, participantsIds, participantList, getParticipantsData, nameUpperLevel, setSearchName } =
    props;
  const css = useStyles();
  const [defaultFilter, setDefaultFilter] = React.useState(ParticipantValue.student);
  const [dom, setDom] = React.useState<HTMLDivElement | null>(null);
  const [tScrollTop, settScrollTop] = React.useState(0);
  const [sScrollTop, setsScrollTop] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const suggestParticipants = useMemo(() => {
    const participantsFilterData = modelSchedule.FilterParticipants(ParticipantsData, participantList);
    return { ...participantsFilterData };
  }, [ParticipantsData, participantList]);

  const handleFilterChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (dom) {
      dom.scrollTop = event.target.value === ParticipantValue.student ? sScrollTop : tScrollTop;
    }
    const value = event.target.value as ParticipantValue;
    setDefaultFilter(value);
    if (value === ParticipantValue.student && ParticipantsData.classes.students.length) return;
    if (value === ParticipantValue.teacher && ParticipantsData.classes.teachers.length) return;
    setLoading(true);
    if (getParticipantsData) {
      await getParticipantsData(false, name, "", value);
    }
    setLoading(false);
  };

  const [part, setPart] = React.useState<ParticipantsShortInfo>(participantsIds);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, value: RolesData) => {
    const selectedValue = {
      id: value.user_id,
      name: value.user_name,
    };
    if (e.target.checked) {
      if (defaultFilter === ParticipantValue.student) {
        const student = [...part.student, selectedValue];
        setPart({ ...part, student });
      } else {
        const teacher = [...part.teacher, selectedValue];
        setPart({ ...part, teacher });
      }
    } else {
      const _part = cloneDeep(part);
      if (defaultFilter === ParticipantValue.student) {
        _part.student.splice(
          _part.student.findIndex((item) => item.id === value.user_id),
          1
        );
      }
      if (defaultFilter === ParticipantValue.teacher) {
        _part.teacher.splice(
          _part.teacher.findIndex((item) => item.id === value.user_id),
          1
        );
      }
      setPart({ ..._part });
    }
  };

  const handleConfirm = () => {
    handleChangeParticipants && handleChangeParticipants("addParticipants", part);
    handleClose();
  };

  const [name, setName] = React.useState(nameUpperLevel);

  const handleSearch = async () => {
    if (getParticipantsData && !loading) {
      setLoading(true);
      dispatch(resetParticipantsData());
      settScrollTop(0);
      setsScrollTop(0);
      await getParticipantsData(false, name, "", defaultFilter);
      setLoading(false);
      setSearchName(name);
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

  const handleOnScroll = async () => {
    if (dom) {
      const contentScrollTop = dom.scrollTop; //滚动条距离顶部
      const clientHeight = dom.clientHeight; //可视区域
      const scrollHeight = dom.scrollHeight; //滚动条内容的总高度
      if (defaultFilter === ParticipantValue.student) {
        setsScrollTop(contentScrollTop);
      } else {
        settScrollTop(contentScrollTop);
      }
      const hash = defaultFilter === ParticipantValue.student ? ParticipantsData.hash.student ?? "" : ParticipantsData?.hash.teacher ?? "";
      const next = defaultFilter === ParticipantValue.student ? ParticipantsData.next.student : ParticipantsData.next.teacher;
      if (contentScrollTop + clientHeight >= scrollHeight) {
        if (next && getParticipantsData && !loading) {
          setLoading(true);
          await getParticipantsData(false, name, hash, defaultFilter);
          setLoading(false);
        }
      }
    }
  };

  return (
    <div style={{ width: "600px" }}>
      <div className={css.title}>{d("Add Participants").t("schedule_detail_participants")}</div>
      <Grid container alignItems="center" className={css.searchPart}>
        <TextField
          id="outlined-basic"
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          placeholder={d("Search").t("schedule_button_search")}
          className={css.searchInputBox}
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
            value={ParticipantValue.student}
            control={<Radio color="primary" />}
            label={d("Student").t("schedule_time_conflict_student")}
            className={css.radioItem}
          />
          <FormControlLabel
            value={ParticipantValue.teacher}
            control={<Radio color="primary" />}
            label={d("Teacher").t("schedule_detail_teacher")}
            className={css.radioItem}
          />
        </RadioGroup>
      </Grid>
      <FormGroup
        className={css.checkboxContainer}
        ref={(dom) => {
          setDom(dom as any);
        }}
        onScrollCapture={() => handleOnScroll()}
      >
        {defaultFilter === ParticipantValue.student &&
          suggestParticipants.classes.students.map((item: RolesData) => {
            return (
              <FormControlLabel
                key={item.user_id}
                control={
                  <Checkbox
                    name="checkedB"
                    color="primary"
                    checked={part.student.some((item1) => item1.id === item.user_id)}
                    onChange={(e) => handleChange(e, item)}
                  />
                }
                label={item.user_name}
              />
            );
          })}
        {defaultFilter === ParticipantValue.teacher &&
          suggestParticipants.classes.teachers.map((item: RolesData) => {
            return (
              <FormControlLabel
                key={item.user_id}
                control={
                  <Checkbox
                    name="checkedB"
                    color="primary"
                    checked={part.teacher.some((item1) => item1.id === item.user_id)}
                    onChange={(e) => handleChange(e, item)}
                  />
                }
                label={item.user_name}
              />
            );
          })}
        {((defaultFilter === ParticipantValue.student && !suggestParticipants.classes.students.length) ||
          (defaultFilter === ParticipantValue.teacher && !suggestParticipants.classes.teachers.length)) &&
          !loading && (
            <div className={css.emptyCon}>
              {name ? d("No matching result").t("schedule_msg_no_matching_result") : d("No Data Available").t("report_no_data_available")}
            </div>
          )}
        {loading && (
          <Box sx={{ width: "98%" }}>
            <LinearProgress />
          </Box>
        )}
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
