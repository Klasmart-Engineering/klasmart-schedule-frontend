import {
  createStyles,
  FormControl,
  FormControlLabel,
  makeStyles,
  withStyles,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import {
  EntityAssessHomeFunStudyArgs,
  EntityGetHomeFunStudyResult,
  EntityHomeFunStudyOutcome,
  EntityScheduleFeedbackView,
} from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import { Box } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

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
}

export function LessonPlan(props: AssignmentProps) {
  const { detail, formMethods, outcomesList } = props;
  const [status, setStatus] = React.useState<string>("2");
  const css = useStyle();
  const { control, setValue } = formMethods;

  const handFilter = (assumed: boolean) => {
    if (status === "0") return !assumed;
    if (status === "1") return assumed;
    return true;
  };

  const updateStatus = (value: string, index: number, item: EntityHomeFunStudyOutcome) => {
    setValue(`outcomes[${index}]`, { ...item, status: value });
  };

  return (
    <div className={css.assignment}>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "-10px 0 10px 0" }}>
        <Typography variant="h5">
          {d("Assignment of {studentname}").t("assess_assignment_of_student", {
            studentname: detail.student_name ?? d("Student").t("schedule_time_conflict_student"),
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
            <option value="2">All</option>
            <option value="1">Assumed</option>
            <option value="0">Unassumed</option>
          </NativeSelect>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table className={css.table} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#F2F5F7" }}>
            <TableRow>
              <TableCell align="center">Learning Outcomes</TableCell>
              <TableCell align="center">Assumed</TableCell>
              <TableCell align="center">Assessing Action</TableCell>
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
                      {value.outcome_name}
                    </TableCell>
                    <TableCell align="center">{value.assumed ? "Yes" : "No"}</TableCell>
                    <TableCell align="center" style={{ display: "flex", justifyContent: "center" }}>
                      <RadioGroup row aria-label="position" name="position" defaultValue="top">
                        <FormControlLabel
                          onChange={(e) => {
                            updateStatus(e.target.value, index, value);
                          }}
                          value="end"
                          control={<Checkbox value="achieved" checked={value.status === "achieved"} color="primary" />}
                          label="Achieved"
                        />
                        <FormControlLabel
                          onChange={(e) => {
                            updateStatus(e.target.value, index, value);
                          }}
                          value="end"
                          control={<Checkbox value="not_achieved" checked={value.status === "not_achieved"} color="primary" />}
                          label="Not Achieved"
                        />
                        <FormControlLabel
                          onChange={(e) => {
                            updateStatus(e.target.value, index, value);
                          }}
                          value="end"
                          control={<Checkbox value="not_attempted" checked={value.status === "not_attempted"} color="primary" />}
                          label="Not Attempted"
                        />
                      </RadioGroup>
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
