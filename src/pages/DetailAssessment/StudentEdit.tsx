import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { actWarning } from "@reducers/notify";
import clsx from "clsx";
import { cloneDeep } from "lodash";
import React, { ChangeEvent, useCallback, useMemo, useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import PermissionType from "../../api/PermissionType";
import { PermissionOr } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { DetailAssessmentResult } from "../ListAssessment/types";
import { StudentParticipate } from "./type";
const useStyles = makeStyles(({ palette, spacing }) => ({
  editBox: {
    width: "100%",
    marginTop: 30,
    position: "relative",
  },
  fieldset: {
    "& .MuiInputBase-input": {
      color: "rgba(0,0,0,1)",
    },
    "&:not(:first-child)": {
      marginTop: 30,
    },
  },
  norwarp: {
    whiteSpace: "nowrap",
    overflow: "none",
    textOverflow: "ellipsis",
  },
  editStudentBox: {
    "& .MuiInputBase-input": {
      width: "calc(100% - 78px)",
    },
  },
  editButton: {
    position: "absolute",
    bottom: 10,
    right: 14,
    background: "rgba(14,120,213,0.24)",
    "&:hover": {
      background: "rgba(14,120,213,0.24)",
    },
  },
  title: {
    "& .MuiTypography-root": {
      fontSize: "24px !important",
      fontWeight: 700,
    },
  },
  okBtn: {
    marginLeft: "40px !important",
  },
  subTitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
}));

export interface StudentEditProps {
  students: DetailAssessmentResult["students"];
  editable: boolean;
  onChangeStudent: (students: DetailAssessmentResult["students"]) => void;
}
export function StudentEdit(props: StudentEditProps) {
  const css = useStyles();
  const dispatch = useDispatch();
  const { students, editable, onChangeStudent } = props;
  const studentsnamelist = useMemo(() => {
    const studentsNameArr = students?.filter((item) => item.status === StudentParticipate.Participate).map((item) => item.student_name);
    return `${studentsNameArr?.join(",")}(${studentsNameArr?.length ?? 0})`;
  }, [students]);
  const [changedStudentList, setChangedStudentList] = useState(students);
  const [open, toggle] = useReducer((open) => {
    return !open;
  }, false);
  const handleOk = useCallback(() => {
    const selectedStudents = changedStudentList?.filter((item) => item.status === "Participate");
    if (selectedStudents?.length) {
      onChangeStudent(changedStudentList);
      toggle();
    } else {
      return Promise.reject(dispatch(actWarning(d("You must choose at least one student.").t("assess_msg_ one_student"))));
    }
  }, [changedStudentList, dispatch, onChangeStudent]);
  const handleChangeStudent = (students: DetailAssessmentResult["students"]) => {
    setChangedStudentList(students);
  };
  return (
    <Box className={css.editBox}>
      <TextField
        fullWidth
        disabled
        multiline
        minRows={2}
        maxRows={4}
        value={studentsnamelist}
        className={clsx(css.fieldset, css.norwarp, css.editStudentBox)}
        label={d("Student List").t("assess_detail_student_list")}
      />
      <PermissionOr
        value={[PermissionType.edit_in_progress_assessment_439, PermissionType.edit_attendance_for_in_progress_assessment_438]}
        render={(value) =>
          value && (
            <Button className={css.editButton} color="primary" variant="outlined" onClick={toggle} disabled={!editable}>
              {d("Edit").t("assess_button_edit")}
            </Button>
          )
        }
      />
      <Dialog open={open} onClose={toggle}>
        <DialogTitle className={css.title}>{d("Edit Student List").t("assess_detail_edit_student_list")}</DialogTitle>
        <DialogContent dividers style={{ borderBottom: "none" }}>
          <StudentInput students={students} editable={editable} onChangeStudent={handleChangeStudent} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggle} color="primary" variant="outlined">
            {d("CANCEL").t("general_button_CANCEL")}
          </Button>
          <Button onClick={handleOk} color="primary" variant="contained" className={css.okBtn}>
            {d("OK").t("general_button_OK")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export function StudentInput(props: StudentEditProps) {
  const css = useStyles();
  const { students, onChangeStudent } = props;
  const [studentsArr, setStudentArr] = useState(students);
  const selectedStudentsCount = useMemo(() => {
    return studentsArr?.filter((item) => item.status === StudentParticipate.Participate).length;
  }, [studentsArr]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const { checked } = event.target;
    const _students = cloneDeep(studentsArr) ?? [];
    _students[index].status = checked ? StudentParticipate.Participate : StudentParticipate.NotParticipate;
    setStudentArr(_students);
    onChangeStudent(_students);
  };
  return (
    <Box>
      <Typography className={css.subTitle}>
        {d("Students").t("assess_detail_students")}
        {`(${selectedStudentsCount})`}
      </Typography>
      {studentsArr?.map((item, index) => (
        <FormControlLabel
          key={item.student_id}
          control={
            <Checkbox
              color="primary"
              value={item.student_id}
              checked={item.status === StudentParticipate.Participate}
              onChange={(e) => handleChange(e, index)}
            />
          }
          label={item.student_name}
        />
      ))}
    </Box>
  );
}
