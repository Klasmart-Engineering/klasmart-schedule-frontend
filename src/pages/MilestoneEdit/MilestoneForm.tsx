import { Box, Grid, makeStyles, MenuItem, TextField } from "@material-ui/core";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { MilestoneDetailResult } from "../../api/type";
import { decodeOneItemArray, encodeOneItemArray, FormattedTextField, frontTrim } from "../../components/FormattedTextField";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { CreateDefaultValueAndKeyResult } from "../../models/ModelMilestone";
import { LinkedMockOptions, LinkedMockOptionsItem } from "../../reducers/milestone";
import { GENERALMILESTONE } from "../MilestoneList/MilestoneTable";
const useStyles = makeStyles(({ palette }) => ({
  fieldset: {
    marginTop: 32,
    "& .MuiInputBase-input": {
      color: "rgba(0,0,0,1)",
    },
  },
}));

export interface MilestoneFormProps {
  initDefaultValue: CreateDefaultValueAndKeyResult;
  formMethods: UseFormMethods<MilestoneDetailResult>;
  milestoneDetail: MilestoneDetailResult;
  linkedMockOptions: LinkedMockOptions;
  onChangeProgram: (value: string[]) => any;
  onChangeSubject: (value: string[]) => any;
  onChangeCategory: (value: string[]) => any;
  milestone_id: string | null;
  shortCode?: string;
  canEdit: boolean;
}
export default function MilestoneForm(props: MilestoneFormProps) {
  // const { breakpoints } = useTheme();
  // const sm = useMediaQuery(breakpoints.down("sm"));
  const css = useStyles();
  const {
    formMethods: { control, errors },
    milestoneDetail,
    linkedMockOptions,
    onChangeProgram,
    onChangeSubject,
    onChangeCategory,
    milestone_id,
    shortCode,
    canEdit,
    initDefaultValue,
  } = props;
  const isGeneralMilestone = milestoneDetail.type === GENERALMILESTONE;
  const shortCodeValidate = (value: string) => {
    const re = /^[0-9A-Z]+$/;
    const newValue = value.trim();
    if (newValue.length < 5 || !re.test(newValue)) return false;
  };
  const menuItemList = (list?: LinkedMockOptionsItem[]) =>
    list &&
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  return (
    <Box component="form" p="4.5% 8.5%">
      <Controller
        as={FormattedTextField}
        control={control}
        name="milestone_name"
        label={d("Milestone Name").t("assess_milestone_detail_name")}
        required
        fullWidth
        multiline
        rowsMax={3}
        encode={frontTrim}
        decode={frontTrim}
        defaultValue={initDefaultValue.milestone_name?.value}
        key={initDefaultValue.milestone_name?.key}
        rules={{
          required: true,
        }}
        InputProps={{
          style: { color: "rgba(0,0,0,1)" },
        }}
        inputProps={{ maxLength: 200 }}
        error={errors.milestone_name ? true : false}
        disabled={!canEdit}
      />
      {isGeneralMilestone ? (
        <TextField
          label={d("Short Code").t("assess_label_short_code")}
          fullWidth
          className={css.fieldset}
          disabled
          variant="outlined"
          InputProps={{
            readOnly: true,
            style: { color: "rgba(0,0,0,1)" },
          }}
          value={d("N/A").t("assess_column_n_a")}
        />
      ) : (
        <Controller
          name="shortcode"
          as={TextField}
          control={control}
          defaultValue={milestone_id ? initDefaultValue.shortcode?.value : shortCode}
          key={milestone_id ? initDefaultValue.shortcode?.key : shortCode}
          fullWidth
          className={css.fieldset}
          disabled={!canEdit}
          label={d("Short Code").t("assess_label_short_code")}
          inputProps={{ maxLength: 5 }}
          error={!!errors["shortcode"]}
          rules={{ validate: shortCodeValidate }}
          helperText={d("5 characters long, number 0-9 & letter A-Z only").t("assess_milestone_code_requirement")}
        />
      )}
      {milestone_id && (
        <>
          <TextField
            label={d("Organization").t("assess_label_organization")}
            fullWidth
            className={css.fieldset}
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={milestoneDetail.organization?.organization_name || ""}
          />
          <TextField
            label={d("Created On").t("assess_label_created_on")}
            fullWidth
            className={css.fieldset}
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={formattedTime(milestoneDetail.create_at)}
          />
          <TextField
            label={d("Author").t("assess_label_author")}
            fullWidth
            className={css.fieldset}
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={isGeneralMilestone ? d("N/A").t("assess_column_n_a") : milestoneDetail.author?.author_name || ""}
          />
        </>
      )}
      {isGeneralMilestone ? (
        <TextField
          label={d("Program").t("assess_label_program")}
          fullWidth
          className={css.fieldset}
          disabled
          variant="outlined"
          InputProps={{
            readOnly: true,
            style: { color: "rgba(0,0,0,1)" },
          }}
          value={"None Specified"}
        />
      ) : (
        <Controller
          name={"program_ids"}
          defaultValue={initDefaultValue.program?.value || []}
          key={initDefaultValue.program?.key}
          control={control}
          rules={{
            validate: (value) => value.length > 0,
          }}
          render={(props) => (
            <FormattedTextField
              select
              error={errors.program_ids ? true : false}
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
              className={css.fieldset}
              disabled={!canEdit}
            >
              {menuItemList(linkedMockOptions.program)}
            </FormattedTextField>
          )}
        />
      )}
      {isGeneralMilestone ? (
        <TextField
          label={d("Subject").t("assess_label_subject")}
          fullWidth
          className={css.fieldset}
          disabled
          variant="outlined"
          InputProps={{
            readOnly: true,
            style: { color: "rgba(0,0,0,1)" },
          }}
          value={"None Specified"}
        />
      ) : (
        <Controller
          name={"subject_ids"}
          defaultValue={initDefaultValue.subject?.value || []}
          key={initDefaultValue.subject?.key}
          control={control}
          rules={{
            validate: (value) => value.length > 0,
          }}
          render={(props) => (
            <TextField
              select
              error={errors.subject_ids ? true : false}
              label={d("Subject").t("assess_label_subject")}
              {...props}
              onChange={(e) => {
                const value = (e.target.value as unknown) as string[];
                value.length > 0 && onChangeSubject(value);
                value.length > 0 && props.onChange(value);
              }}
              fullWidth
              className={css.fieldset}
              SelectProps={{ multiple: true }}
              required
              disabled={!canEdit}
            >
              {menuItemList(linkedMockOptions.subject)}
            </TextField>
          )}
        />
      )}
      {isGeneralMilestone ? (
        <TextField
          label={d("Category").t("library_label_category")}
          fullWidth
          className={css.fieldset}
          disabled
          variant="outlined"
          InputProps={{
            readOnly: true,
            style: { color: "rgba(0,0,0,1)" },
          }}
          value={"None Specified"}
        />
      ) : (
        <Controller
          name={"category_ids"}
          defaultValue={initDefaultValue.category?.value || []}
          key={initDefaultValue.category?.key}
          control={control}
          rules={{
            validate: (value) => value.length > 0,
          }}
          render={(props) => (
            <FormattedTextField
              select
              error={errors.category_ids ? true : false}
              label={d("Category").t("library_label_category")}
              encode={encodeOneItemArray}
              decode={decodeOneItemArray}
              {...props}
              onChange={(value: ReturnType<typeof decodeOneItemArray>) => {
                onChangeCategory(value);
                props.onChange(value);
              }}
              fullWidth
              required
              className={css.fieldset}
              disabled={!canEdit}
            >
              {menuItemList(linkedMockOptions.developmental)}
            </FormattedTextField>
          )}
        />
      )}
      {isGeneralMilestone ? (
        <TextField
          label={d("Subcategory").t("library_label_subcategory")}
          fullWidth
          className={css.fieldset}
          disabled
          variant="outlined"
          InputProps={{
            readOnly: true,
            style: { color: "rgba(0,0,0,1)" },
          }}
          value={"None Specified"}
        />
      ) : (
        <Controller
          disabled={!canEdit}
          as={TextField}
          select
          SelectProps={{ multiple: true }}
          label={d("Subcategory").t("library_label_subcategory")}
          name={"subcategory_ids"}
          defaultValue={initDefaultValue.sub_category?.value || []}
          key={initDefaultValue.sub_category?.key || "subcategory_ids"}
          control={control}
          fullWidth
          className={css.fieldset}
        >
          {menuItemList(linkedMockOptions.skills)}
        </Controller>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          {isGeneralMilestone ? (
            <TextField
              label={d("Age").t("assess_label_age")}
              fullWidth
              className={css.fieldset}
              disabled
              variant="outlined"
              InputProps={{
                readOnly: true,
                style: { color: "rgba(0,0,0,1)" },
              }}
              value={"None Specified"}
            />
          ) : (
            <Controller
              disabled={!canEdit}
              as={TextField}
              name={"age_ids"}
              defaultValue={initDefaultValue.age?.value || []}
              key={initDefaultValue.age?.key}
              control={control}
              select
              SelectProps={{ multiple: true }}
              // className={sm ? css.fieldset : css.halfFieldset}
              fullWidth
              className={css.fieldset}
              label={d("Age").t("assess_label_age")}
            >
              {menuItemList(linkedMockOptions.age || [])}
            </Controller>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {isGeneralMilestone ? (
            <TextField
              label={d("Grade").t("assess_label_grade")}
              fullWidth
              className={css.fieldset}
              disabled
              variant="outlined"
              InputProps={{
                readOnly: true,
                style: { color: "rgba(0,0,0,1)" },
              }}
              value={"None Specified"}
            />
          ) : (
            <Controller
              disabled={!canEdit}
              as={TextField}
              name={"grade_ids"}
              defaultValue={initDefaultValue.grade?.value || []}
              key={initDefaultValue.grade?.key}
              control={control}
              select
              SelectProps={{ multiple: true }}
              // className={sm ? css.fieldset : css.halfFieldset}
              fullWidth
              className={css.fieldset}
              label={d("Grade").t("assess_label_grade")}
              // disabled={permission}
            >
              {menuItemList(linkedMockOptions.grade || [])}
            </Controller>
          )}
        </Grid>
      </Grid>
      {isGeneralMilestone ? (
        <TextField
          label={d("Description").t("assess_label_description")}
          fullWidth
          className={css.fieldset}
          disabled
          rows={4}
          variant="outlined"
          InputProps={{
            readOnly: true,
            style: { color: "rgba(0,0,0,1)" },
          }}
          value={d("N/A").t("assess_column_n_a")}
        />
      ) : (
        <Controller
          name="description"
          as={TextField}
          control={control}
          defaultValue={initDefaultValue.description?.value}
          key={initDefaultValue.description?.key}
          label={d("Description").t("assess_label_description")}
          fullWidth
          className={css.fieldset}
          multiline
          rows={4}
          inputProps={{ maxLength: 200 }}
          disabled={!canEdit}
        />
      )}
      <Controller style={{ display: "none" }} name="with_publish" control={control} as={TextField} defaultValue={false} />
      <Controller style={{ display: "none" }} name="type" control={control} as={TextField} defaultValue={"normal"} />
    </Box>
  );
}
