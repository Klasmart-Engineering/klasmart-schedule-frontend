import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  CircularProgressProps,
  createMuiTheme,
  FormControl,
  FormControlLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  OutlinedInput,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { CloudUploadOutlined } from "@material-ui/icons";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { useParams } from "react-router-dom";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { apiResourcePathById } from "../../api/extra";
import { CropImage } from "../../components/CropImage";
import { decodeArray, decodeOneItemArray, encodeOneItemArray, FormattedTextField } from "../../components/FormattedTextField";
import { SingleUploader } from "../../components/SingleUploader";
import { LangRecordId } from "../../locale/lang/type";
import { d, t } from "../../locale/LocaleManager";
import { ContentDetailForm, formattedTime } from "../../models/ModelContentDetailForm";
import { CreateAllDefaultValueAndKeyResult } from "../../models/ModelMockOptions";
import { LinkedMockOptions, LinkedMockOptionsItem } from "../../reducers/content";
const useStyles = makeStyles(({ breakpoints, palette }) => ({
  details: {
    minHeight: 800,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
  },
  fieldset: {
    marginTop: 32,
  },
  fieldsetReject: {
    color: palette.error.main,
    marginBottom: 32,
  },
  halfFieldset: {
    marginTop: 32,
    width: "calc(50% - 10px)",
    "&:not(:first-child)": {
      marginLeft: 20,
    },
  },
  thumbnailImg: {
    width: 260,
    height: 132,
  },
  thumbnailButton: {
    height: 56,
    marginRight: "auto",
  },
  thumbnailProgressText: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function ProgressWithText(props: CircularProgressProps) {
  const css = useStyles();
  return (
    <Box position="relative" display="inline-flex" alignItems="center">
      <CircularProgress className={css.thumbnailImg} variant="static" {...props} />
      <Box className={css.thumbnailProgressText}>
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(props.value || 0)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

type NeedTransilationMenuItem =
  | "library_label_visibility_school"
  | "library_label_visibility_organization"
  | "library_label_test"
  | "library_label_not_test";

export interface DetailsProps {
  allDefaultValueAndKey: CreateAllDefaultValueAndKeyResult;
  contentDetail: EntityContentInfoWithDetails;
  uploadThumnail?: Function;
  formMethods: UseFormMethods<ContentDetailForm>;
  linkedMockOptions: LinkedMockOptions;
  lesson_types: LinkedMockOptionsItem[];
  visibility_settings: LinkedMockOptionsItem[];
  onChangeProgram: (value: NonNullable<ContentDetailForm["program"]>) => any;
  onChangeDevelopmental: (value: NonNullable<ContentDetailForm["developmental"]>) => any;
  onDrawingActivity: (event: React.ChangeEvent<HTMLInputElement>, label: string) => any;
  permission: boolean;
}
export default function Details(props: DetailsProps) {
  const {
    allDefaultValueAndKey,
    contentDetail,
    formMethods: { control, errors },
    linkedMockOptions,
    visibility_settings,
    lesson_types,
    onChangeDevelopmental,
    onChangeProgram,
    onDrawingActivity,
    permission,
  } = props;
  // console.log("allDefaultValueAndKey = ", allDefaultValueAndKey);

  const css = useStyles();
  const { lesson } = useParams();
  const defaultTheme = useTheme();
  const sm = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  const menuItemList = (list?: LinkedMockOptionsItem[]) =>
    list &&
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  const NeedTransilationMenuItemList = (list: LinkedMockOptionsItem[]) =>
    list &&
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {t(item.name as NeedTransilationMenuItem)}
      </MenuItem>
    ));

  const rejectReasonTransilation = (reson?: string[], remark?: string) => {
    const reson_remark = reson && reson.map((item) => t(item as LangRecordId));
    if (reson_remark && remark) reson_remark.push(remark);
    return reson_remark ? reson_remark : remark && [remark];
  };

  const size = sm ? "small" : "medium";
  const theme = createMuiTheme(defaultTheme, {
    props: {
      MuiTextField: {
        size,
        fullWidth: true,
      },
      MuiFormControl: {
        size,
        fullWidth: true,
      },
      MuiButton: {
        size,
      },
      MuiSvgIcon: {
        fontSize: sm ? "small" : "default",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Box component="form" p="7.8% 8.5%" className={css.details}>
        {contentDetail.publish_status === "rejected" && (
          <FormControl variant="outlined">
            <InputLabel error variant="outlined" htmlFor="rejectReason">
              {d("Reason").t("library_label_reason")}
            </InputLabel>
            <OutlinedInput
              readOnly
              className={css.fieldsetReject}
              error
              id="rejectReason"
              multiline
              value={rejectReasonTransilation(contentDetail.reject_reason, contentDetail.remark)}
              label={d("Reason").t("library_label_reason")}
            ></OutlinedInput>
          </FormControl>
        )}
        <Controller
          as={TextField}
          control={control}
          name="name"
          label={lesson === "material" ? d("Material Name").t("library_label_material_name") : d("Plan Name").t("library_label_plan_name")}
          required
          defaultValue={allDefaultValueAndKey.name?.value}
          key={allDefaultValueAndKey.name?.key}
          rules={{
            required: true,
          }}
          error={errors.name ? true : false}
          helperText=""
          disabled={permission}
        />
        <Controller
          name="thumbnail"
          defaultValue={allDefaultValueAndKey.thumbnail?.value}
          key={allDefaultValueAndKey.thumbnail?.key}
          control={control}
          render={(props) => (
            <CropImage
              render={({ crop }) => (
                <SingleUploader
                  partition="thumbnail"
                  accept="image/*"
                  transformFile={crop}
                  {...props}
                  render={({ uploady, item, btnRef, value, isUploading }) => (
                    <Box className={css.fieldset} display="flex">
                      <Button
                        className={css.thumbnailButton}
                        ref={btnRef}
                        size={sm ? "medium" : "large"}
                        variant="contained"
                        component="span"
                        color="primary"
                        endIcon={<CloudUploadOutlined />}
                        disabled={permission}
                      >
                        {d("Thumbnail").t("library_label_thumbnail")}
                      </Button>
                      {isUploading && <ProgressWithText value={item?.completed} />}
                      {!isUploading && value && <img className={css.thumbnailImg} alt="thumbnail" src={apiResourcePathById(value)} />}
                    </Box>
                  )}
                />
              )}
            />
          )}
        />
        {contentDetail.id && (
          <Box>
            <TextField
              // as={TextField}
              // name="created_at"
              defaultValue={formattedTime(contentDetail.updated_at)}
              key={allDefaultValueAndKey.created_at?.value}
              // control={control}
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              disabled
              label={d("Created On").t("library_label_created_on")}
            ></TextField>
            <TextField
              // as={TextField}
              // name="author_name"
              defaultValue={allDefaultValueAndKey.author_name?.value}
              key={allDefaultValueAndKey.author_name?.key}
              // control={control}
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              disabled
              label={d("Author").t("library_label_author")}
            ></TextField>
          </Box>
        )}
        <Controller
          as={FormattedTextField}
          control={control}
          name="suggest_time"
          decode={Number}
          type="number"
          className={css.fieldset}
          label={d("Duration(Minutes)").t("library_label_duration")}
          defaultValue={contentDetail.suggest_time}
          disabled={permission}
        />
        <Controller
          name="program"
          defaultValue={allDefaultValueAndKey.program?.value}
          key={allDefaultValueAndKey.program?.key}
          control={control}
          render={(props) => (
            <TextField
              select
              className={css.fieldset}
              label={d("Program").t("library_label_program")}
              disabled={permission}
              {...props}
              onChange={(e) => {
                // debugger;
                onChangeProgram(e.target.value);
                props.onChange(e.target.value);
              }}
              required
            >
              {menuItemList(linkedMockOptions.program || [])}
            </TextField>
          )}
        />
        {/*
        <Controller
          as={TextField}
          select
          SelectProps={{
            multiple: true,
          }}
          className={css.fieldset}
          label={d("Subject").t("library_label_subject")}
          disabled={permission}
          name="subject"
          defaultValue={allDefaultValueAndKey.subject?.value}
          key={allDefaultValueAndKey.subject?.key}
          control={control}
        >
          {menuItemList(linkedMockOptions.subject || [])}
        </Controller>*/}

        <Box>
          <Controller
            name="developmental"
            defaultValue={allDefaultValueAndKey.developmental?.value}
            key={allDefaultValueAndKey.developmental?.key}
            control={control}
            render={(props) => (
              <FormattedTextField
                select
                className={sm ? css.fieldset : css.halfFieldset}
                label={d("Category").t("library_label_category")}
                disabled={permission}
                encode={encodeOneItemArray}
                decode={decodeOneItemArray}
                {...props}
                onChange={(value: ReturnType<typeof decodeOneItemArray>) => {
                  onChangeDevelopmental(value);
                  props.onChange(value);
                }}
                fullWidth={sm}
                required
              >
                {menuItemList(linkedMockOptions.developmental || [])}
              </FormattedTextField>
            )}
          />
          <Controller
            as={TextField}
            name="skills"
            defaultValue={allDefaultValueAndKey.skills?.value}
            key={allDefaultValueAndKey.skills?.key}
            control={control}
            select
            SelectProps={{
              multiple: true,
            }}
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label={d("Subcategory").t("library_label_subcategory")}
            disabled={permission}
          >
            {menuItemList(linkedMockOptions.skills || [])}
          </Controller>
        </Box>
        <Box>
          {/* {console.log('{allDefaultValueAndKey.age?.key = ', allDefaultValueAndKey.age?.key)}
          {console.log('{allDefaultValueAndKey.skills?.key = ', allDefaultValueAndKey.skills?.key)}
          {console.log('{allDefaultValueAndKey.program?.key = ', allDefaultValueAndKey.program?.key)} */}
          <Controller
            as={TextField}
            name="age"
            defaultValue={allDefaultValueAndKey.age?.value}
            key={allDefaultValueAndKey.age?.key}
            control={control}
            select
            SelectProps={{
              multiple: true,
            }}
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label={d("Age").t("library_label_age")}
            disabled={permission}
          >
            {menuItemList(linkedMockOptions.age || [])}
          </Controller>
          <Controller
            as={TextField}
            name="grade"
            defaultValue={allDefaultValueAndKey.grade?.value}
            key={allDefaultValueAndKey.grade?.key}
            control={control}
            select
            SelectProps={{
              multiple: true,
            }}
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label={d("Grade").t("library_label_grade")}
            disabled={permission}
          >
            {menuItemList(linkedMockOptions.grade || [])}
          </Controller>
        </Box>
        <Controller
          as={TextField}
          select
          className={css.fieldset}
          label={d("Visibility Settings").t("library_label_visibility_settings")}
          disabled={permission}
          name="publish_scope"
          required
          defaultValue={allDefaultValueAndKey.publish_scope?.value}
          key={allDefaultValueAndKey.publish_scope?.key}
          control={control}
          rules={{
            required: true,
          }}
          error={errors.publish_scope ? true : false}
          helperText=""
        >
          {menuItemList(visibility_settings)}
        </Controller>
        {lesson === "material" && (
          <Controller
            as={TextField}
            select
            className={css.fieldset}
            label={d("Lesson Type").t("library_label_lesson_type")}
            disabled={permission}
            name="lesson_type"
            defaultValue={allDefaultValueAndKey.lesson_type?.value}
            key={allDefaultValueAndKey.lesson_type?.key}
            control={control}
          >
            {NeedTransilationMenuItemList(lesson_types)}
          </Controller>
        )}
        <Controller
          name="self_study"
          defaultValue={allDefaultValueAndKey.self_study?.value}
          key={allDefaultValueAndKey.self_study?.key}
          render={(props) => (
            <Box
              className={css.fieldset}
              style={{
                position: "relative",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    style={{
                      position: "absolute",
                      right: 0,
                    }}
                    checked={props.value || false}
                    onChange={(e) => onDrawingActivity(e, "self_study")}
                    color="primary"
                  />
                }
                label={d("Suitable for Self Study").t("library_label_self_study")}
                disabled={permission}
                style={{
                  color: "rgba(0,0,0,0.6)",
                }}
                labelPlacement="start"
              />
            </Box>
          )}
          control={control}
        />
        {lesson === "material" && (
          <Controller
            name="draw_activity"
            defaultValue={allDefaultValueAndKey.draw_activity?.value}
            key={allDefaultValueAndKey.draw_activity?.key}
            render={(props) => (
              <Box
                className={css.fieldset}
                style={{
                  position: "relative",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{
                        position: "absolute",
                        right: 0,
                      }}
                      checked={props.value || false}
                      onChange={(e) => onDrawingActivity(e, "draw_activity")}
                      color="primary"
                    />
                  }
                  label={d("Drawing Activity").t("library_label_drawing_activity")}
                  disabled={permission}
                  style={{
                    color: "rgba(0,0,0,0.6)",
                  }}
                  labelPlacement="start"
                />
              </Box>
            )}
            control={control}
          />
        )}

        <Controller
          as={TextField}
          control={control}
          name="description"
          multiline
          defaultValue={allDefaultValueAndKey.description?.value}
          key={allDefaultValueAndKey.description?.key}
          className={css.fieldset}
          label={d("Description").t("library_label_description")}
          disabled={permission}
        />
        <Controller
          as={FormattedTextField}
          control={control}
          name="keywords"
          decode={decodeArray}
          defaultValue={allDefaultValueAndKey.keywords?.value}
          key={allDefaultValueAndKey.keywords?.key}
          className={css.fieldset}
          label={d("Keywords").t("library_label_keywords")}
          disabled={permission}
          helperText=""
        />
      </Box>
    </ThemeProvider>
  );
}
