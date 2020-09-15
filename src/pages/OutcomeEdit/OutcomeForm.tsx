import {
  Box,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  SelectProps,
  TextField,
  TextFieldProps,
} from "@material-ui/core";
import React from "react";
import { MockOptionsItem } from "../../api/extra";

const useStyles = makeStyles(() => ({
  outcomings_container: {
    width: "100%",
    // padding: "70px 22%",
    boxSizing: "border-box",
  },
  marginItem: {
    marginBottom: "40px",
  },
  middleBox: {
    padding: "50px 20%",
  },
  checkBox: {
    width: "100%",
    border: "1px solid #bbb",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "flex-end",
    position: "relative",
  },
  checkLabel: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    margin: 0,
    padding: 0,
    color: "rgba(0, 0, 0, 0.8)",
  },
}));

export interface OutcomeFormProps {
  mockOptions: any;
  outcome_id: string;
  finalData: any;
  setFinalData: any;
  handleInputChange: (name: string, event: React.ChangeEvent<{ value: any }>) => void;
  handleMultipleChange: (name: string, event: Parameters<NonNullable<SelectProps["onChange"]>>[0]) => void;
  handleKeywordsChange: TextFieldProps["onChange"];
  getKeywords: (keywords: string[] | undefined) => void;
  showCode: boolean;
  showEdit: boolean;
  isError: boolean;
}

export function OutcomeForm(props: OutcomeFormProps) {
  const {
    mockOptions,
    outcome_id,
    finalData,
    handleInputChange,
    handleMultipleChange,
    handleKeywordsChange,
    showCode,
    showEdit,
    isError,
  } = props;
  const classes = useStyles();

  const getItems = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));

  const timestampToTime = (timestamp: number | undefined, type: string = "default") => {
    const date = new Date(Number(timestamp) * 1000);
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
    const [Y, M, D, h, m] = [
      date.getFullYear(),
      dateNumFun(date.getMonth() + 1),
      dateNumFun(date.getDate()),
      dateNumFun(date.getHours()),
      dateNumFun(date.getMinutes()),
      dateNumFun(date.getSeconds()),
    ];
    return `${Y}-${M}-${D} ${h}:${m}`;
  };

  return (
    <Box className={classes.outcomings_container}>
      <div className={classes.middleBox}>
        <Box style={{ borderBottom: "1px solid #d7d7d7", marginBottom: "40px" }}>
          {finalData.publish_status && finalData.publish_status === "rejected" && (
            <Grid container>
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                <TextField
                  size="small"
                  defaultValue={finalData.reject_reason}
                  fullWidth
                  label="Reject Reason"
                  disabled
                  onChange={(event) => handleInputChange("reject_reason", event)}
                />
              </Grid>
            </Grid>
          )}
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <TextField
                size="small"
                value={finalData.outcome_name}
                fullWidth
                label="Learning outcome Name"
                onChange={(event) => handleInputChange("outcome_name", event)}
                required
                error={isError}
                disabled={showEdit}
              />
            </Grid>
            {(outcome_id || showCode) && (
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                <TextField size="small" value={finalData.shortcode} fullWidth label="Short Code" disabled />
              </Grid>
            )}
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={`${classes.checkBox} ${classes.marginItem}`}>
              <Checkbox
                checked={finalData.assumed || false}
                onChange={(event) => handleInputChange("assumed", event)}
                disabled={showEdit}
              />
              <p className={classes.checkLabel}>Assumed</p>
            </Grid>
            {(outcome_id || showCode) && (
              <>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <TextField value={finalData.organization_id} fullWidth label="Organization" disabled size="small" />
                </Grid>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <TextField fullWidth value={timestampToTime(finalData.created_at)} disabled label="Create Time" size="small" />
                </Grid>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <TextField value={finalData.author_name} fullWidth size="small" disabled label="Author" />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
        <Box style={{ paddingBottom: "10px", borderBottom: "1px solid #d7d7d7" }}>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Program</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.program?.map((item: any) => item.program_id)}
                  onChange={(event) => handleMultipleChange("program", event)}
                  label="Program"
                  disabled={showEdit}
                >
                  {getItems(mockOptions.program)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Subject</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.subject?.map((item: any) => item.subject_id)}
                  onChange={(event) => handleMultipleChange("subject", event)}
                  label="Subject"
                  disabled={showEdit}
                >
                  {getItems(mockOptions.subject)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Developmental</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.developmental?.map((item: any) => item.developmental_id)}
                  onChange={(event) => handleMultipleChange("developmental", event)}
                  label="Developmental"
                  disabled={showEdit}
                >
                  {getItems(mockOptions.developmental)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Skills</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.skills?.map((item: any) => item.skill_id)}
                  onChange={(event) => handleMultipleChange("skills", event)}
                  label="Skills"
                  disabled={showEdit}
                >
                  {getItems(mockOptions.skills)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Age</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.age?.map((item: any) => item.age_id)}
                  onChange={(event) => handleMultipleChange("age", event)}
                  label="Age"
                  disabled={showEdit}
                >
                  {getItems(mockOptions.age)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-mutiple-name-label">Grade</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  multiple
                  value={finalData.grade?.map((item: any) => item.grade_id)}
                  onChange={(event) => handleMultipleChange("grade", event)}
                  label="Grade"
                  disabled={showEdit}
                >
                  {getItems(mockOptions.grade)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container justify="space-between" style={{ marginTop: "40px" }}>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <TextField
                size="small"
                fullWidth
                value={finalData.estimated_time}
                label="Estimated time"
                onChange={(event) => handleInputChange("estimated_time", event)}
                disabled={showEdit}
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <TextField
                value={finalData.keywords.map((item: any) => item)}
                onChange={handleKeywordsChange}
                size="small"
                fullWidth
                label="Keywords"
                disabled={showEdit}
              />
            </Grid>
          </Grid>
          <Grid container justify="space-between" className={classes.marginItem}>
            <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
              <TextField
                size="small"
                value={finalData.description || ""}
                fullWidth
                label="Description"
                onChange={(event) => handleInputChange("description", event)}
                disabled={showEdit}
              />
            </Grid>
          </Grid>
        </Box>
      </div>
    </Box>
  );
}