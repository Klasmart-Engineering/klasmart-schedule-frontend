import { ParticipantString, ParticipantValue } from "@api/type";
import { d } from "@locale/LocaleManager";
import {
  Box,
  Button,
  Checkbox,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  LinearProgress,
  makeStyles,
  Tab,
  Tabs,
  TextField,
} from "@material-ui/core";
import { Close, Search } from "@material-ui/icons";
import { resetParticipantsData } from "@reducers/schedule";
import { cloneDeep } from "lodash";
import React, { ChangeEvent, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ParticipantsData, ParticipantsShortInfo, RolesData } from "src/types/scheduleTypes";
import { RootState } from "../../reducers";
const useStyles = makeStyles((theme) =>
  createStyles({
    closeBtn: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    root: {
      "& div": {
        borderRadius: 20,
      },
    },
    checkboxContainer: {
      marginTop: "30px",
      maxHeight: "calc(100% - 118px)",
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
    dialogActionRoot: {
      justifyContent: "center",
      marginBottom: 150,
    },
    okBtn: {
      width: 160,
    },
    dialogContentRoot: {
      height: "calc(100% - 116.5px)",
      overflow: "hidden",
    },
    emptyCon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 140,
    },
    tabLabel: {
      fontWeight: 600,
      color: "#000",
    },
    title: {
      fontSize: 20,
      fontWeight: 600,
      color: "#000",
    },
  })
);
export interface AddParticipantsTemplateMbProps {
  open: boolean;
  onClose: () => void;
  ParticipantsData?: ParticipantsData;
  handleChangeParticipants?: (type: string, data: ParticipantsShortInfo) => void;
  participantsIds: ParticipantsShortInfo;
  getParticipantsData?: (metaLoading: boolean, search: string, hash: string, roleName: ParticipantString["key"]) => void;
}
export function AddParticipantsTemplateMb(props: AddParticipantsTemplateMbProps) {
  const css = useStyles();
  const dispatch = useDispatch();
  const { participantsIds, open, onClose, handleChangeParticipants, getParticipantsData } = props;
  const { ParticipantsData } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const [tabValue, setTabValue] = useState(ParticipantValue.student);
  const [name, setName] = useState("");
  const [dom, setDom] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [part, setPart] = useState<ParticipantsShortInfo>(participantsIds);
  const disableOkBtn = !part.student.length && !part.teacher.length;

  const handleChangeParticipantValue = async (value: ParticipantValue) => {
    setTabValue(value);
    if (value === ParticipantValue.student && ParticipantsData.classes.students.length) return;
    if (value === ParticipantValue.teacher && ParticipantsData.classes.teachers.length) return;
    setLoading(true);
    if (getParticipantsData) {
      await getParticipantsData(false, name, "", value);
    }
    setLoading(false);
  };

  const handleOnScroll = async () => {
    if (dom) {
      const contentScrollTop = dom.scrollTop; //滚动条距离顶部
      const clientHeight = dom.clientHeight; //可视区域
      const scrollHeight = dom.scrollHeight; //滚动条内容的总高度
      const hash = tabValue === ParticipantValue.student ? ParticipantsData.hash.student ?? "" : ParticipantsData?.hash.teacher ?? "";
      const next = tabValue === ParticipantValue.student ? ParticipantsData.next.student : ParticipantsData.next.teacher;
      if (contentScrollTop + clientHeight >= scrollHeight) {
        if (getParticipantsData && next && !loading) {
          setLoading(true);
          await getParticipantsData(false, name, hash, tabValue);
          setLoading(false);
        }
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, value: RolesData) => {
    const selectedValue = {
      id: value.user_id,
      name: value.user_name,
    };
    if (e.target.checked) {
      if (tabValue === ParticipantValue.student) {
        const student = [...part.student, selectedValue];
        setPart({ ...part, student });
      } else {
        const teacher = [...part.teacher, selectedValue];
        setPart({ ...part, teacher });
      }
    } else {
      const _part = cloneDeep(part);
      if (tabValue === ParticipantValue.student) {
        _part.student.splice(
          _part.student.findIndex((item) => item.id === value.user_id),
          1
        );
      }
      if (tabValue === ParticipantValue.teacher) {
        _part.teacher.splice(
          _part.teacher.findIndex((item) => item.id === value.user_id),
          1
        );
      }
      setPart({ ..._part });
    }
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSearch = async () => {
    if (!loading && getParticipantsData) {
      setLoading(true);
      dispatch(resetParticipantsData());
      await getParticipantsData(false, name, "", tabValue);
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    handleChangeParticipants && handleChangeParticipants("addParticipants", part);
    onClose();
  };

  const handleClearName = async () => {
    setName("");
    if (!loading && getParticipantsData) {
      setLoading(true);
      dispatch(resetParticipantsData());
      await getParticipantsData(false, "", "", tabValue);
      setLoading(false);
    }
  };

  return (
    <Dialog fullScreen open={open}>
      <DialogTitle>
        <div className={css.title}>{d("Add Participants").t("schedule_detail_participants")}</div>
        <IconButton onClick={onClose} className={css.closeBtn}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent classes={{ root: css.dialogContentRoot }}>
        <TextField
          classes={{ root: css.root }}
          fullWidth
          size="small"
          placeholder={d("Search").t("schedule_button_search")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search style={{ color: "rgba(0, 0, 0, 0.54)" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {name && <Close fontSize="small" style={{ color: "rgba(0, 0, 0, 0.54)" }} onClick={handleClearName} />}
              </InputAdornment>
            ),
          }}
          value={name}
          onChange={handleChangeName}
          onBlur={handleSearch}
        />
        <Tabs
          value={tabValue}
          variant="fullWidth"
          centered
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, value) => handleChangeParticipantValue(value)}
        >
          <Tab className={css.tabLabel} label={d("Student").t("schedule_time_conflict_student")} value={ParticipantValue.student} />
          <Tab className={css.tabLabel} label={d("Teacher").t("schedule_detail_teacher")} value={ParticipantValue.teacher} />
        </Tabs>
        <FormGroup
          className={css.checkboxContainer}
          ref={(dom) => {
            setDom(dom as any);
          }}
          onScrollCapture={(e) => handleOnScroll()}
        >
          {tabValue === ParticipantValue.student &&
            ParticipantsData.classes.students.map((student) => {
              return (
                <FormControlLabel
                  key={student.user_id}
                  control={
                    <Checkbox
                      name="checkedB"
                      color="primary"
                      style={{ marginRight: 20 }}
                      checked={part.student.some((s) => s.id === student.user_id)}
                      onChange={(e) => handleChange(e, student)}
                    />
                  }
                  label={student.user_name}
                />
              );
            })}
          {tabValue === ParticipantValue.teacher &&
            ParticipantsData.classes.teachers.map((teacher) => {
              return (
                <FormControlLabel
                  key={teacher.user_id}
                  control={
                    <Checkbox
                      name="checkedB"
                      color="primary"
                      style={{ marginRight: 20 }}
                      checked={part.teacher.some((t) => t.id === teacher.user_id)}
                      onChange={(e) => handleChange(e, teacher)}
                    />
                  }
                  label={teacher.user_name}
                />
              );
            })}
          {((tabValue === ParticipantValue.student && !ParticipantsData.classes.students.length) ||
            (tabValue === ParticipantValue.teacher && !ParticipantsData.classes.teachers.length)) &&
            !loading && (
              <div className={css.emptyCon}>{name ? "No matching result" : d("No Data Available").t("report_no_data_available")}</div>
            )}
          {loading && (
            <Box sx={{ width: "98%" }}>
              <LinearProgress />
            </Box>
          )}
        </FormGroup>
      </DialogContent>
      <DialogActions classes={{ root: css.dialogActionRoot }}>
        <Button className={css.okBtn} color="primary" variant="contained" disabled={disableOkBtn} onClick={handleConfirm}>
          {d("OK").t("schedule_button_ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function useAddParticipant() {
  const [addParticipantShowIndex, setAddParticipantShowIndex] = useState(1);
  const [active, setActive] = useState(false);
  return useMemo(
    () => ({
      addParticipantShowIndex,
      participantActive: active,
      openAddParticipant: () => {
        setAddParticipantShowIndex(addParticipantShowIndex + 1);
        setActive(true);
      },
      closeAddParticipant: () => setActive(false),
    }),
    [active, addParticipantShowIndex]
  );
}
