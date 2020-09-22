import { Box, Checkbox, CheckboxProps, Grid, makeStyles, MenuItem, TextField } from "@material-ui/core";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { ApiOutcomeView } from "../../api/api.auto";
import { MockOptionsItem } from "../../api/extra";
import { decodeArray, decodeOneItemArray, encodeOneItemArray, FormattedTextField } from "../../components/FormattedTextField";
import { d } from "../../locale/LocaleManager";
import { FlattenedMockOptions } from "../../models/ModelMockOptions";

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
  },
}));

export interface OutcomeFormProps {
  flattenedMockOptions: FlattenedMockOptions;
  outcome_id: string;
  showEdit: boolean;
  formMethods: UseFormMethods<any>;
  outcomeDetail: ApiOutcomeView;
  onChangeProgram: (value: NonNullable<string[]>) => any;
  onChangeDevelopmental: (value: NonNullable<string[]>) => any;
  handleCheckBoxChange: CheckboxProps["onChange"];
  isAssumed: boolean;
}

export function OutcomeForm(props: OutcomeFormProps) {
  const {
    outcome_id,
    showEdit,
    formMethods: { control, errors },
    outcomeDetail,
    flattenedMockOptions,
    onChangeProgram,
    onChangeDevelopmental,
    handleCheckBoxChange,
    isAssumed,
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

  // console.log(isAssumed)

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
                  label={d("Reason").t("assess_label_reason")}
                  disabled
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
                label={d("Learning Outcome Name").t("assess_label_learning_outcome_name")}
                disabled={showEdit}
                defaultValue={outcome_id ? outcomeDetail.outcome_name : ""}
                rules={{ required: true }}
                error={errors.outcome_name ? true : false}
              />
            </Grid>
            {outcome_id && (
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                <Controller
                  name="shortcode"
                  as={TextField}
                  control={control}
                  defaultValue={outcomeDetail.shortcode}
                  fullWidth
                  label={d("Short Code").t("assess_label_short_code")}
                  disabled
                />
              </Grid>
            )}
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={`${classes.checkBox} ${classes.marginItem}`}>
              <Controller
                name="assumed"
                control={control}
                // as={Checkbox}
                // defaultChecked={outcomeDetail.assumed}
                disabled={showEdit}
                render={() => <Checkbox checked={isAssumed} disabled={showEdit} onChange={handleCheckBoxChange} />}
              />
              <p className={classes.checkLabel} style={{ color: showEdit ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.8)" }}>
                {d("Assumed").t("assess_label_assumed")}
              </p>
            </Grid>
            {outcome_id && (
              <>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <Controller
                    name="organization_id"
                    control={control}
                    as={TextField}
                    defaultValue={outcomeDetail.organization_id}
                    fullWidth
                    label={d("Organization").t("assess_label_organization")}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <Controller
                    name="created_at"
                    control={control}
                    // as={TextField}
                    defaultValue={timestampToTime(outcomeDetail.created_at)}
                    fullWidth
                    label={d("Created On").t("assess_label_created_on")}
                    disabled
                    size="small"
                    render={() => (
                      <TextField value={timestampToTime(outcomeDetail.created_at)} fullWidth label="Create Time" disabled size="small" />
                    )}
                  />
                </Grid>
                <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                  <Controller
                    name="author_name"
                    control={control}
                    as={TextField}
                    defaultValue={outcomeDetail.author_name}
                    fullWidth
                    label={d("Author").t("assess_label_author")}
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
                name="program"
                defaultValue={outcomeDetail.program}
                control={control}
                render={(props) => (
                  <FormattedTextField
                    select
                    label={d("Program").t("assess_label_program")}
                    encode={encodeOneItemArray}
                    decode={decodeOneItemArray}
                    {...props}
                    onChange={(value: ReturnType<typeof decodeOneItemArray>) => {
                      onChangeProgram(value);
                      props.onChange(value);
                    }}
                    required
                    fullWidth
                    disabled={showEdit}
                  >
                    {getItems(flattenedMockOptions.program)}
                  </FormattedTextField>
                )}
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label={d("Subject").t("assess_label_subject")}
                name="subject"
                defaultValue={outcome_id ? outcomeDetail.subject : []}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {getItems(flattenedMockOptions.subject)}
              </Controller>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="developmental"
                defaultValue={outcomeDetail.developmental}
                control={control}
                render={(props) => (
                  <FormattedTextField
                    select
                    label={"Category"}
                    encode={encodeOneItemArray}
                    decode={decodeOneItemArray}
                    {...props}
                    onChange={(value: ReturnType<typeof decodeOneItemArray>) => {
                      onChangeDevelopmental(value);
                      props.onChange(value);
                    }}
                    fullWidth
                    required
                    disabled={showEdit}
                  >
                    {getItems(flattenedMockOptions.developmental)}
                  </FormattedTextField>
                )}
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label={"Subcategory"}
                name="skills"
                defaultValue={outcome_id ? outcomeDetail.skills : []}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {getItems(flattenedMockOptions.skills)}
              </Controller>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label={d("Age").t("assess_label_age")}
                name="age"
                defaultValue={outcome_id ? outcomeDetail.age : []}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {getItems(flattenedMockOptions.age)}
              </Controller>
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label={d("Grade").t("assess_label_grade")}
                name="grade"
                defaultValue={outcome_id ? outcomeDetail.grade : []}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {getItems(flattenedMockOptions.grade)}
              </Controller>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container justify="space-between" style={{ marginTop: "40px" }}>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={FormattedTextField}
                control={control}
                name="estimated_time"
                decode={Number}
                type="number"
                label={d("Estimated Time(Minutes)").t("assess_label_estimated_time")}
                defaultValue={outcome_id ? outcomeDetail.estimated_time : 0}
                fullWidth
                disabled={showEdit}
                // rules={{ pattern: /^[0-9]*$ / }}
                // error={errors.estimated_time ? true : false}
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={FormattedTextField}
                control={control}
                name="keywords"
                decode={decodeArray}
                defaultValue={outcome_id ? outcomeDetail.keywords : []}
                label={d("Keywords").t("assess_label_keywords")}
                helperText=""
                fullWidth
                disabled={showEdit}
              />
            </Grid>
          </Grid>
          <Grid container justify="space-between" className={classes.marginItem}>
            <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
              <Controller
                name="description"
                as={TextField}
                control={control}
                defaultValue={outcome_id ? outcomeDetail.description : ""}
                label={d("Description").t("assess_label_description")}
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
