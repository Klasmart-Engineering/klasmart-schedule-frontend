import {
  Box,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { FinalOutcomeList } from "../../api/type";
import { CheckboxGroup } from "../CheckboxGroup";
import { d } from "../../locale/LocaleManager";
import { UpdateAssessmentRequestDataOmitAction } from "../../models/ModelAssessment";
import { IAssessmentState } from "../../reducers/assessments";
import { AchievedTooltips } from "../DynamicTable";
import { PLField, PLTableHeader } from "../PLTable";
import { EntityAssessmentStudentViewH5PItemExtend } from "../DynamicTable/types";
import { EntityUpdateAssessmentH5PStudent } from "../../api/api.auto";
import { cloneDeep } from "lodash";
const useStyles = makeStyles({
  tableContainer: {
    marginTop: 5,
    maxHeight: 830,
    marginBottom: 20,
  },
  table: {
    minWidth: 900,
    fontSize: "14px !important",
  },
  checkBoxUi: {
    fontSize: "14px !important",
  },
  tableCellLine: {
    wordBreak: "break-all",
    "&:not(:last-child)": {
      // borderRight: "1px solid #ebebeb",
    },
  },
  assessActionline: {
    borderLeft: "1px solid #ebebeb",
  },
  tablecellError: {
    padding: 0,
    paddingBottom: 16,
  },
  partially_checked: {
    width: 18,
    height: 18,
    margin: 3,
    borderRadius: 3,
    backgroundColor: "#0E78D5",
    boxShadow: "0 0 2px #0E78D5",
  },
});
interface mergeHandlerProps<T> extends Array<(arg: T) => any> {}

const mergeHanlder = <T extends unknown>(handlers: mergeHandlerProps<T>): any => {
  return function (arg: T) {
    handlers.forEach((handler) => handler(arg));
  };
};

interface AssessActionProps {
  outcome: FinalOutcomeList;
  attendanceList: IAssessmentState["assessmentDetail"]["students"];
  formMethods: UseFormMethods<IAssessmentState["assessmentDetail"]>;
  index: number;
  formValue: UpdateAssessmentRequestDataOmitAction;
  editable?: boolean;
  studentViewItems?: EntityAssessmentStudentViewH5PItemExtend[];
  changeAssessmentTableDetail?: (value?: EntityUpdateAssessmentH5PStudent[]) => void;
}

const AssessAction = (props: AssessActionProps) => {
  const css = useStyles();
  const {
    outcome: { outcome_id, attendance_ids, partial_ids },
    formMethods: { control, setValue },
    index,
    attendanceList,
    formValue,
    editable,
    studentViewItems,
    changeAssessmentTableDetail,
  } = props;
  const skip: boolean = (formValue.outcomes && formValue.outcomes[index] && formValue.outcomes[index].skip) || false;
  const none_achieved: boolean = (formValue.outcomes && formValue.outcomes[index] && formValue.outcomes[index].none_achieved) || false;
  const allValue: string[] = formValue.attendance_ids || [];
  const checked_attendance_ids = useMemo(
    () => allValue && attendance_ids?.filter((item) => allValue.indexOf(item) >= 0),
    [allValue, attendance_ids]
  );
  const funSetValue = useMemo(
    () => (name: string, value: boolean | string[]) => {
      setValue(`outcomes[${index}].${name}`, value);
    },
    [index, setValue]
  );

  useEffect(() => {
    /** 当且仅当 此 outcomes 包含 **/
    let hasOutcome =
      studentViewItems && studentViewItems[0]?.lesson_materials?.some((lm) => lm.outcomes?.some((oc) => oc.outcome_id === outcome_id));
    if (hasOutcome) setValue(`outcomes[${index}].attendance_ids`, attendance_ids);
  }, [index, setValue, attendance_ids, studentViewItems, outcome_id]);

  /** 更改下方的 student&content 中的数据 **/
  const transBottomToTop = (studentIds: string[], indeterminate?: boolean) => {
    // console.log("outcomes=========", formValue, studentViewItems, outcome_id,indeterminate);
    let newSVI = cloneDeep(studentViewItems);
    newSVI?.forEach((stu) => {
      stu.lesson_materials?.forEach((lm) => {
        lm.outcomes?.forEach((lmo) => {
          // lmo.checked = !lmo.checked
          /**  **/
          switch (true) {
            case studentIds?.length === 0:
              if (lmo.outcome_id === outcome_id) lmo.checked = false;
              break;
            case studentIds?.length === allValue.length:
              if (lmo.outcome_id === outcome_id) lmo.checked = true;
              break;
            default:
              if (lmo.outcome_id === outcome_id && stu.student_id === studentIds[0]) lmo.checked = !lmo.checked;
              if (lmo.outcome_id === outcome_id && stu.student_id === studentIds[0] && indeterminate)
                lmo.checked = false; /** 如果当前点击的是 partial 状态，则把它当成选中状态处理 **/
              break;
          }
        });
      });
    });
    console.log("studentViewItems:", newSVI);
    changeAssessmentTableDetail && changeAssessmentTableDetail(newSVI);
  };

  const handleChangeSkip = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    funSetValue(name, e.target.checked);
    if (e.target.checked) {
      if (name === "skip") {
        funSetValue("none_achieved", false);
      }
      funSetValue("attendance_ids", []);
    }
    transBottomToTop([]);
  };

  const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      funSetValue("none_achieved", false);
    }
    let arr: string[] = [];
    if (e.target.name === "award") {
      arr = e.target.checked ? allValue : [];
    } else {
      if (e.target.value) arr = [e.target.value];
    }
    // console.log("arr111111111", arr,e.target,e.target.getAttribute('data-indeterminate')==='true', cloneDeep(formValue));
    transBottomToTop(arr, e.target.getAttribute("data-indeterminate") === "true");
  };

  return (
    <Controller
      name={`outcomes[${index}].attendance_ids`}
      control={control}
      defaultValue={checked_attendance_ids || []}
      render={({ ref, ...props }) => (
        <CheckboxGroup
          allValue={allValue}
          {...props}
          render={(selectedContentGroupContext) => (
            <Box display="flex" alignItems="center" p={2} pb={0} {...{ ref }}>
              <Box width={180} fontSize={14}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedContentGroupContext.isAllvalue || false}
                      onChange={mergeHanlder([selectedContentGroupContext.registerAllChange, handleChangeStudent])}
                      name="award"
                      color="primary"
                    />
                  }
                  label={d("All Achieved").t("assess_option_all_achieved")}
                  disabled={skip || !editable}
                />
                <Controller
                  name={`outcomes[${index}].none_achieved`}
                  defaultValue={none_achieved || false}
                  control={control}
                  render={(props: { value: boolean | undefined }) => (
                    <FormControlLabel
                      control={<Checkbox checked={props.value} onChange={(e) => handleChangeSkip(e, "none_achieved")} color="primary" />}
                      label={d("None Achieved").t("assess_option_none_achieved")}
                      disabled={skip || !editable}
                    />
                  )}
                />
                <Controller
                  name={`outcomes[${index}].skip`}
                  defaultValue={skip || false}
                  control={control}
                  render={(props: { value: boolean | undefined }) => (
                    <FormControlLabel
                      control={<Checkbox checked={props.value} onChange={(e) => handleChangeSkip(e, "skip")} color="primary" />}
                      label={d("Not Attempted").t("assess_option_not_attempted")}
                      disabled={!editable}
                    />
                  )}
                />
              </Box>
              <Box px={3} className={css.assessActionline}>
                {attendanceList &&
                  attendanceList.map((item) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          indeterminate={partial_ids?.some((p) => p === item.id)}
                          indeterminateIcon={<div className={css.partially_checked} />}
                          color="primary"
                          value={item.id}
                          checked={selectedContentGroupContext.hashValue[item.id as string] || false}
                          onChange={mergeHanlder([selectedContentGroupContext.registerChange, handleChangeStudent])}
                        />
                      }
                      label={item.name}
                      key={item.id}
                      disabled={skip || !editable}
                    />
                  ))}
                <Controller
                  as={TextField}
                  control={control}
                  disabled
                  name={`outcomes[${index}].outcome_id`}
                  defaultValue={outcome_id}
                  style={{ display: "none" }}
                />
              </Box>
            </Box>
          )}
        />
      )}
    />
  );
};

