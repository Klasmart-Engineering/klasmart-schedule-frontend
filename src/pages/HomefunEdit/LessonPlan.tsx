import {
  Box,
  createStyles,
  FormControl,
  FormControlLabel,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import InputBase from "@material-ui/core/InputBase";
import NativeSelect from "@material-ui/core/NativeSelect";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import {
  EntityAssessHomeFunStudyArgs,
  EntityGetHomeFunStudyResult,
  EntityHomeFunStudyOutcome,
  EntityScheduleFeedbackView,
} from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
import Tooltip from "@material-ui/core/Tooltip";

const useStyle = makeStyles((theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    assignment: {
      position: "relative",
    },
    table: {
      minWidth: 650,
    },
  })
);

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
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
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

interface AssignmentProps {
  editable?: boolean;
  detail: EntityGetHomeFunStudyResult;
  feedbacks: EntityScheduleFeedbackView[];
  formMethods: UseFormMethods<EntityAssessHomeFunStudyArgs>;
  outcomesList?: EntityHomeFunStudyOutcome[];
  isComplete: boolean;
}

export function LessonPlan(props: AssignmentProps) {
  const { detail, formMethods, outcomesList, isComplete } = props;
  const [status, setStatus] = React.useState<string>("2");
  const css = useStyle();
  const { control, setValue } = formMethods;

  const handFilter = (assumed: boolean) => {
    if (status === "0") return !assumed;
    if (status === "1") return assumed;
    return true;
  };

  const reBytesStr = (str: string, len: number) => {
    let bytesNum = 0;
    let afterCutting = "";
    for (let i = 0, lens = str.length; i < lens; i++) {
      bytesNum += str.charCodeAt(i) > 255 ? 2 : 1;
      if (bytesNum > len) break;
      afterCutting = str.substring(0, i + 1);
    }
    return bytesNum > len ? `${afterCutting} ....` : afterCutting;
  };

  const textEllipsis = (value?: string) => {
    const CharacterCount = 16;
    return value ? reBytesStr(value, CharacterCount) : "";
  };

  const updateStatus = (value: string, index: number, item: EntityHomeFunStudyOutcome) => {
    setValue(`outcomes[${index}]`, { ...item, status: value });
  };

  return (
    <div className={css.assignment}>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "-10px 0 10px 0" }}>
        <Typography variant="h6">
          {d("Learning Outcomes Achievement of {StudentName}").t("assessment_learning_outcomes_achievement", {
            StudentName: detail.student_name ?? d("Student").t("schedule_time_conflict_student"),
          })}
        </Typography>
        <FormControl className={css.margin}>
          <NativeSelect
            id="demo-customized-select-native"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
            input={<BootstrapInput />}
          >
            <option value="2">{d("All").t("assess_filter_all")}</option>
            <option value="1">{d("Assumed").t("assess_label_assumed")}</option>
            <option value="0">{d("Unassumed").t("assess_filter_unassumed")}</option>
          </NativeSelect>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table className={css.table} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#F2F5F7" }}>
            <TableRow>
              <TableCell align="center">{d("Learning Outcomes").t("assess_column_lo")}</TableCell>
              <TableCell align="center">{d("Assumed").t("assess_label_assumed")}</TableCell>
              <TableCell align="center">{d("Assessing Actions").t("assess_option_assessing_actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outcomesList?.map((row, index) => (
              <Controller
                name={`outcomes[${index}]`}
                control={control}
                defaultValue={row || []}
                key={row.outcome_id}
                render={({ value, onChange }) => (
                  <TableRow style={{ display: handFilter(value.assumed as boolean) ? "" : "none" }}>
                    <TableCell component="th" scope="row" align="center">
                      <Tooltip title={value.outcome_name as string} placement="top-start">
                        <span>{textEllipsis(value.outcome_name)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">{value.assumed ? d("Yes").t("assess_label_yes") : ""}</TableCell>
                    <TableCell align="center" style={{ display: "flex", justifyContent: "center" }}>
                      <FormControl component="fieldset">
                        <FormGroup aria-label="position" row>
                          <FormControlLabel
                            value="end"
                            control={
                              <Checkbox
                                onChange={(e) => {
                                  updateStatus(e.target.value, index, value);
                                }}
                                value="achieved"
                                checked={value.status === "achieved"}
                                color="primary"
                                disabled={isComplete}
                              />
                            }
                            label={d("Achieved").t("report_label_achieved")}
                          />
                          <FormControlLabel
                            value="end"
                            control={
                              <Checkbox
                                onChange={(e) => {
                                  updateStatus(e.target.value, index, value);
                                }}
                                value="not_achieved"
                                checked={value.status === "not_achieved"}
                                color="primary"
                                disabled={isComplete}
                              />
                            }
                            label={d("Not Achieved").t("report_label_not_achieved")}
                          />
                          <FormControlLabel
                            value="end"
                            control={
                              <Checkbox
                                onChange={(e) => {
                                  updateStatus(e.target.value, index, value);
                                }}
                                value="not_attempted"
                                checked={value.status === "not_attempted"}
                                color="primary"
                                disabled={isComplete}
                              />
                            }
                            label={d("Not Attempted").t("assess_option_not_attempted")}
                          />
                        </FormGroup>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                )}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
