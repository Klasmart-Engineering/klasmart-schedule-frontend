import { Box, Checkbox, Grid, makeStyles, MenuItem, SelectProps, TextField, TextFieldProps } from "@material-ui/core";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { LearningOutcomes } from "../../api/api";
import { decodeArray, FormattedTextField } from "../../components/FormattedTextField";

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
  handleInputChange: (name: string, event: React.ChangeEvent<{ value: any }>) => void;
  handleMultipleChange: (name: string, event: Parameters<NonNullable<SelectProps["onChange"]>>[0]) => void;
  handleKeywordsChange: TextFieldProps["onChange"];
  getKeywords: (keywords: string[] | undefined) => void;
  showCode: boolean;
  showEdit: boolean;
  isError: boolean;
  formMethods: UseFormMethods<any>;
  outcomeDetail: LearningOutcomes;
}

export function OutcomeForm(props: OutcomeFormProps) {
  const {
    outcome_id,
    showCode,
    showEdit,
    formMethods: { control, errors },
    outcomeDetail,
  } = props;
  const classes = useStyles();

  // const getItems = (list: MockOptionsItem[]) =>
  //   list.map((item) => (
  //     <MenuItem key={item.id} value={item.id}>
  //       {item.name}
  //     </MenuItem>
  //   ));

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
          {outcomeDetail.publish_status && outcomeDetail.publish_status === "rejected" && (
            <Grid container>
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                <Controller
                  name="reject_reason"
                  control={control}
                  as={TextField}
                  defaultValue={outcomeDetail.reject_reason}
                  fullWidth
                  label="Reject Reason"
                />
              </Grid>
            </Grid>
          )}
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="outcome_name"
                as={TextField}
                control={control}
                fullWidth
                label="Learning outcome Name"
                disabled={showEdit}
                defaultValue={outcomeDetail.outcome_name}
                rules={{ required: true }}
                error={errors.outcome_name ? true : false}
              />
            </Grid>
            {(outcome_id || showCode) && (
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                {/* <TextField size="small" value={outcomeDetail.shortcode} fullWidth label="Short Code" disabled /> */}
                <Controller
                  name="shortcode"
                  as={TextField}
                  control={control}
                  defaultValue={outcomeDetail.shortcode}
                  fullWidth
                  label="Short Code"
                  disabled
                />
              </Grid>
            )}
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={`${classes.checkBox} ${classes.marginItem}`}>
              <Controller
                name="assumed"
                control={control}
                as={Checkbox}
                defaultChecked={outcomeDetail.assumed}
                disabled={showEdit}
                // render={() => <Checkbox
                //   defaultChecked={outcomeDetail.assumed}
                //   disabled={showEdit}
                //   onChange={(event) => {
                //     setValue('assumed', event.target.checked)
                //   }}
                // />}
              />
              <p className={classes.checkLabel}>Assumed</p>
            </Grid>
            {(outcome_id || showCode) && (
              <>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  {/* <TextField value={outcomeDetail.organization_id} fullWidth label="Organization" disabled size="small" /> */}
                  <Controller
                    name="organization_id"
                    control={control}
                    as={TextField}
                    defaultValue={outcomeDetail.organization_id}
                    fullWidth
                    label="Organization"
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  {/* <TextField fullWidth value={timestampToTime(outcomeDetail.created_at)} disabled label="Create Time" size="small" /> */}
                  <Controller
                    name="created_at"
                    control={control}
                    // as={TextField}
                    defaultValue={timestampToTime(outcomeDetail.created_at)}
                    fullWidth
                    label="Create Time"
                    disabled
                    size="small"
                    render={() => (
                      <TextField value={timestampToTime(outcomeDetail.created_at)} fullWidth label="Create Time" disabled size="small" />
                    )}
                  />
                </Grid>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  {/* <TextField value={outcomeDetail.author_name} fullWidth size="small" disabled label="Author" /> */}
                  <Controller
                    name="author_name"
                    control={control}
                    as={TextField}
                    defaultValue={outcomeDetail.author_name}
                    fullWidth
                    label="Author"
                    disabled
                    size="small"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
        <Box style={{ paddingBottom: "10px", borderBottom: "1px solid #d7d7d7" }}>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label="Program"
                name="program"
                defaultValue={outcomeDetail.program}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {/* {getItems(mockOptions.program)} */}
                <MenuItem value={0}>{"first"}</MenuItem>
              </Controller>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label="Subject"
                name="subject"
                defaultValue={outcomeDetail.subject}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {/* {getItems(mockOptions.subject)} */}
                <MenuItem value={0}>{"first"}</MenuItem>
              </Controller>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label="Developmental"
                name="developmental"
                defaultValue={outcomeDetail.developmental}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {/* {getItems(mockOptions.developmental)} */}
                <MenuItem value={0}>{"first"}</MenuItem>
              </Controller>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label="skills"
                name="skills"
                defaultValue={outcomeDetail.skills}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {/* {getItems(mockOptions.skills)} */}
                <MenuItem value={0}>{"first"}</MenuItem>
              </Controller>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label="Age"
                name="age"
                defaultValue={outcomeDetail.age}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {/* {getItems(mockOptions.age)} */}
                <MenuItem value={0}>{"first"}</MenuItem>
              </Controller>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label="Grade"
                name="grade"
                defaultValue={outcomeDetail.grade}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {/* {getItems(mockOptions.grade)} */}
                <MenuItem value={0}>{"first"}</MenuItem>
              </Controller>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container justify="space-between" style={{ marginTop: "40px" }}>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              {/* <Controller
                name="estimated_time"
                as={TextField}
                control={control}
                defaultValue={outcomeDetail.estimated_time}
                label="Estimated time"
                disabled={showEdit}
                fullWidth
                size="small"
                rules={{pattern: /^[0-9]*$/}}
                error={errors.estimated_time}
              /> */}
              <Controller
                as={FormattedTextField}
                control={control}
                name="estimated_time"
                decode={Number}
                type="number"
                label="Estimated time"
                defaultValue={outcomeDetail.estimated_time}
                fullWidth
                rules={{ pattern: /^[0-9]*$ / }}
                error={errors.estimated_time ? true : false}
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              {/* <Controller
                name="keywords"
                as={TextField}
                control={control}
                defaultValue={[""]}
                label="Keywords"
                disabled={showEdit}
                fullWidth
                size="small"
              /> */}
              <Controller
                as={FormattedTextField}
                control={control}
                name="keywords"
                decode={decodeArray}
                defaultValue={outcomeDetail.keywords}
                label="Keywords"
                helperText=""
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container justify="space-between" className={classes.marginItem}>
            <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
              <Controller
                name="description"
                as={TextField}
                control={control}
                defaultValue={outcomeDetail.description}
                label="Description"
                disabled={showEdit}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
      </div>
    </Box>
  );
}
