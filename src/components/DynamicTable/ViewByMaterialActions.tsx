import React, { useMemo, useState } from "react";
import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
import { d } from "../../locale/LocaleManager";
import { EntityAssessmentDetailContentOutcome, EntityAssessmentStudentViewH5PItem } from "../../api/api.auto";
import { cloneDeep, isEmpty } from "lodash";
import { formValueMethods } from "./types";

interface AssessActionProps extends formValueMethods {
  outcome: EntityAssessmentDetailContentOutcome;
  studentViewItemsSet: EntityAssessmentStudentViewH5PItem[] | undefined;
  disabled?: boolean;
}

export default function ViewByMaterialActions(props: AssessActionProps) {
  const { outcome, studentViewItemsSet, disabled, formMethods, formValue, changeAssessmentTableDetail } = props;

  let { outcome_id, none_achieved, content_id } = outcome;
  let attendance_ids: string[] =
    formValue.content_outcomes?.find((co) => co.content_id === outcome.content_id && co.outcome_id === outcome.outcome_id)
      ?.attendance_ids ?? [];

  let [noneAchieved, setNoneAchieved] = useState(none_achieved && isEmpty(attendance_ids));
  let [attendanceIds, setAttendanceIds] = useState(cloneDeep(attendance_ids));
  let allAchieved = useMemo(() => attendanceIds?.length === studentViewItemsSet?.length, [attendanceIds, studentViewItemsSet]);

  /** 上传所有数据的方法 **/
  const emitData = () => {
    console.log("formValue:", formValue, formMethods, outcome_id, attendanceIds);
    let newStudentViewItemsSet = cloneDeep(studentViewItemsSet);
    newStudentViewItemsSet?.forEach((stu) => {
      stu.lesson_materials?.forEach((lm) => {
        lm.outcomes?.forEach((oc) => {
          if (outcome_id === oc.outcome_id && content_id === oc.content_id) {
            oc.checked = !!attendanceIds.find((ai) => ai === stu.student_id);
          }
        });
      });
    });
    changeAssessmentTableDetail && changeAssessmentTableDetail(newStudentViewItemsSet);
  };

  /** 全选 / 全不选 **/
  const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === "none") {
      /** 勾选了 None achieved 清空 AttendanceIds **/
      !noneAchieved && setAttendanceIds([]);
      setNoneAchieved(!noneAchieved);
    } else {
      /** 勾选了 All achieved 填满 AttendanceIds 否则 清空 AttendanceIds **/
      if (!e.target.checked) setAttendanceIds([]);
      else {
        setNoneAchieved(false);
        setAttendanceIds(studentViewItemsSet?.map((i) => i.student_id || "") ?? []);
      }
    }
    emitData();
  };

  /** 更改学生状态 **/
  const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement>, item: any) => {
    let ids = attendanceIds ?? [];
    let curIdx = attendanceIds?.findIndex((i) => i === item.student_id) ?? -1;
    if (curIdx === -1) ids?.push(item.student_id);
    else ids.splice(curIdx, 1);

    if (ids.length > 0) setNoneAchieved(false);
    setAttendanceIds([...ids]);
    emitData();
  };

  return (
    <Box display="flex" alignItems="center" p={2} pb={0}>
      <Box width={180} fontSize={14} display="flex" flexDirection="column" alignItems="flexStart">
        <FormControlLabel
          label={d("All Achieved").t("assess_option_all_achieved")}
          disabled={disabled}
          control={<Checkbox checked={allAchieved} color="primary" onChange={(e) => handleAllCheck(e, "all")} />}
        />
        <FormControlLabel
          label={d("None Achieved").t("assess_option_none_achieved")}
          disabled={disabled}
          control={<Checkbox checked={noneAchieved} color="primary" onChange={(e) => handleAllCheck(e, "none")} />}
        />
      </Box>
      <Box px={3} style={{ borderLeft: "1px solid #ebebeb" }}>
        {studentViewItemsSet &&
          studentViewItemsSet.map((item) => (
            <FormControlLabel
              label={item?.student_name}
              key={item.student_id}
              disabled={disabled}
              control={
                <Checkbox
                  color="primary"
                  value={item.student_id}
                  checked={!!attendanceIds?.find((i) => i === item.student_id)}
                  onChange={(e) => handleChangeStudent(e, item)}
                />
              }
            />
          ))}
      </Box>
    </Box>
  );
}
