/**
 * 目前此组件 仅仅用于 assessment 中的 class 类型
 * */

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
import React, { useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { GetAssessmentResultOutcomeAttendanceMap } from "../../api/type";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { PLField, PLTableHeader } from "../../components/PLTable";
import { d } from "../../locale/LocaleManager";
import { UpdateAssessmentRequestDataOmitAction } from "../../models/ModelAssessment";
import { IAssessmentState } from "../../reducers/assessments";
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
});
interface mergeHandlerProps<T> extends Array<(arg: T) => any> {}

const mergeHanlder = <T extends unknown>(handlers: mergeHandlerProps<T>): any => {
  return function (arg: T) {
    handlers.forEach((handler) => handler(arg));
  };
};

interface AssessActionProps {
  outcome: GetAssessmentResultOutcomeAttendanceMap;
  attendanceList: IAssessmentState["assessmentDetail"]["students"];
  formMethods: UseFormMethods<IAssessmentState["assessmentDetail"]>;
  index: number;
  formValue: UpdateAssessmentRequestDataOmitAction;
  editable?: boolean;
}

const AssessAction = (props: AssessActionProps) => {
  const css = useStyles();
  const {
    outcome: { outcome_id, attendance_ids },
    formMethods: { control, setValue },
    index,
    attendanceList,
    formValue,
    editable,
  } = props;
  const skip: boolean = (formValue.outcomes && formValue.outcomes[index] && formValue.outcomes[index].skip) || false;
  const none_achieved: boolean = (formValue.outcomes && formValue.outcomes[index] && formValue.outcomes[index].none_achieved) || false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allValue: string[] = formValue.attendance_ids || [];
  const checked_attendance_ids = useMemo(() => allValue && attendance_ids?.filter((item) => allValue.indexOf(item) >= 0), [
    allValue,
    attendance_ids,
  ]);
  const funSetValue = useMemo(
    () => (name: string, value: boolean | string[]) => {
      setValue(`outcomes[${index}].${name}`, value);
    },
    [index, setValue]
  );
  const handleChangeSkip = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    funSetValue(name, e.target.checked);

    if (e.target.checked) {
      if (name === "skip") {
        funSetValue("none_achieved", false);
      }
      funSetValue("attendance_ids", []);
    }
  };

  const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      funSetValue("none_achieved", false);
    }
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
                      label={d("Not Covered").t("assess_option_not_attempted")}
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
}
export function OutcomesTable(props: OutcomesTableProps) {
  const css = useStyles();
  const { outcomesList, attendanceList, formMethods, formValue, editable, filterOutcomes } = props;

  const OutcomesHeader: PLField[] = [
    {
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
      width: 150,
      value: "name",
      text: d("Learning Outcomes").t("library_label_learning_outcomes"),
    },
    { align: "center", style: { backgroundColor: "#F2F5F7" }, width: 120, value: "assignTo", text: "Assign to" },
    { align: "center", style: { backgroundColor: "#F2F5F7" }, width: 100, value: "assumed", text: d("Assumed").t("assess_label_assumed") },
    {
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
      value: "actions",
      text: d("Assessing Actions").t("assess_option_assessing_actions"),
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
          {" "}
          {outcome.outcome_name}{" "}
        </TableCell>
        <TableCell className={css.tableCellLine} align="center">
          {" "}
          Lesson Plan{" "}
        </TableCell>
        <TableCell className={css.tableCellLine} align="center">
          {" "}
          {outcome.assumed ? d("Yes").t("assess_label_yes") : ""}{" "}
        </TableCell>
        <TableCell className={css.tablecellError}>
          <AssessAction
            outcome={outcome}
            attendanceList={attendanceList}
            formMethods={formMethods}
            index={index}
            formValue={formValue}
            editable={editable}
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
