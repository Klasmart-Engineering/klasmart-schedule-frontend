import {
  createStyles,
  FormControl,
  FormControlLabel,
  IconButton,
  Link,
  makeStyles,
  Radio,
  RadioGroup,
  RadioGroupProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  GetApp,
  SentimentSatisfied,
  SentimentSatisfiedOutlined,
  SentimentVeryDissatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
  SvgIconComponent,
} from "@material-ui/icons";
import React, { createElement } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { EntityAssessHomeFunStudyArgs, EntityGetHomeFunStudyResult, EntityScheduleFeedbackView } from "../../api/api.auto";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";

const useStyle = makeStyles(() =>
  createStyles({
    assignment: {
      position: "relative",
    },
    assignmentTableContainer: {
      paddingBottom: 40,
    },
    assignmentTable: {
      marginTop: 32,
    },
    assignmentTableHeader: {
      backgroundColor: "#f2f5f7",
    },
    assignmentTableHeaderItem: {
      height: 80 - 32,
      color: "#666666",
      fontSize: 15,
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
    },
    assignmentTableBodyItem: {
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      "&:last-child": {
        borderRight: "none",
      },
    },
    assignmentDownloadRow: {
      padding: "11px 24px 10px 20px",
      display: "flex",
      justifyContent: "space-between",
      fontSize: 16,
      fontFamily: "Helvetica",
    },
    scoreInput: {
      marginTop: 50,
      display: "flex",
    },
    scoreInputLabel: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    scoreInputTitle: {
      marginTop: 6,
      fontSize: 18,
    },
    scoreIcon: {
      fontSize: 30,
    },
    scoreInputFormControlLabel: {
      marginRight: 72 - 16,
    },
    comment: {
      marginTop: 32,
      marginBottom: 120,
      borderRadius: 7,
    },
    commentInput: {
      minHeight: 200,
    },
  })
);

interface ScoreInputProps {
  optionIcons: SvgIconComponent[];
  optionColors: string[];
  optionNames: string[];
  optionValues: number[];
  value?: number;
  onChange?: RadioGroupProps["onChange"];
}
function ScoreInput(props: ScoreInputProps) {
  const css = useStyle();
  const { optionColors, optionNames, optionIcons, optionValues, value, onChange } = props;
  console.log("value = ", value);
  const radioList = optionNames.map((name, index) => (
    <FormControlLabel
      key={optionValues[index]}
      className={css.scoreInputFormControlLabel}
      value={optionValues[index]}
      label={
        <div className={css.scoreInputLabel}>
          {createElement(optionIcons[index], { className: css.scoreIcon, style: { color: optionColors[index] } })}
          <div className={css.scoreInputTitle}>{optionNames[index]}</div>
        </div>
      }
      labelPlacement="top"
      control={<Radio color="primary" />}
    />
  ));
  return (
    <FormControl component="fieldset" className={css.scoreInput}>
      <RadioGroup row value={value} onChange={onChange}>
        {radioList}
      </RadioGroup>
    </FormControl>
  );
}

interface AssignmentDownloadRowProps {
  name?: string;
  url?: string;
}
function AssignmentDownloadRow(props: AssignmentDownloadRowProps) {
  const { name, url } = props;
  const css = useStyle();
  return (
    <div className={css.assignmentDownloadRow}>
      <span>{name}</span>
      <Link href={url} download={name} target="_blank">
        <IconButton size="small">
          <GetApp fontSize="inherit" />
        </IconButton>
      </Link>
    </div>
  );
}

interface AssignmentTableProps {
  title: string;
  feedbacks: AssignmentProps["feedbacks"];
}
function AssignmentTable(props: AssignmentTableProps) {
  const { feedbacks, title } = props;
  const css = useStyle();
  const tableBodyRows = feedbacks.map(({ id, comment, create_at, assignments }) => (
    <TableRow key={id}>
      <TableCell align="center" className={css.assignmentTableBodyItem}>
        {assignments?.map((assignment) => (
          <AssignmentDownloadRow name={assignment.name} url={assignment.url} key={assignment.name} />
        ))}
      </TableCell>
      <TableCell align="center" className={css.assignmentTableBodyItem}>
        <Typography align="justify" variant="body1">
          {comment}
        </Typography>
      </TableCell>
      <TableCell align="center" className={css.assignmentTableBodyItem}>
        {formattedTime(create_at)}
      </TableCell>
    </TableRow>
  ));
  return (
    <div className={css.assignmentTableContainer}>
      <Typography variant="h5">{title}</Typography>
      <Table className={css.assignmentTable}>
        <TableHead className={css.assignmentTableHeader}>
          <TableRow>
            <TableCell align="center" className={css.assignmentTableHeaderItem} width="40%">
              {d("Assignment Uploaded").t("assess_assignment_uploaded")}
            </TableCell>
            <TableCell align="center" className={css.assignmentTableHeaderItem} width="35%">
              {d("Comment").t("assess_comment")}
            </TableCell>
            <TableCell align="center" className={css.assignmentTableHeaderItem} width="25%">
              {d("Submit Time").t("assess_column_submit_time")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableBodyRows}</TableBody>
      </Table>
    </div>
  );
}

interface AssignmentProps {
  detail: EntityGetHomeFunStudyResult;
  feedbacks: EntityScheduleFeedbackView[];
  formMethods: UseFormMethods<EntityAssessHomeFunStudyArgs>;
}

export function Assignment(props: AssignmentProps) {
  const { detail, feedbacks, formMethods } = props;
  console.log("detail.assess_score = ", detail.assess_score);
  const css = useStyle();
  const { control } = formMethods;
  return (
    <div className={css.assignment}>
      <AssignmentTable
        feedbacks={feedbacks.slice(0, 1)}
        title={d("Assignment of {studentname}").t("assess_assignment_of_student", {
          studentname: detail.student_name ?? d("Student").t("schedule_time_conflict_student"),
        })}
      />
      <Typography variant="h5">{d("Teacher Assessment").t("assess_teacher_assessment")}</Typography>
      <Controller
        name="assess_score"
        control={control}
        defaultValue={detail.assess_score}
        key={`assess_score:${detail.assess_score}`}
        render={({ value, onChange }) => (
          <ScoreInput
            optionNames={[
              d("Poor").t("assess_score_poor"),
              d("Fair").t("assess_score_fair"),
              d("Average").t("assess_score_average"),
              d("Good").t("assess_score_good"),
              d("Excellent").t("assess_score_excellent"),
            ]}
            optionValues={[1, 2, 3, 4, 5]}
            optionColors={["#d32f2f", "#DC6F17", "#FFC107", "#A1CC41", "#4CAF50"]}
            optionIcons={[
              SentimentVeryDissatisfiedOutlined,
              SentimentVeryDissatisfiedOutlined,
              SentimentSatisfied,
              SentimentSatisfiedOutlined,
              SentimentVerySatisfiedOutlined,
            ]}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        )}
      />
      <Controller
        as={TextField}
        name="assess_comment"
        control={control}
        defaultValue={detail.assess_comment}
        key={`assess_comment:${detail.assess_comment}`}
        placeholder={d("Leave a comment here").t("assess_leave_a_comment_here")}
        multiline
        className={css.comment}
        fullWidth
        inputProps={{ className: css.commentInput, maxLength: 100 }}
      />
      <AssignmentTable feedbacks={feedbacks.slice(1)} title={d("Submission History").t("assess_submission_history")} />
    </div>
  );
}
