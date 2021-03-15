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
  optionValues: string[];
  value?: string;
  onChange?: RadioGroupProps["onChange"];
}
function ScoreInput(props: ScoreInputProps) {
  const css = useStyle();
  const { optionColors, optionNames, optionIcons, optionValues, value, onChange } = props;
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
      <RadioGroup row defaultValue={value} onChange={onChange}>
        {radioList}
      </RadioGroup>
    </FormControl>
  );
}

interface AssignmentDownloadRowProps {
  name: string;
  url: string;
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

interface AssignmentTableProps {}
function AssignmentTable(props: AssignmentTableProps) {
  const css = useStyle();
  return (
    <div className={css.assignmentTableContainer}>
      <Typography variant="h5">Assignment of Student 1</Typography>
      <Table className={css.assignmentTable}>
        <TableHead className={css.assignmentTableHeader}>
          <TableRow>
            <TableCell align="center" className={css.assignmentTableHeaderItem} width="40%">
              Assignment Uploaded
            </TableCell>
            <TableCell align="center" className={css.assignmentTableHeaderItem} width="35%">
              Comment
            </TableCell>
            <TableCell align="center" className={css.assignmentTableHeaderItem} width="25%">
              Submit Time
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center" className={css.assignmentTableBodyItem}>
              <AssignmentDownloadRow name="Assignment 1.svg" url="https://hub-test.kidsloop.cn/97ece66af51f6ea324b8256e0d370b68.svg" />
              <AssignmentDownloadRow name="Assignment 1.svg" url="https://hub-test.kidsloop.cn/97ece66af51f6ea324b8256e0d370b68.svg" />
              <AssignmentDownloadRow name="Assignment 1.svg" url="https://hub-test.kidsloop.cn/97ece66af51f6ea324b8256e0d370b68.svg" />
            </TableCell>
            <TableCell align="center" className={css.assignmentTableBodyItem}>
              <Typography align="justify" variant="body1">
                They are grilling celebrities in their own right. You’ve seen them on TV and you see their cookbooks lined along the shelves
                of your local bookstore. They may have different backgrounds and a variety of cooking styles, but just like you
              </Typography>
            </TableCell>
            <TableCell align="center" className={css.assignmentTableBodyItem}>
              2020/07/20 10:51AM
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" className={css.assignmentTableBodyItem}>
              <AssignmentDownloadRow name="Assignment 1.svg" url="https://hub-test.kidsloop.cn/97ece66af51f6ea324b8256e0d370b68.svg" />
              <AssignmentDownloadRow name="Assignment 1.svg" url="https://hub-test.kidsloop.cn/97ece66af51f6ea324b8256e0d370b68.svg" />
              <AssignmentDownloadRow name="Assignment 1.svg" url="https://hub-test.kidsloop.cn/97ece66af51f6ea324b8256e0d370b68.svg" />
            </TableCell>
            <TableCell align="center" className={css.assignmentTableBodyItem}>
              <Typography align="justify" variant="body1">
                They are grilling celebrities in their own right. You’ve seen them on TV and you see their cookbooks lined along the shelves
                of your local bookstore. They may have different backgrounds and a variety of cooking styles, but just like you
              </Typography>
            </TableCell>
            <TableCell align="center" className={css.assignmentTableBodyItem}>
              2020/07/20 10:51AM
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

interface AssignmentProps {}

export function Assignment(props: AssignmentProps) {
  const css = useStyle();
  return (
    <div className={css.assignment}>
      <AssignmentTable />
      <Typography variant="h5">Teacher Assessment</Typography>
      <ScoreInput
        optionNames={["Poor", "Fair", "Average", "Good", "Excellent"]}
        optionValues={["Poor", "Fair", "Average", "Good", "Excellent"]}
        optionColors={["#d32f2f", "#DC6F17", "#FFC107", "#A1CC41", "#4CAF50"]}
        optionIcons={[
          SentimentVeryDissatisfiedOutlined,
          SentimentVeryDissatisfiedOutlined,
          SentimentSatisfied,
          SentimentSatisfiedOutlined,
          SentimentVerySatisfiedOutlined,
        ]}
        value="Average"
      />
      <TextField
        placeholder="Leave a comment here."
        multiline
        className={css.comment}
        fullWidth
        inputProps={{ className: css.commentInput, maxLength: 300 }}
      />
      <AssignmentTable />
    </div>
  );
}
