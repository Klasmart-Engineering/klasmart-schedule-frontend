import { Box, Checkbox, CheckboxProps, Chip, Grid, InputAdornment, makeStyles, MenuItem, TextField } from "@material-ui/core";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import React, { useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { ApiOutcomeSetCreateView, ApiOutcomeView, ApiPullOutcomeSetResponse } from "../../api/api.auto";
import { decodeArray, decodeOneItemArray, encodeOneItemArray, FormattedTextField } from "../../components/FormattedTextField";
import { OutcomeSet } from "../../components/OutSet";
import { d } from "../../locale/LocaleManager";
import { LinkedMockOptionsItem } from "../../reducers/content";
import { ResultGetNewOptions } from "../../reducers/outcome";

const useStyles = makeStyles((theme) => ({
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
  chip: {
    borderRadius: "4px",
    fontSize: 16,
    margin: theme.spacing(0.5),
  },
  outcomesetCon: {
    "& .MuiInputAdornment-root": {
      display: "flex",
      flexWrap: "wrap",
      height: "auto",
      maxHeight: "fit-content",
      padding: "8px 0",
    },
    "& .MuiInputBase-input": {
      width: 0,
    },
  },
}));

export interface OutcomeFormProps {
  outcome_id: string;
  showEdit: boolean;
  formMethods: UseFormMethods<any>;
  outcomeDetail: ApiOutcomeView;
  onChangeProgram: (value: NonNullable<string[]>) => any;
  onChangeDevelopmental: (value: NonNullable<string[]>) => any;
  onChangeSubject: (value: string[]) => any;
  handleCheckBoxChange: CheckboxProps["onChange"];
  isAssumed: boolean;
  newOptions: ResultGetNewOptions;
  showSetList: boolean;
  onSearchOutcomeSet: (set_name: string) => any;
  onCreateOutcomeSet: (set_name: string) => any;
  onSetOutcomeSet: (ids: string[]) => any;
  selectedOutcomeSet: ApiOutcomeSetCreateView[];
  outcomeSetList: ApiPullOutcomeSetResponse["sets"];
  onDeleteSet: (set_id: string) => any;
  defaultSelectOutcomeset: string;
  shortCode: string;
  onInputChange: () => any;
}

export function OutcomeForm(props: OutcomeFormProps) {
  const {
    outcome_id,
    showEdit,
    formMethods: { control, errors },
    outcomeDetail,
    onChangeProgram,
    onChangeDevelopmental,
    handleCheckBoxChange,
    onChangeSubject,
    isAssumed,
    newOptions,
    showSetList,
    onSearchOutcomeSet,
    onCreateOutcomeSet,
    onSetOutcomeSet,
    selectedOutcomeSet,
    outcomeSetList,
    onDeleteSet,
    defaultSelectOutcomeset,
    shortCode,
    onInputChange,
  } = props;
  const classes = useStyles();
  const getItems = (list: LinkedMockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  const sets = useMemo(() => {
    if (outcomeDetail && outcomeDetail.sets && outcomeDetail.sets.length) {
      return outcomeDetail.sets.map((set) => set.set_name).join(";");
    } else {
      return "";
    }
  }, [outcomeDetail]);
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
  const shortCodeValidate = (value: string) => {
    const re = /^[0-9A-Z]+$/;
    const newValue = value.trim();
    if (newValue.length < 5 || !re.test(newValue)) return false;
  };
  const handleDelete = (set_id: string) => {
    onDeleteSet(set_id);
  };
  return (
    <Box className={classes.outcomings_container}>
      <div className={classes.middleBox}>
        <Box style={{ borderBottom: "1px solid #d7d7d7", marginBottom: "40px" }}>
          {outcomeDetail.publish_status && outcomeDetail.publish_status === "rejected" && outcome_id && (
            <Grid container>
              <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
                <Controller
                  name="reject_reason"
                  control={control}
                  multiline
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
            {/* {outcome_id && ( */}
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                name="shortcode"
                as={TextField}
                control={control}
                defaultValue={outcomeDetail.shortcode ? outcomeDetail.shortcode : shortCode}
                fullWidth
                label={d("Short Code").t("assess_label_short_code")}
                disabled={showEdit}
                inputProps={{ maxLength: 5 }}
                error={!!errors["shortcode"]}
                rules={{ validate: shortCodeValidate }}
                helperText={d("The short code needs to be five characters long, 0-9, A-Z.").t("assess_msg_short_code_error")}
              />
            </Grid>
            {/* )} */}
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
                    name="organization_name"
                    control={control}
                    as={TextField}
                    defaultValue={outcomeDetail.organization_name}
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
                    defaultValue={timestampToTime(outcomeDetail.update_at)}
                    fullWidth
                    // label={d("Created On").t("assess_label_created_on")}
                    disabled
                    size="small"
                    render={() => (
                      <TextField
                        value={timestampToTime(outcomeDetail.update_at)}
                        fullWidth
                        label={d("Created On").t("assess_label_created_on")}
                        disabled
                        size="small"
                      />
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
                    {getItems(newOptions.program)}
                  </FormattedTextField>
                )}
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              {/* <Controller
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
                {getItems(newOptions.subject)}
              </Controller> */}
              <Controller
                name="subject"
                defaultValue={outcome_id ? outcomeDetail.subject : []}
                control={control}
                render={(props) => (
                  <TextField
                    select
                    label={d("Subject").t("assess_label_subject")}
                    {...props}
                    onChange={(e) => {
                      const value = (e.target.value as unknown) as string[];
                      value.length > 0 && onChangeSubject(value);
                      value.length > 0 && props.onChange(value);
                    }}
                    fullWidth
                    disabled={showEdit}
                    SelectProps={{ multiple: true }}
                    required
                  >
                    {getItems(newOptions.subject)}
                  </TextField>
                )}
              />
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
                    label={d("Category").t("library_label_category")}
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
                    {getItems(newOptions.developmental)}
                  </FormattedTextField>
                )}
              />
            </Grid>
            <Grid item lg={5} xl={5} md={5} sm={12} xs={12} className={classes.marginItem}>
              <Controller
                as={TextField}
                select
                SelectProps={{ multiple: true }}
                label={d("Subcategory").t("library_label_subcategory")}
                name="skills"
                defaultValue={outcome_id ? outcomeDetail.skills : []}
                control={control}
                disabled={showEdit}
                fullWidth
              >
                {getItems(newOptions.skills)}
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
                {getItems(newOptions.age)}
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
                {getItems(newOptions.grade)}
              </Controller>
            </Grid>
          </Grid>
          <Grid container justify="space-between" className={classes.marginItem}>
            <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
              {showEdit && (
                <TextField
                  label={d("Learning Outcome Set").t("assess_set_learning_outcome_set")}
                  fullWidth
                  disabled
                  variant="outlined"
                  multiline
                  value={sets}
                />
              )}
              {!showEdit && (
                <Controller
                  name="sets"
                  control={control}
                  defaultValue={selectedOutcomeSet.length ? selectedOutcomeSet : []}
                  disabled={showEdit}
                  fullWidth
                  multiline
                  render={() => (
                    <TextField
                      fullWidth
                      disabled={showEdit}
                      className={classes.outcomesetCon}
                      label={d("Learning Outcome Set").t("assess_set_learning_outcome_set")}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            {selectedOutcomeSet.map((item) => (
                              <Chip
                                className={classes.chip}
                                deleteIcon={<ClearRoundedIcon />}
                                key={item.set_id}
                                label={item.set_name}
                                onDelete={(e) => handleDelete(item.set_id as string)}
                              />
                            ))}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              )}
            </Grid>
          </Grid>
          {!showEdit && (
            <Grid container justify="space-between" className={classes.marginItem}>
              <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
                <OutcomeSet
                  title={d("Add more sets").t("assess_set_add_more_sets")}
                  showSetList={showSetList}
                  onSearchOutcomeSet={onSearchOutcomeSet}
                  onCreateOutcomeSet={onCreateOutcomeSet}
                  onSetOutcomeSet={(ids) => onSetOutcomeSet(ids)}
                  selectedOutcomeSet={selectedOutcomeSet}
                  outcomeSetList={outcomeSetList}
                  onDeleteSet={handleDelete}
                  defaultSelectOutcomeset={defaultSelectOutcomeset}
                  onInputChange={onInputChange}
                />
              </Grid>
            </Grid>
          )}
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
                label={d("Estimated Time (Minutes)").t("assess_label_estimated_time")}
                defaultValue={outcome_id ? outcomeDetail.estimated_time : 0}
                fullWidth
                disabled={showEdit}
                inputProps={{ min: 0 }}
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
                multiline
              />
            </Grid>
          </Grid>
        </Box>
      </div>
    </Box>
  );
}
