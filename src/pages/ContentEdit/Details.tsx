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

interface DetailsProps {
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
          defaultValue={contentDetail.name}
          rules={{
            required: true,
          }}
          error={errors.name ? true : false}
          helperText=""
          disabled={permission}
        />
        <Controller
          name="thumbnail"
          defaultValue={contentDetail.thumbnail}
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
            <Controller
              as={TextField}
              name="created_at"
              defaultValue={formattedTime(contentDetail.updated_at)}
              control={control}
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              disabled
              label={d("Created On").t("library_label_created_on")}
            ></Controller>
            <Controller
              as={TextField}
              name="author_name"
              defaultValue={contentDetail.author_name}
              control={control}
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              disabled
              label={d("Author").t("library_label_author")}
            ></Controller>
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
          defaultValue={contentDetail.program}
          control={control}
          render={(props) => (
            <TextField
              select
              className={css.fieldset}
              label={d("Program").t("library_label_program")}
              disabled={permission}
              {...props}
              onChange={(e) => {
                onChangeProgram(e.target.value);
                props.onChange(e.target.value);
              }}
              required
            >
              {menuItemList(linkedMockOptions.program || [])}
            </TextField>
          )}
        />
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
          defaultValue={contentDetail.subject}
          control={control}
        >
          {menuItemList(linkedMockOptions.subject || [])}
        </Controller>
        <Box>
          <Controller
            name="developmental"
            defaultValue={contentDetail.developmental}
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
            defaultValue={contentDetail.skills}
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
          <Controller
            as={TextField}
            name="age"
            defaultValue={contentDetail.age}
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
            defaultValue={contentDetail.grade}
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
          defaultValue={contentDetail.publish_scope}
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
            defaultValue={contentDetail.lesson_type || ""}
            control={control}
          >
            {NeedTransilationMenuItemList(lesson_types)}
          </Controller>
        )}
        <Controller
          name="self_study"
          defaultValue={contentDetail.self_study}
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
            defaultValue={contentDetail.draw_activity}
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
          defaultValue={contentDetail.description}
          className={css.fieldset}
          label={d("Description").t("library_label_description")}
          disabled={permission}
        />
        <Controller
          as={FormattedTextField}
          control={control}
          name="keywords"
          decode={decodeArray}
          defaultValue={contentDetail.keywords}
          className={css.fieldset}
          label={d("Keywords").t("library_label_keywords")}
          disabled={permission}
          helperText=""
        />
      </Box>
    </ThemeProvider>
  );
}
