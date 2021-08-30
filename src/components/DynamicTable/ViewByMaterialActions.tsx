import React, { useEffect, useMemo, useState } from "react";
import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
import { d } from "../../locale/LocaleManager";
import { EntityAssessmentDetailContentOutcome, EntityAssessmentStudentViewH5PItem } from "../../api/api.auto";
import { cloneDeep, isEmpty } from "lodash";
import { BasicTableProps, formValueMethods } from "./types";

interface AssessActionProps extends formValueMethods {
  outcome: EntityAssessmentDetailContentOutcome;
  studentViewItemsSet: EntityAssessmentStudentViewH5PItem[] | undefined;
  disabled?: boolean;
  dimension2Item?: BasicTableProps["dimension2Item"];
}

export default function ViewByMaterialActions(props: AssessActionProps) {
  const { outcome, studentViewItemsSet, disabled, formValue, changeAssessmentTableDetail, dimension2Item } = props;

  let { outcome_id, none_achieved, content_id } = outcome;

  let attendance_ids: string[] = [];

  let [noneAchieved, setNoneAchieved] = useState(none_achieved && isEmpty(attendance_ids));
  let [attendanceIds, setAttendanceIds] = useState(cloneDeep(attendance_ids));
  let allAchieved = useMemo(() => attendanceIds?.length === studentViewItemsSet?.length, [attendanceIds, studentViewItemsSet]);

  useEffect(() => {
    let rAttendanceIds =
      formValue.content_outcomes?.find((co) => co.content_id === outcome.content_id && co.outcome_id === outcome.outcome_id)
        ?.attendance_ids ?? [];
    setAttendanceIds(rAttendanceIds);
  }, [formValue.content_outcomes, outcome.content_id, outcome.outcome_id]);

  /** 根据 outcome 得到（用户通过点击 not attempted 而得到的）禁用列表 **/
  const outcomeDisableList = useMemo(
    () => formValue.outcomes?.filter((o) => o.skip && o.outcome_id)?.map((o) => o.outcome_id) ?? [],
    [formValue.outcomes]
  );

  /** 上传所有数据的方法 **/
  const emitData = (arr?: string[], NA?: boolean) => {
    let attendanceIds = arr;
    console.log("formValue:", formValue, outcome_id, attendanceIds, none_achieved, NA);
    let newStudentViewItemsSet = cloneDeep(studentViewItemsSet);
    newStudentViewItemsSet?.forEach((stu) => {
      stu.lesson_materials?.forEach((lm) => {
        lm.outcomes?.forEach((oc) => {
          if (outcome_id === oc.outcome_id && content_id === oc.content_id) {
            oc.checked = !!attendanceIds?.find((ai) => ai === stu.student_id);
            oc.none_achieved = NA;
          }
        });
      });
    });
    // console.log("newStudentViewItemsSet111111111111:",cloneDeep(newStudentViewItemsSet))
    newStudentViewItemsSet?.forEach((stu) => {
      stu.lesson_materials?.forEach((lm) => {
        let nestedArr = lm.number?.split("-");
        if (lm.parent_id && nestedArr && nestedArr[0] === dimension2Item?.number) {
          let outcomes =
            newStudentViewItemsSet &&
            newStudentViewItemsSet
              .find((nstu) => nstu.student_id === stu.student_id)
              ?.lesson_materials?.find((nlm) => nlm.lesson_material_id === lm.lesson_material_id);
          lm.outcomes = (outcomes && outcomes.outcomes) || [];
        }
      });
    });
    // console.log("newStudentViewItemsSet222222222222:",cloneDeep(newStudentViewItemsSet))

    changeAssessmentTableDetail && changeAssessmentTableDetail(newStudentViewItemsSet);
  };

  /** 全选 / 全不选 **/
  const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    let ids: string[] = [];
    let NA: boolean = !!noneAchieved;
    if (type === "none") {
      /** 勾选了 None achieved 清空 AttendanceIds **/
      !noneAchieved && (ids = []);
      NA = !noneAchieved;
    } else {
      /** 勾选了 All achieved 填满 AttendanceIds 否则 清空 AttendanceIds **/
      if (!e.target.checked) ids = [];
      else {
        NA = false;
        ids = studentViewItemsSet?.map((i) => i.student_id || "") ?? [];
      }
    }
    setAttendanceIds(ids);
    setNoneAchieved(NA);
    emitData([...ids], NA);
  };

  /** 更改学生状态 **/
  const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement>, item: any) => {
    let ids = attendanceIds ?? [];
    let curIdx = attendanceIds?.findIndex((i) => i === item.student_id) ?? -1;
    if (curIdx === -1) ids?.push(item.student_id);
    else ids.splice(curIdx, 1);

    let NA: boolean = !!noneAchieved;
    if (ids.length > 0) NA = false;
    setAttendanceIds([...ids]);
    setNoneAchieved(NA);
    emitData([...ids], NA);
  };

  return (
    <Box display="flex" alignItems="center" p={2} pb={0}>
      <Box width={180} fontSize={14} display="flex" flexDirection="column" alignItems="flexStart">
        <FormControlLabel
          label={d("All Achieved").t("assess_option_all_achieved")}
          disabled={disabled || outcomeDisableList?.some((o) => o === outcome_id)}
          control={<Checkbox checked={allAchieved} color="primary" onChange={(e) => handleAllCheck(e, "all")} />}
        />
        <FormControlLabel
          label={d("None Achieved").t("assess_option_none_achieved")}
          disabled={disabled || outcomeDisableList?.some((o) => o === outcome_id)}
          control={<Checkbox checked={noneAchieved} color="primary" onChange={(e) => handleAllCheck(e, "none")} />}
        />
      </Box>
      <Box px={3} style={{ borderLeft: "1px solid #ebebeb" }}>
        {studentViewItemsSet &&
          studentViewItemsSet.map((item) => (
            <FormControlLabel
              label={item?.student_name}
              key={item.student_id}
              disabled={disabled || outcomeDisableList?.some((o) => o === outcome_id)}
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