export interface OutcomesTableProps {
  outcomesList: IAssessmentState["assessmentDetail"]["outcomes"];
  attendanceList: IAssessmentState["assessmentDetail"]["students"];
  formMethods: UseFormMethods<IAssessmentState["assessmentDetail"]>;
  formValue: UpdateAssessmentRequestDataOmitAction;
  editable?: boolean;
  filterOutcomes: string;
  studentViewItems?: EntityAssessmentStudentViewH5PItemExtend[];
  changeAssessmentTableDetail?: (value?: EntityUpdateAssessmentH5PStudent[]) => void;
}
export function OutcomesTable(props: OutcomesTableProps) {
  const css = useStyles();
  const { outcomesList, attendanceList, formMethods, formValue, editable, filterOutcomes, changeAssessmentTableDetail, studentViewItems } =
    props;

  const OutcomesHeader: PLField[] = [
    {
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
      width: 150,
      value: "name",
      text: d("Learning Outcomes").t("library_label_learning_outcomes"),
    },
    {
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
      width: 120,
      value: "assignTo",
      text: d("Assigned to").t("assessment_assigned_to"),
    },
    { align: "center", style: { backgroundColor: "#F2F5F7" }, width: 100, value: "assumed", text: d("Assumed").t("assess_label_assumed") },
    {
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
      value: "actions",
      text: (
        <div className="flex_align_center flex_justify_center">
          <span>{d("Assessing Actions").t("assess_option_assessing_actions")}</span>
          <AchievedTooltips showPartially />
        </div>
      ),
    },
  ];

  const rows =
    outcomesList &&
    outcomesList.map((outcome, index) => (
      <TableRow
        key={outcome.outcome_id}
        style={{
          display: (filterOutcomes === "assumed" && !outcome.assumed) || (filterOutcomes === "unassumed" && outcome.assumed) ? "none" : "",
        }}
      >
        <TableCell className={css.tableCellLine} align="center">
          &ensp; {outcome.outcome_name} &ensp;
        </TableCell>
        <TableCell className={css.tableCellLine} align="center">
          &ensp;{" "}
          {outcome.assigned_to?.map((a) => (
            <div>{a}</div>
          ))}{" "}
          &ensp;
        </TableCell>
        <TableCell className={css.tableCellLine} align="center">
          &ensp; {outcome.assumed ? d("Yes").t("assess_label_yes") : ""} &ensp;
        </TableCell>
        <TableCell className={css.tablecellError}>
          <AssessAction
            outcome={outcome}
            attendanceList={attendanceList}
            formMethods={formMethods}
            index={index}
            formValue={formValue}
            editable={editable}
            studentViewItems={studentViewItems}
            changeAssessmentTableDetail={changeAssessmentTableDetail}
          />
        </TableCell>
      </TableRow>
    ));

  return (
    <TableContainer className={css.tableContainer}>
      <Table className={css.table} stickyHeader>
        <PLTableHeader fields={OutcomesHeader} style={{ height: 80 }} />
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}
